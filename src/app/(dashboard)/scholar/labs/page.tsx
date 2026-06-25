"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import {
  Code2,
  Play,
  Square,
  Terminal,
  BookOpen,
  ScrollText,
  Brain,
  Clock,
  Loader2,
  Circle,
  FlaskConical,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

interface Lab {
  id: string
  name: string
  version: string
  icon: React.ElementType
  status: "Running" | "Idle" | "Stopped"
  cpu: string
  memory: string
  color: string
}

const labs: Lab[] = [
  { id: "python", name: "Python", version: "3.12", icon: Code2, status: "Running", cpu: "2.4%", memory: "128 MB", color: "text-blue-500" },
  { id: "r", name: "R", version: "4.3", icon: FlaskConical, status: "Running", cpu: "1.1%", memory: "96 MB", color: "text-emerald-500" },
  { id: "jupyter", name: "Jupyter Notebook", version: "7.0", icon: Brain, status: "Running", cpu: "3.7%", memory: "256 MB", color: "text-amber-500" },
  { id: "stata", name: "Stata", version: "18", icon: Terminal, status: "Idle", cpu: "0%", memory: "64 MB", color: "text-purple-500" },
  { id: "latex", name: "LaTeX", version: "2024", icon: ScrollText, status: "Idle", cpu: "0%", memory: "32 MB", color: "text-cyan-500" },
]

const recentSessions = [
  { id: "s1", lab: "Python 3.12", name: "Data analysis - census.ipynb", duration: "45 min", status: "Completed" },
  { id: "s2", lab: "R 4.3", name: "Regression models - housing.R", duration: "22 min", status: "Completed" },
  { id: "s3", lab: "Jupyter Notebook", name: "ML training - classifier.ipynb", duration: "1h 12m", status: "Running" },
  { id: "s4", lab: "Stata 18", name: "Econometric analysis - panel.do", duration: "15 min", status: "Completed" },
]

const statusColor: Record<string, string> = {
  Running: "text-emerald-400",
  Idle: "text-amber-400",
  Stopped: "text-slate-300",
}

export default function CodeLaboratories() {
  const [launching, setLaunching] = useState<string | null>(null)

  const handleLaunch = (labId: string) => {
    setLaunching(labId)
    setTimeout(() => {
      setLaunching(null)
      toast.success("Lab environment launched")
    }, 1200)
  }

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 p-3 shadow-lg">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-900">Code Laboratories</h1>
            <p className="mt-0.5 text-slate-400">Interactive computing environments for research and experimentation</p>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {labs.map((lab) => (
            <div key={lab.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-slate-100 p-2.5">
                    <lab.icon className={cn("h-5 w-5", lab.color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{lab.name}</h3>
                    <p className="text-xs text-slate-400">v{lab.version}</p>
                  </div>
                </div>
                <span className={cn("flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", lab.status === "Running" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                  <Circle className={cn("h-2 w-2 fill-current", statusColor[lab.status])} />
                  {lab.status}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span>CPU: {lab.cpu}</span>
                <span>Memory: {lab.memory}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleLaunch(lab.id)}
                  disabled={launching === lab.id}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
                >
                  {launching === lab.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {launching === lab.id ? "Launching..." : "Launch"}
                </button>
                <button className="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 transition hover:bg-slate-50">
                  <Square className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Recent Lab Sessions</h2>
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {recentSessions.map((session) => (
                <div key={session.id} className="flex items-center gap-4 p-4 transition hover:bg-slate-50">
                  <div className="rounded-lg bg-slate-100 p-2">
                    <Clock className="h-4 w-4 text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-slate-800">{session.name}</p>
                    <p className="text-xs text-slate-400">{session.lab} &middot; {session.duration}</p>
                  </div>
                  <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium", session.status === "Running" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                    {session.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
