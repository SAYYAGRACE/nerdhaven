"use client"

import { motion } from "framer-motion"
import { TrendingUp, DollarSign, Users, Activity, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const metrics = [
  { label: "Monthly Recurring Revenue", value: "₦2.8M", change: "+15.3%", positive: true, icon: DollarSign },
  { label: "Customer Acquisition Cost", value: "₦18,500", change: "-8.1%", positive: true, icon: Target },
  { label: "Lifetime Value", value: "₦156,000", change: "+22.4%", positive: true, icon: TrendingUp },
  { label: "Churn Rate", value: "2.8%", change: "-0.6%", positive: true, icon: Activity },
]

const channels = [
  { name: "Organic Search", pct: 32, users: 1_230, color: "bg-gray-600" },
  { name: "Paid Ads", pct: 24, users: 922, color: "bg-gray-500" },
  { name: "Referral Program", pct: 18, users: 691, color: "bg-gray-700" },
  { name: "Social Media", pct: 15, users: 576, color: "bg-gray-400" },
  { name: "Email Marketing", pct: 11, users: 423, color: "bg-gray-300" },
]

const recommendations = [
  {
    title: "Optimize Pricing for Enterprise Tier",
    impact: "High",
    description: "Adjust pricing model to increase average revenue per user by 18%.",
    icon: DollarSign,
  },
  {
    title: "Launch Referral Incentive Program",
    impact: "High",
    description: "Leverage existing users to drive organic acquisition at lower CAC.",
    icon: Users,
  },
  {
    title: "Reduce Churn with Engagement Campaigns",
    impact: "Medium",
    description: "Implement automated re-engagement emails for inactive users.",
    icon: Activity,
  },
  {
    title: "Expand Paid Ad Spend on LinkedIn",
    impact: "Medium",
    description: "Target decision-makers with case study-driven ad creatives.",
    icon: Target,
  },
]

const impactColors: Record<string, string> = {
  High: "text-emerald-400 bg-emerald-900/50",
  Medium: "text-amber-400 bg-amber-900/50",
  Low: "text-gray-400 bg-gray-800",
}

export default function GrowthPage() {
  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-950 p-6 text-white lg:p-10"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex items-center gap-3">
          <div className="rounded-xl bg-gray-800 p-3">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Growth Analytics</h1>
            <p className="text-sm text-gray-400">Key growth metrics, acquisition data, and recommendations</p>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{m.label}</span>
                <m.icon className="h-5 w-5 text-gray-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{m.value}</p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-0.5 text-xs font-medium",
                  m.positive ? "text-emerald-400" : "text-red-400",
                )}
              >
                {m.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {m.change}
              </span>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Acquisition Channels</h2>
            <div className="space-y-4">
              {channels.map((ch) => (
                <div key={ch.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-300">{ch.name}</span>
                    <span className="text-gray-500">{ch.users.toLocaleString()} ({ch.pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className={`h-full rounded-full ${ch.color} transition-all`} style={{ width: `${ch.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Growth Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec) => (
                <div key={rec.title} className="rounded-lg border border-gray-800 p-3 transition hover:border-gray-700">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <rec.icon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-200">{rec.title}</p>
                        <p className="mt-0.5 text-xs text-gray-500">{rec.description}</p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        impactColors[rec.impact] || "bg-gray-800 text-gray-400",
                      )}
                    >
                      {rec.impact}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
