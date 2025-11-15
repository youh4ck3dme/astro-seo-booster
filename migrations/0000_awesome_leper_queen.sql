CREATE TABLE "blog_posts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"featured_image" text,
	"author" text DEFAULT 'VI&MO Team' NOT NULL,
	"published_at" timestamp DEFAULT now() NOT NULL,
	"reading_time" integer DEFAULT 5 NOT NULL,
	"meta_description" text,
	"featured" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"apartment_size" text,
	"move_date" text,
	"message" text NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL
);
