# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**CapiShop** is a Next.js 14 (App Router) e-commerce platform for technology products and services, built with TypeScript, PostgreSQL (via Supabase client libraries), and deployed to Vercel.

**Database environment (current):** Local Docker PostgreSQL — not Supabase cloud. The Supabase JS client is used as the query layer, but the database runs locally in a Docker container. Supabase Auth and Storage are NOT active in this environment.

## Commands

```bash
# Development
npm run dev          # Start dev server on port 3003
npm run build        # Production build
npm run lint         # ESLint

# Testing
npm run test                              # Run all tests once
npm run test:watch                        # Watch mode
npm run test:coverage                     # Coverage report (80% threshold)
npx vitest tests/unit/lib/formatting.test.ts   # Run a single test file
npx vitest --grep "formatPrice"           # Run tests matching a pattern

# Database (local Docker)
npm run db:restore:local  # Restore backup into local Docker container
npm run test:database     # Health-check database connection
npm run fix:database      # Run quick database fixes
npm run migrate:json      # Migrate JSON data to database
```

## Architecture

### Data Flow
API Routes → Context Providers → Components. Authenticated users get real-time cart sync via the database; guests use local state.

### Key Directories

- **`app/`** — Next.js App Router. Each subdirectory is a route (`admin/`, `api/`, `auth/`, `cart/`, `checkout/`, `products/`, `profile/`, `orders/`, `favorites/`).
- **`app/api/`** — Serverless API routes for cart, products, and favorites operations.
- **`components/ui/`** — shadcn/ui base components. Do not edit these directly.
- **`components/`** — Feature components organized by domain (`auth/`, `cart/`, `products/`, `layout/`, `payments/`, `sections/`).
- **`contexts/`** — Global state via React Context: `AuthContext`, `CartContext`, `FavoritesContext`, `SharedDataContext`.
- **`lib/supabase/`** — Database client initialization split by environment: `client.ts` (browser), `server.ts` (RSC/SSR), `middleware.ts` (auth middleware helpers), `types.ts` (DB types). Uses Supabase JS client pointed at local Docker.
- **`supabase/`** — Schema (`schema.sql`), migrations, and DB backup (`db_cluster-04-09-2025@04-34-20.backup.gz`).
- **`tests/unit/`** — Vitest tests mirroring `lib/`, `components/`, and `contexts/` structure.

### Authentication
`middleware.ts` at the root intercepts all requests (except static assets) and delegates to `lib/supabase/middleware.ts` for session validation. Protected routes redirect to `/auth/login`. Note: Supabase Auth is not active in the local Docker environment.

### State Management
Four Context providers wrap the app in `app/layout.tsx`. `CartContext` handles both guest (localStorage) and authenticated (DB) cart states, merging them on login.

### Rate Limiting
`lib/ratelimit.ts` uses Upstash Redis. It gracefully degrades — the app functions normally if Upstash env vars are not set.

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=      # Points to local Docker: http://localhost:54329 (or Supabase cloud when deploying)
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key (still required by the client library)
```

Optional:
```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

## Local Docker Database

Container: `capishop-postgres` | Port: `54329` | DB: `postgres` | User: `capishop_admin`

```powershell
# Connect directly
docker exec -it capishop-postgres psql -U capishop_admin -d postgres

# Restore from backup
npm run db:restore:local
```

## Tech Stack

- **Framework:** Next.js 14, App Router, TypeScript
- **Database:** PostgreSQL via Docker (local) — Supabase JS client as query layer
- **UI:** Tailwind CSS, shadcn/ui, Radix UI
- **Testing:** Vitest + jsdom + @testing-library/react
- **Rate Limiting:** Upstash Redis (optional, graceful degradation)
- **Deployment:** Vercel
- **Path alias:** `@/` maps to project root
