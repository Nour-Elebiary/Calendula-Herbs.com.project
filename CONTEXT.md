# Calendula Herbs — Project Context
Last updated: 2026-06-11 | Current chunk: **5 (Products Manager — next up)**

## Stack
Next.js 16.2.9 (App Router) + TypeScript + Tailwind CSS v4 + Radix UI
+ Prisma 6 + Supabase (PostgreSQL) + Cloudinary + NextAuth.js v5 (beta)
+ Upstash Redis + Framer Motion + Zustand + RHF + Zod

## Repo
Location: `e:\Calendula Herbs Website Project\calendula-herbs\`
Branches: main (prod) | develop (staging)
Domain: calendulaherbs.com

## Services
- Supabase: Working properly via IPv4 pooler (`aws-0-eu-west-3.pooler.supabase.com:6543`)
- Cloudinary: REPLACE_ME (not yet configured)
- Resend: REPLACE_ME (not yet configured)
- Upstash Redis: REPLACE_ME (not yet configured)

## DB Schema version
Prisma schema: `prisma/schema.prisma` (all models defined)
Migration status: ✅ **Migrated** (`20260611013013_init`)
Seed status: ✅ **Seeded** (`admin@calendulaherbs.com` / `admin123`)

## Conventions
- All admin API routes: /api/admin/* (JWT protected via middleware)
- All public API routes: /api/public/* (read-only, rate limited)
- Zod validation on every API endpoint input
- Cloudinary signed uploads only (server generates signature)
- Images served via next/image with Cloudinary loader
- All colors via CSS variables (defined in globals.css, overridable from DB)
- Route groups: (admin-auth) for login/OTP, admin/ for dashboard
- Fonts: Inter (body via `--font-body`), Playfair Display (headings via `--font-heading`)

## Completed chunks
- [x] Chunk 0 — Skeleton (deployed to Vercel, DB migrated)
- [x] Chunk 1 — Auth Foundation (middleware, NextAuth, login IP/UA capture, session invalidation)
- [x] Chunk 2 — OTP + Account (forgot password, OTP generation via email, admin dashboard wrapper)

## Completed chunks (continued)
- [x] Chunk 3 — Cloudinary Media System
  - [x] `lib/cloudinary.ts`, `MediaUploader.tsx`, `ImageCropper.tsx`, `MediaPicker.tsx`
  - [x] `POST /api/admin/media/sign`, `POST /api/admin/media`, `GET /api/admin/media`, `DELETE /api/admin/media/[id]`, `PATCH /api/admin/media/[id]` (rename)
  - [x] `/admin/dashboard/media` — grid, filter, rename, delete, copy URL, storage bar, pagination
- [x] Chunk 4 — Gallery & Certificates Managers
  - [x] `POST/GET/PATCH /api/admin/gallery` + `GET/PATCH/DELETE /api/admin/gallery/[id]`
  - [x] `POST/PATCH /api/admin/gallery/[id]/items`, `PATCH/DELETE /api/admin/gallery/[id]/items/[itemId]`
  - [x] `POST/GET/PATCH /api/admin/certificates`, `PATCH/DELETE /api/admin/certificates/[id]`
  - [x] `/admin/dashboard/galleries` — dnd-kit list, create, rename, delete
  - [x] `/admin/dashboard/galleries/[id]` — grid items, add (media/YouTube/Drive), drag-reorder
  - [x] `/admin/dashboard/certificates` — dnd-kit list, create/edit dialog with MediaPicker

## Key file locations
- Admin login: `src/app/(admin-auth)/admin/login/page.tsx`
- Auth config: `src/lib/auth.ts`
- DB client: `src/lib/db.ts`
- Security utils: `src/lib/security.ts`
- Rate limits: `src/lib/rate-limit.ts`
- Middleware: `src/middleware.ts`
- Globals CSS: `src/app/globals.css`
- Media API: `src/app/api/admin/media/route.ts`
- OTP API: `src/app/api/otp/send/route.ts`

## Open issues / known debt
1. ⚠️ Upstash Redis not configured — rate limiting will fail until REPLACE_ME values are filled in `.env.local`
2. ⚠️ Cloudinary not configured — media uploads blocked until keys added to `.env.local`
3. ⚠️ Resend not configured — OTP emails will fail to send until API key is added
4. Admin login page uses `zod v4` — `z.string().email()` should be used instead of `z.email()`.
