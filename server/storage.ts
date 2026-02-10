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
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  getAllAuthors(): Promise<Author[]>;
  getAuthor(slug: string): Promise<Author | undefined>;
  createAuthor(author: InsertAuthor): Promise<Author>;
  getCommentsByPostId(postId: string, approvedOnly?: boolean): Promise<Comment[]>;
  createComment(comment: InsertComment): Promise<Comment>;
  approveComment(commentId: string): Promise<Comment | undefined>;
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
}

const fallbackAuthors: Author[] = [
  {
    id: "fallback-1",
    name: "Vladimír Mikuš",
    slug: "vladimir-mikus",
    bio: "Majiteľ a zakladateľ VI&MO Sťahovanie.",
    email: "vladimir@viamo.sk",
    avatar: null,
    website: null,
    socialLinkedIn: null,
    socialTwitter: null,
    createdAt: new Date(),
  },
  {
    id: "fallback-2",
    name: "VI&MO Team",
    slug: "viamo-team",
    bio: "Profesionálny tím sťahovacích expertov.",
    email: null,
    avatar: null,
    website: null,
    socialLinkedIn: null,
    socialTwitter: null,
    createdAt: new Date(),
  },
];

const fallbackPosts: BlogPost[] = [
  {
    id: "fallback-post-1",
    slug: "ako-sa-pripravit-na-stahovanie-bytu",
    title: "Ako sa pripraviť na sťahovanie bytu v Bratislave",
    excerpt: "Pripravte sa na bezproblémové sťahovanie s našim kompletným návodom.",
    content: "# Ako sa pripraviť na sťahovanie bytu\n\nSťahovanie bytu môže byť stresujúce, ale s dobrým plánovaním to zvládnete bez problémov.",
    category: "Tipy a návody",
    tags: ["sťahovanie", "príprava", "balenie", "Bratislava"],
    authorName: "VI&MO Team",
    readingTime: 5,
    metaDescription: "Kompletný návod, ako sa pripraviť na sťahovanie bytu v Bratislave.",
    featured: 1,
    featuredImage: null,
    authorId: "fallback-2",
    publishedAt: new Date("2024-12-01"),
  },
  {
    id: "fallback-post-2",
    slug: "5-tipov-ako-znizit-stres-pri-stahovani",
    title: "5 tipov, ako znížiť stres pri sťahovaní",
    excerpt: "Sťahovanie nemusí byť chaos. Pozrite si naše overené tipy.",
    content: "# 5 tipov, ako znížiť stres pri sťahovaní\n\nSťahovanie je medzi najstresujúcejšími životnými udalosťami.",
    category: "Tipy a návody",
    tags: ["stres", "organizácia", "tipy"],
    authorName: "Vladimír Mikuš",
    readingTime: 4,
    metaDescription: "5 overených tipov, ako zvládnuť sťahovanie bez stresu.",
    featured: 0,
    featuredImage: null,
    authorId: "fallback-1",
    publishedAt: new Date("2024-11-15"),
  },
  {
    id: "fallback-post-3",
    slug: "kolko-stoji-stahovanie-v-bratislave",
    title: "Koľko stojí sťahovanie v Bratislave v roku 2024?",
    excerpt: "Porovnanie cien sťahovaní v Bratislave s transparentným prehľadom.",
    content: "# Koľko stojí sťahovanie v Bratislave?\n\nCena sťahovania závisí od veľkosti bytu a vzdialenosti.",
    category: "Cenník",
    tags: ["ceny", "Bratislava", "porovnanie"],
    authorName: "VI&MO Team",
    readingTime: 6,
    metaDescription: "Prehľad cien sťahovaní v Bratislave pre rok 2024.",
    featured: 0,
    featuredImage: null,
    authorId: "fallback-2",
    publishedAt: new Date("2024-10-20"),
  },
  {
    id: "fallback-post-4",
    slug: "ako-zabalit-krehke-predmety",
    title: "Ako správne zabaliť krehké predmety pri sťahovaní",
    excerpt: "Naučte sa, ako bezpečne zabaliť sklo, porcelán a elektroniku.",
    content: "# Ako zabaliť krehké predmety\n\nKrehké predmety vyžadujú špeciálnu starostlivosť pri balení.",
    category: "Tipy a návody",
    tags: ["balenie", "krehké predmety", "ochrana"],
    authorName: "Vladimír Mikuš",
    readingTime: 4,
    metaDescription: "Návod na bezpečné balenie krehkých predmetov pri sťahovaní.",
    featured: 0,
    featuredImage: null,
    authorId: "fallback-1",
    publishedAt: new Date("2024-09-10"),
  },
];

export class DatabaseStorage implements IStorage {
  async getAllBlogPosts(): Promise<BlogPost[]> {
    try {
      const posts = await db
        .select()
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt));
      return posts;
    } catch (err) {
      console.warn("DB unavailable for getAllBlogPosts, using fallback data");
      return fallbackPosts;
    }
  }

  async getBlogPost(slug: string): Promise<BlogPost | undefined> {
    try {
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug));
      return post || undefined;
    } catch (err) {
      console.warn("DB unavailable for getBlogPost, using fallback data");
      return fallbackPosts.find(p => p.slug === slug);
    }
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const [post] = await db
      .insert(blogPosts)
      .values(insertPost)
      .returning();
    return post;
  }

  async getAllAuthors(): Promise<Author[]> {
    try {
      const allAuthors = await db
        .select()
        .from(authors)
        .orderBy(desc(authors.createdAt));
      return allAuthors;
    } catch (err) {
      console.warn("DB unavailable for getAllAuthors, using fallback data");
      return fallbackAuthors;
    }
  }

  async getAuthor(slug: string): Promise<Author | undefined> {
    try {
      const [author] = await db
        .select()
        .from(authors)
        .where(eq(authors.slug, slug));
      return author || undefined;
    } catch (err) {
      console.warn("DB unavailable for getAuthor, using fallback data");
      return fallbackAuthors.find(a => a.slug === slug);
    }
  }

  async createAuthor(insertAuthor: InsertAuthor): Promise<Author> {
    const [author] = await db
      .insert(authors)
      .values(insertAuthor)
      .returning();
    return author;
  }

  async getCommentsByPostId(postId: string, approvedOnly = true): Promise<Comment[]> {
    try {
      const conditions = approvedOnly 
        ? and(eq(comments.postId, postId), eq(comments.approved, true))
        : eq(comments.postId, postId);
      
      const postComments = await db
        .select()
        .from(comments)
        .where(conditions)
        .orderBy(desc(comments.createdAt));
      return postComments;
    } catch (err) {
      console.warn("DB unavailable for getCommentsByPostId, returning empty");
      return [];
    }
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
