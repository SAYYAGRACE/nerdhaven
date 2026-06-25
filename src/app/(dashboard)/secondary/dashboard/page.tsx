"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  GraduationCap,
  FileQuestion,
  Library,
  ClipboardCheck,
  ArrowRight,
  ChevronRight,
  Loader2,
  Clock,
  Award,
  BarChart3,
  Sparkles,
  Target,
  Layers,
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
  logoUrl: string | null
  _count: { subjects: number; pastQuestions: number }
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
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

const examColors: Record<string, string> = {
  WAEC: "from-blue-500 to-blue-700",
  NECO: "from-cyan-500 to-cyan-700",
  JAMB: "from-indigo-500 to-indigo-700",
  IGCSE: "from-violet-500 to-violet-700",
  SAT: "from-purple-500 to-purple-700",
  NABTEB: "from-sky-500 to-sky-700",
  BECE: "from-teal-500 to-teal-700",
  IELTS: "from-rose-500 to-rose-700",
}

const courses = [
  { title: "IGCSE Mathematics Mastery", slug: "igcse-math-mastery", progress: 68, lessons: 12 },
  { title: "WASSCE Complete Prep Bundle", slug: "wassce-complete-prep", progress: 42, lessons: 24 },
  { title: "JAMB UTME Success Pack", slug: "jamb-utme-success", progress: 85, lessons: 18 },
  { title: "IGCSE Chemistry Theory Summary", slug: "igcse-chemistry-resource", progress: 23, lessons: 8, isResource: true },
]

const quickLinks = [
  { label: "Past Questions", href: "/secondary/past-questions", icon: FileQuestion, desc: "Browse past questions by exam and subject" },
  { label: "Practice Tests", href: "/secondary/exams", icon: ClipboardCheck, desc: "Take timed practice tests" },
  { label: "Study Resources", href: "/secondary/resources", icon: Library, desc: "Notes, guides, and video tutorials" },
  { label: "Study Plan", href: "/secondary/study-plan", icon: Target, desc: "Create and track your study plan" },
]

const recentActivities = [
  { action: "Completed practice test", detail: "WAEC Mathematics - 15/20", time: "2 hours ago" },
  { action: "Viewed resource", detail: "JAMB UTME Syllabus 2025", time: "Yesterday" },
  { action: "Started subject", detail: "IGCSE Physics - Past Questions", time: "2 days ago" },
  { action: "Updated study plan", detail: "SAT target date set to Dec 2025", time: "3 days ago" },
]

export default function SecondaryDashboard() {
  const { data: session } = useSession()
  const [exams, setExams] = useState<ExamBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ examsAvailable: 0, totalQuestions: 0, totalResources: 0, practiceTests: 0 })

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/secondary/exams")
        if (!res.ok) throw new Error("Failed to fetch exams")
        const data: ExamBrief[] = await res.json()
        setExams(data)
        setStats({
          examsAvailable: data.length,
          totalQuestions: data.reduce((a, e) => a + e._count.pastQuestions, 0),
          totalResources: 0,
          practiceTests: 0,
        })
      } catch {
        toast.error("Failed to load exam data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const name = session?.user?.name?.split(" ")[0] || "Student"
  const featured = exams.slice(0, 6)

  const statCards = [
    { label: "Exams Available", value: stats.examsAvailable, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Questions", value: stats.totalQuestions.toLocaleString(), icon: FileQuestion, color: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Study Resources", value: stats.totalResources || "24+", icon: Library, color: "text-violet-500", bg: "bg-violet-50" },
    { label: "Practice Tests", value: stats.practiceTests || "8", icon: ClipboardCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
  ]

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Welcome Hero */}
        <motion.div variants={stagger.item} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 p-6 text-white shadow-lg lg:p-8">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-sm text-blue-100">
              <Sparkles className="h-4 w-4" />
              <span>Secondary School</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold lg:text-3xl">Welcome back, {name}! 🎓</h1>
            <p className="mt-1 text-blue-100">Continue your exam preparation journey and ace your goals.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/secondary/past-questions"
                className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30"
              >
                Start Practicing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/secondary/exams"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
              >
                Browse Exams
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={stagger.item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className={cn("rounded-lg p-2.5", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Featured Exams */}
        <motion.div variants={stagger.item}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Featured Exams</h2>
            <Link
              href="/secondary/exams"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {featured.map((exam) => {
                const Icon = examIcons[exam.name] || GraduationCap
                const gradient = examColors[exam.name] || "from-blue-500 to-blue-700"
                return (
                  <Link
                    key={exam.id}
                    href={`/secondary/exams/${exam.slug}`}
                    className="group relative overflow-hidden rounded-xl bg-white border border-gray-100 p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className={cn("mb-3 inline-flex rounded-lg p-2.5 text-white bg-gradient-to-br", gradient)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{exam.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-1">{exam.fullName}</p>
                    <p className="mt-2 text-xs text-gray-400">
                      {exam._count.subjects} subjects · {exam._count.pastQuestions} questions
                    </p>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* My Courses */}
        <motion.div variants={stagger.item}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
            <Link
              href="/dashboard/courses"
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {courses.map((course, i) => (
              <div
                key={course.slug}
                className="group rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md lg:p-5"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("rounded-lg p-1.5", i % 2 === 0 ? "bg-blue-50" : "bg-indigo-50")}>
                        <BookOpen className={cn("h-4 w-4", i % 2 === 0 ? "text-blue-500" : "text-indigo-500")} />
                      </div>
                      <span className="text-xs font-medium text-blue-600">
                        {course.isResource ? "Resource" : "Course"}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-gray-900">{course.title}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">{course.lessons} lessons</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{course.progress}%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <Link
                  href={`/courses/${course.slug}`}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Continue Learning <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links + Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Links */}
          <motion.div variants={stagger.item} className="lg:col-span-2">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Quick Access</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 transition group-hover:bg-blue-100">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{link.label}</h3>
                      <p className="mt-0.5 text-xs text-gray-500">{link.desc}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={stagger.item}>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                  <div className="rounded-full bg-blue-50 p-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-400">{activity.detail}</p>
                    <p className="text-xs text-gray-300">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
