# 🌐 Custom Domain Setup Guide for ClaimMiner

## Step 1: Buy Your Domain

Go to **Namecheap.com** (recommended) or **GoDaddy.com**:

1. Search for `claimminer.com`
2. If taken, try:
   - `claimminer.io`
   - `claimminer.app`
   - `getclaimminer.com`
   - `claimminer.pro`
3. Add to cart & checkout (~$10-15/year)
4. Complete purchase

## Step 2: Connect to Vercel

### In Vercel Dashboard:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **claimminer** project
3. Go to **Settings** → **Domains**
4. Enter your domain (e.g., `claimminer.com`)
5. Click **Add**

### Configure DNS (Namecheap):
1. Go to Namecheap → Domain List → Manage → Advanced DNS
2. Delete any existing `A Records` or `CNAME Records`
3. Add these records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | Automatic |
| CNAME | www | cname.vercel-dns.com | Automatic |

> **Note:** Vercel will show you the exact DNS records to add. Use those if different.

### Alternative: Use Namecheap DNS (Easier)
1. In Namecheap, go to Domain → Nameservers
2. Select **Custom DNS**
3. Enter Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
4. Save

## Step 3: Wait for SSL

Vercel automatically provisions SSL certificates:
- ⏳ DNS propagation takes **5 minutes to 48 hours** (usually under 1 hour)
- ✅ Vercel will show a green checkmark when ready
- 🔒 SSL certificate is **free and automatic**

## Step 4: Update Environment Variables

In Vercel → Settings → Environment Variables, update:

```
NEXT_PUBLIC_APP_URL=https://claimminer.com
```

(Replace with your actual domain)

## Step 5: Update PayPal Webhook (If Set Up)

If you configured PayPal webhooks, update the URL:
- Old: `https://claimminer-eight.vercel.app/api/paypal/webhook`
- New: `https://claimminer.com/api/paypal/webhook`

## Step 6: Verify

Visit `https://claimminer.com` — it should show your app!

---

## 📧 Email Domain Setup (For Resend)

To send emails from `alerts@claimminer.com` instead of `onboarding@resend.dev`:

1. Go to [resend.com](https://resend.com) → Domains
2. Click **Add Domain**
3. Enter `claimminer.com`
4. Resend will give you DNS records to add in Namecheap
5. Add them and verify
6. Update your email "from" address in the code

---

## ✅ Checklist

- [ ] Domain purchased
- [ ] DNS records added / Nameservers changed
- [ ] Domain added in Vercel
- [ ] SSL certificate active (green checkmark)
- [ ] `NEXT_PUBLIC_APP_URL` updated
- [ ] PayPal webhook URL updated (if applicable)
- [ ] Resend domain verified (optional)
