# Design Guidelines: VI&MO Sťahovanie - Premium Moving Services Website

## Design Approach

**Reference-Based Approach:** Drawing inspiration from successful service businesses like Thumbtack, TaskRabbit, and European logistics companies that balance professionalism with approachability. The design should convey trustworthiness, efficiency, and local expertise while maintaining a modern, clean aesthetic.

**Core Principles:**
- Trust-first design with prominent social proof and credentials
- Mobile-first approach (users often search for movers on mobile)
- Clear conversion paths with multiple CTA opportunities
- Professional yet warm and approachable tone
- SEO-optimized content presentation

---

## Typography

**Font System:**
- Primary: Inter (via Google Fonts) - clean, modern, excellent readability
- Secondary: Nunito Sans (for headings) - friendly, professional warmth

**Hierarchy:**
- H1: 32px (mobile) / 48px (desktop), weight 700, tight letter-spacing (-0.03em)
- H2: 24px (mobile) / 36px (desktop), weight 700
- H3: 20px (mobile) / 24px (desktop), weight 600
- Body: 16px, weight 400, line-height 1.6
- Small text: 14px for metadata, captions
- Micro text: 12px for footer, disclaimers

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 8, 12, 16, 20, 24 for consistent vertical rhythm
- Component padding: p-8 (mobile) / p-12 (desktop)
- Section spacing: py-16 (mobile) / py-24 (desktop)
- Element gaps: gap-4, gap-8, gap-12

**Grid System:**
- Max container width: 1280px (max-w-7xl)
- Content width: 1024px (max-w-6xl) for text-heavy sections
- Blog content: 720px (max-w-3xl) for optimal reading

**Responsive Breakpoints:**
- Mobile: base (< 640px) - single column
- Tablet: md (640px+) - 2 columns where appropriate
- Desktop: lg (1024px+) - 3-4 columns for service cards/features

---

## Component Library

### Navigation
**Sticky Header:** Blurred background (backdrop-blur-lg), subtle border bottom, compact height (64px)
- Logo: Truck emoji + company name on left
- Navigation links: horizontal menu (center/right)
- Primary CTA: "Nezáväzná ponuka" button (prominent, always visible)
- Phone number: visible on desktop, click-to-call on mobile

### Hero Section (Homepage)
**Layout:** Asymmetric two-column (60/40 split on desktop)
- Left: Headline + description + dual CTA buttons + trust indicators
- Right: Gradient card with truck illustration/icon (not full image - maintaining clean aesthetic)
- Trust indicators: Small badges/text below CTAs (insurance, experience, reviews)
- No full-width hero image - focus on immediate clarity and conversion

### Service Cards
**Grid:** 2 columns (tablet) / 4 columns (desktop)
- Card style: White background, rounded corners (16px), subtle border, hover elevation
- Icon: Large emoji or simple SVG at top
- Title + short description + "Zistiť viac →" link
- Consistent heights with bottom-aligned CTA links

### Pricing Section
**Table Layout:** Structured comparison with clear visual hierarchy
- Left column: Service type/apartment size
- Right column: Price range (bold, emphasized)
- Background alternating rows for readability
- "Zobraziť celý cenník" link at bottom

### Blog System
**Blog Overview Page:**
- Featured post: Large card at top (image + title + excerpt + date/reading time)
- Grid: 3 columns (desktop) / 2 columns (tablet) / 1 column (mobile)
- Each card: Featured image, category tag, title, excerpt, date, reading time
- Pagination: Simple numbered navigation

**Blog Post Layout:**
- Single column, centered (max-w-3xl)
- Featured image at top (16:9 aspect ratio)
- Metadata: Published date, author, reading time, category tags
- Typography optimized for long-form reading
- Related posts section at bottom (3 cards)
- Table of contents for longer articles (sticky on desktop)

### Contact/Quote Forms
**Layout:** Two-column on desktop
- Left: Form fields (name, email, phone, apartment size, date, message)
- Right: Contact information card (address, phone, email, map placeholder)
- Submit button: Full-width, prominent
- Validation: Inline error messages

### Footer
**Multi-column structure:**
- Column 1: Logo + brief tagline
- Column 2: Quick links (services, pricing, blog, contact)
- Column 3: Contact info (address, phone, email)
- Column 4: Legal/certifications (IČO, DIČ, insurance info)
- Bottom: Copyright + social links (if applicable)

---

## SEO-Optimized Elements

### Breadcrumbs
- Visible on all pages except homepage
- Small, unobtrusive at top of content
- Schema markup ready (implemented via JSON-LD)

### Structured Data Indicators
- Trust badges: Insurance certification, years of experience, customer count
- Star ratings display: When reviews are added (prepared for schema markup)
- Local business info: Address, phone, service area prominently displayed

### Blog Metadata
- Category tags: Colored badges at top of posts
- Reading time: Displayed with publish date
- Author info: Small byline with optional avatar
- Social sharing: Subtle share buttons (prepared for implementation)

---

## Page-Specific Guidelines

### Homepage Sections (Order):
1. Hero (asymmetric, conversion-focused)
2. Trust indicators bar (certifications, insurance, customer count)
3. Services preview (4-column grid)
4. Pricing teaser (compact table)
5. Blog preview (3 latest posts)
6. Final CTA section (centered, prominent quote request)

### Blog Pages:
- Clean, distraction-free reading experience
- Generous whitespace around text
- Images: Full-width within content column
- Pull quotes: Styled distinctly for emphasis
- Code blocks: If needed for tutorials, syntax highlighted

### Service Pages:
- Process timeline: Numbered steps with icons
- Before/after scenarios: Comparison cards
- FAQ section: Expandable accordion pattern
- Testimonials: Card-based layout with quote + name + location

---

## Images

**Homepage Hero:** NO large hero image - instead, use a gradient card with truck emoji/icon (maintaining clean, fast-loading aesthetic)

**Blog Posts:**
- Featured images: 1200x675px (16:9), optimized WebP format
- Placement: Top of article, full-width within content column
- Alt text required for SEO

**Service Pages:**
- Icon-based illustrations rather than photos
- Process diagrams: Simple, clean vector graphics
- Testimonial placeholders: Avatar circles (can use initials if no photos)

**General:**
- Lazy loading for all images below fold
- Responsive srcset for different screen sizes
- Consistent aspect ratios within each section type

---

## Animation Strategy

**Minimal, purposeful animations:**
- Hover states: Subtle elevation on cards (2px translate-y)
- Link underlines: Smooth slide-in effect
- CTA buttons: Gentle scale on hover (1.02)
- Page transitions: None (instant navigation for speed)
- Scroll animations: None (prioritizing performance and accessibility)

**Performance Focus:** No heavy animations, no scroll-triggered effects, prioritizing load speed and SEO metrics.