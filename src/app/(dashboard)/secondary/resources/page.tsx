"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  Search,
  Library,
  Video,
  FileText,
  Filter,
  Loader2,
  X,
  ExternalLink,
  Download,
  BookOpen,
  Sparkles,
  CheckCircle,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface Resource {
  id: string
  title: string
  type: string
  description: string | null
  url: string | null
  content: string | null
  free: boolean
  fileSize: number | null
  duration: number | null
  downloads: number
  createdAt: string
  exam: { name: string; slug: string } | null
  subject: { name: string; slug: string } | null
}

const typeIcons: Record<string, React.ElementType> = {
  NOTE: FileText,
  VIDEO: Video,
  PDF: FileText,
  AUDIO: FileText,
}

const typeColors: Record<string, string> = {
  NOTE: "text-amber-600 bg-amber-50",
  VIDEO: "text-purple-600 bg-purple-50",
  PDF: "text-red-600 bg-red-50",
  AUDIO: "text-cyan-600 bg-cyan-50",
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [exams, setExams] = useState<{ name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [filters, setFilters] = useState({ exam: "", type: "", free: false, search: "" })

  useEffect(() => {
    async function loadExams() {
      try {
        const res = await fetch("/api/secondary/exams")
        if (res.ok) {
          const data = await res.json()
          setExams(data.map((e: any) => ({ name: e.name, slug: e.slug })))
        }
      } catch {
        // silent
      }
    }
    loadExams()
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.exam) params.set("exam", filters.exam)
        if (filters.type) params.set("type", filters.type)
        if (filters.free) params.set("free", "true")

        const res = await fetch(`/api/secondary/resources?${params.toString()}`)
        if (!res.ok) throw new Error("Failed")
        let data: Resource[] = await res.json()

        if (filters.search) {
          const q = filters.search.toLowerCase()
          data = data.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              (r.description || "").toLowerCase().includes(q),
          )
        }

        setResources(data)
      } catch {
        toast.error("Failed to load resources")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [filters.exam, filters.type, filters.free])

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div variants={stagger.item}>
          <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">Study Resources</h1>
          <p className="mt-1 text-gray-500">Notes, video tutorials, and guides for your exam preparation.</p>
        </motion.div>

        {/* Filter Bar */}
        <motion.div variants={stagger.item} className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Exam</label>
              <select
                value={filters.exam}
                onChange={(e) => setFilters((prev) => ({ ...prev, exam: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">All Exams</option>
                {exams.map((e) => (
                  <option key={e.slug} value={e.slug}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Type</label>
              <select
                value={filters.type}
                onChange={(e) => setFilters((prev) => ({ ...prev, type: e.target.value }))}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="">All Types</option>
                <option value="NOTE">Notes</option>
                <option value="VIDEO">Videos</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">Price</label>
              <div className="flex h-full items-center gap-2 pt-1">
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, free: !prev.free }))}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                    filters.free
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  Free Only
                </button>
                {filters.free && (
                  <button
                    onClick={() => setFilters((prev) => ({ ...prev, free: false }))}
                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-500 transition hover:bg-gray-50"
                  >
                    All
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2">
              <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : resources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Library className="h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No resources found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
          </div>
        ) : (
          <motion.div variants={stagger.container} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = typeIcons[resource.type] || FileText
              const colorClasses = typeColors[resource.type] || "text-gray-600 bg-gray-50"
              return (
                <motion.div key={resource.id} variants={stagger.item}>
                  <button
                    onClick={() => setSelectedResource(resource)}
                    className="group w-full rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn("rounded-lg p-2.5", colorClasses)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{resource.title}</h3>
                        {resource.description && (
                          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{resource.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {resource.exam && (
                            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                              {resource.exam.name}
                            </span>
                          )}
                          {resource.subject && (
                            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                              {resource.subject.name}
                            </span>
                          )}
                          <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", colorClasses)}>
                            {resource.type}
                          </span>
                          {resource.free && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              <Sparkles className="h-3 w-3" />
                              Free
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                          {resource.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resource.duration}min
                            </span>
                          )}
                          {resource.downloads > 0 && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {resource.downloads}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResource && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setSelectedResource(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-2.5", typeColors[selectedResource.type] || "text-gray-600 bg-gray-50")}>
                    {(() => {
                      const Icon = typeIcons[selectedResource.type] || FileText
                      return <Icon className="h-5 w-5" />
                    })()}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedResource.title}</h3>
                    <p className="text-xs text-gray-500">{selectedResource.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedResource(null)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {selectedResource.description && (
                <p className="mt-4 text-sm text-gray-600">{selectedResource.description}</p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedResource.exam && (
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                    {selectedResource.exam.name}
                  </span>
                )}
                {selectedResource.subject && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    {selectedResource.subject.name}
                  </span>
                )}
                {selectedResource.free && (
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Free
                  </span>
                )}
                {!selectedResource.free && (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    Premium
                  </span>
                )}
              </div>

              {selectedResource.content && (
                <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                  {selectedResource.content}
                </div>
              )}

              <div className="mt-6 flex gap-3">
                {selectedResource.url && (
                  <a
                    href={selectedResource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open Resource
                  </a>
                )}
                <button
                  onClick={() => setSelectedResource(null)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
