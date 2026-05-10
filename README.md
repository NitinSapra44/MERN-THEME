# VidNova — Next.js APK Download Theme

A fully-featured, dark-themed Next.js 15 website for promoting and distributing Android APK files (video downloader apps, utilities, etc.). Includes a complete admin panel, multi-language support, blog system, and dynamic CSS controls.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (via `pg`) |
| Auth | `iron-session` (session cookies) |
| i18n | `next-intl` (21 locales) |
| Rich Text | TipTap editor |
| Styling | Inline styles (no CSS framework) |

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

---

## Setup

### 1. Clone & install dependencies

```bash
npm install
```

### 2. Create PostgreSQL database

```bash
createdb vidmate
```

### 3. Create the schema

```bash
psql -U <your_pg_user> -d vidmate -f schema.sql
```

> If upgrading an existing database, run the migration instead:
> ```bash
> psql -U <your_pg_user> -d vidmate -f migration_sprint1.sql
> ```

### 4. Seed sample data (optional but recommended)

```bash
psql -U <your_pg_user> -d vidmate -f seed.sql
```

This seeds:
- Site settings (name, logo, tagline)
- Homepage content (hero, intro, features, screenshots, FAQs)
- 9 blog posts
- Social media links
- CSS design settings

### 5. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/vidmate
SESSION_SECRET=your-super-secret-session-key-min-32-chars
```

> **SESSION_SECRET** must be at least 32 characters.

### 6. Create upload directories

```bash
mkdir -p public/uploads/logos
mkdir -p public/uploads/blogs
```

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Admin Panel

Visit [http://localhost:3000/admin](http://localhost:3000/admin)

**Default credentials:**
- Username: `admin`
- Password: `admin123`

> Change these in the database after first login: `UPDATE admin_settings SET password = md5('your_new_password');`

### Admin Sections

| Section | What it controls |
|---|---|
| Dashboard | Overview stats and quick links |
| Homepage | Hero banner, intro text, download button |
| Features | App feature cards (icon, title, description) |
| Screenshots | Screenshot showcase cards |
| FAQs | Accordion questions and answers |
| Blogs | Create, edit, delete blog posts |
| About Us | /about page content |
| Contact Us | /contact page content |
| Privacy Policy | /privacy-policy page content |
| DMCA | /dmca page content |
| Social Links | Footer and floating social icons |
| CSS & Design | Colors, font sizes, padding for every section |
| Site Settings | Logo, site name, tagline, header/footer colors |
| Languages | Per-locale content for all 21 supported languages |
| APK Versions | Add/edit/delete APK versions with download tracking |
| SEO Manager | Meta title, description, OG image, robots per static page |
| Slug Manager | Control download & home page URLs with auto-redirects |
| Contact Inbox | Read and reply to contact form submissions |

---

## CSS & Design System

The **CSS & Design** admin page is organized by page section:

1. **Hero Banner** — app title, download button colors/padding, security icons
2. **Intro Section** — body text size/color, H2 heading size in rich content
3. **Features Grid** — section background, card icon box, shared card typography
4. **Screenshots** — shares card heading/text colors with Features
5. **Home Info Section** — heading and body text for the info block
6. **FAQ Section** — section background, heading bar background, question/answer styles
7. **Blog Typography** — H3 size/color for blog article pages

---

## Multi-Language Support

Supported locales (21 total):

`en`, `hi`, `es`, `fr`, `de`, `pt`, `ar`, `zh`, `ja`, `ko`, `ru`, `tr`, `vi`, `th`, `id`, `ms`, `bn`, `ur`, `fa`, `sw`, `tl`

- English (`en`) uses no URL prefix: `yourdomain.com/`
- All other locales use a prefix: `yourdomain.com/hi/`, `yourdomain.com/es/`, etc.
- Per-locale content is managed under **Admin → Languages**

---

## File Uploads

| Type | Upload path | DB stored as |
|---|---|---|
| Logo | `public/uploads/logos/` | bare filename (e.g. `logo.png`) |
| Blog images | `public/uploads/blogs/` | bare filename |

Logo is served at `/uploads/logos/<filename>` automatically.

---

## Production Build

```bash
npm run build
npm run start
```

---

## Project Structure

```
nextjs-vidmate/
├── app/
│   ├── [locale]/          # Public-facing pages (homepage, blogs, about, etc.)
│   └── admin/             # Admin panel (settings, content, CSS, blogs)
├── components/
│   ├── admin/             # Admin UI components (Sidebar, Header, ContentEditorPage)
│   ├── SiteNavbar.tsx     # Public navbar with active link highlighting
│   ├── SiteFooter.tsx     # Footer with social links
│   └── FaqAccordion.tsx   # Client-side FAQ accordion
├── lib/
│   ├── db.ts              # PostgreSQL pool
│   ├── getSiteSettings.ts # Cached DB fetchers (React.cache)
│   └── i18n/              # next-intl routing config
├── public/
│   └── uploads/           # Logo and blog image uploads
├── schema.sql             # Database schema (run once)
└── seed.sql               # Sample content (optional)
```

---

## License

Private / commercial use. All rights reserved.
