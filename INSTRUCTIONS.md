# ClaimMiner Upgrade - Database + Green Styling

## What was added:

### Database (Neon PostgreSQL + Drizzle ORM)
- `drizzle.config.ts` - Drizzle configuration
- `src/lib/db.ts` - Database connection
- `src/lib/schema.ts` - Database schema (users, rfps, alerts, favorites, tracked_rfps)
- API routes: `/api/rfps`, `/api/rfps/[id]`, `/api/alerts`, `/api/favorites`, `/api/tracked`, `/api/stats`
- `seed.ts` - Script to populate sample RFP data

### Styling (Green Theme + Dark Mode)
- `src/components/theme-provider.tsx` - Next-themes provider
- `src/components/theme-toggle.tsx` - Dark/light toggle button
- `src/components/stats-card.tsx` - Animated dashboard stats cards
- `src/components/loading-skeleton.tsx` - Loading skeletons
- Updated `src/components/navbar.tsx` - New green navbar with mobile menu
- Updated pages: Dashboard, RFPs, RFP Detail, Alerts, Profile
- Updated `src/app/layout.tsx` - Theme support
- Updated `src/app/globals.css` - Green color scheme, custom scrollbar

## Setup Steps:

### 1. Install new dependencies
```bash
npm install drizzle-orm @neondatabase/serverless next-themes framer-motion
npm install -D drizzle-kit
```

### 2. Set up Neon Database
- Go to https://neon.tech and create a free account
- Create a new project
- Copy the connection string (starts with `postgresql://`)
- Add to Vercel Environment Variables:
  - Key: `DATABASE_URL`
  - Value: `postgresql://...` (your Neon connection string)

### 3. Run migrations
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 4. Seed the database
```bash
npx tsx seed.ts
```

### 5. Deploy
```bash
git add .
git commit -m "Add database and green styling"
git push
```

## Files to replace in your project:
1. `drizzle.config.ts` (new file)
2. `src/lib/db.ts` (replace)
3. `src/lib/schema.ts` (replace)
4. `src/app/layout.tsx` (replace)
5. `src/app/globals.css` (replace)
6. `src/components/navbar.tsx` (replace)
7. `src/app/dashboard/page.tsx` (replace)
8. `src/app/rfps/page.tsx` (replace)
9. `src/app/rfps/[id]/page.tsx` (replace)
10. `src/app/alerts/page.tsx` (replace)
11. `src/app/profile/page.tsx` (replace)
12. `src/app/api/rfps/route.ts` (replace)
13. `src/app/api/rfps/[id]/route.ts` (replace)
14. `src/app/api/alerts/route.ts` (replace)
15. `src/app/api/favorites/route.ts` (new)
16. `src/app/api/tracked/route.ts` (new)
17. `src/app/api/stats/route.ts` (new)
18. `src/components/theme-provider.tsx` (new)
19. `src/components/theme-toggle.tsx` (new)
20. `src/components/stats-card.tsx` (new)
21. `src/components/loading-skeleton.tsx` (new)
22. `seed.ts` (new file at root)
