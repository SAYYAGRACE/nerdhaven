"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import {
  ShieldAlert,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface CourseRecord {
  id: string
  title: string
  slug: string
  description: string | null
  tier: string
  category: string | null
  difficulty: string
  priceInKobo: number
  published: boolean
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },
}

const emptyForm = {
  title: "",
  slug: "",
  description: "",
  tier: "PRIMARY",
  category: "",
  difficulty: "BEGINNER",
  priceInKobo: 0,
}

export default function AdminCoursesPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const [courses, setCourses] = useState<CourseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) return
    async function load() {
      try {
        const res = await fetch("/api/admin/courses")
        if (res.ok) setCourses(await res.json())
      } catch {
        toast.error("Failed to load courses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function handleEdit(course: CourseRecord) {
    setForm({
      title: course.title,
      slug: course.slug,
      description: course.description || "",
      tier: course.tier,
      category: course.category || "",
      difficulty: course.difficulty,
      priceInKobo: course.priceInKobo,
    })
    setEditingId(course.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title || !form.slug) {
      toast.error("Title and slug are required")
      return
    }
    setSaving(true)
    try {
      const url = editingId ? `/api/admin/courses/${editingId}` : "/api/admin/courses"
      const method = editingId ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(await res.text())
      const saved = await res.json()
      if (editingId) {
        setCourses((prev) => prev.map((c) => (c.id === editingId ? saved : c)))
      } else {
        setCourses((prev) => [saved, ...prev])
      }
      toast.success(editingId ? "Course updated" : "Course created")
      resetForm()
    } catch (err: any) {
      toast.error(err.message || "Failed to save course")
    } finally {
      setSaving(false)
    }
  }

  async function handleTogglePublish(course: CourseRecord) {
    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !course.published }),
      })
      if (!res.ok) throw new Error(await res.text())
      setCourses((prev) =>
        prev.map((c) => (c.id === course.id ? { ...c, published: !c.published } : c))
      )
      toast.success(`Course ${course.published ? "unpublished" : "published"}`)
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle publish")
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      setCourses((prev) => prev.filter((c) => c.id !== id))
      toast.success("Course deleted")
    } catch (err: any) {
      toast.error(err.message || "Failed to delete course")
    } finally {
      setDeleteConfirm(null)
    }
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8">
        <ShieldAlert className="h-16 w-16 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500">Administrator access required.</p>
      </div>
    )
  }

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div variants={stagger.item} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
            <p className="mt-1 text-gray-500">Create, edit, and manage courses</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close" : "Create Course"}
          </button>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingId ? "Edit Course" : "New Course"}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  placeholder="Course title"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  placeholder="course-slug"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-600">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  placeholder="Course description"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Tier</label>
                <select
                  value={form.tier}
                  onChange={(e) => setForm({ ...form, tier: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  {["PRIMARY", "SECONDARY", "UNIVERSITY", "BUSINESS"].map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  placeholder="e.g. Mathematics, Science"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Difficulty</label>
                <select
                  value={form.difficulty}
                  onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Price (in kobo)</label>
                <input
                  type="number"
                  value={form.priceInKobo}
                  onChange={(e) => setForm({ ...form, priceInKobo: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                  placeholder="0 = free"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Update" : "Create"} Course
              </button>
            </div>
          </motion.div>
        )}

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 pb-3 pt-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Slug</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Tier</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Difficulty</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Price</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 pt-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-gray-50 transition hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{course.title}</td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-400">{course.slug}</td>
                    <td className="py-3 pr-4">
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                        {course.tier}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{course.difficulty}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">
                      ₦{(course.priceInKobo / 100).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        className={cn(
                          "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition",
                          course.published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {course.published ? (
                          <ToggleRight className="h-3.5 w-3.5" />
                        ) : (
                          <ToggleLeft className="h-3.5 w-3.5" />
                        )}
                        {course.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        {deleteConfirm === course.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(course.id)}
                              className="rounded-lg bg-red-500 p-1.5 text-white transition hover:bg-red-600"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="rounded-lg bg-gray-200 p-1.5 text-gray-600 transition hover:bg-gray-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(course.id)}
                            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                      No courses yet. Click &quot;Create Course&quot; to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
