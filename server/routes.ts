import type { Express } from "express";
import { createServer, type Server } from "http";
import { exec } from "child_process";
import { promisify } from "util";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { emailService } from "./emailService";

const execAsync = promisify(exec);
import { insertBlogPostSchema, insertContactSubmissionSchema, insertAuthorSchema, insertCommentSchema } from "@shared/schema";

// Rate limiting for admin endpoints - prevent brute force attacks
const adminRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: { error: "Too many admin requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from counting against the limit
  skipSuccessfulRequests: false,
});

// Admin access logger
const logAdminAccess = (req: any, success: boolean, reason?: string) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const adminKey = req.headers['x-admin-key'];
  const hasKey = !!adminKey;

  console.log(JSON.stringify({
    timestamp,
    type: 'ADMIN_ACCESS',
    ip,
    path: req.path,
    method: req.method,
    success,
    hasAdminKey: hasKey,
    reason: reason || (success ? 'authorized' : 'unauthorized'),
  }));
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Blog Posts Routes
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  app.post("/api/blog/posts", async (req, res) => {
    try {
      const validatedPost = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(validatedPost);
      res.status(201).json(post);
    } catch (error: any) {
      console.error("Error creating blog post:", error);
      res.status(400).json({ error: error.message || "Invalid blog post data" });
    }
  });

  // Authors Routes
  app.get("/api/authors", async (req, res) => {
    try {
      const allAuthors = await storage.getAllAuthors();
      res.json(allAuthors);
    } catch (error) {
      console.error("Error fetching authors:", error);
      res.status(500).json({ error: "Failed to fetch authors" });
    }
  });

  app.get("/api/authors/:slug", async (req, res) => {
    try {
      const author = await storage.getAuthor(req.params.slug);
      if (!author) {
        return res.status(404).json({ error: "Author not found" });
      }
      res.json(author);
    } catch (error) {
      console.error("Error fetching author:", error);
      res.status(500).json({ error: "Failed to fetch author" });
    }
  });

  app.post("/api/authors", async (req, res) => {
    try {
      const validatedAuthor = insertAuthorSchema.parse(req.body);
      const author = await storage.createAuthor(validatedAuthor);
      res.status(201).json(author);
    } catch (error: any) {
      console.error("Error creating author:", error);
      res.status(400).json({ error: error.message || "Invalid author data" });
    }
  });

  // Comments Routes
  app.get("/api/blog/posts/:postId/comments", async (req, res) => {
    try {
      const approvedOnly = req.query.approvedOnly !== 'false';
      const postComments = await storage.getCommentsByPostId(req.params.postId, approvedOnly);
      res.json(postComments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  // ADMIN ENDPOINT: Get pending comments (with rate limiting and logging)
  app.get("/api/comments/pending", adminRateLimiter, async (req, res) => {
    try {
      // Require ADMIN_KEY environment variable - no defaults for security
      const expectedKey = process.env.ADMIN_KEY;

      if (!expectedKey) {
        console.error("ADMIN_KEY environment variable not set");
        logAdminAccess(req, false, 'server_misconfiguration');
        return res.status(500).json({ error: "Server configuration error: ADMIN_KEY not configured" });
      }

      // Security: Only accept admin key via header (not query string to prevent leaks in logs/referrers)
      const adminKey = req.headers['x-admin-key'] as string | undefined;

      if (!adminKey || adminKey !== expectedKey) {
        logAdminAccess(req, false, !adminKey ? 'missing_key' : 'invalid_key');
        return res.status(403).json({ error: "Unauthorized: Invalid or missing admin key" });
      }

      // Log successful admin access
      logAdminAccess(req, true);

      const allPendingComments: any[] = [];
      const posts = await storage.getAllBlogPosts();

      for (const post of posts) {
        const pending = await storage.getCommentsByPostId(post.id, false);
        const unapproved = pending.filter(c => !c.approved);

        allPendingComments.push(...unapproved.map(comment => ({
          ...comment,
          postTitle: post.title,
          postSlug: post.slug,
        })));
      }

      res.json(allPendingComments);
    } catch (error) {
      console.error("Error fetching pending comments:", error);
      res.status(500).json({ error: "Failed to fetch pending comments" });
    }
  });

  app.post("/api/blog/posts/:postId/comments", async (req, res) => {
    try {
      const commentData = {
        ...req.body,
        postId: req.params.postId
      };
      const validatedComment = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(validatedComment);
      res.status(201).json({
        success: true,
        message: "Váš komentár bol odoslaný a čaká na schválenie.",
        comment
      });
    } catch (error: any) {
      console.error("Error creating comment:", error);
      res.status(400).json({ error: error.message || "Invalid comment data" });
    }
  });

  // ADMIN ENDPOINT: Approve comment (with rate limiting and logging)
  app.patch("/api/comments/:commentId/approve", adminRateLimiter, async (req, res) => {
    try {
      // Require ADMIN_KEY environment variable - no defaults for security
      const expectedKey = process.env.ADMIN_KEY;

      if (!expectedKey) {
        console.error("ADMIN_KEY environment variable not set");
        logAdminAccess(req, false, 'server_misconfiguration');
        return res.status(500).json({ error: "Server configuration error: ADMIN_KEY not configured" });
      }

      // Security: Only accept admin key via header (not query string to prevent leaks in logs/referrers)
      const adminKey = req.headers['x-admin-key'] as string | undefined;

      if (!adminKey || adminKey !== expectedKey) {
        logAdminAccess(req, false, !adminKey ? 'missing_key' : 'invalid_key');
        return res.status(403).json({ error: "Unauthorized: Invalid or missing admin key" });
      }

      // Log successful admin access
      logAdminAccess(req, true);

      const comment = await storage.approveComment(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ error: "Comment not found" });
      }
      res.json(comment);
    } catch (error) {
      console.error("Error approving comment:", error);
      res.status(500).json({ error: "Failed to approve comment" });
    }
  });

  // Contact Form Route
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedSubmission = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedSubmission);

      // In a real app, you would send an email notification here
      console.log("New contact submission:", {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
      });

      res.status(201).json({
        success: true,
        message: "Ďakujeme za vašu správu. Ozveme sa vám čoskoro."
      });
    } catch (error: any) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: error.message || "Invalid contact form data" });
    }
  });

  // SEO Routes - Sitemap XML
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      const baseUrl = process.env.BASE_URL || "https://stahovanie-bratislava.viandmo.com";

      const staticPages: Array<{ url: string; priority: string; changefreq: string; lastmod?: string }> = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/stahovanie", priority: "1.0", changefreq: "weekly" },
        { url: "/cennik", priority: "0.8", changefreq: "monthly" },
        { url: "/blog", priority: "0.9", changefreq: "daily" },
        { url: "/kontakt", priority: "0.7", changefreq: "monthly" },
      ];

      const blogPages = posts.map(post => ({
        url: `/blog/${post.slug}`,
        priority: "0.7",
        changefreq: "monthly",
        lastmod: post.publishedAt.toISOString().split('T')[0],
      }));

      const allPages = [...staticPages, ...blogPages];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      console.error("Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Robots.txt
  app.get("/robots.txt", (req, res) => {
    const baseUrl = process.env.BASE_URL || "https://stahovanie-bratislava.viandmo.com";
    const robots = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // RSS Feed
  app.get("/rss.xml", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      const baseUrl = process.env.BASE_URL || "https://stahovanie-bratislava.viandmo.com";

      const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VI&amp;MO Sťahovanie - Blog</title>
    <link>${baseUrl}/blog</link>
    <description>Praktické rady a tipy na sťahovanie bytov, domov a firiem v Bratislave</description>
    <language>sk-SK</language>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${posts.map(post => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <guid>${baseUrl}/blog/${post.slug}</guid>
      <pubDate>${post.publishedAt.toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
      <category>${escapeXml(post.category)}</category>
      <author>${escapeXml(post.authorName)}</author>
    </item>`).join('\n')}
  </channel>
</rss>`;

      res.header("Content-Type", "application/xml");
      res.send(rss);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).send("Error generating RSS feed");
    }
  });

  // Google Places API - Get Reviews and Location Data
  app.get("/api/google-reviews", async (req, res) => {
    try {
      const apiKey = process.env.GOOGLE_PLACES_API_KEY;
      const placeId = process.env.GOOGLE_PLACE_ID || 'ChIJAbCdYpBfbEcRYXZ3z0vLPPw';

      if (!apiKey) {
        return res.json({
          reviews: [],
          location: null,
          message: "Google Places API key not configured"
        });
      }

      // Fetch place details including reviews
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,formatted_address,formatted_phone_number,opening_hours,website&key=${apiKey}&language=sk`
      );

      if (!response.ok) {
        throw new Error(`Google Places API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        throw new Error(`Google Places API returned status: ${data.status}`);
      }

      const result = data.result || {};

      res.json({
        reviews: result.reviews || [],
        location: {
          name: result.name,
          rating: result.rating,
          userRatingsTotal: result.user_ratings_total,
          address: result.formatted_address,
          phone: result.formatted_phone_number,
          openingHours: result.opening_hours,
          website: result.website
        }
      });
    } catch (error) {
      console.error("Error fetching Google reviews:", error);
      res.status(500).json({
        error: "Failed to fetch Google reviews",
        reviews: [],
        location: null
      });
    }
  });

  // Admin System Stats
  app.get("/api/admin/system-stats", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      const avgReadingTime = posts.length > 0
        ? Math.round(posts.reduce((acc, p) => acc + p.readingTime, 0) / posts.length)
        : 0;

      res.json({
        content: {
          totalPosts: posts.length,
          avgReadingTime,
          latestPost: posts[posts.length - 1]?.title
        },
        system: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: Math.round(process.uptime()),
          memoryUsage: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + "MB"
        },
        seo: {
          sitemapUrl: "/sitemap.xml",
          robotsUrl: "/robots.txt",
          rssUrl: "/rss.xml"
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Execute Automation Script
  app.post("/api/admin/execute-script", async (req, res) => {
    const remoteAddress = req.socket.remoteAddress;
    if (remoteAddress !== '::1' && remoteAddress !== '127.0.0.1' && remoteAddress !== '::ffff:127.0.0.1') {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { scriptName } = req.body;
    let scriptPath = "";

    if (scriptName === "AutoSortDownloads") {
      scriptPath = "C:\\Users\\engli\\DevCleanup\\AutoSortDownloads.ps1";
    } else if (scriptName === "ReclaimWSLMemory") {
      scriptPath = "C:\\Users\\engli\\DevCleanup\\ReclaimWSLMemory.ps1";
    } else {
      return res.status(400).json({ error: "Invalid script name" });
    }

    try {
      const { stdout, stderr } = await execAsync(`powershell.exe -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`);
      res.json({ success: true, output: stdout, error: stderr });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Email Configuration Routes (ADMIN)
  app.get("/api/admin/email/config", adminRateLimiter, async (req, res) => {
    try {
      const config = await storage.getEmailConfig();
      res.json(config);
    } catch (error) {
      console.error("Error fetching email config:", error);
      res.status(500).json({ error: "Failed to fetch email configuration" });
    }
  });

  app.put("/api/admin/email/config", adminRateLimiter, async (req, res) => {
    try {
      const config = await storage.updateEmailConfig(req.body);
      res.json(config);
    } catch (error: any) {
      console.error("Error updating email config:", error);
      res.status(400).json({ error: error.message || "Invalid email configuration" });
    }
  });

  // Email Templates Routes (ADMIN)
  app.get("/api/admin/email/templates", adminRateLimiter, async (req, res) => {
    try {
      const templates = await storage.getAllEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ error: "Failed to fetch email templates" });
    }
  });

  app.post("/api/admin/email/templates", adminRateLimiter, async (req, res) => {
    try {
      const template = await storage.createEmailTemplate(req.body);
      res.status(201).json(template);
    } catch (error: any) {
      console.error("Error creating email template:", error);
      res.status(400).json({ error: error.message || "Invalid email template" });
    }
  });

  app.put("/api/admin/email/templates/:id", adminRateLimiter, async (req, res) => {
    try {
      const template = await storage.updateEmailTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Email template not found" });
      }
      res.json(template);
    } catch (error: any) {
      console.error("Error updating email template:", error);
      res.status(400).json({ error: error.message || "Invalid email template" });
    }
  });

  app.delete("/api/admin/email/templates/:id", adminRateLimiter, async (req, res) => {
    try {
      const deleted = await storage.deleteEmailTemplate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Email template not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting email template:", error);
      res.status(500).json({ error: "Failed to delete email template" });
    }
  });

  // Email Logs Routes (ADMIN)
  app.get("/api/admin/email/logs", adminRateLimiter, async (req, res) => {
    try {
      const logs = await storage.getAllEmailLogs();
      res.json(logs);
    } catch (error) {
      console.error("Error fetching email logs:", error);
      res.status(500).json({ error: "Failed to fetch email logs" });
    }
  });

  app.delete("/api/admin/email/logs/:id", adminRateLimiter, async (req, res) => {
    try {
      const deleted = await storage.deleteEmailLog(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Email log not found" });
      }
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting email log:", error);
      res.status(500).json({ error: "Failed to delete email log" });
    }
  });

  // Email Stats Route (ADMIN)
  app.get("/api/admin/email/stats", adminRateLimiter, async (req, res) => {
    try {
      const stats = await emailService.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching email stats:", error);
      res.status(500).json({ error: "Failed to fetch email statistics" });
    }
  });

  // Test Email Route (ADMIN)
  app.post("/api/admin/email/test", adminRateLimiter, async (req, res) => {
    try {
      const { toEmail } = req.body;
      if (!toEmail) {
        return res.status(400).json({ error: "Recipient email is required" });
      }

      const result = await emailService.testEmailConfig(toEmail);
      res.json(result);
    } catch (error: any) {
      console.error("Error testing email config:", error);
      res.status(500).json({ error: error.message || "Failed to test email configuration" });
    }
  });

  // Contact Form with Email Integration
  app.post("/api/contact-with-email", async (req, res) => {
    try {
      const validatedSubmission = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(validatedSubmission);

      // Send email notifications
      emailService.sendContactNotification(submission).catch(console.error);
      emailService.sendConfirmationEmail(submission).catch(console.error);

      console.log("New contact submission with emails:", {
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
      });

      res.status(201).json({
        success: true,
        message: "Ďakujeme za vašu správu. Ozveme sa vám čoskoro.",
        submission
      });
    } catch (error: any) {
      console.error("Error creating contact submission:", error);
      res.status(400).json({ error: error.message || "Invalid contact form data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
