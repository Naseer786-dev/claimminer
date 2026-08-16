const CLIENT_ID = "AZDDsL_GQQSDtDCSiK0edVYaTJumzaFQBEr8maGMTBrpNgl17qo6eY6_0HQvpUvo5eZYkf5icicXgSps";
const SECRET = "EAK7yLaF6MfVxv2ldejz_C2Cgh25plbAUZ9uQ8ZmcJzZ3D65j9r8ouEjPLuKPd2-QFEgzwGaz4xgLb-B";
const PAYPAL_API = "https://api-m.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Auth error:", data);
    throw new Error("Failed to authenticate");
  }
  return data.access_token;
}

async function createProduct(token, name, description) {
  const res = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `product-${name.replace(/\s/g, "-")}-${Date.now()}`,
    },
    body: JSON.stringify({
      name,
      description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Product error:", data);
    throw new Error("Failed to create product");
  }
  console.log(`✅ Product: ${name} → ${data.id}`);
  return data.id;
}

async function createPlan(token, productId, name, price, description) {
  const res = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `plan-${name.replace(/\s/g, "-")}-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name,
      description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: "MONTH",
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: price.toString(),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "USD",
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Plan error:", data);
    throw new Error("Failed to create plan");
  }
  console.log(`✅ Plan: ${name} ($${price}/mo) → ${data.id}`);
  return data.id;
}

async function main() {
  console.log("🔐 Getting LIVE access token...\n");
  const token = await getAccessToken();
  console.log("✅ Authenticated with LIVE API!\n");

  console.log("📦 Creating LIVE products...\n");
  const starterProductId = await createProduct(token, "ClaimMiner Starter", "Up to 50 RFP searches, 5 alerts per month");
  const proProductId = await createProduct(token, "ClaimMiner Professional", "Unlimited RFP searches, 20 alerts, API access");
  const enterpriseProductId = await createProduct(token, "ClaimMiner Enterprise", "Everything unlimited, custom integrations, dedicated support");

  console.log("\n📋 Creating LIVE billing plans...\n");
  const starterPlanId = await createPlan(token, starterProductId, "ClaimMiner Starter Monthly", 49, "Monthly subscription for ClaimMiner Starter");
  const proPlanId = await createPlan(token, proProductId, "ClaimMiner Professional Monthly", 99, "Monthly subscription for ClaimMiner Professional");
  const enterprisePlanId = await createPlan(token, enterpriseProductId, "ClaimMiner Enterprise Monthly", 249, "Monthly subscription for ClaimMiner Enterprise");

  console.log("\n🎉 ALL LIVE PLANS CREATED!");
  console.log("═══════════════════════════════════════════════════════════");
  console.log(`NEXT_PUBLIC_PAYPAL_CLIENT_ID=${CLIENT_ID}`);
  console.log(`PAYPAL_CLIENT_SECRET=${SECRET}`);
  console.log(`NEXT_PUBLIC_PAYPAL_PLAN_STARTER=${starterPlanId}`);
  console.log(`NEXT_PUBLIC_PAYPAL_PLAN_PRO=${proPlanId}`);
  console.log(`NEXT_PUBLIC_PAYPAL_PLAN_ENTERPRISE=${enterprisePlanId}`);
  console.log("═══════════════════════════════════════════════════════════");
}

main().catch(console.error);
