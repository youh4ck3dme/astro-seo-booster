import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertContactSubmissionSchema, insertAuthorSchema, insertCommentSchema } from "@shared/schema";

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

  app.get("/api/comments/pending", async (req, res) => {
    try {
      // Simple admin protection - in production, use proper authentication
      const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
      const expectedKey = process.env.ADMIN_KEY || 'dev_admin_key_123';
      
      if (adminKey !== expectedKey) {
        return res.status(403).json({ error: "Unauthorized: Invalid admin key" });
      }
      
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

  app.patch("/api/comments/:commentId/approve", async (req, res) => {
    try {
      // Simple admin protection - in production, use proper authentication
      const adminKey = req.headers['x-admin-key'] || req.query.admin_key;
      const expectedKey = process.env.ADMIN_KEY || 'dev_admin_key_123';
      
      if (adminKey !== expectedKey) {
        return res.status(403).json({ error: "Unauthorized: Invalid admin key" });
      }
      
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
      const baseUrl = process.env.BASE_URL || "https://stahovanie.website";
      
      const staticPages = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/stahovanie", priority: "0.9", changefreq: "weekly" },
        { url: "/cennik", priority: "0.8", changefreq: "monthly" },
        { url: "/blog", priority: "0.7", changefreq: "daily" },
        { url: "/kontakt", priority: "0.6", changefreq: "monthly" },
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
    const baseUrl = process.env.BASE_URL || "https://stahovanie.website";
    const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin or private paths if any
# Disallow: /admin/`;

    res.header("Content-Type", "text/plain");
    res.send(robots);
  });

  // RSS Feed
  app.get("/rss.xml", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      const baseUrl = process.env.BASE_URL || "https://stahovanie.website";
      
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
