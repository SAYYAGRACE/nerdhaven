"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  CircleCheck,
  Circle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Wallet,
  BarChart3,
  Target,
  FileText,
} from "lucide-react"
import { cn, formatNaira } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const revenueData = [
  { day: "Mon", revenue: 320000 },
  { day: "Tue", revenue: 410000 },
  { day: "Wed", revenue: 380000 },
  { day: "Thu", revenue: 520000 },
  { day: "Fri", revenue: 490000 },
  { day: "Sat", revenue: 280000 },
  { day: "Sun", revenue: 350000 },
]

const actionItems = [
  { id: "1", text: "Complete Q2 compliance filing", done: false, urgent: true },
  { id: "2", text: "Review course completion analytics", done: true, urgent: false },
  { id: "3", text: "Approve new instructor applications", done: false, urgent: true },
  { id: "4", text: "Update pricing for Enterprise tier", done: false, urgent: false },
  { id: "5", text: "Schedule team standup for product roadmap", done: true, urgent: false },
]

const businessMetrics = [
  { label: "CAC", value: "₦24,500", change: -5.2, icon: Target },
  { label: "LTV", value: "₦142,000", change: 12.8, icon: TrendingUp },
  { label: "Churn Rate", value: "3.2%", change: -0.8, icon: ArrowDownRight },
  { label: "NPS", value: "72", change: 4, icon: BarChart3 },
]

const transactions = [
  { id: "1", user: "Emeka O.", course: "Full-Stack Web Dev", amount: 45000, status: "success", date: "2 mins ago" },
  { id: "2", user: "Zainab A.", course: "Data Science Pro", amount: 65000, status: "success", date: "1 hour ago" },
  { id: "3", user: "Chidi N.", course: "UI/UX Masterclass", amount: 35000, status: "pending", date: "3 hours ago" },
  { id: "4", user: "Folake D.", course: "Mobile Dev Bootcamp", amount: 55000, status: "success", date: "5 hours ago" },
]

const executiveModules = [
  { title: "Strategic Leadership", progress: 75, lessons: "10/12" },
  { title: "Financial Modeling", progress: 40, lessons: "4/10" },
  { title: "Growth Marketing", progress: 90, lessons: "18/20" },
  { title: "Operations Excellence", progress: 25, lessons: "3/12" },
]

export default function FounderDashboard() {
  const { data: session } = useSession()
  const name = session?.user?.name || "Executive"
  const [items, setItems] = useState(actionItems)

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-gray-950 p-6 text-white lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Founder&apos;s Dashboard</h1>
            <p className="mt-1 text-gray-400">Welcome back, {name}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-800 bg-gray-900 px-4 py-2 text-sm text-amber-400">
            <Zap className="h-4 w-4" />
            <span>BUSINESS Tier</span>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Monthly Revenue", value: "₦2,450,000", change: "+12.5%", icon: DollarSign, positive: true },
            { label: "Active Students", value: "1,847", change: "+8.2%", icon: Users, positive: true },
            { label: "Completion Rate", value: "76%", change: "+3.1%", icon: CircleCheck, positive: true },
            { label: "Avg Session Time", value: "34m", change: "-2.4%", icon: Clock, positive: false },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{kpi.label}</p>
                <kpi.icon className="h-5 w-5 text-gray-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{kpi.value}</p>
              <p className={cn("mt-1 flex items-center gap-1 text-sm", kpi.positive ? "text-emerald-400" : "text-red-400")}>
                {kpi.positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {kpi.change}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Revenue (7 days)</h2>
              <div className="flex gap-1 rounded-lg bg-gray-800 p-0.5">
                {["7D", "30D", "90D"].map((p) => (
                  <button key={p} className={cn("rounded-md px-3 py-1 text-xs font-medium transition", p === "7D" ? "bg-amber-500 text-gray-950" : "text-gray-400 hover:text-white")}>{p}</button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis dataKey="day" stroke="#6b7280" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px", color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#revenueGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Action Items</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <button key={item.id} onClick={() => toggleItem(item.id)} className="flex w-full items-start gap-3 rounded-lg p-2 text-left transition hover:bg-gray-800">
                  {item.done ? (
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className={cn("mt-0.5 h-5 w-5 shrink-0", item.urgent ? "text-amber-400" : "text-gray-500")} />
                  )}
                  <span className={cn("text-sm", item.done && "text-gray-500 line-through")}>{item.text}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {businessMetrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-400">{m.label}</p>
                <m.icon className="h-4 w-4 text-gray-500" />
              </div>
              <p className="mt-2 text-xl font-bold text-white">{m.value}</p>
              <p className={cn("mt-1 text-xs", m.change > 0 ? "text-emerald-400" : "text-red-400")}>
                {m.change > 0 ? "+" : ""}{m.change}% vs last month
              </p>
            </div>
          ))}
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Executive Modules</h2>
            <div className="space-y-4">
              {executiveModules.map((mod) => (
                <div key={mod.title}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-gray-300">{mod.title}</span>
                    <span className="text-gray-500">{mod.lessons}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: `${mod.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Recent Transactions</h2>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-gray-800">
                  <Wallet className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{tx.user}</p>
                    <p className="text-xs text-gray-500">{tx.course}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{formatNaira(tx.amount)}</p>
                    <p className={cn("text-xs", tx.status === "success" ? "text-emerald-400" : "text-amber-400")}>{tx.status}</p>
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
