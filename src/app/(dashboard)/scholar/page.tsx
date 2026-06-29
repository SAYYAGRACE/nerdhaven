"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  BookOpen,
  Code2,
  Calendar,
  Users,
  FileText,
  ArrowRight,
  Circle,
  Beaker,
  FlaskConical,
  Sigma,
  ScrollText,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getAllCourseGroups } from "@/lib/groups"
import { useState } from "react"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.07 } } },
  item: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
} as const

const kanbanColumns = [
  { id: "lit", title: "Literature Review", color: "border-l-blue-400", bg: "bg-blue-50", cards: 3 },
  { id: "method", title: "Methodology", color: "border-l-amber-400", bg: "bg-amber-50", cards: 2 },
  { id: "analysis", title: "Analysis", color: "border-l-purple-400", bg: "bg-purple-50", cards: 1 },
  { id: "pub", title: "Publication", color: "border-l-emerald-400", bg: "bg-emerald-50", cards: 0 },
]

const playgrounds = [
  { id: "py", name: "Python 3.12", icon: Code2, color: "text-blue-500", status: "Running" },
  { id: "r", name: "R 4.3", icon: FlaskConical, color: "text-emerald-500", status: "Running" },
  { id: "stata", name: "Stata 18", icon: Beaker, color: "text-purple-500", status: "Idle" },
  { id: "latex", name: "LaTeX", icon: ScrollText, color: "text-amber-500", status: "Running" },
]

const studyGroups = getAllCourseGroups()

const publications = [
  { id: "1", title: "Neural Network Approaches in African Language Processing", authors: "Dr. Okafor et al.", date: "2 days ago", journal: "Journal of AI Research" },
  { id: "2", title: "Economic Impacts of Mobile Money in Sub-Saharan Africa", authors: "Adebayo, K. et al.", date: "1 week ago", journal: "African Economic Review" },
  { id: "3", title: "Low-Cost Water Filtration Using Biodegradable Polymers", authors: "Nwachukwu, C. et al.", date: "2 weeks ago", journal: "Nature Sustainability" },
]

const deadlines = [
  { id: "1", title: "Research Proposal Draft", date: "Jun 28", urgent: true },
  { id: "2", title: "Ethics Board Submission", date: "Jul 5", urgent: false },
  { id: "3", title: "Conference Abstract", date: "Jul 12", urgent: false },
]

export default function ScholarDashboard() {
  const { data: session } = useSession()
  const name = session?.user?.name?.split(" ")[0] || "Researcher"

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Scholar Command Center</h1>
            <p className="mt-1 text-slate-400">Welcome back, {name}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <Calendar className="h-4 w-4" />
            <span>{new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </motion.div>

        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Research Pipeline</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kanbanColumns.map((col) => (
              <div key={col.id} className={cn("rounded-lg border border-slate-200 bg-white p-4 shadow-sm", col.bg)}>
                <div className={cn("border-l-4 pl-3", col.color)}>
                  <h3 className="font-semibold text-slate-800">{col.title}</h3>
                  <p className="text-sm text-slate-400">{col.cards} items</p>
                </div>
                {col.cards > 0 ? (
                  <div className="mt-3 space-y-2">
                    {Array.from({ length: col.cards }).map((_, i) => (
                      <div key={i} className="rounded-md border border-slate-100 bg-white p-3 text-sm shadow-sm">
                        <p className="font-medium text-slate-700">Research item {i + 1}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Updated 2h ago</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-center text-sm text-slate-400">No items yet</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={stagger.item} className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Code Playgrounds</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {playgrounds.map((pg) => (
                <div key={pg.id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <pg.icon className={cn("h-5 w-5", pg.color)} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{pg.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Circle className={cn("h-2 w-2 fill-current", pg.status === "Running" ? "text-emerald-400" : "text-slate-300")} />
                      {pg.status}
                    </p>
                  </div>
                  <button className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
                    Launch
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Upcoming Deadlines</h2>
            <div className="space-y-2">
              {deadlines.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                  <div className={cn("h-2 w-2 rounded-full", d.urgent ? "bg-red-400" : "bg-slate-300")} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">{d.title}</p>
                    <p className="text-xs text-slate-400">{d.date}</p>
                  </div>
                  <Clock className="h-4 w-4 text-slate-300" />
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Peer Study Network</h2>
            <div className="space-y-3">
              {studyGroups.map((g) => (
                <a
                  key={g.link}
                  href={g.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg">
                    💬
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{g.name}</p>
                    <p className="text-xs text-slate-400">{g.memberCount} members</p>
                  </div>
                  <span className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-emerald-700">
                    Join
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-slate-800">Publications Feed</h2>
            <div className="space-y-3">
              {publications.map((pub) => (
                <div key={pub.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow">
                  <div className="flex items-start gap-3">
                    <FileText className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
                    <div>
                      <p className="font-medium text-slate-800">{pub.title}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{pub.authors} · {pub.journal}</p>
                      <p className="mt-1 text-xs text-slate-300">{pub.date}</p>
                    </div>
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
