"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Calendar,
  Zap,
  Crown,
  Building2,
} from "lucide-react";

interface Subscription {
  plan: string;
  status: string;
  current_period_end: string;
  paypal_subscription_id: string;
}

const planConfig: Record<string, { name: string; icon: any; color: string; price: string }> = {
  free: { name: "Free Plan", icon: Zap, color: "text-slate-400", price: "$0" },
  starter: { name: "Starter", icon: Zap, color: "text-emerald-400", price: "$49/mo" },
  pro: { name: "Professional", icon: Crown, color: "text-blue-400", price: "$99/mo" },
  enterprise: { name: "Enterprise", icon: Building2, color: "text-purple-400", price: "$249/mo" },
};

function BillingContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const success = searchParams?.get("success");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      fetchSubscription();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [isLoaded, user]);

  async function fetchSubscription() {
    try {
      const res = await fetch(`/api/subscription/status?userId=${user?.id}`);
      const data = await res.json();
      setSubscription(data);
    } catch (error) {
      console.error("Subscription fetch error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function cancelSubscription() {
    if (!subscription?.paypal_subscription_id) return;
    setCancelling(true);
    try {
      const res = await fetch("/api/paypal/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: subscription.paypal_subscription_id }),
      });
      if (res.ok) {
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Cancel error:", error);
    } finally {
      setCancelling(false);
    }
  }

  const currentPlan = planConfig[subscription?.plan || "free"];
  const PlanIcon = currentPlan?.icon || Zap;
  const isActive = subscription?.status === "active";
  const isFree = subscription?.plan === "free" || !subscription;

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-slate-400 mb-8">Manage your ClaimMiner subscription</p>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-400">Payment successful! Your subscription is now active.</span>
          </motion.div>
        )}

        {/* Current Plan Card */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm text-slate-400 mb-1">Current Plan</p>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-800">
                  <PlanIcon className={`w-5 h-5 ${currentPlan?.color || "text-slate-400"}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{currentPlan?.name || "Free Plan"}</h2>
                  <p className="text-sm text-slate-400">{currentPlan?.price || "$0"}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isActive && !isFree ? (
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active
                </span>
              ) : (
                <span className="px-3 py-1 bg-slate-700 text-slate-400 text-sm rounded-full flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {isFree ? "Free" : subscription?.status}
                </span>
              )}
            </div>
          </div>

          {subscription?.current_period_end && !isFree && (
            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
              <Calendar className="w-4 h-4" />
              Next billing date: {new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            {isFree ? (
              <button
                onClick={() => window.location.href = "/pricing"}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                Upgrade Plan
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => window.location.href = "/pricing"}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors"
                >
                  Change Plan
                </button>
                <button
                  onClick={cancelSubscription}
                  disabled={cancelling}
                  className="px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {cancelling ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </span>
                  ) : (
                    "Cancel Subscription"
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-semibold text-white">Payment Method</h3>
          </div>
          <p className="text-sm text-slate-400">
            Payments are securely processed through PayPal. You can manage your payment methods directly in your PayPal account.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="px-3 py-2 bg-slate-800 rounded-lg text-sm text-slate-300 flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .757-.629h6.844c2.515 0 4.657.537 5.815 1.724.862.88 1.187 2.131.964 3.714-.373 2.595-1.764 4.399-4.034 5.32-.553.226-1.146.36-1.77.397l-.073.004h4.653a.641.641 0 0 1 .633.74l-.966 6.166a.77.77 0 0 1-.757.629H9.89l-.065-.004c-.337-.024-.65-.14-.917-.332a1.69 1.69 0 0 1-.657-1.143l-.036-.223-.176-1.127z"/>
              </svg>
              PayPal
            </div>
            <span className="text-sm text-slate-500">Secure checkout powered by PayPal</span>
          </div>
        </div>

        {/* Billing History */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Billing History</h3>
          {isFree ? (
            <p className="text-sm text-slate-400">No billing history yet. Upgrade to a paid plan to see your invoices here.</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-slate-800">
                <div>
                  <p className="text-sm text-white">{currentPlan?.name} Plan</p>
                  <p className="text-xs text-slate-400">
                    {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <span className="text-sm font-medium text-white">{currentPlan?.price}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}