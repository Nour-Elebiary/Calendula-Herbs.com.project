# AGENTS.md — Calendula Herbs

## Status
✅ Codebase complete — all improvements applied. Ready for production deployment after env var config.

## Stack
- Next.js 16.2.9 (App Router) + TypeScript + Tailwind CSS v4 + Radix UI
- Prisma 6 + Supabase (PostgreSQL) + Cloudinary + NextAuth.js v5 (beta)
- Upstash Redis + Framer Motion + Zustand + RHF + Zod
- No test framework, no CI workflows, no typecheck script

## Commands
```bash
npm run dev       # next dev
npm run build     # next build
npm run start     # next start
npm run lint      # eslint
npx prisma migrate dev   # create/apply migration
npx prisma db push       # quick schema sync (no migration file)
tsx prisma/seed.ts       # seed: admin@calendulaherbs.com / admin123
```

## Route groups
- `(public)/` — public pages (/, /about, /products, /contact, /galleries, /certificates, /privacy, /terms)
- `(admin-auth)/` — `/admin/login`, `/admin/forgot-password`, `/admin/otp`
- `(admin-panel)/` — `/admin/dashboard/*` (protected)
- `/api/admin/*` — JWT-protected (middleware returns 401/redirect)
- `/api/public/*` — read-only, rate limited, now with email notifications
- `/api/auth/[...nextauth]` — NextAuth handler
- `/api/otp/*` — forgot-password OTP flow

## Key architectural rules
1. **Every API endpoint** validates input with Zod before touching DB
2. **Admin auth**: NextAuth v5 credentials, JWT strategy, 8h expiry. Custom `AdminSession` for per-session revocation.
3. **Middleware** protects `/admin/*` and `/api/admin/*`. Login + forgot-password exempted.
4. **Cloudinary signed uploads only** — server generates signature; client never has write API key
5. **All colors via CSS variables** (globals.css, overridable from `SiteSetting` DB table)
6. **Images**: `next/image` with Cloudinary remote pattern (`res.cloudinary.com`)
7. **Rate limiting**: Upstash Redis on all public endpoints (login, OTP, contact, cart, sample, search, generic API)

## Database
- `prisma/schema.prisma` — 18 models
- Migration applied: `20260611013013_init`
- DB seeded: `admin@calendulaherbs.com` / `admin123`
- DB live on Supabase (IPv4 pooler, aws-0-eu-west-3)

## Recent improvements (this session)
- **Rate limiters** wired to contact, cart, and sample API routes
- **Email notifications** wired — confirmation to user + notification to admin on contact, cart, sample
- **Sample request email functions** added (confirmation + notification)
- **DOMPurify sanitization** on product descriptions (XSS prevention)
- **Input length limits** on all public Zod schemas
- **`trustHost`** scoped to development only
- **Honeypot field** added to ContactForm (anti-spam)
- **Lightbox modal** for gallery images with keyboard navigation
- **Missing pages**: `/privacy`, `/terms`, `not-found.tsx`, `error.tsx`
- **Dashboard stats** now use real DB queries (products, sessions, inquiries)
- **Custom 404 and error pages**

## Deployment prerequisites
Env vars to configure (`.env.example` has full list):
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Codebase layout
- `src/lib/` — auth, db, cloudinary, email, otp, rate-limit, security, utils
- `src/components/ui/` — primitives (button, input, dialog, select, etc.)
- `src/components/admin/` — AdminSidebar, AdminHeader, MediaUploader, MediaPicker, ImageCropper
- `src/components/public/` — Header, Footer, CartDrawer, CartProvider, ContactForm, ProductActions, GalleryLightbox
- `src/app/(public)/` — public server components + async data fetching
- `src/app/(admin-panel)/admin/dashboard/` — admin CMS pages
- `src/app/api/admin/` — all admin CRUD routes

## opencode
Config in `.opencode/opencode.json`. Custom agents: `admin-dev`, `public-dev`.

## Open issues (pre-existing, non-blocking)
- Middleware convention deprecated (Next.js 16 recommends "proxy" file)
- 33 lint errors (setState-in-effect, `any` types, unescaped entities — pre-existing)
- Cloudinary/Resend/Upstash env vars still `REPLACE_ME`
