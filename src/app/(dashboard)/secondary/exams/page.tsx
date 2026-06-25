"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  GraduationCap,
  BookOpen,
  Target,
  Award,
  Layers,
  ClipboardCheck,
  Library,
  Search,
  Loader2,
  Globe,
  FileQuestion,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ExamBrief {
  id: string
  name: string
  slug: string
  fullName: string | null
  description: string | null
  country: string | null
  website: string | null
  logoUrl: string | null
  _count: { subjects: number; pastQuestions: number }
}

const examIcons: Record<string, React.ElementType> = {
  WAEC: GraduationCap,
  NECO: BookOpen,
  JAMB: Target,
  IGCSE: Layers,
  SAT: Award,
  NABTEB: ClipboardCheck,
  BECE: BookOpen,
  IELTS: Library,
}

const examGradients: Record<string, string> = {
  WAEC: "from-blue-500 to-blue-600",
  NECO: "from-cyan-500 to-cyan-600",
  JAMB: "from-indigo-500 to-indigo-600",
  IGCSE: "from-violet-500 to-violet-600",
  SAT: "from-purple-500 to-purple-600",
  NABTEB: "from-sky-500 to-sky-600",
  BECE: "from-teal-500 to-teal-600",
  IELTS: "from-rose-500 to-rose-600",
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  },
}

export default function ExamsPage() {
  const [exams, setExams] = useState<ExamBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/secondary/exams")
        if (!res.ok) throw new Error("Failed to load")
        setExams(await res.json())
      } catch {
        toast.error("Failed to load exams")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = exams.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.fullName || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.country || "").toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div variants={stagger.item}>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Exam Boards</h1>
          <p className="mt-1 text-gray-500">Browse all secondary school examination boards and start preparing.</p>
        </motion.div>

        <motion.div variants={stagger.item} className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exams by name, full name, or country..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No exams found</h3>
            <p className="mt-1 text-sm text-gray-500">Try a different search term.</p>
          </div>
        ) : (
          <motion.div variants={stagger.container} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((exam) => {
              const Icon = examIcons[exam.name] || GraduationCap
              const gradient = examGradients[exam.name] || "from-blue-500 to-blue-600"
              return (
                <motion.div key={exam.id} variants={stagger.item}>
                  <Link
                    href={`/secondary/exams/${exam.slug}`}
                    className="group block h-full rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className={cn("flex items-center gap-3 rounded-t-xl bg-gradient-to-br p-5 text-white", gradient)}>
                      <div className="rounded-lg bg-white/20 p-2.5 backdrop-blur-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{exam.name}</h3>
                        <p className="text-xs text-white/80">{exam.country}</p>
                      </div>
                    </div>
                    <div className="space-y-3 p-4">
                      <p className="text-sm font-medium text-gray-700 line-clamp-1">
                        {exam.fullName}
                      </p>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {exam.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {exam._count.subjects} subjects
                        </span>
                        <span className="flex items-center gap-1">
                          <FileQuestion className="h-3.5 w-3.5" />
                          {exam._count.pastQuestions} questions
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700">
                        Explore <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
