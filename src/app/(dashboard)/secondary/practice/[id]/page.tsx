"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer?: string
  explanation?: string
  difficulty?: string
  year?: string
}

interface TestData {
  id: string
  title: string
  questionCount: number
  timeLimit: number | null
  status: string
  startedAt: string
}

export default function PracticeTestPage() {
  const router = useRouter()
  const params = useParams()
  const [test, setTest] = useState<TestData | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showConfirm, setShowConfirm] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasSubmittedRef = useRef(false)

  useEffect(() => {
    fetch(`/api/secondary/practice/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTest(data.test)
        setQuestions(data.questions)
        if (data.test.timeLimit) setTimeLeft(data.test.timeLimit * 60)
        setLoading(false)
      })
      .catch(() => {
        toast.error("Failed to load test")
        setLoading(false)
      })
  }, [params.id])

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || hasSubmittedRef.current) return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timerRef.current!)
          if (!hasSubmittedRef.current) handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeLeft])

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length > 0 && !hasSubmittedRef.current) {
        e.preventDefault()
      }
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [answers])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex((i) => i - 1)
      } else if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1)
      } else if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(e.key)) {
        const idx = parseInt(e.key) - 1
        if (questions[currentIndex]?.options[idx]) {
          handleAnswer(questions[currentIndex].options[idx])
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [currentIndex, questions])

  const handleAnswer = useCallback(
    (option: string) => {
      setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: option }))
    },
    [currentIndex, questions],
  )

  const handleSubmit = useCallback(async () => {
    if (submitting || hasSubmittedRef.current) return
    hasSubmittedRef.current = true
    setSubmitting(true)
    if (timerRef.current) clearInterval(timerRef.current)
    try {
      const formatted = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      }))
      const res = await fetch(`/api/secondary/practice/${params.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: formatted }),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Test submitted! Score: ${data.score}/${data.maxScore}`)
        router.push(`/secondary/results/${params.id}`)
      } else {
        throw new Error(data.error || "Failed to submit")
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to submit")
      hasSubmittedRef.current = false
    } finally {
      setSubmitting(false)
      setShowConfirm(false)
    }
  }, [submitting, answers, params.id, router])

  const answeredCount = Object.keys(answers).length

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )

  if (!test || questions.length === 0)
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Test not found
      </div>
    )

  const current = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{test.title}</h1>
            <p className="text-sm text-gray-500">{test.questionCount} questions</p>
          </div>
          {timeLeft !== null && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold",
                timeLeft < 60
                  ? "bg-red-50 text-red-600"
                  : "bg-blue-50 text-blue-600",
              )}
            >
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>
            Q {currentIndex + 1}/{questions.length}
          </span>
          <span>{answeredCount} answered</span>
        </div>
      </motion.div>

      {/* Question palette */}
      <div className="mb-6 flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setCurrentIndex(i)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
              i === currentIndex
                ? "bg-blue-500 text-white ring-2 ring-blue-200"
                : answers[q.id]
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-2 flex items-center gap-2">
            {current.difficulty && (
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  current.difficulty === "EASY"
                    ? "bg-green-100 text-green-700"
                    : current.difficulty === "MEDIUM"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-red-100 text-red-700",
                )}
              >
                {current.difficulty}
              </span>
            )}
            {current.year && (
              <span className="text-xs text-gray-400">{current.year}</span>
            )}
          </div>
          <p className="mb-6 text-lg leading-relaxed text-gray-900">
            {current.question}
          </p>

          <div className="space-y-3">
            {current.options.map((option, oi) => (
              <button
                key={oi}
                onClick={() => handleAnswer(option)}
                className={cn(
                  "w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all",
                  answers[current.id] === option
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-gray-100",
                )}
              >
                <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold">
                  {String.fromCharCode(65 + oi)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </button>

        <button
          onClick={() => setShowConfirm(true)}
          disabled={submitting}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-blue-600 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Test"}
          <CheckCircle2 className="h-4 w-4" />
        </button>

        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))
          }
          disabled={currentIndex === questions.length - 1}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-40"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-4 w-full max-w-sm rounded-xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-gray-900">Submit test?</h3>
            <p className="mt-2 text-sm text-gray-500">
              {answeredCount} of {questions.length} questions answered.
              {answeredCount < questions.length && (
                <span className="block mt-1 text-amber-600">
                  {questions.length - answeredCount} unanswered questions will be marked wrong.
                </span>
              )}
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Continue Test
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
