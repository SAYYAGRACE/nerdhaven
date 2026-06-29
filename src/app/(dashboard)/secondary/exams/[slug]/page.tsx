"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  GraduationCap,
  BookOpen,
  FileQuestion,
  Library,
  Globe,
  ArrowLeft,
  Loader2,
  ChevronRight,
  ExternalLink,
  Play,
  Sparkles,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { getWhatsAppGroup } from "@/lib/groups"
import toast from "react-hot-toast"

interface SubjectBrief {
  id: string
  name: string
  slug: string
  description: string | null
  _count: { pastQuestions: number }
}

interface ResourceBrief {
  id: string
  title: string
  type: string
  description: string | null
  free: boolean
  url: string | null
}

interface ExamDetail {
  id: string
  name: string
  slug: string
  fullName: string | null
  description: string | null
  country: string | null
  website: string | null
  logoUrl: string | null
  subjects: SubjectBrief[]
  resources: ResourceBrief[]
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  },
}

const examGradients: Record<string, string> = {
  WAEC: "from-blue-500 to-blue-700",
  NECO: "from-cyan-500 to-cyan-700",
  JAMB: "from-indigo-500 to-indigo-700",
  IGCSE: "from-violet-500 to-violet-700",
  SAT: "from-purple-500 to-purple-700",
}

export default function ExamDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [exam, setExam] = useState<ExamDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [startingPractice, setStartingPractice] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/secondary/exams/${slug}`)
        if (!res.ok) throw new Error("Not found")
        setExam(await res.json())
      } catch {
        toast.error("Failed to load exam details")
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
        body: JSON.stringify({ examSlug: slug, title: `${exam?.name} Practice Test`, questionCount: 10 }),
      })
      if (!res.ok) throw new Error("Failed to start practice")
      const data = await res.json()
      toast.success("Practice test started!")
      router.push(`/secondary/practice/${data.test.id}`)
    } catch {
      toast.error("Failed to start practice test")
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

  if (!exam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
        <GraduationCap className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Exam not found</h1>
        <Link href="/secondary/exams" className="text-blue-600 hover:underline">
          Back to exams
        </Link>
      </div>
    )
  }

  const gradient = examGradients[exam.name] || "from-blue-500 to-blue-700"
  const totalQuestions = exam.subjects.reduce((a, s) => a + s._count.pastQuestions, 0)

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <motion.div variants={stagger.item}>
          <Link
            href="/secondary/exams"
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            All Exams
          </Link>
        </motion.div>

        {/* Exam Header */}
        <motion.div
          variants={stagger.item}
          className={cn("relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg lg:p-8", gradient)}
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <GraduationCap className="h-4 w-4" />
              <span>{exam.country}</span>
            </div>
            <h1 className="mt-1 text-3xl font-bold">{exam.name}</h1>
            <p className="mt-1 text-lg text-white/90">{exam.fullName}</p>
            <p className="mt-3 max-w-2xl text-sm text-white/80">{exam.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {exam.website && (
                <a
                  href={exam.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
                >
                  <Globe className="h-4 w-4" />
                  Official Website
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm">
                <BookOpen className="h-4 w-4" />
                {exam.subjects.length} subjects
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-white/10 px-4 py-2 text-sm">
                <FileQuestion className="h-4 w-4" />
                {totalQuestions} questions
              </span>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleStartPractice}
                disabled={startingPractice}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50 disabled:opacity-50"
              >
                {startingPractice ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Practice
              </button>
              <Link
                href={`/secondary/past-questions?exam=${exam.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/30"
              >
                <FileQuestion className="h-4 w-4" />
                View Past Questions
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Subjects */}
        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Subjects</h2>
          {exam.subjects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No subjects available yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {exam.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/secondary/subjects/${subject.slug}`}
                  className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-blue-600">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{subject.name}</h3>
                  {subject.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-2">{subject.description}</p>
                  )}
                  <p className="mt-2 text-xs text-gray-400">
                    {subject._count.pastQuestions} past questions
                  </p>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Free Resources */}
        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Free Study Resources</h2>
          {exam.resources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center">
              <Library className="mx-auto h-8 w-8 text-gray-300" />
              <p className="mt-2 text-sm text-gray-500">No free resources available yet.</p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {exam.resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
                >
                  <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
                    <Library className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{resource.title}</h3>
                    {resource.description && (
                      <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                    )}
                    <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      {resource.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* WhatsApp Study Group */}
        {exam && getWhatsAppGroup(exam.slug) && (
          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Study Group</h2>
            <a
              href={getWhatsAppGroup(exam.slug)!.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 transition hover:bg-emerald-100"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                💬
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-emerald-900">
                  {getWhatsAppGroup(exam.slug)!.name}
                </h3>
                <p className="text-sm text-emerald-700">
                  {getWhatsAppGroup(exam.slug)!.description}
                </p>
                <p className="mt-1 text-xs text-emerald-600">
                  {getWhatsAppGroup(exam.slug)!.memberCount.toLocaleString()} members
                </p>
              </div>
              <span className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
                Join Free
              </span>
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
