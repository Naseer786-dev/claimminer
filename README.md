# ClaimMiner

AI-powered government contract intelligence. Find and win federal, state, and local RFPs before your competitors.

## 🚀 Quick Start

### 1. Clone & Install
```bash
cd claimminer
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env.local
```
Fill in your Clerk, Supabase, and Stripe keys.

### 3. Database Setup
```bash
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
claimminer/
├── src/
│   ├── app/
│   │   ├── api/alerts/      # Alert CRUD API
│   │   ├── api/rfps/        # RFP search API
│   │   ├── dashboard/       # Dashboard with stats + matches
│   │   ├── rfps/            # RFP list + filters
│   │   ├── alerts/          # Alert management + creation
│   │   ├── profile/         # Company profile + NAICS codes
│   │   └── layout.tsx       # Root layout with Clerk auth
│   ├── components/
│   │   ├── navbar.tsx       # Navigation
│   │   └── ui/              # Badge, Button, Card
│   ├── lib/
│   │   ├── db.ts            # Drizzle ORM client
│   │   ├── schema.ts        # Database schema (7 tables)
│   │   └── utils.ts         # Helpers
│   └── types/
│       └── index.ts         # TypeScript types
├── drizzle/                 # Migrations
└── package.json
```

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | PostgreSQL + Drizzle ORM |
| Payments | Stripe (subscriptions) |

## 🗺️ Features

- **RFP Discovery**: Browse 1,200+ active government RFPs from federal, state, and local agencies
- **Smart Matching**: AI matches RFPs to your NAICS codes, capabilities, and set-aside certifications
- **Alerts**: Create custom alerts and get notified when matching RFPs are posted
- **Tracking**: Save and track RFPs through your pipeline (tracking → bidding → submitted → won/lost)
- **Compliance**: Manage your NAICS codes, set-aside certifications, and company profile

## 💰 Business Model

| Plan | Price | Features |
|------|-------|----------|
| **Free** | $0 | 1 alert, 50 RFPs/month |
| **Starter** | $99/mo | 5 alerts, 500 RFPs/month, email notifications |
| **Pro** | $299/mo | Unlimited alerts, unlimited RFPs, API access, priority support |
| **Enterprise** | Custom | Team collaboration, custom integrations, dedicated support |

## 🗺️ Roadmap

- [x] Auth & user management
- [x] Dashboard with stats
- [x] RFP list + search
- [x] Alert creation + management
- [x] Company profile + NAICS codes
- [ ] RFP detail page with AI summary
- [ ] Real-time RFP scraping (SAM.gov, state procurement sites)
- [ ] Smart matching algorithm
- [ ] Email notifications
- [ ] Pipeline tracking (Kanban board)
- [ ] Stripe subscription billing
- [ ] API for enterprise customers

## 📄 License

MIT
