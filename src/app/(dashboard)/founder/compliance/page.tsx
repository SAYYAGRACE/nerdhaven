"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  CheckSquare,
  Circle,
  CircleCheck,
  FileText,
  Calendar,
  Upload,
  AlertTriangle,
  ArrowUpRight,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const checklistItems = [
  { id: "1", label: "Q2 Tax Filing – Corporate Income Tax", done: false, due: "Jun 30, 2026" },
  { id: "2", label: "Annual Financial Statement Submission", done: true, due: "Mar 15, 2026" },
  { id: "3", label: "Data Privacy Compliance (NDPR) Audit", done: false, due: "Jul 10, 2026" },
  { id: "4", label: "Employee Pension Remittance (March)", done: true, due: "Apr 5, 2026" },
  { id: "5", label: "Business Permit Renewal", done: false, due: "Aug 1, 2026" },
  { id: "6", label: "VAT Filing for Q2", done: false, due: "Jul 20, 2026" },
]

const deadlines = [
  { label: "CIT Filing", date: "Jun 30", urgent: true },
  { label: "VAT Return", date: "Jul 20", urgent: false },
  { label: "Pension Remittance", date: "Aug 5", urgent: false },
  { label: "Annual Returns", date: "Dec 31", urgent: false },
]

export default function CompliancePage() {
  const [items, setItems] = useState(checklistItems)

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, done: !i.done } : i)))
  }

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
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Compliance Center</h1>
            <p className="text-sm text-gray-400">Manage regulatory filings, taxes, and obligations</p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={stagger.item} className="rounded-xl border border-gray-800 bg-gray-900 p-5 lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-white">Compliance Checklist</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className="flex w-full items-start gap-3 rounded-lg p-3 text-left transition hover:bg-gray-800"
                >
                  {item.done ? (
                    <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" />
                  )}
                  <div className="flex-1">
                    <span className={cn("text-sm", item.done && "text-gray-500 line-through")}>{item.label}</span>
                    <p className={cn("mt-0.5 text-xs", item.done ? "text-gray-600" : "text-gray-500")}>Due: {item.due}</p>
                  </div>
                  {!item.done && (
                    <span className="rounded-full bg-amber-900/50 px-2 py-0.5 text-xs font-medium text-amber-300">
                      Pending
                    </span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="space-y-6">
            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Upcoming Deadlines</h2>
              </div>
              <div className="mt-4 space-y-3">
                {deadlines.map((d) => (
                  <div key={d.label} className="flex items-center justify-between rounded-lg border border-gray-800 p-3">
                    <div>
                      <p className="text-sm font-medium text-gray-200">{d.label}</p>
                      <p className="text-xs text-gray-500">{d.date}</p>
                    </div>
                    {d.urgent && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-400">
                        <AlertTriangle className="h-3.5 w-3.5" /> Urgent
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-gray-400" />
                <h2 className="text-lg font-semibold text-white">Document Upload</h2>
              </div>
              <p className="mt-1 text-xs text-gray-500">Upload tax filings, permits, and compliance documents</p>
              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-700 p-4 text-sm text-gray-400 transition hover:border-gray-600 hover:text-gray-300">
                <Upload className="h-4 w-4" />
                Click to upload
              </button>
              <div className="mt-3 space-y-2">
                {["Tax Receipt Q1.pdf", "Business Permit 2026.pdf"].map((doc) => (
                  <div key={doc} className="flex items-center gap-2 rounded-lg bg-gray-800 p-2.5 text-sm">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="flex-1 text-gray-300">{doc}</span>
                    <ArrowUpRight className="h-4 w-4 text-gray-500" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
