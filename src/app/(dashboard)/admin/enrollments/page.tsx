"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { ShieldAlert, Loader2, Download, Plus, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

interface EnrollmentRecord {
  id: string
  user: { name: string | null; email: string }
  course: { title: string }
  status: string
  enrolledAt: string
}

interface UserBrief {
  id: string
  name: string | null
  email: string
}

interface CourseBrief {
  id: string
  title: string
}

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.04 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  },
}

export default function AdminEnrollmentsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([])
  const [users, setUsers] = useState<UserBrief[]>([])
  const [courses, setCourses] = useState<CourseBrief[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newUserId, setNewUserId] = useState("")
  const [newCourseId, setNewCourseId] = useState("")
  const [newStatus, setNewStatus] = useState("ACTIVE")
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    if (!isAdmin) return
    async function load() {
      try {
        const [eRes, uRes, cRes] = await Promise.all([
          fetch("/api/admin/enrollments"),
          fetch("/api/admin/users"),
          fetch("/api/admin/courses"),
        ])
        if (eRes.ok) setEnrollments(await eRes.json())
        if (uRes.ok) setUsers(await uRes.json())
        if (cRes.ok) setCourses(await cRes.json())
      } catch {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [isAdmin])

  async function handleCreateEnrollment() {
    if (!newUserId || !newCourseId) {
      toast.error("Please select a user and course")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/admin/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: newUserId, courseId: newCourseId, status: newStatus }),
      })
      if (!res.ok) throw new Error(await res.text())
      const created = await res.json()
      setEnrollments((prev) => [created, ...prev])
      toast.success("Enrollment created")
      setShowCreateForm(false)
      setNewUserId("")
      setNewCourseId("")
      setNewStatus("ACTIVE")
    } catch (err: any) {
      toast.error(err.message || "Failed to create enrollment")
    } finally {
      setCreating(false)
    }
  }

  function handleExportCSV() {
    const filtered = filteredEnrollments
    const header = "User Name,Email,Course,Status,Enrolled Date\n"
    const rows = filtered
      .map(
        (e) =>
          `"${e.user.name || ""}","${e.user.email}","${e.course.title}","${e.status}","${new Date(e.enrolledAt).toLocaleDateString()}"`
      )
      .join("\n")
    const blob = new Blob([header + rows], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "enrollments.csv"
    a.click()
    URL.revokeObjectURL(url)
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

  const filteredEnrollments =
    statusFilter === "ALL"
      ? enrollments
      : enrollments.filter((e) => e.status === statusFilter)

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-6">
        <motion.div variants={stagger.item} className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enrollment Management</h1>
            <p className="mt-1 text-gray-500">Bulk enrollment and status management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Enrollment
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </motion.div>

        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <h3 className="mb-4 text-lg font-semibold text-gray-900">New Enrollment</h3>
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">User</label>
                <select
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  <option value="">Select user</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Course</label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  <option value="">Select course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-600">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none"
                >
                  {["ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleCreateEnrollment}
                  disabled={creating}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Create
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            {["ALL", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  statusFilter === s
                    ? "bg-indigo-100 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {s === "ALL" ? "All" : s}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Course</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filteredEnrollments.map((e) => (
                  <tr key={e.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{e.user.name || "Unnamed"}</p>
                      <p className="text-xs text-gray-400">{e.user.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{e.course.title}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                          e.status === "ACTIVE" && "bg-emerald-50 text-emerald-700",
                          e.status === "COMPLETED" && "bg-blue-50 text-blue-700",
                          e.status === "EXPIRED" && "bg-amber-50 text-amber-700",
                          e.status === "CANCELLED" && "bg-red-50 text-red-700"
                        )}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">{new Date(e.enrolledAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {filteredEnrollments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-sm text-gray-400">
                      No enrollments found
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
