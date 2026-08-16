# ClaimMiner PayPal Integration Setup Guide

## Pricing Tiers
| Plan | Price | Best For |
|------|-------|----------|
| Starter | $49/month | Solo contractors |
| Professional | $99/month | Growing teams |
| Enterprise | $249/month | Large organizations |

## Step 1: Database Setup
Run this SQL in your Neon database:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  paypal_subscription_id TEXT UNIQUE,
  paypal_plan_id TEXT,
  current_period_start TIMESTAMP,
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Step 2: PayPal Developer Setup

1. Go to https://developer.paypal.com/dashboard/
2. Make sure you're in **Sandbox** mode (toggle at top left)
3. Click **Apps & Credentials** in left sidebar
4. Click **Create App**
5. Name it "ClaimMiner"
6. Copy the **Client ID** and **Secret**

## Step 3: Create Subscription Products & Plans

In PayPal Developer Dashboard:

1. Go to **Testing Tools** → **Subscription Plans**
2. Click **Create Plan** for each tier:

### Starter Plan ($49/month)
- Product name: "ClaimMiner Starter"
- Description: "Up to 50 RFP searches, 5 alerts"
- Billing: Fixed price $49.00 USD, Monthly

### Professional Plan ($99/month)
- Product name: "ClaimMiner Professional"
- Description: "Unlimited searches, 20 alerts, API access"
- Billing: Fixed price $99.00 USD, Monthly

### Enterprise Plan ($249/month)
- Product name: "ClaimMiner Enterprise"
- Description: "Everything unlimited, custom integrations"
- Billing: Fixed price $249.00 USD, Monthly

3. Copy each Plan ID (starts with P-...)

## Step 4: Set Environment Variables in Vercel

Go to Vercel → claimminer → Environment Variables, add these:

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID = your_sandbox_client_id
PAYPAL_CLIENT_SECRET = your_sandbox_secret
PAYPAL_WEBHOOK_ID = (we'll get this in Step 6)
NEXT_PUBLIC_PAYPAL_PLAN_STARTER = P-XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_PRO = P-XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_PAYPAL_PLAN_ENTERPRISE = P-XXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_APP_URL = https://claimminer-eight.vercel.app
```

## Step 5: File Placement

Copy these files to your project:

| Downloaded File | Replace This Path |
|-----------------|-------------------|
| subscriptions_schema.sql | Run in Neon SQL Editor |
| pricing_page.tsx | src/app/pricing/page.tsx |
| billing_page.tsx | src/app/settings/billing/page.tsx |
| paypal_create_subscription.ts | src/app/api/paypal/create-subscription/route.ts |
| paypal_webhook.ts | src/app/api/paypal/webhook/route.ts |
| paypal_save_subscription.ts | src/app/api/paypal/save-subscription/route.ts |
| paypal_cancel_subscription.ts | src/app/api/paypal/cancel-subscription/route.ts |
| subscription_status.ts | src/app/api/subscription/status/route.ts |

## Step 6: Create Webhook in PayPal

1. In PayPal Developer Dashboard, go to your app
2. Scroll to **Webhooks** → **Add Webhook**
3. Webhook URL: `https://claimminer-eight.vercel.app/api/paypal/webhook`
4. Select these event types:
   - Billing subscription created
   - Billing subscription activated
   - Billing subscription cancelled
   - Billing subscription suspended
   - Billing subscription payment failed
5. Save and copy the **Webhook ID**
6. Add it to Vercel env vars as `PAYPAL_WEBHOOK_ID`

## Step 7: Deploy

```bash
git add .
git commit -m "Add PayPal subscription payments"
git push
```

## Step 8: Test in Sandbox

1. Go to https://developer.paypal.com/dashboard/accounts
2. Create a **Personal** sandbox account (if you don't have one)
3. Visit your app → /pricing
4. Click Subscribe on any plan
5. Log in with your sandbox personal account
6. Complete the payment
7. Check /settings/billing for active subscription

## Step 9: Go Live

When ready for real payments:

1. Toggle PayPal Developer to **Live** mode
2. Create a Live app (separate from sandbox)
3. Update all env vars with Live credentials
4. Update webhook URL to production
5. Redeploy

## File Summary

All files are ready for download. Replace them in your project and deploy!
