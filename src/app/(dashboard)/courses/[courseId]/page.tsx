"use client"

import { useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import {
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Circle,
  Play,
  FileText,
  HelpCircle,
  BookOpen,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import toast from "react-hot-toast"

interface CurriculumNode {
  id: string
  title: string
  type: "MODULE" | "LESSON" | "QUIZ" | "ASSESSMENT"
  content: string | null
  order: number
  xpReward: number
  parentId: string | null
  children: CurriculumNode[]
}

interface CourseDetail {
  id: string
  title: string
  description: string | null
  curriculumNodes: CurriculumNode[]
}

const nodeIcons: Record<string, React.ElementType> = {
  MODULE: BookOpen,
  LESSON: FileText,
  QUIZ: HelpCircle,
  ASSESSMENT: HelpCircle,
}

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const { data: session } = useSession()
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [activeNode, setActiveNode] = useState<CurriculumNode | null>(null)
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/courses/${courseId}?includeCurriculum=true`)
        if (res.ok) {
          const data = await res.json()
          setCourse(data)
          const modules = data.curriculumNodes?.filter((n: CurriculumNode) => n.type === "MODULE") || []
          if (modules.length > 0) {
            setExpandedModules(new Set([modules[0].id]))
            const firstLesson = modules[0].children?.[0]
            if (firstLesson) setActiveNode(firstLesson)
          }
        }
      } catch {
        toast.error("Failed to load course")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [courseId])

  async function handleMarkComplete() {
    if (!activeNode) return
    setCompletedNodes((prev) => {
      const next = new Set(prev)
      next.add(activeNode.id)
      return next
    })
    toast.success(`"${activeNode.title}" completed! +${activeNode.xpReward} XP`)

    const siblings = getCurrentLessonSiblings()
    const currentIdx = siblings.findIndex((n) => n.id === activeNode.id)
    if (currentIdx >= 0 && currentIdx + 1 < siblings.length) {
      setActiveNode(siblings[currentIdx + 1])
    }
  }

  function toggleModule(id: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function getCurrentLessonSiblings(): CurriculumNode[] {
    if (!course || !activeNode) return []
    for (const mod of course.curriculumNodes) {
      if (mod.children) {
        const found = mod.children.find((c) => c.id === activeNode.id)
        if (found) return mod.children
      }
    }
    return []
  }

  function calculateModuleProgress(node: CurriculumNode): number {
    if (!node.children || node.children.length === 0) return 0
    const completed = node.children.filter((c) => completedNodes.has(c.id)).length
    return Math.round((completed / node.children.length) * 100)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
        <BookOpen className="h-16 w-16 text-gray-300" />
        <h1 className="text-2xl font-bold text-gray-900">Course not found</h1>
        <Link href="/courses" className="text-indigo-600 hover:underline">Back to courses</Link>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden w-80 shrink-0 border-r border-gray-200 bg-gray-50 p-4 lg:block">
        <Link href="/courses" className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          All Courses
        </Link>
        <h2 className="mb-4 text-lg font-bold text-gray-900">{course.title}</h2>
        <nav className="space-y-1">
          {(course.curriculumNodes || [])
            .filter((n) => n.type === "MODULE")
            .map((mod) => (
              <div key={mod.id}>
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition hover:bg-white"
                >
                  {expandedModules.has(mod.id) ? (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
                  )}
                  <span className="flex-1 truncate">{mod.title}</span>
                  <span className="text-xs text-gray-400">{calculateModuleProgress(mod)}%</span>
                </button>
                <AnimatePresence>
                  {expandedModules.has(mod.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-4 space-y-0.5 border-l-2 border-gray-200 pl-3">
                        {(mod.children || []).map((child) => (
                          <button
                            key={child.id}
                            onClick={() => setActiveNode(child)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs transition",
                              activeNode?.id === child.id
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-500 hover:bg-gray-50"
                            )}
                          >
                            {completedNodes.has(child.id) ? (
                              <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 shrink-0 text-gray-300" />
                            )}
                            <span className="flex items-center gap-1.5">
                              {child.type !== "LESSON" && (
                                <HelpCircle className="h-3 w-3 text-gray-400" />
                              )}
                              {child.title}
                            </span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto">
        {activeNode ? (
          <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                {activeNode.type === "QUIZ" || activeNode.type === "ASSESSMENT" ? (
                  <HelpCircle className="h-6 w-6 text-indigo-600" />
                ) : (
                  <FileText className="h-6 w-6 text-indigo-600" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">{activeNode.type}</p>
                <h1 className="text-2xl font-bold text-gray-900">{activeNode.title}</h1>
              </div>
            </div>

            <div className="mb-8 flex aspect-video items-center justify-center rounded-2xl bg-gray-900 shadow-lg">
              <button className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30">
                <Play className="h-8 w-8 pl-0.5" />
              </button>
            </div>

            <div className="prose prose-gray max-w-none">
              {activeNode.content ? (
                <div dangerouslySetInnerHTML={{ __html: activeNode.content }} />
              ) : (
                <p className="text-gray-400">No content available for this lesson yet.</p>
              )}
            </div>

            {(activeNode.type === "QUIZ" || activeNode.type === "ASSESSMENT") && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <h3 className="font-semibold text-amber-800">Assessment</h3>
                <p className="mt-1 text-sm text-amber-700">This is a quiz/assessment node. Complete it to earn XP.</p>
                <button className="mt-4 rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700">
                  Start Quiz
                </button>
              </div>
            )}

            <div className="mt-10 flex items-center justify-between border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-400">+{activeNode.xpReward} XP on completion</p>
              <button
                onClick={handleMarkComplete}
                disabled={completedNodes.has(activeNode.id)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4" />
                {completedNodes.has(activeNode.id) ? "Completed" : "Mark Complete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">{course.title}</h2>
            <p className="mt-2 text-gray-500 max-w-md">{course.description}</p>
            <p className="mt-4 text-sm text-gray-400">Select a lesson from the sidebar to begin</p>
          </div>
        )}
      </main>
    </div>
  )
}
