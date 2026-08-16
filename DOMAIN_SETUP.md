# ClaimMiner Custom Domain Setup Guide

## Step 1: Buy a Domain

Go to **Namecheap.com** (recommended) or **GoDaddy.com**

Search for available domains:
- `claimminer.com` (~$10/year)
- `claimminer.io` (~$15/year)  
- `claimminer.app` (~$12/year)
- `getclaimminer.com` (~$10/year)

Buy the one you like.

## Step 2: Add Domain to Vercel

1. Go to **Vercel → claimminer → Settings → Domains**
2. Click **"Add"**
3. Enter your domain: `claimminer.com`
4. Click **"Add"**

Vercel will show you DNS records to add.

## Step 3: Configure DNS (Namecheap)

1. Log in to **Namecheap**
2. Go to **Domain List** → Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Delete any existing A records or CNAME records
5. Add these records from Vercel:

### Option A: Using A Record (Root Domain)
- **Type:** A Record
- **Host:** @
- **Value:** 76.76.21.21 (Vercel's IP)
- **TTL:** Automatic

### Option B: Using CNAME (www subdomain)
- **Type:** CNAME Record
- **Host:** www
- **Value:** cname.vercel-dns.com
- **TTL:** Automatic

## Step 4: Wait for DNS Propagation

DNS changes can take **5 minutes to 48 hours** to propagate.

You can check if it's working by visiting:
```
https://claimminer.com
```

## Step 5: Update PayPal Return URLs

After your domain is working, update PayPal:

1. Go to **PayPal Developer Dashboard**
2. Click your **Live App**
3. Find your subscription plans
4. Update the return URLs:
   - Return URL: `https://claimminer.com/settings/billing?success=true`
   - Cancel URL: `https://claimminer.com/pricing?canceled=true`

## Step 6: Update Environment Variables

In Vercel, update:
```
NEXT_PUBLIC_APP_URL=https://claimminer.com
```

## Done! 🎉

Your app will now be available at your custom domain!
