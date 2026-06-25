"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Loader2,
  FileQuestion,
  AlertCircle,
  BookOpen,
  Calendar,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface ExamOption {
  name: string
  slug: string
}

interface SubjectOption {
  name: string
  slug: string
}

interface Question {
  id: string
  question: string
  options: string
  correctAnswer: string | null
  explanation: string | null
  year: number
  difficulty: string
  questionType: string
  subject: { name: string; slug: string }
  exam: { name: string; slug: string }
}

const difficultyColors: Record<string, string> = {
  EASY: "bg-emerald-50 text-emerald-700",
  MEDIUM: "bg-amber-50 text-amber-700",
  HARD: "bg-red-50 text-red-700",
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
}

export default function PastQuestionsPage() {
  const [exams, setExams] = useState<ExamOption[]>([])
  const [subjects, setSubjects] = useState<SubjectOption[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [visible, setVisible] = useState(20)

  const [filters, setFilters] = useState({
    exam: "",
    subject: "",
    year: "",
    difficulty: "",
    search: "",
  })

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await fetch("/api/secondary/exams")
        if (res.ok) {
          const data = await res.json()
          setExams(data.map((e: any) => ({ name: e.name, slug: e.slug })))
        }
      } catch {
        // silent fail
      }
    }
    loadExams()
  }, [])

  const fetchQuestions = useCallback(async (f: typeof filters, append = false) => {
    setSearching(true)
    try {
      const params = new URLSearchParams()
      if (f.exam) params.set("exam", f.exam)
      if (f.subject) params.set("subject", f.subject)
      if (f.year) params.set("year", f.year)
      if (f.difficulty) params.set("difficulty", f.difficulty)
      if (f.search) params.set("search", f.search)

      const res = await fetch(`/api/secondary/past-questions?${params.toString()}`)
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setQuestions(data)
      setVisible(20)
    } catch {
      toast.error("Failed to load questions")
    } finally {
      setSearching(false)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuestions(filters)
  }, [filters.exam, filters.subject, filters.year, filters.difficulty, fetchQuestions])

  useEffect(() => {
    async function loadSubjects() {
      if (!filters.exam) {
        setSubjects([])
        return
      }
      try {
        const res = await fetch(`/api/secondary/exams/${filters.exam}`)
        if (res.ok) {
          const data = await res.json()
          setSubjects(data.subjects.map((s: any) => ({ name: s.name, slug: s.slug })))
        }
      } catch {
        // silent
      }
    }
    loadSubjects()
  }, [filters.exam])

  function handleSearch() {
    fetchQuestions(filters)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSearch()
  }

  const displayed = questions.slice(0, visible)
  const hasMore = visible < questions.length

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div variants={stagger.item}>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Past Questions</h1>
          <p className="mt-1 text-gray-500">Browse and search past examination questions with answers.</p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={stagger.item} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Exam</label>
              <select
                value={filters.exam}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, exam: e.target.value, subject: "" }))
                  setQuestions([])
                  setLoading(true)
                }}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">All Exams</option>
                {exams.map((e) => (
                  <option key={e.slug} value={e.slug}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters((prev) => ({ ...prev, subject: e.target.value }))}
                disabled={!filters.exam}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400 disabled:opacity-50"
              >
                <option value="">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Year</label>
              <input
                type="number"
                placeholder="e.g. 2023"
                value={filters.year}
                onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters((prev) => ({ ...prev, difficulty: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  onKeyDown={handleKeyDown}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
              <button
                onClick={handleSearch}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <motion.div variants={stagger.item}>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : searching ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileQuestion className="h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">No questions found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting the filters or search terms.</p>
            </div>
          ) : (
            <>
              <p className="mb-3 text-sm text-gray-500">{questions.length} questions found</p>
              <div className="space-y-3">
                {displayed.map((q, i) => (
                  <div key={q.id} className="rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow">
                    <button
                      onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                      className="flex w-full items-start gap-3 p-4 text-left lg:p-5"
                    >
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                            {q.exam.name}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            {q.subject.name}
                          </span>
                          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", difficultyColors[q.difficulty])}>
                            {q.difficulty}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar className="h-3 w-3" />
                            {q.year}
                          </span>
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

              {hasMore && (
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setVisible((prev) => prev + 20)}
                    className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    Load More ({questions.length - visible} remaining)
                  </button>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
