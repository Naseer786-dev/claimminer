"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Bell,
  TrendingUp,
  Shield,
  ArrowRight,
  Check,
  FileText,
  Zap,
  Users,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart RFP Discovery",
    description: "AI-powered search across thousands of government contracts. Find opportunities that match your business perfectly.",
  },
  {
    icon: Bell,
    title: "Real-Time Alerts",
    description: "Get notified instantly when new RFPs match your criteria. Never miss a deadline again.",
  },
  {
    icon: TrendingUp,
    title: "Match Scoring",
    description: "Our algorithm scores each RFP based on your profile. Focus on the contracts you can actually win.",
  },
  {
    icon: Shield,
    title: "Deadline Tracking",
    description: "Track due dates, submission requirements, and agency contacts all in one place.",
  },
];

const stats = [
  { label: "Active RFPs", value: "12,000+", icon: FileText },
  { label: "Government Agencies", value: "500+", icon: Users },
  { label: "Contract Value", value: "$2.4B", icon: BarChart3 },
  { label: "Success Rate", value: "87%", icon: Zap },
];

const testimonials = [
  {
    quote: "ClaimMiner helped us find $3.2M in contract opportunities we would have missed. The alerts alone are worth the subscription.",
    author: "Michael Chen",
    role: "CEO, TechGov Solutions",
  },
  {
    quote: "We went from manually checking 20 websites to having everything in one dashboard. Game changer for our bidding process.",
    author: "Sarah Johnson",
    role: "BD Director, Federal Partners Inc",
  },
  {
    quote: "The match scoring feature saves us hours every week. We only bid on contracts we have a real shot at winning.",
    author: "David Park",
    role: "Founder, GovTech Consulting",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm mb-8"
            >
              <Zap className="w-4 h-4" />
              Trusted by 500+ government contractors
            </motion.div>
            <motion.h1
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            >
              Find Government Contracts{" "}
              <span className="text-emerald-400">Before Your Competition</span>
            </motion.h1>
            <motion.p
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto"
            >
              ClaimMiner scans thousands of government RFPs daily and delivers the ones that match your business — with AI-powered scoring, alerts, and deadline tracking.
            </motion.p>
            <motion.div
              initial={mounted ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => router.push("/sign-up")}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => router.push("/pricing")}
                className="px-8 py-4 border border-slate-700 text-white font-semibold rounded-xl hover:bg-slate-800 transition-colors"
              >
                View Pricing
              </button>
            </motion.div>
            <motion.p
              initial={mounted ? { opacity: 0 } : { opacity: 1 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-sm text-slate-500"
            >
              14-day free trial • No credit card required • Cancel anytime
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Win Government Contracts
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Stop manually checking dozens of websites. ClaimMiner does the hard work for you.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={mounted ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-slate-400">From signup to winning contracts in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Tell us your industry, services, and target agencies. Our AI learns what contracts fit your business.",
              },
              {
                step: "02",
                title: "Get Matched RFPs",
                description: "We scan thousands of government contracts daily and deliver the ones that match your profile with a match score.",
              },
              {
                step: "03",
                title: "Win Contracts",
                description: "Track deadlines, set alerts, and never miss an opportunity. Export data and collaborate with your team.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-slate-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Government Contractors
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={index}
                initial={mounted ? { opacity: 0, y: 20 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900/50 border border-slate-800 rounded-xl p-8"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="text-white font-medium">{t.author}</div>
                  <div className="text-sm text-slate-400">{t.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Start free, upgrade when you are ready. No hidden fees, no surprises.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {[
              { name: "Free", price: "$0", desc: "5 RFPs, basic search", featured: false },
              { name: "Starter", price: "$49/mo", desc: "50 RFPs, 5 alerts", featured: true },
              { name: "Professional", price: "$99/mo", desc: "Unlimited everything", featured: false },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 border ${
                  plan.featured
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-slate-800 bg-slate-900/50"
                }`}
              >
                <div className="text-lg font-semibold text-white mb-1">{plan.name}</div>
                <div className="text-3xl font-bold text-white mb-2">{plan.price}</div>
                <div className="text-sm text-slate-400">{plan.desc}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => router.push("/pricing")}
            className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-colors inline-flex items-center gap-2"
          >
            See Full Pricing
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={mounted ? { opacity: 0, y: 20 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Win More Government Contracts?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join 500+ contractors who use ClaimMiner to find and win government contracts. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/sign-up")}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" /> 14-day free trial
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" /> No credit card
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-400" /> Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-slate-950 font-bold text-sm">C</span>
              </div>
              <span className="text-white font-semibold">ClaimMiner</span>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <button onClick={() => router.push("/pricing")} className="hover:text-white transition-colors">Pricing</button>
              <button onClick={() => router.push("/rfps")} className="hover:text-white transition-colors">RFPs</button>
              <button onClick={() => router.push("/sign-in")} className="hover:text-white transition-colors">Sign In</button>
            </div>
            <div className="text-sm text-slate-500">
              © 2026 ClaimMiner. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}