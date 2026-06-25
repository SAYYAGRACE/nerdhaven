"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import {
  Flame,
  BookOpen,
  Trophy,
  Clock,
  Award,
  ArrowRight,
  Zap,
  Users,
  ChevronRight,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.08 } } },
  item: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
  },
}

const courseAccents: Record<string, string> = {
  Mathematics: "from-green-400 to-emerald-600 shadow-green-200",
  Science: "from-purple-400 to-violet-600 shadow-purple-200",
  English: "from-orange-400 to-amber-600 shadow-orange-200",
  History: "from-blue-400 to-cyan-600 shadow-blue-200",
}

const courses = [
  { id: "1", title: "Mathematics", lessons: 12, progress: 68, accent: "Mathematics", instructor: "Ms. Ade" },
  { id: "2", title: "Science", lessons: 8, progress: 42, accent: "Science", instructor: "Dr. Okafor" },
  { id: "3", title: "English", lessons: 10, progress: 85, accent: "English", instructor: "Mr. Bello" },
  { id: "4", title: "History", lessons: 6, progress: 23, accent: "History", instructor: "Prof. Eze" },
]

const leaderboard = [
  { name: "Chioma O.", points: 2840, avatar: "CO" },
  { name: "Tunde B.", points: 2710, avatar: "TB" },
  { name: "Amina S.", points: 2550, avatar: "AS" },
]

function ProgressRing({ progress, size = 64 }: { progress: number; size?: number }) {
  const strokeWidth = 5
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference

  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="url(#gradient)"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours()
  if (hour < 12) return { text: "Good Morning", emoji: "🌅" }
  if (hour < 17) return { text: "Good Afternoon", emoji: "☀️" }
  return { text: "Good Evening", emoji: "🌙" }
}

export default function YouthDashboard() {
  const { data: session } = useSession()
  const greeting = getGreeting()
  const name = session?.user?.name?.split(" ")[0] || "Explorer"
  const [streak] = useState(5)
  const [xp] = useState({ current: 1340, max: 2000, level: 12 })

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-gradient-to-br from-youth-50 via-white to-purple-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {greeting.emoji} {greeting.text}, {name}!
            </h1>
            <p className="mt-1 text-gray-500">Ready to learn something awesome today?</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-orange-50 to-red-50 px-5 py-3 shadow-sm ring-1 ring-orange-200">
            <Flame className="h-6 w-6 text-orange-500" />
            <span className="text-lg font-bold text-orange-600">{streak}-day streak</span>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-semibold text-indigo-600">Level {xp.level}</span>
            <span>{xp.current.toLocaleString()} / {xp.max.toLocaleString()} XP</span>
          </div>
          <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(xp.current / xp.max) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" as const }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"
            />
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          <motion.div variants={stagger.item} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-lg lg:col-span-2">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/5" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="shrink-0">
                <ProgressRing progress={68} size={72} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white/70">Continue Learning</p>
                <h3 className="mt-1 text-xl font-bold">AI & Machine Learning Basics</h3>
                <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
                  <BookOpen className="h-4 w-4" />
                  <span>Lesson 8 of 12</span>
                </div>
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-white/20 px-5 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
                Resume <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="rounded-2xl bg-gradient-to-br from-amber-400 via-orange-400 to-red-500 p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8" />
              <div>
                <p className="text-sm font-medium text-white/80">Today&apos;s Challenge</p>
                <h3 className="text-lg font-bold">Quick Quiz</h3>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">Solve 5 math problems to earn bonus XP!</p>
            <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/20 py-3 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/30">
              Start Challenge <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>

        <motion.div variants={stagger.item} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: "Courses Enrolled", value: "6", icon: BookOpen, color: "text-indigo-500", bg: "bg-indigo-50" },
            { label: "Quizzes Passed", value: "24", icon: Trophy, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Hours Learned", value: "48", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Badges Earned", value: "12", icon: Award, color: "text-purple-500", bg: "bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
              <div className={cn("rounded-xl p-3", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div variants={stagger.item}>
          <h2 className="mb-4 text-xl font-bold text-gray-900">My Courses</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className={cn(
                  "group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-white shadow-lg transition-shadow hover:shadow-xl",
                  courseAccents[course.accent]
                )}
              >
                <div className="absolute right-3 top-3 rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium backdrop-blur-sm">
                  {course.progress}%
                </div>
                <h3 className="relative z-10 text-lg font-bold">{course.title}</h3>
                <p className="relative z-10 mt-1 text-sm text-white/70">{course.instructor}</p>
                <div className="relative z-10 mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white/60" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
                <p className="relative z-10 mt-2 text-xs text-white/60">{course.lessons} lessons</p>
                <div className="absolute -bottom-6 -right-6 opacity-0 transition group-hover:opacity-100">
                  <ArrowRight className="h-8 w-8 text-white/30" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Leaderboard</h2>
            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="space-y-3">
            {leaderboard.map((entry, i) => (
              <div key={entry.name} className="flex items-center gap-4 rounded-xl px-4 py-3 transition hover:bg-gray-50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 text-sm font-bold text-white shadow">
                  {i + 1}
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 text-sm font-bold text-white shadow-sm">
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{entry.name}</p>
                  <p className="text-sm text-gray-400">{entry.points.toLocaleString()} XP</p>
                </div>
                {i === 0 && <Star className="h-5 w-5 text-yellow-400" />}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
