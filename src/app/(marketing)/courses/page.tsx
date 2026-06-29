"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Search, BookOpen, GraduationCap, FlaskConical, Building2, Users, Loader2 } from "lucide-react"
import toast from "react-hot-toast"

const tiers = ["All", "PRIMARY", "SECONDARY", "UNIVERSITY", "BUSINESS"] as const
type Tier = (typeof tiers)[number]

const tierIcons: Record<string, any> = { PRIMARY: GraduationCap, SECONDARY: BookOpen, UNIVERSITY: FlaskConical, BUSINESS: Building2 }

const tierColors: Record<string, string> = {
  PRIMARY: "bg-emerald-100 text-emerald-700",
  SECONDARY: "bg-blue-100 text-blue-700",
  UNIVERSITY: "bg-slate-100 text-slate-700",
  BUSINESS: "bg-gray-100 text-gray-700",
}

const difficultyColors: Record<string, string> = {
  BEGINNER: "bg-green-100 text-green-700",
  INTERMEDIATE: "bg-amber-100 text-amber-700",
  ADVANCED: "bg-red-100 text-red-700",
}

interface Course {
  id: string; title: string; slug: string; description: string; shortDescription: string | null
  tier: string; category: string; difficulty: string; priceInKobo: number; thumbnailUrl: string | null
  _count: { enrollments: number; curriculumNodes: number }
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTier, setActiveTier] = useState<Tier>("All")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetch("/api/courses?published=true")
      .then(r => r.json())
      .then(data => { setCourses(data); setLoading(false) })
      .catch(() => { toast.error("Failed to load courses"); setLoading(false) })
  }, [])

  const filtered = courses
    .filter(c => activeTier === "All" || c.tier === activeTier)
    .filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || (c.description || "").toLowerCase().includes(search.toLowerCase()))

  const formatPrice = (kobo: number) => {
    if (kobo === 0) return "Free"
    return `₦${(kobo / 100).toLocaleString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Explore Courses</h1>
            <p className="mt-2 text-gray-600">Discover the perfect course for your learning journey.</p>
          </motion.div>

          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search courses..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {tiers.map(tier => (
              <button key={tier} onClick={() => setActiveTier(tier)}
                className={cn("rounded-lg px-4 py-2 text-sm font-medium transition", activeTier === tier ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
              >
                {tier === "All" ? "All" : tier.charAt(0) + tier.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((course, i) => {
              const TierIcon = tierIcons[course.tier]
              return (
                <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg">
                    <Link href={`/courses/${course.slug}`} className="group block">
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
                        <BookOpen className="h-12 w-12 text-indigo-300" />
                      </div>
                      <div className="p-4 pb-2">
                        <div className="flex items-center gap-2">
                          <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium", tierColors[course.tier])}>
                            <TierIcon className="h-3 w-3" /> {course.tier.charAt(0) + course.tier.slice(1).toLowerCase()}
                          </span>
                          <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", difficultyColors[course.difficulty])}>
                            {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-semibold text-gray-900 transition-colors group-hover:text-indigo-600">{course.title}</h3>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{course.shortDescription || course.description}</p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
                      <span className="text-sm font-bold text-gray-900">{formatPrice(course.priceInKobo)}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400"><Users className="h-3 w-3" />{course._count.enrollments}</span>
                        <Link
                          href={`/checkout/${course.slug}`}
                          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 text-center">
            <BookOpen className="h-12 w-12 text-gray-300" />
            <p className="mt-4 text-sm text-gray-500">No courses found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  )
}
