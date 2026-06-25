"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Home,
  Trophy,
  BarChart3,
  Share2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ResultQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

interface TestResult {
  id: string
  title: string
  score: number
  maxScore: number
  questionCount: number
  timeLimit: number | null
  startedAt: string
  completedAt: string
  answers: string
  status: string
}

export default function TestResultsPage() {
  const params = useParams()
  const router = useRouter()
  const [test, setTest] = useState<TestResult | null>(null)
  const [questions, setQuestions] = useState<ResultQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/secondary/practice/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setTest(data.test)
        setQuestions(data.questions)
        try {
          setAnswers(JSON.parse(data.test.answers || "{}"))
        } catch {
          setAnswers({})
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [params.id])

  if (loading)
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
      </div>
    )

  if (!test)
    return (
      <div className="flex h-96 items-center justify-center text-gray-400">
        Results not found
      </div>
    )

  const percentage =
    test.maxScore > 0 ? Math.round((test.score / test.maxScore) * 100) : 0
  const gradeColor =
    percentage >= 70
      ? "text-green-500"
      : percentage >= 40
        ? "text-amber-500"
        : "text-red-500"
  const gradeBg =
    percentage >= 70
      ? "bg-green-50 border-green-200"
      : percentage >= 40
        ? "bg-amber-50 border-amber-200"
        : "bg-red-50 border-red-200"
  const gradeLetter = percentage >= 70 ? "A" : percentage >= 50 ? "B" : percentage >= 40 ? "C" : "D"

  const startTime = new Date(test.startedAt).getTime()
  const endTime = new Date(test.completedAt).getTime()
  const timeTaken = Math.round((endTime - startTime) / 1000)
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}m ${sec}s`
  }

  const handleShare = async () => {
    const text = `I scored ${test.score}/${test.maxScore} (${percentage}%) on "${test.title}"!`
    if (navigator.share) {
      await navigator.share({ title: "Practice Test Results", text })
    } else {
      await navigator.clipboard.writeText(text)
    }
  }

  const incorrect = test.maxScore - test.score
  const correctPercent = test.maxScore > 0 ? (test.score / test.maxScore) * 100 : 0

  return (
    <div className="mx-auto max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-2xl font-bold text-gray-900">Test Complete!</h1>
        <p className="mt-1 text-gray-500">{test.title}</p>
      </motion.div>

      {/* Score hero */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={cn("mb-8 rounded-2xl border-2 p-8 text-center", gradeBg)}
      >
        <div className={cn("text-6xl font-bold", gradeColor)}>{gradeLetter}</div>
        <div className={cn("mt-2 text-5xl font-black", gradeColor)}>
          {percentage}%
        </div>
        <p className="mt-2 text-lg font-semibold text-gray-700">
          {test.score} / {test.maxScore} correct
        </p>
        {percentage >= 70 && (
          <div className="mt-3 flex items-center justify-center gap-2 text-green-600">
            <Trophy className="h-5 w-5" />
            <span className="text-sm font-medium">Great job!</span>
          </div>
        )}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" /> {formatDuration(timeTaken)}
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" /> {test.questionCount} questions
          </span>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8 grid grid-cols-3 gap-4"
      >
        <div className="rounded-xl border border-green-100 bg-white p-4 text-center shadow-sm">
          <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
          <p className="mt-1 text-2xl font-bold text-green-500">{test.score}</p>
          <p className="text-xs text-gray-400">Correct</p>
        </div>
        <div className="rounded-xl border border-red-100 bg-white p-4 text-center shadow-sm">
          <XCircle className="mx-auto h-6 w-6 text-red-500" />
          <p className="mt-1 text-2xl font-bold text-red-500">{incorrect}</p>
          <p className="text-xs text-gray-400">Incorrect</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <BarChart3 className="mx-auto h-6 w-6 text-blue-500" />
          <p className="mt-1 text-2xl font-bold text-blue-500">{correctPercent.toFixed(0)}%</p>
          <p className="text-xs text-gray-400">Accuracy</p>
        </div>
      </motion.div>

      {/* Mini bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="mb-8 h-4 overflow-hidden rounded-full bg-gray-100"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${correctPercent}%` }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={cn(
            "h-full rounded-full",
            percentage >= 70
              ? "bg-green-400"
              : percentage >= 40
                ? "bg-amber-400"
                : "bg-red-400",
          )}
        />
      </motion.div>

      {/* Question review */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-lg font-semibold text-gray-900">Review Answers</h2>
        {questions.map((q, i) => {
          const yourAnswer = answers[q.id]
          const isCorrect = yourAnswer === q.correctAnswer
          return (
            <div
              key={q.id}
              className={cn(
                "rounded-xl border p-4",
                isCorrect
                  ? "border-green-100 bg-green-50/50"
                  : "border-red-100 bg-red-50/50",
              )}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    Q{i + 1}: {q.question}
                  </p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p
                      className={isCorrect ? "text-green-600" : "text-red-500"}
                    >
                      Your answer: {yourAnswer || "Not answered"}
                    </p>
                    {!isCorrect && (
                      <p className="text-green-600">
                        Correct answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                  {q.explanation && (
                    <div className="mt-3 rounded-lg bg-white/80 p-3 text-sm text-gray-600">
                      <p className="font-medium text-gray-700">Explanation:</p>
                      <p className="mt-1">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Actions */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={() => router.push(`/secondary/practice/${params.id}`)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          <RotateCcw className="h-4 w-4" /> Try Again
        </button>
        <button
          onClick={() => router.push("/secondary/dashboard")}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Home className="h-4 w-4" /> Dashboard
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  )
}
