"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Users, Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface Course {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string | null
  tier: string
  category: string
  difficulty: string
  priceInKobo: number
  thumbnailUrl: string | null
  _count: { enrollments: number; curriculumNodes: number }
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

const difficultyStyles: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700",
}

export default function PrimaryCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/courses?tier=PRIMARY&published=true")
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
      .catch(() => { toast.error("Failed to load courses"); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
    </div>
  )

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="mx-auto max-w-6xl">
      <motion.div variants={stagger.item} className="mb-8">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-3">
            <BookOpen className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-sm text-gray-500">Continue your learning adventure!</p>
          </div>
        </div>
      </motion.div>

      {courses.length === 0 ? (
        <motion.div variants={stagger.item} className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <Sparkles className="mx-auto h-12 w-12 text-gray-300" />
          <p className="mt-4 text-lg font-medium text-gray-500">No courses available yet</p>
          <p className="mt-1 text-sm text-gray-400">New courses are coming soon!</p>
        </motion.div>
      ) : (
        <motion.div variants={stagger.item} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div key={course.id} className="group rounded-xl border border-gray-100 bg-white shadow-sm transition hover:border-emerald-200 hover:shadow-md">
              <Link href={`/courses/${course.slug}`} className="block p-5 pb-3">
                <div className="mb-3 flex items-start justify-between">
                  <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", difficultyStyles[course.difficulty])}>
                    {course.difficulty}
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    ₦{(course.priceInKobo / 100).toLocaleString()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600">{course.title}</h3>
                {course.shortDescription && (
                  <p className="mt-1.5 text-sm text-gray-500">{course.shortDescription}</p>
                )}
                <div className="mt-4 flex items-center gap-4 border-t border-gray-50 pt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {course._count.enrollments} students</span>
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {course._count.curriculumNodes} lessons</span>
                </div>
              </Link>
              <div className="border-t border-gray-50 px-5 py-3">
                <Link
                  href={`/checkout/${course.slug}`}
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
