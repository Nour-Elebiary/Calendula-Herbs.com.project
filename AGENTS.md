# AGENTS.md — Calendula Herbs

Next.js 16.2.9 App Router + TypeScript + Tailwind v4 (`@tailwindcss/postcss`) + Radix UI + Framer Motion.  
Prisma 6 + Supabase PostgreSQL (IPv4 pooler, `aws-0-eu-west-3`) + Cloudinary + NextAuth.js v5 beta.  
Upstash Redis (rate limits) + Zustand + React Hook Form + Zod v4.  
**No test framework.** No `src/hooks/`, `src/stores/`, `src/types/` dirs.

## Commands
```
pnpm dev                    # next dev (port 3000)
pnpm build                  # next build (run prisma generate first)
pnpm start                  # next start
pnpm lint                   # ESLint v9 (33 pre-existing — setState-in-effect, `any`, unescaped entities)

pnpm prisma generate        # required after schema changes before build
pnpm prisma migrate dev     # create & apply migration
pnpm prisma db push         # quick schema sync (no migration file)
pnpm prisma studio          # DB browser
pnpm tsx prisma/seed.ts     # seed: admin@calendulaherbs.com / key from secrets.json

pnpm tsc --noEmit           # explicit typecheck (no npm script)
```

Package manager is **pnpm**. Run `prisma generate` before `build`. Run `tsc --noEmit` for typecheck.

## Auth & security
- NextAuth v5 credentials, JWT strategy, 8h expiry. Custom `AdminSession` table for per-session revocation.
- Auth guard at `src/proxy.ts` (Next.js 16 proxy convention, replaces `middleware.ts`). Matches `/admin/:path*` and `/api/admin/:path*`.
- 5-attempt lockout (15 min), IP + User-Agent + geolocation capture, audit log on all write actions.
- Cloudinary **signed uploads only** — `POST /api/admin/media/sign` generates server-side signature.
- `.env.local` + `secrets.json` contain live credentials. Do not commit. Delete `secrets.json` after first login.
- Rate limiting via Upstash Redis: 8 sliding-window limiters in `src/lib/rate-limit.ts` (login, OTP send/verify, contact, cart, search, sample, generic API).

## Database
- `prisma/schema.prisma` — 18 models. Migration `20260611013013_init` already applied to Supabase.
- Prisma v6 dual-connection: `DATABASE_URL` (pooler, port 6543) for queries, `DIRECT_URL` (port 5432) for migrations.
- Zod v4 validation on every API endpoint before touching DB.
- Seed: single admin (`admin@calendulaherbs.com`), password from `secrets.json` (`adminInitialKey`).

## Design system — "Botanical Light Glass — Calendula Dawn Edition"
- **Public**: light theme (`#FAFAF6` bg-void, `#F2EFE7` bg-base). CSS vars in `globals.css`. Calendula `#DC7E18` accent, sage green `#5E9E66`.
- **Admin** (`#0a0f0d` bg): dark theme under `.admin-panel` CSS scope. Add `className="admin-panel"` to admin layout root div for Radix context.
- **Typography**: Cormorant Garamond (headings, `--font-display`), DM Sans (body, `--font-body`), Dancing Script (script, `--font-script`), JetBrains Mono (mono, `--font-mono`). Fluid `clamp()` scale.
- **Utility classes** in `globals.css`: `card-glass`, `btn`/`btn-primary`/`btn-secondary`/`btn-accent` (pill), `badge`/`badge-green`/`badge-calendula`, `hero-atmospheric`, `nav-primary` (frosted sticky), `section-divider`, `product-card`, `leaf-float`, `scroll-reveal`, etc.
- **B2B export only**: no "Buy Now" / "Add to Cart" — only "Request a Quote", "Get a Sample", "Contact Us".
- WCAG AA: `#DC7E18` on `#FAFAF6` = 4.8:1 contrast. Tap targets min 44×44px.

## Animation conventions
- Shared variants in `src/lib/animations.ts`: `fadeInUp`, `fadeInLeft`, `fadeInRight`, `staggerContainer`, `cardVariant`, `heroStagger`, `heroChild`, `scaleIn`.
- `LazyMotion` + `domAnimation` at root layout. Public pages: `whileInView` + `viewport={{ once: true }}`. Respect `prefers-reduced-motion`.

## Route groups
| Group | Routes |
|---|---|
| `(public)/` | `/`, `/about`, `/products`, `/products/[slug]`, `/galleries`, `/certificates`, `/contact`, `/team`, `/sample`, `/faq` |
| `(admin-auth)/` | `/admin/login`, `/admin/forgot-password`, `/admin/otp` |
| `(admin-panel)/admin/dashboard/` | media, galleries, certificates, products, team, settings, inquiries, profile |
| `/api/admin/*` | JWT-protected CRUD |
| `/api/public/*` | read-only, rate limited |
| `/api/auth/[...nextauth]` | NextAuth handler |
| `/api/otp/send`, `/api/otp/verify`, `/api/otp/reset-password` | forgot-password OTP flow |
| Root-level | `/privacy`, `/terms`, `not-found.tsx`, `error.tsx`, `sitemap.ts`, `robots.ts` |

## Codebase layout
```
src/
  lib/            auth, db, cloudinary, email, otp, rate-limit, security, animations, utils
  app/
    (public)/     public server components + async data fetching
    (admin-auth)/ login, forgot-password, OTP pages
    (admin-panel)/admin/dashboard/  admin CMS pages
    api/          admin/ (CRUD), public/ (read-only), auth/[...nextauth], otp/send, otp/verify, otp/reset-password
    globals.css   Tailwind v4 + CSS variables + design tokens (~1200 lines)
    layout.tsx    root layout (fonts: CormorantGaramond + DM Sans + DancingScript + JetBrainsMono, PWA manifest)
  components/
    ui/           Radix UI primitives (button, input, dialog, select, checkbox, switch, tabs, toast, tooltip)
    admin/        AdminSidebar, AdminHeader, MediaUploader, MediaPicker, ImageCropper
    public/       Header, Footer, CartDrawer, CartProvider, ContactForm, GalleryLightbox, CookieConsent, MapEmbed
    public/home/  HeroSection, StatsBar, FeaturedProductsSection, BotanicalAboutSection, ProcessSection, CertsBanner
    public/shared/ BotanicalDivider, FloatingLeaves, SectionLabel
  proxy.ts        auth guard (Next.js 16 proxy convention)
prisma/           schema.prisma, seed.ts, migrations/ (1 applied: 20260611013013_init)
```

## `.opencode/opencode.json`
Defines 2 subagents (`admin-dev`, `public-dev`) and custom commands (`dev`, `build`, `lint`, `db-migrate`, `db-seed`, `db-studio`, `deploy`, `routes`). Referenced by `AGENTS.md` as instruction source.

## Deployment
Env vars in `.env.example` (populated in `.env.local`): Supabase pooler + direct, Cloudinary, Resend, Upstash Redis, NEXTAUTH, `NEXT_PUBLIC_SITE_URL`.  
CSP in `next.config.ts` allows tawk.to, Cloudinary, Supabase, YouTube, Resend, Upstash, `blob:` (images), Vercel analytics.  
Image `remotePatterns`: `res.cloudinary.com`, `*.supabase.co`, `img.youtube.com`, `i.ytimg.com`.  
`serverExternalPackages`: `["@prisma/client", "bcryptjs"]`. No CI workflows exist.
