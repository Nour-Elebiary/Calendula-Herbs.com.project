# AGENTS.md — Calendula Herbs

## Stack
- Next.js 16.2.9 (App Router) + TypeScript + Tailwind CSS v4 (`@tailwindcss/postcss`) + Radix UI + Framer Motion
- Prisma 6 + Supabase PostgreSQL (IPv4 pooler, `aws-0-eu-west-3`) + Cloudinary + NextAuth.js v5 (beta)
- Upstash Redis (rate limits) + Zustand + React Hook Form + Zod v4
- **No test framework**, no typecheck script, no `src/hooks/`, `src/stores/`, or `src/types/` dirs

## Commands
```bash
pnpm dev                     # next dev (port 3000)
pnpm build                   # next build (run prisma generate first)
pnpm start                   # next start
pnpm lint                    # ESLint (33 pre-existing — setState-in-effect, `any`, unescaped entities)

pnpm prisma generate         # required after schema changes before build
pnpm prisma migrate dev      # create & apply migration
pnpm prisma db push          # quick schema sync (no migration file)
pnpm prisma studio           # DB browser
pnpm tsx prisma/seed.ts      # seed: admin@calendulaherbs.com / key from secrets.json

pnpm tsc --noEmit            # explicit typecheck (no npm script)
```

Package manager is **pnpm**. Run `prisma generate` before `build` and `tsc --noEmit`.

## Design system — "Botanical Light Glass — Calendula Dawn Edition"
- **Public site**: light theme (`#FAFAF6` bg-void, `#F2EFE7` bg-base, `#E8E3D9` bg-elevated). CSS variables in `globals.css`. Calendula `#DC7E18` accent, sage green `#5E9E66`.
- **Admin panel** (`#0a0f0d` bg): dark theme preserved under `.admin-panel` CSS scope. Utility classes `admin-card`, `admin-table`, `admin-input`. Radix context fix: add `className="admin-panel"` to admin layout root div.
- **Typography**: Cormorant Garamond (headings, `--font-display`), DM Sans (body, `--font-body`), Dancing Script (script, `--font-script`), JetBrains Mono (mono, `--font-mono`). Fluid `clamp()` scale.
- **Component classes** (all in `globals.css`): `card-glass`, `btn`/`btn-primary`/`btn-secondary`/`btn-accent` (pill shape), `badge`/`badge-green`/`badge-calendula`, `hero-atmospheric` (photo + vignette overlay), `nav-primary` (frosted sticky), `footer-primary` (4-col), `stat-row`, `cert-strip`/`cert-badge`, `section-divider`, `feature-card`, `channel-card`, `product-card`, `leaf-float`, `scroll-reveal`.
- **Product grid**: 1 col `<480px`, 2 cols `480-1023px`, 3 cols `≥1024px` (`.product-grid` class).
- **Accessibility**: calendula `#DC7E18` on `#FAFAF6` is WCAG AA (4.8:1). Tap targets min 44×44px.
- **B2B export only**: no pricing displayed, no "Buy Now" / "Add to Cart" — only "Request a Quote", "Get a Sample", "Contact Us".

## Animation conventions
- Shared variants in `src/lib/animations.ts`: `fadeInUp`, `fadeInLeft`, `staggerContainer`, `cardVariant`. `LazyMotion` + `domAnimation` at root layout.
- Public pages: `whileInView` + `viewport={{ once: true }}` (never replay). Hero uses `animate`.
- Respect `prefers-reduced-motion` via `useReducedMotion()`.

## Route groups
| Group | Routes |
|---|---|
| `(public)/` | `/`, `/about`, `/products`, `/products/[slug]`, `/galleries`, `/certificates`, `/contact`, `/team`, `/sample`, `/faq` |
| `(admin-auth)/` | `/admin/login`, `/admin/forgot-password`, `/admin/otp` |
| `(admin-panel)/admin/dashboard/` | media, galleries, certificates, products, team, settings, inquiries, profile |
| `/api/admin/*` | JWT-protected CRUD (middleware returns 401 or redirect) |
| `/api/public/*` | read-only, rate limited |
| `/api/auth/[...nextauth]` | NextAuth handler |
| `/api/otp/*` | forgot-password OTP flow |
| Root-level | `/privacy`, `/terms`, `not-found.tsx`, `error.tsx`, `sitemap.ts`, `robots.ts` |

