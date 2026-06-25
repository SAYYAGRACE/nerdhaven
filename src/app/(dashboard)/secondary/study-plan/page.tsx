"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import {
  Target,
  Calendar,
  Clock,
  BookOpen,
  Plus,
  Loader2,
  Trash2,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Sparkles,
  GraduationCap,
  ArrowRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface StudyPlan {
  id: string
  examId: string
  targetDate: string | null
  dailyHours: number
  subjects: string | null
  status: string
  createdAt: string
  exam: { name: string; slug: string }
}

interface ExamOption {
  id: string
  name: string
  slug: string
  _count: { subjects: number; pastQuestions: number }
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
}

export default function StudyPlanPage() {
  const { data: session } = useSession()
  const [plans, setPlans] = useState<StudyPlan[]>([])
  const [exams, setExams] = useState<ExamOption[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ examSlug: "", targetDate: "", dailyHours: 2 })

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, examsRes] = await Promise.all([
          fetch("/api/secondary/study-plan"),
          fetch("/api/secondary/exams"),
        ])
        if (plansRes.ok) setPlans(await plansRes.json())
        if (examsRes.ok) setExams(await examsRes.json())
      } catch {
        toast.error("Failed to load study plans")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.examSlug || !form.targetDate) {
      toast.error("Please select an exam and target date")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/secondary/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create")
      const newPlan = await res.json()
      setPlans((prev) => [...prev, newPlan])
      setShowForm(false)
      setForm({ examSlug: "", targetDate: "", dailyHours: 2 })
      toast.success("Study plan created!")
    } catch {
      toast.error("Failed to create study plan")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/secondary/study-plan?id=${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed")
      setPlans((prev) => prev.filter((p) => p.id !== id))
      toast.success("Study plan deleted")
    } catch {
      toast.error("Failed to delete plan")
    }
  }

  function getDaysRemaining(targetDate: string): number {
    const diff = new Date(targetDate).getTime() - Date.now()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  function getEstimatedHours(targetDate: string, dailyHours: number): number {
    const days = getDaysRemaining(targetDate)
    return days * dailyHours
  }

  const totalWeeklyHours = plans.reduce((a, p) => a + (p.dailyHours || 0) * 7, 0)

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <motion.div variants={stagger.item} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Study Plan</h1>
            <p className="mt-1 text-gray-500">Plan your exam preparation and track your progress.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Study Plan
          </button>
        </motion.div>

        {/* Stats */}
        {plans.length > 0 && (
          <motion.div variants={stagger.item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600">
                <Target className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{plans.length}</p>
              <p className="text-xs text-gray-500">Active Plans</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-indigo-600">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {plans.reduce((a, p) => a + (p.targetDate ? getDaysRemaining(p.targetDate) : 0), 0)}
              </p>
              <p className="text-xs text-gray-500">Total Days Left</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">{totalWeeklyHours}</p>
              <p className="text-xs text-gray-500">Weekly Study Hours</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {plans.reduce((a, p) => a + (p.targetDate ? getEstimatedHours(p.targetDate, p.dailyHours) : 0), 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Est. Study Hours</p>
            </div>
          </motion.div>
        )}

        {/* Create Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:p-6"
            >
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Create Study Plan</h2>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Exam</label>
                  <select
                    value={form.examSlug}
                    onChange={(e) => setForm((prev) => ({ ...prev, examSlug: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    required
                  >
                    <option value="">Select exam</option>
                    {exams.map((e) => (
                      <option key={e.slug} value={e.slug}>{e.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Target Date</label>
                  <input
                    type="date"
                    value={form.targetDate}
                    onChange={(e) => setForm((prev) => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">Daily Hours</label>
                  <input
                    type="number"
                    min={1}
                    max={16}
                    value={form.dailyHours}
                    onChange={(e) => setForm((prev) => ({ ...prev, dailyHours: Math.min(16, Math.max(1, Number(e.target.value))) }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Create Plan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plans List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : plans.length === 0 ? (
          <motion.div variants={stagger.item} className="flex flex-col items-center justify-center py-16 text-center">
            <Target className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No study plans yet</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first study plan to start tracking your preparation.</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Create Study Plan
            </button>
          </motion.div>
        ) : (
          <motion.div variants={stagger.container} className="space-y-4">
            {plans.map((plan) => {
              const daysLeft = plan.targetDate ? getDaysRemaining(plan.targetDate) : 0
              const estHours = plan.targetDate ? getEstimatedHours(plan.targetDate, plan.dailyHours) : 0
              return (
                <motion.div
                  key={plan.id}
                  variants={stagger.item}
                  className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md lg:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                        <GraduationCap className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{plan.exam.name}</h3>
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            {plan.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          Created {new Date(plan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Target Date</p>
                      <p className="mt-0.5 font-semibold text-gray-900">
                        {plan.targetDate ? new Date(plan.targetDate).toLocaleDateString() : "Not set"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Days Remaining</p>
                      <p className="mt-0.5 font-semibold text-gray-900">{daysLeft} days</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Daily Hours</p>
                      <p className="mt-0.5 font-semibold text-gray-900">{plan.dailyHours}h</p>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <p className="text-xs text-gray-500">Est. Total Hours</p>
                      <p className="mt-0.5 font-semibold text-gray-900">{estHours}h</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Progress</span>
                      <span>{Math.min(100, Math.round((1 - daysLeft / Math.max(1, (daysLeft + 1))) * 100))}%</span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                        style={{
                          width: `${Math.min(100, Math.round((1 - daysLeft / Math.max(365, daysLeft + 1)) * 100))}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="mt-4 flex gap-2">
                    <a
                      href={`/secondary/past-questions?exam=${plan.exam.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Past Questions
                    </a>
                    <a
                      href={`/secondary/exams/${plan.exam.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-200"
                    >
                      Exam Details <ArrowRight className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
