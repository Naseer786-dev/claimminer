"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

declare global {
  interface Window {
    paypal?: any;
  }
}

// Hardcoded plan IDs (from your PayPal setup)
const PAYPAL_PLANS = {
  starter: "P-45N158797D214493ENKATHSY",
  pro: "P-62M76978NH025890GNKATHTA",
  enterprise: "P-8FS24293JU519284MNKATHTI",
};

const plans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "Perfect for solo contractors just getting started",
    icon: Zap,
    color: "emerald",
    planId: PAYPAL_PLANS.starter,
    features: [
      "Up to 50 RFP searches/month",
      "5 saved alerts",
      "Email notifications",
      "Basic match scoring",
      "Export to CSV",
      "1 user seat",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "For growing teams that need more power",
    icon: Crown,
    color: "blue",
    planId: PAYPAL_PLANS.pro,
    features: [
      "Unlimited RFP searches",
      "20 saved alerts",
      "Priority email + SMS notifications",
      "Advanced AI match scoring",
      "Export to PDF & CSV",
      "3 user seats",
      "API access",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    period: "/month",
    description: "For large organizations with custom needs",
    icon: Building2,
    color: "purple",
    planId: PAYPAL_PLANS.enterprise,
    features: [
      "Everything in Professional",
      "Unlimited alerts",
      "Custom integrations",
      "Dedicated account manager",
      "White-label options",
      "Unlimited user seats",
      "SLA guarantee",
      "On-premise deployment option",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

function PricingContent() {
  const router = useRouter();
  const { isSignedIn, user } = useUser();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const paypalRefs = useRef<(HTMLDivElement | null)[]>([]);
  const buttonsRendered = useRef<boolean[]>([false, false, false]);

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "BAAImq2Jk4_ACYYGHWf6-CL1_151dWLTX7CRIWDnwjhqU_qbEDHWG2DZbpY_O3dzt75BTQMXNHjZeW6-E8";

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }
    if (document.getElementById("paypal-script")) {
      // Script already loading, wait for it
      const checkPaypal = setInterval(() => {
        if (window.paypal) {
          setScriptLoaded(true);
          clearInterval(checkPaypal);
        }
      }, 500);
      return () => clearInterval(checkPaypal);
    }

    const script = document.createElement("script");
    script.id = "paypal-script";
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription&components=buttons`;
    script.async = true;
    script.onload = () => {
      console.log("PayPal SDK loaded");
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load PayPal SDK");
      setScriptError(true);
    };
    document.body.appendChild(script);
  }, [clientId]);

  useEffect(() => {
    if (!scriptLoaded || !window.paypal) return;

    plans.forEach((plan, index) => {
      if (plan.name === "Enterprise") return;
      if (buttonsRendered.current[index]) return;

      const container = paypalRefs.current[index];
      if (!container) return;

      // Clear previous content
      container.innerHTML = "";

      try {
        window.paypal
          .Buttons({
            style: {
              shape: "pill",
              color: plan.popular ? "blue" : "white",
              layout: "vertical",
              label: "subscribe",
              height: 40,
            },
            createSubscription: async (_data: any, actions: any) => {
              if (!isSignedIn) {
                router.push("/sign-in?redirect=/pricing");
                return "";
              }
              setLoadingPlan(plan.name);
              return actions.subscription.create({
                plan_id: plan.planId,
              });
            },
            onApprove: async (data: any) => {
              console.log("Subscription approved:", data);
              setLoadingPlan(null);
              // Save to backend
              try {
                await fetch("/api/paypal/save-subscription", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    subscriptionId: data.subscriptionID,
                    planId: plan.planId,
                    userId: user?.id,
                    planName: plan.name.toLowerCase(),
                  }),
                });
              } catch (e) {
                console.error("Save subscription error:", e);
              }
              router.push("/settings/billing?success=true");
            },
            onError: (err: any) => {
              console.error("PayPal error:", err);
              setLoadingPlan(null);
            },
            onCancel: () => {
              setLoadingPlan(null);
            },
          })
          .render(container)
          .then(() => {
            buttonsRendered.current[index] = true;
          })
          .catch((err: any) => {
            console.error("PayPal render error:", err);
          });
      } catch (err) {
        console.error("PayPal button init error:", err);
      }
    });
  }, [scriptLoaded, isSignedIn, router, user]);

  const handleEnterprise = () => {
    window.location.href = "mailto:sales@claimminer.com?subject=Enterprise Inquiry";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto"
          >
            Choose the plan that fits your business. All plans include a 14-day free trial.
            No credit card required to start.
          </motion.p>
        </div>

        {/* Error Banner */}
        {scriptError && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 max-w-2xl mx-auto">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span className="text-red-400 text-sm">
              PayPal payment system is temporarily unavailable. Please refresh the page or try again later.
            </span>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isEnterprise = plan.name === "Enterprise";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.popular
                    ? "border-emerald-500/50 bg-slate-900/80 shadow-lg shadow-emerald-500/10"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-emerald-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      plan.popular ? "bg-emerald-500/20" : "bg-slate-800"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        plan.popular ? "text-emerald-400" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-slate-400">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {plan.price}
                  </span>
                  <span className="text-slate-400">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {isEnterprise ? (
                  <button
                    onClick={handleEnterprise}
                    className="w-full py-3 px-4 rounded-xl border border-slate-700 text-white font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="space-y-3">
                    {loadingPlan === plan.name ? (
                      <div className="w-full py-3 px-4 rounded-xl bg-slate-800 flex items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div
                        ref={(el) => { paypalRefs.current[index] = el; }}
                        className="w-full min-h-[40px]"
                      />
                    )}
                    {!scriptLoaded && !scriptError && !isEnterprise && (
                      <div className="w-full py-3 px-4 rounded-xl bg-slate-800 text-center">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto text-slate-500" />
                        <p className="text-xs text-slate-500 mt-1">Loading PayPal...</p>
                      </div>
                    )}
                    {scriptError && !isEnterprise && (
                      <button
                        onClick={() => window.location.reload()}
                        className="w-full py-3 px-4 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors text-sm"
                      >
                        Retry PayPal
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-slate-500 text-sm mb-4">
            Trusted by 500+ government contractors nationwide
          </p>
          <div className="flex items-center justify-center gap-8 text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-sm">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              <span className="text-sm">SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
              </svg>
              <span className="text-sm">Cancel Anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}