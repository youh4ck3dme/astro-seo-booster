# VI&MO Sťahovanie - Premium Moving Services Website

## Overview

VI&MO Sťahovanie is a professional moving services website for Bratislava, Slovakia. The application provides a modern, SEO-optimized platform for a moving company offering residential, commercial, and clearance services. Built with React, Express, and PostgreSQL, it features a bilingual (Slovak) content management system with blog functionality, contact forms, and service showcases designed to convert visitors into customers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router

**UI Component System**
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design system
- Custom theme system using CSS variables for light/dark mode support
- Font stack: Inter (primary) and Nunito Sans (headings) via Google Fonts

**State Management & Data Fetching**
- **TanStack Query (React Query)** for server state management and caching
- **React Hook Form** with Zod validation for form handling
- Custom hooks for analytics tracking and mobile detection

**Design System**
- Component-based architecture following "Flutter style" feature organization
- Mobile-first responsive design (breakpoints: 640px, 1024px)
- Trust-first design approach inspired by service platforms like Thumbtack
- SEO-optimized content presentation with structured data

### Backend Architecture

**Server Framework**
- **Express.js** running on Node.js with TypeScript
- Custom middleware for request logging and JSON body parsing with raw body preservation
- Vite integration for development with HMR support

**API Structure**
- RESTful API endpoints under `/api` prefix
- Blog posts CRUD operations (`/api/blog/posts`)
- Contact form submissions (`/api/contact`)
- Zod schema validation for all incoming data

**Data Layer Pattern**
- Storage interface abstraction (`IStorage`) for database operations
- In-memory storage implementation (`MemStorage`) for development/demo
- Prepared for PostgreSQL integration via Drizzle ORM

### Database Design

**ORM & Schema**
- **Drizzle ORM** with PostgreSQL dialect
- **Drizzle-Zod** integration for runtime validation from database schemas

**Tables**
1. **blog_posts**
   - Primary fields: id (UUID), slug (unique), title, excerpt, content
   - Metadata: category, tags (array), author, publishedAt, readingTime
   - SEO: metaDescription, featuredImage, featured flag
   - Content management optimized for Slovak language blog posts

2. **contact_submissions**
   - Fields: id (UUID), name, email, phone
   - Moving-specific: apartmentSize, moveDate
   - message and submittedAt timestamp
   - Designed to capture lead information for sales follow-up

**Schema Management**
- Schema defined in `shared/schema.ts` for client-server type safety
- Migration management via Drizzle Kit
- Database connection via Neon serverless driver

### SEO & Analytics Architecture

**SEO Implementation**
- **React Helmet Async** for meta tag management
- Structured data (JSON-LD) for local business, services, and blog posts
- Schema.org markup for MovingCompany, Service, BlogPosting
- Breadcrumb navigation with structured data
- Canonical URLs and Open Graph tags on all pages

**Analytics & Performance**
- **Google Analytics 4** integration via gtag.js
- **Core Web Vitals** tracking (CLS, FID, FCP, LCP, TTFB, INP) via web-vitals library
- **Conversion tracking** for:
  - Form submissions (quote requests)
  - Phone clicks
  - Email clicks
  - Service views
  - Blog post reads
- Custom page view tracking for SPA navigation
- Event tracking with detailed categorization
- Performance metrics sent to Google Analytics

**Google Business Profile Integration**
- **Google Places API** integration for reviews and location data
- Automatic fetching of business ratings and reviews
- Display of up to 6 most recent Google reviews
- Location information display (address, phone, hours)
- Real-time review updates from Google

**Content Strategy**
- Slovak-language content optimization
- Local SEO targeting Bratislava region
- Blog system for content marketing
- Trust indicators and social proof placement

### Routing & Navigation

**Page Structure**
- `/` - Home with hero, services preview, pricing, blog preview
- `/stahovanie` - Services detail page
- `/cennik` - Pricing information
- `/kontakt` - Contact form with company details
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog posts
- 404 handling with NotFound component

**Navigation Features**
- Sticky header with mobile hamburger menu
- Active route highlighting
- SEO-friendly breadcrumbs
- Footer with quick links and contact information

## External Dependencies

### Third-Party Services

**Database**
- **Neon Serverless PostgreSQL** - Cloud-hosted PostgreSQL with serverless driver
- Connection via `@neondatabase/serverless` package
- Environment variable: `DATABASE_URL`

**Analytics & Monitoring**
- **Google Analytics 4** - Web analytics, conversion tracking, Core Web Vitals
- **Google Places API** - Business reviews and location data
- Environment variables: 
  - `VITE_GA_MEASUREMENT_ID` (required for analytics)
  - `GOOGLE_PLACES_API_KEY` (optional, for reviews)
  - `GOOGLE_PLACE_ID` (optional, defaults to example ID)

### Key npm Packages

**UI & Styling**
- `@radix-ui/*` - 20+ headless UI component primitives
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant management
- `lucide-react` - Icon library

**Forms & Validation**
- `react-hook-form` - Form state management
- `zod` - Schema validation
- `@hookform/resolvers` - Zod integration for forms

**Data & State**
- `@tanstack/react-query` - Server state management
- `drizzle-orm` - Type-safe ORM
- `drizzle-zod` - Schema-to-Zod conversion

**Development Tools**
- `@replit/vite-plugin-*` - Replit-specific Vite plugins for development
- `tsx` - TypeScript execution for development server
- `esbuild` - Production build bundling

**Session & Storage**
- `connect-pg-simple` - PostgreSQL session store (prepared for future auth)

### Build & Deployment

**Build Process**
- Client: Vite builds to `dist/public`
- Server: esbuild bundles to `dist/index.js`
- Shared schema ensures type consistency across client/server boundary

**Environment Configuration**
- Development: `NODE_ENV=development` with Vite dev server
- Production: `NODE_ENV=production` with static file serving

**Required Environment Variables**
- `DATABASE_URL` - PostgreSQL connection string
- `VITE_GA_MEASUREMENT_ID` - Google Analytics 4 measurement ID
- `SESSION_SECRET` - Session encryption secret
- `ADMIN_KEY` - **REQUIRED** Admin panel authentication key for comment moderation (no default for security)

**Optional Environment Variables**
- `GOOGLE_PLACES_API_KEY` - Google Places API key for reviews
- `GOOGLE_PLACE_ID` - Google Place ID for business location
- `BASE_URL` - Base URL for sitemap and RSS generation

## Advanced Features

### Blog System with Moderation
- Author profiles with bio, social links, and avatars
- Comment system with admin moderation
- Admin panel at `/admin/comments` with authentication
- Comments require approval before publication
- Automatic database seeding for demo content

### Performance Monitoring
- Real-time Core Web Vitals tracking
- Metrics sent to Google Analytics:
  - Cumulative Layout Shift (CLS)
  - Interaction to Next Paint (INP) *replaced FID in March 2024*
  - First Contentful Paint (FCP)
  - Largest Contentful Paint (LCP)
  - Time to First Byte (TTFB)
- Automatic performance degradation detection

### Conversion Tracking
- Form submission tracking with apartment size
- Phone and email click tracking
- Service page view tracking
- Blog reading time tracking
- Quote request conversions
- Event categorization for analysis

### Google Business Integration
- Automatic review fetching from Google Places
- Business rating and review count display
- Recent customer reviews showcase
- Location data integration
- Direct links to Google Business Profile