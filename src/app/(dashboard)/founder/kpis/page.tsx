"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3, TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const kpis = [
  { label: "Monthly Revenue", value: "₦12.4M", change: "+12.5%", positive: true, icon: DollarSign },
  { label: "Active Users", value: "3,842", change: "+8.2%", positive: true, icon: Users },
  { label: "Growth Rate", value: "24.6%", change: "+3.1%", positive: true, icon: TrendingUp },
  { label: "Course Completion", value: "68.2%", change: "-2.4%", positive: false, icon: Target },
]

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
const monthHeights = [52, 68, 45, 88, 76, 94]

const revenueSources = [
  { src: "Course Sales", pct: 45 },
  { src: "Subscriptions", pct: 30 },
  { src: "Consulting", pct: 15 },
  { src: "Partnerships", pct: 10 },
]

const periods = ["month", "quarter", "year"]

export default function KPIPage() {
  const [period, setPeriod] = useState("month")

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-950 p-6 text-white lg:p-10"
    >
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gray-800 p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Key Performance Indicators</h1>
              <p className="text-sm text-gray-400">Track your business growth and metrics</p>
            </div>
          </div>
          <div className="flex gap-1 rounded-lg border border-gray-800 bg-gray-900 p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition",
                  period === p ? "bg-gray-700 text-white" : "text-gray-400 hover:text-white",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">{kpi.label}</span>
                <kpi.icon className="h-5 w-5 text-gray-500" />
              </div>
              <p className="mt-2 text-2xl font-bold text-white">{kpi.value}</p>
              <span
                className={cn(
                  "mt-1 inline-flex items-center gap-0.5 text-xs font-medium",
                  kpi.positive ? "text-emerald-400" : "text-red-400",
                )}
              >
                {kpi.positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {kpi.change} vs last period
              </span>
            </div>
          ))}
        </motion.div>

        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-white">Monthly Overview</h2>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <div className="flex items-end gap-3">
              {months.map((month, i) => (
                <div key={month} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-md bg-gray-700 transition hover:bg-gray-600"
                    style={{ height: `${monthHeights[i]}px` }}
                  />
                  <span className="text-xs text-gray-500">{month}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="font-semibold text-white">Revenue by Source</h3>
            <div className="mt-4 space-y-3">
              {revenueSources.map((item) => (
                <div key={item.src}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{item.src}</span>
                    <span className="font-medium text-white">{item.pct}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-gray-600 transition-all"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
            <h3 className="font-semibold text-white">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {["View Reports", "Manage Team", "Export Data", "Set Goals"].map((action) => (
                <button
                  key={action}
                  className="rounded-lg border border-gray-700 p-3 text-sm font-medium text-gray-300 transition hover:border-gray-600 hover:bg-gray-800"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
