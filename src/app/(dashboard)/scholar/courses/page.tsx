"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Users,
  Loader2,
  GraduationCap,
  Search,
  ChevronRight,
  Clock,
  BarChart3,
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

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-emerald-100 text-emerald-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700",
}

interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  difficulty: string
  tier: string
  _count: { enrollments: number }
}

export default function UniversityCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/courses?tier=UNIVERSITY&published=true")
        if (!res.ok) throw new Error("Failed")
        const data = await res.json()
        setCourses(data)
      } catch {
        setError(true)
        toast.error("Failed to load courses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-slate-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 p-3 shadow-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-slate-900">Research & Course Catalog</h1>
              <p className="mt-0.5 text-slate-400">University-level courses and research programs</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart3 className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">Failed to load courses</h3>
            <p className="mt-1 text-sm text-slate-400">Something went wrong. Please try again.</p>
            <button
              onClick={() => { setLoading(true); setError(false); fetch("/api/courses?tier=UNIVERSITY&published=true").then(r => r.json()).then(setCourses).catch(() => { setError(true); toast.error("Failed to load courses") }).finally(() => setLoading(false)) }}
              className="mt-4 rounded-xl bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-slate-300" />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">No courses found</h3>
            <p className="mt-1 text-sm text-slate-400">
              {search ? "Try a different search term." : "No university courses are available yet."}
            </p>
          </div>
        ) : (
          <motion.div variants={stagger.container} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <motion.div key={course.id} variants={stagger.item}>
                <Link
                  href={`/courses/${course.id}`}
                  className="group block h-full rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 rounded-t-xl bg-gradient-to-br from-slate-600 to-slate-800 p-5 text-white">
                    <div className="rounded-lg bg-white/20 p-2.5 backdrop-blur-sm">
                      <FlaskConical className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold">{course.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {course.description || "No description available."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", difficultyColors[course.difficulty] || "bg-slate-100 text-slate-600")}>
                        {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments} enrolled
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                      View Course <ChevronRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
