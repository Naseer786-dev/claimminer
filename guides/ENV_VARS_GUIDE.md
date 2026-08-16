# 🔑 Environment Variables Setup Guide

Add these to Vercel → Settings → Environment Variables:

## Required for Live PayPal (Already Done)
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AZDDsL_GQQSDtDCSiK0edVYaTJumzaFQBEr8maGMTBrpNgl17qo6eY6_0HQvpUvo5eZYkf5icicXgSps
PAYPAL_CLIENT_SECRET=EAK7yLaF6MfVxv2ldejz_C2Cgh25plbAUZ9uQ8ZmcJzZ3D65j9r8ouEjPLuKPd2-QFEgzwGaz4xgLb-B
NEXT_PUBLIC_PAYPAL_PLAN_STARTER=P-9NA31790RW3719218NKAUWCA
NEXT_PUBLIC_PAYPAL_PLAN_PRO=P-5WC69176PV346753YNKAUWCA
NEXT_PUBLIC_PAYPAL_PLAN_ENTERPRISE=P-496199786U953470XNKAUWCA
```

## NEW: Required for SAM.gov Live API
```
SAM_API_KEY=your_sam_gov_api_key
```
Get free at: https://sam.gov/sam-data-extracts/registration

## NEW: Required for Email Alerts
```
RESEND_API_KEY=re_xxxxxxxx
FROM_EMAIL=ClaimMiner <onboarding@resend.dev>
```
Get free at: https://resend.com (3,000 emails/month free)

## NEW: Required for Cron Job Security
```
CRON_SECRET=your_random_secret_string_here
```
Generate with: `openssl rand -base64 32` or just use a random password

## NEW: App URL
```
NEXT_PUBLIC_APP_URL=https://claimminer-eight.vercel.app
```
Update this when you get a custom domain!

## Database (Already Done)
```
DATABASE_URL=your_neon_postgres_url
```

## Clerk Auth (Already Done)
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxx
CLERK_SECRET_KEY=sk_xxx
```
