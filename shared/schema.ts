import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Authors Schema
export const authors = pgTable("authors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  bio: text("bio"),
  avatar: text("avatar"),
  email: text("email"),
  website: text("website"),
  socialLinkedIn: text("social_linkedin"),
  socialTwitter: text("social_twitter"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertAuthorSchema = createInsertSchema(authors).omit({
  id: true,
  createdAt: true,
});

export type InsertAuthor = z.infer<typeof insertAuthorSchema>;
export type Author = typeof authors.$inferSelect;

// Blog Posts Schema
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  featuredImage: text("featured_image"),
  authorId: varchar("author_id").references(() => authors.id),
  authorName: text("author_name").notNull().default('VI&MO Team'),
  publishedAt: timestamp("published_at").notNull().defaultNow(),
  readingTime: integer("reading_time").notNull().default(5),
  metaDescription: text("meta_description"),
  featured: integer("featured").notNull().default(0),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  publishedAt: true,
});

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Contact Form Submissions Schema
export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  apartmentSize: text("apartment_size"),
  moveDate: text("move_date"),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  submittedAt: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

// Comments Schema
export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  postId: varchar("post_id").notNull().references(() => blogPosts.id, { onDelete: 'cascade' }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email").notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  approved: true,
});

export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Comment = typeof comments.$inferSelect;

// Service data type (static content, no database table needed)
export type Service = {
  title: string;
  desc: string;
  icon: string;
  href: string;
};

// Pricing data type (static content)
export type PricingItem = {
  type: string;
  price: string;
};

// Site configuration type
export type SiteConfig = {
  name: string;
  baseUrl: string;
  phone: string;
  email: string;
  addressLine: string;
  ico: string;
  dic: string;
};

// SEO metadata type
export type SEOData = {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  canonicalUrl?: string;
};
