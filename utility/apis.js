// Utility: Calculate days between today and the expiry date
const dayDifference = (expiryDateStr) => {
  const today = new Date();
  const expiryDate = new Date(expiryDateStr);
  const diffTime = expiryDate - today;
  return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
};

// API subscriptions list with explicit start and expiry dates
const apis = [
  {
    name: "540 Cron Jobs Apis",
    start_on: "2025-07-09",
    expires_on: "2025-08-07",
    premium_plan: {
      plan: "Pro",
      price_usd: 100,
      billing_cycle: "monthly",
    },
  },
  {
    name: "Stripe Terminal",
    start_on: "2024-01-01",
    expires_on: "2026-01-01",
    premium_plan: {
      plan: "Enterprise",
      price_usd: 190,
      billing_cycle: "yearly",
    },
  },
  {
    name: "IPinfo Api",
    start_on: "2024-01-01",
    expires_on: "2026-01-01",
    premium_plan: {
      plan: "Standard",
      price_usd: 790,
      billing_cycle: "yearly",
    },
  },
  {
    name: "Escrow IPv4 API",
    start_on: "2024-01-01",
    expires_on: "2026-01-01",
    premium_plan: {
      plan: "Pro",
      price_usd: 194.99,
      billing_cycle: "yearly",
    },
  },
  {
    name: "Chat IPv4 API",
    start_on: "2025-07-16",
    expires_on: "2025-08-14",
    premium_plan: {
      plan: "Business",
      price_usd: 95,
      billing_cycle: "monthly",
    },
  },
  {
    name: "Redis Cloud",
    start_on: "2025-07-09",
    expires_on: "2025-08-07",
    premium_plan: {
      plan: "Cloud",
      price_usd: 100,
      billing_cycle: "monthly",
    },
  },
  {
    name: "Ngrok",
    start_on: "2024-01-01",
    expires_on: "2026-01-01",
    premium_plan: {
      plan: "Pro",
      price_usd: 180,
      billing_cycle: "yearly",
    },
  },
   {
    name: "VTPass Api",
    start_on: "2025-07-16",
    expires_on: "2025-08-14",
    premium_plan: {
      plan: "Pro",
      price_usd: 87.97,
      billing_cycle: "monthly",
    },
  },
].map((api) => {
  const days = dayDifference(api.expires_on);

  return {
    ...api,
    days_remaining: days,
    state: days === 0 ? "Expired" : "Running",
  };
});

// Export the processed API data
module.exports = { apis };
