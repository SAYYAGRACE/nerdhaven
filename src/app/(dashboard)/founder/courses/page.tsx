"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  Users,
  Loader2,
  Search,
  ChevronRight,
  Clock,
  BarChart3,
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

const difficultyStyles: Record<string, string> = {
  BEGINNER: "bg-emerald-900/50 text-emerald-300 border-emerald-800",
  INTERMEDIATE: "bg-amber-900/50 text-amber-300 border-amber-800",
  ADVANCED: "bg-red-900/50 text-red-300 border-red-800",
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

export default function BusinessCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/courses?tier=BUSINESS&published=true")
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
              <h1 className="text-2xl font-bold tracking-tight text-white">Business Courses</h1>
              <p className="mt-0.5 text-sm text-gray-400">Executive and KPI-driven course catalog</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full rounded-xl border border-gray-800 bg-gray-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-gray-500 transition focus:border-gray-700 focus:ring-2 focus:ring-gray-800"
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BarChart3 className="h-12 w-12 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-300">Failed to load courses</h3>
            <p className="mt-1 text-sm text-gray-500">Something went wrong. Please try again.</p>
            <button
              onClick={() => {
                setLoading(true)
                setError(false)
                fetch("/api/courses?tier=BUSINESS&published=true")
                  .then((r) => r.json())
                  .then(setCourses)
                  .catch(() => {
                    setError(true)
                    toast.error("Failed to load courses")
                  })
                  .finally(() => setLoading(false))
              }}
              className="mt-4 rounded-xl bg-gray-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-600"
            >
              Retry
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-gray-600" />
            <h3 className="mt-4 text-lg font-semibold text-gray-300">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search ? "Try a different search term." : "No business courses are available yet."}
            </p>
          </div>
        ) : (
          <motion.div variants={stagger.container} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <motion.div key={course.id} variants={stagger.item}>
                <Link
                  href={`/courses/${course.id}`}
                  className="group block h-full rounded-xl border border-gray-800 bg-gray-900 shadow-sm transition hover:-translate-y-1 hover:border-gray-700 hover:shadow-lg"
                >
                  <div className="flex items-center gap-3 rounded-t-xl border-b border-gray-800 bg-gray-800/50 p-5">
                    <div className="rounded-lg bg-gray-700 p-2.5">
                      <BookOpen className="h-5 w-5 text-gray-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-bold text-white">{course.title}</h3>
                    </div>
                  </div>
                  <div className="space-y-3 p-4">
                    <p className="text-sm leading-relaxed text-gray-400 line-clamp-2">
                      {course.description || "No description available."}
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
                          difficultyStyles[course.difficulty] || "bg-gray-800 text-gray-400 border-gray-700",
                        )}
                      >
                        {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="h-3.5 w-3.5" />
                        {course._count.enrollments} enrolled
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium text-gray-300 transition group-hover:text-white">
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
