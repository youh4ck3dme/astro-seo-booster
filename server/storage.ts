// Database storage implementation using Drizzle ORM - based on blueprint:javascript_database
import { 
  type BlogPost, 
  type InsertBlogPost,
  type ContactSubmission,
  type InsertContactSubmission,
  type Author,
  type InsertAuthor,
  type Comment,
  type InsertComment,
  blogPosts,
  contactSubmissions,
  authors,
  comments
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Blog Posts
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  
  // Authors
  getAllAuthors(): Promise<Author[]>;
  getAuthor(slug: string): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  
  // Comments
  getCommentsByPostId(postId: string, approvedOnly?: boolean): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(commentId: string): Promise<Comment | undefined>;
  
  // Contact Submissions
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

export class DatabaseStorage implements IStorage {
  // Blog Posts
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const posts = await db
      .select()
      .from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
    return posts;
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.slug, slug));
    return post || undefined;
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  // Authors
  async getAllAuthors(): Promise<Author[]> {
    const allAuthors = await db
      .select()
      .from(authors)
      .orderBy(desc(authors.createdAt));
    return allAuthors;
  }

  async getAuthor(slug: string): Promise<Author | undefined> {
    const [author] = await db
      .select()
      .from(authors)
      .where(eq(authors.slug, slug));
    return author || undefined;
  }

  async createAuthor(insertAuthor: InsertAuthor): Promise<Author> {
    const [author] = await db
      .insert(authors)
      .values(insertAuthor)
      .returning();
    return author;
  }

  // Comments
  async getCommentsByPostId(postId: string, approvedOnly = true): Promise<Comment[]> {
    const conditions = approvedOnly 
      ? and(eq(comments.postId, postId), eq(comments.approved, true))
      : eq(comments.postId, postId);
    
    const postComments = await db
      .select()
      .from(comments)
      .where(conditions)
      .orderBy(desc(comments.createdAt));
    return postComments;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async approveComment(commentId: string): Promise<Comment | undefined> {
    const [comment] = await db
      .update(comments)
      .set({ approved: true })
      .where(eq(comments.id, commentId))
      .returning();
    return comment || undefined;
  }

  // Contact Submissions
  async createContactSubmission(
    insertSubmission: InsertContactSubmission
  ): Promise<ContactSubmission> {
    const [submission] = await db
      .insert(contactSubmissions)
      .values(insertSubmission)
      .returning();
    return submission;
  }
}

export const storage = new DatabaseStorage();
