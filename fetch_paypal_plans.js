const CLIENT_ID = "BAAb9Zjs4McJzua-eeqk9m_ZQjsbRtfQ6OYp5hN80CUWd77JIMctzeYbJ61v84wj4xcwsbyX1WDB1cDcEo";
const SECRET = "ENR_rL1ZILIP9yPwr-wkpWMY4tJ8lLlJwQhfzHDwkoaIRSRXFGO1ZW1v208nxBQEzXZHNOsN5PoD_yeF";
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

async function listPlans(token) {
  const res = await fetch(`${PAYPAL_API}/v1/billing/plans?page_size=20&page=1&total_required=true`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("List plans error:", data);
    throw new Error("Failed to list plans");
  }
  return data;
}

async function main() {
  console.log("Getting access token...\n");
  const token = await getAccessToken();
  console.log("Authenticated!\n");

  console.log("Fetching your plans...\n");
  const plans = await listPlans(token);

  if (plans.plans && plans.plans.length > 0) {
    console.log(`Found ${plans.plans.length} plan(s):\n`);
    plans.plans.forEach((plan) => {
      console.log(`Plan: ${plan.name}`);
      console.log(`ID: ${plan.id}`);
      console.log(`Status: ${plan.status}`);
      console.log(`Product: ${plan.product_id}`);
      console.log("");
    });
  } else {
    console.log("No plans found.");
    console.log("Full response:", JSON.stringify(plans, null, 2));
  }
}

main().catch(console.error);