## Key architectural rules
1. **Zod validation** on every API endpoint before touching DB (Zod v4, import from `zod`)
2. **Admin auth**: NextAuth v5 credentials, JWT strategy, 8h expiry. Custom `AdminSession` table for per-session revocation. Proxy in `src/proxy.ts` (Next.js 16 proxy convention).
3. **Cloudinary signed uploads only** — server generates signature in `POST /api/admin/media/sign`, client never has write key
4. **Colors via CSS variables** in `globals.css`, overridable from `SiteSetting` DB table
5. **Images**: `next/image` with Cloudinary remote pattern `res.cloudinary.com`. CSP allows `blob:`.
6. **Rate limiting**: Upstash Redis — 7 limiters in `src/lib/rate-limit.ts` (login, OTP send/verify, contact, cart, search, generic API)
7. **Email**: Resend (3K/month free) for OTP, contact confirmation, inquiry notifications
8. **`serverExternalPackages`**: `["@prisma/client", "bcryptjs"]` in next.config.ts
9. **Plugin system**: CMS-managed embed codes at HEAD, BODY_END, FOOTER_FIXED, CHAT_WIDGET positions
10. **Admin login security**: 5-attempt lockout (15 min), IP + User-Agent + geolocation capture, audit log on all write actions

## Database
- `prisma/schema.prisma` — 18 models. Migration `20260611013013_init` already applied to Supabase.
- Seed: single admin (`admin@calendulaherbs.com`), password from `secrets.json` (`adminInitialKey`). Delete `secrets.json` after first login & password change.
- Prisma v6 dual-connection: `DATABASE_URL` (pooler, port 6543) for queries, `DIRECT_URL` (port 5432) for migrations.
- `pnpm-workspace.yaml` explicitly allows `@prisma/client`, `prisma`, `sharp` builds.

## Codebase layout
```
src/
  lib/            auth, db, cloudinary, email, otp, rate-limit, security, animations, utils
  app/
    (public)/     public server components + async data fetching
    (admin-auth)/ login, forgot-password, OTP pages
    (admin-panel)/admin/dashboard/  admin CMS pages
    api/          admin/, public/, auth/[...nextauth], otp/send, otp/verify
    globals.css   Tailwind v4 + CSS variables + design tokens
    layout.tsx    root layout (fonts, providers, PWA)
  components/
    ui/           Radix UI primitives (button, input, dialog, select, etc.)
    admin/        AdminSidebar, AdminHeader, MediaUploader, MediaPicker, ImageCropper
    public/       Header, Footer, CartDrawer, CartProvider, ContactForm, GalleryLightbox, CookieConsent, MapEmbed
    public/home/  HeroSection, StatsBar, FeaturedProductsSection, BotanicalAboutSection, ProcessSection, CertsBanner
    public/shared/ BotanicalDivider, FloatingLeaves, SectionLabel
  proxy.ts        auth guard (Next.js 16 proxy convention, replaces middleware)
prisma/           schema.prisma, seed.ts, migrations/
```

## Deployment
Env vars in `.env.example` (all currently populated in `.env.local`):
- `DATABASE_URL`, `DIRECT_URL` — Supabase pooler + direct
- Cloudinary, Resend, Upstash Redis, NEXTAUTH, `NEXT_PUBLIC_SITE_URL`
- CSP in `next.config.ts` allows tawk.to, Cloudinary, Supabase, YouTube, Resend, Upstash
- Image remotePatterns: `res.cloudinary.com`, `*.supabase.co`, `img.youtube.com`, `i.ytimg.com`

## Security notes
- `.env.local` contains live credentials (Supabase DB password, Cloudinary secret, Resend key, Upstash token). Do not commit.
- `secrets.json` contains the initial admin key. Delete after first use.
- No CI workflows exist (`.github/workflows/` absent). No `.opencode/opencode.json` despite prior reference.
