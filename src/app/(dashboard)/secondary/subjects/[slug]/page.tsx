"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  Play,
  FileQuestion,
  Library,
  CheckCircle,
  XCircle,
  Filter,
  Calendar,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface PastQuestion {
  id: string
  question: string
  options: string
  correctAnswer: string | null
  explanation: string | null
  year: number
  difficulty: string
  questionType: string
  marks: number
}

interface SubjectResource {
  id: string
  title: string
  type: string
  description: string | null
  free: boolean
  url: string | null
}

interface SubjectDetail {
  id: string
  name: string
  slug: string
  description: string | null
  exam: { name: string; slug: string }
  pastQuestions: PastQuestion[]
  resources: SubjectResource[]
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HARD: "bg-red-50 text-red-700",
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
  },
}

export default function SubjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [subject, setSubject] = useState<SubjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterYear, setFilterYear] = useState<number | null>(null)
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null)
  const [startingPractice, setStartingPractice] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/secondary/subjects/${slug}`)
        if (!res.ok) throw new Error("Not found")
        setSubject(await res.json())
      } catch {
        toast.error("Failed to load subject")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug])

  async function handleStartPractice() {
    setStartingPractice(true)
    try {
      const res = await fetch("/api/secondary/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectSlug: slug, title: `${subject?.name} Practice`, questionCount: 10 }),
      })
      if (!res.ok) throw new Error("Failed to start")
      const data = await res.json()
      toast.success("Practice test started!")
      router.push(`/secondary/practice/${data.test.id}`)
    } catch {
      toast.error("Failed to start practice")
    } finally {
      setStartingPractice(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <BookOpen className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Subject not found</h1>
        <Link href="/secondary/exams" className="text-blue-600 hover:underline">Back to exams</Link>
      </div>
    )
  }

  const years = [...new Set(subject.pastQuestions.map((q) => q.year))].sort((a, b) => b - a)
  const difficulties = [...new Set(subject.pastQuestions.map((q) => q.difficulty))]

  const filtered = subject.pastQuestions.filter((q) => {
    if (filterYear && q.year !== filterYear) return false
    if (filterDifficulty && q.difficulty !== filterDifficulty) return false
    return true
  })

  const groupedByYear: Record<number, PastQuestion[]> = {}
  filtered.forEach((q) => {
    if (!groupedByYear[q.year]) groupedByYear[q.year] = []
    groupedByYear[q.year].push(q)
  })

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div variants={stagger.item}>
          <Link
            href={`/secondary/exams/${subject.exam.slug}`}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {subject.exam.name}
          </Link>
        </motion.div>

        {/* Subject Header */}
        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                {subject.exam.name}
              </span>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">{subject.name}</h1>
              {subject.description && (
                <p className="mt-1 max-w-2xl text-gray-500">{subject.description}</p>
              )}
              <p className="mt-2 text-sm text-gray-400">
                {subject.pastQuestions.length} past questions · {subject.resources.length} resources
              </p>
            </div>
            <button
              onClick={handleStartPractice}
              disabled={startingPractice || subject.pastQuestions.length === 0}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
            >
              {startingPractice ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              Practice This Subject
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        {subject.pastQuestions.length > 0 && (
          <motion.div variants={stagger.item} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <Filter className="h-4 w-4" />
              <span>Filter:</span>
            </div>
            <select
              value={filterYear ?? ""}
              onChange={(e) => setFilterYear(e.target.value ? Number(e.target.value) : null)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="">All Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filterDifficulty ?? ""}
              onChange={(e) => setFilterDifficulty(e.target.value || null)}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((d) => (
                <option key={d} value={d}>{d.charAt(0) + d.slice(1).toLowerCase()}</option>
              ))}
            </select>
            <span className="text-sm text-gray-400">{filtered.length} questions</span>
          </motion.div>
        )}

        {/* Past Questions */}
        <motion.div variants={stagger.item}>
          {subject.pastQuestions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <FileQuestion className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">No past questions yet</h3>
              <p className="mt-1 text-sm text-gray-500">Past questions for this subject will be added soon.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-12 text-center">
              <AlertCircle className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="mt-3 text-lg font-semibold text-gray-900">No matching questions</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting the filters.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByYear).map(([year, questions]) => (
                <div key={year}>
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {year}
                    <span className="text-sm font-normal text-gray-400">({questions.length} questions)</span>
                  </h3>
                  <div className="space-y-3">
                    {questions.map((q, i) => (
                      <div
                        key={q.id}
                        className="rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow"
                      >
                        <button
                          onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                          className="flex w-full items-start gap-3 p-4 text-left lg:p-5"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                            {i + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className={cn(
                                  "rounded-full px-2 py-0.5 text-xs font-medium",
                                  difficultyColors[q.difficulty] || "bg-gray-50 text-gray-600"
                                )}
                              >
                                {q.difficulty}
                              </span>
                              <span className="text-xs text-gray-400">{q.questionType}</span>
                            </div>
                            <p className="mt-1.5 text-sm font-medium text-gray-900">{q.question}</p>
                          </div>
                          <div className="shrink-0 text-gray-300">
                            {expandedId === q.id ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </button>

                        <AnimatePresence>
                          {expandedId === q.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="border-t border-gray-100 px-4 pb-4 pt-3 lg:px-5 lg:pb-5">
                                {/* Options */}
                                {q.options && (
                                  <div className="mb-4 space-y-2">
                                    {(() => {
                                      try {
                                        return JSON.parse(q.options).map((opt: string, oi: number) => {
                                          const isCorrect = opt === q.correctAnswer
                                          return (
                                            <div
                                              key={oi}
                                              className={cn(
                                                "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                                                isCorrect
                                                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                                  : "border-gray-100 bg-gray-50 text-gray-600"
                                              )}
                                            >
                                              {isCorrect ? (
                                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-500" />
                                              ) : (
                                                <XCircle className="h-4 w-4 shrink-0 text-gray-300" />
                                              )}
                                              <span>{String.fromCharCode(65 + oi)}. {opt}</span>
                                            </div>
                                          )
                                        })
                                      } catch {
                                        return null
                                      }
                                    })()}
                                  </div>
                                )}

                                {/* Explanation */}
                                {q.explanation && (
                                  <div className="rounded-lg bg-blue-50 p-3">
                                    <p className="text-xs font-medium text-blue-700">Explanation</p>
                                    <p className="mt-1 text-sm text-blue-800">{q.explanation}</p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Resources */}
        {subject.resources.length > 0 && (
          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Resources</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {subject.resources.map((r) => (
                <div key={r.id} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className={cn("rounded-lg p-2", r.free ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400")}>
                    <Library className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{r.title}</h3>
                    {r.description && <p className="mt-0.5 text-xs text-gray-500">{r.description}</p>}
                    <div className="mt-1 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                        {r.type}
                      </span>
                      {r.free && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
