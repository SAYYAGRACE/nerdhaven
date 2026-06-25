"use client"

import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  BookOpen,
  ShieldAlert,
  Loader2,
  ChevronDown,
  Building2,
  Copy,
  ExternalLink,
} from "lucide-react"
import { cn, formatNaira } from "@/lib/utils"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  },
}

interface UserBrief {
  id: string
  name: string | null
  email: string
}

interface PaymentRecord {
  id: string
  user: { name: string | null; email: string }
  course: { title: string }
  amountInKobo: number
  status: string
  provider: string
  providerReference: string | null
  createdAt: string
}

interface EnrollmentRecord {
  id: string
  user: { name: string | null; email: string }
  course: { title: string }
  status: string
  enrolledAt: string
}

function timeAgo(dateString: string): string {
  const now = Date.now()
  const then = new Date(dateString).getTime()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"

  const [users, setUsers] = useState<UserBrief[]>([])
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [enrollments, setEnrollments] = useState<EnrollmentRecord[]>([])
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUserId, setSelectedUserId] = useState("")
  const [selectedCourseId, setSelectedCourseId] = useState("")
  const [manualAmount, setManualAmount] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    if (!isAdmin) return
    try {
      const [uRes, pRes, eRes, cRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/enrollments"),
        fetch("/api/admin/courses"),
      ])
      if (uRes.ok) setUsers(await uRes.json())
      if (pRes.ok) setPayments(await pRes.json())
      if (eRes.ok) setEnrollments(await eRes.json())
      if (cRes.ok) setCourses(await cRes.json())
    } catch {
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleManualMarkPaid() {
    if (!selectedUserId || !selectedCourseId || !manualAmount) {
      toast.error("Please fill all fields")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          courseId: selectedCourseId,
          amountInKobo: parseInt(manualAmount) * 100,
        }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Payment marked as paid")
      setSelectedUserId("")
      setSelectedCourseId("")
      setManualAmount("")
    } catch (err: any) {
      toast.error(err.message || "Failed to mark as paid")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleMarkPendingPaid(paymentId: string) {
    try {
      const res = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Payment updated")
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "SUCCESS" } : p))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to update")
    }
  }

  async function handleConfirmBankTransfer(paymentId: string) {
    setConfirmingId(paymentId)
    try {
      const res = await fetch("/api/bank-transfer/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
      if (res.status === 404) {
        toast.error("Bank transfer confirmation endpoint not available")
        return
      }
      if (!res.ok) throw new Error((await res.json()).error || "Failed to confirm")
      toast.success("Bank transfer confirmed")
      setPayments((prev) =>
        prev.map((p) => (p.id === paymentId ? { ...p, status: "SUCCESS" } : p))
      )
    } catch (err: any) {
      toast.error(err.message || "Failed to confirm transfer")
    } finally {
      setConfirmingId(null)
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
        <p className="text-gray-500">You do not have administrator permissions.</p>
      </div>
    )
  }

  const pendingPayments = payments.filter((p) => p.status === "PENDING" || p.status === "INITIATED")
  const bankTransfers = payments.filter((p) => p.provider === "bank_transfer" && p.status === "PENDING")

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="min-h-screen bg-gray-50 p-6 lg:p-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <motion.div variants={stagger.item}>
          <h1 className="text-3xl font-bold text-gray-900">Admin Reconciliation</h1>
          <p className="mt-1 text-gray-500">Manage payments, enrollments, and users</p>
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Manual Mark as Paid</h2>
          <div className="grid gap-4 sm:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">User</label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
              <label className="mb-1 block text-sm font-medium text-gray-600">Amount (₦)</label>
              <input
                type="number"
                value={manualAmount}
                onChange={(e) => setManualAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleManualMarkPaid}
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                Mark as Paid
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Pending Payments ({pendingPayments.length})</h2>
          </div>
          {pendingPayments.length === 0 ? (
            <p className="text-sm text-gray-400">No pending payments</p>
          ) : (
            <div className="space-y-2">
              {pendingPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.user.name || p.user.email}</p>
                      <p className="text-xs text-gray-500">{p.course.title} · {formatNaira(p.amountInKobo)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkPendingPaid(p.id)}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Mark Paid
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Bank Transfer Queue ({bankTransfers.length})
            </h2>
          </div>
          {bankTransfers.length === 0 ? (
            <p className="text-sm text-gray-400">No pending bank transfers</p>
          ) : (
            <div className="space-y-2">
              {bankTransfers.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.user.name || p.user.email}</p>
                      <p className="text-xs text-gray-500">
                        {p.course.title} · {formatNaira(p.amountInKobo)} · {timeAgo(p.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleConfirmBankTransfer(p.id)}
                    disabled={confirmingId === p.id}
                    size="sm"
                    variant="primary"
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {confirmingId === p.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5" />
                    )}
                    Confirm Payment
                  </Button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Payment Log</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">User</th>
                  <th className="pb-3 pr-4 font-medium">Course</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Provider</th>
                  <th className="pb-3 pr-4 font-medium">Reference</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.slice(0, 20).map((p) => (
                  <tr key={p.id} className="border-b border-gray-50">
                    <td className="py-3 pr-4 text-gray-900">{p.user.name || p.user.email}</td>
                    <td className="py-3 pr-4 text-gray-600">{p.course.title}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">{formatNaira(p.amountInKobo)}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          p.status === "SUCCESS" && "bg-emerald-50 text-emerald-700",
                          p.status === "FAILED" && "bg-red-50 text-red-700",
                          (p.status === "PENDING" || p.status === "INITIATED") && "bg-amber-50 text-amber-700"
                        )}
                      >
                        {p.status === "SUCCESS" && <CheckCircle className="h-3 w-3" />}
                        {p.status === "FAILED" && <XCircle className="h-3 w-3" />}
                        {(p.status === "PENDING" || p.status === "INITIATED") && <Clock className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      {p.provider === "bank_transfer" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                          <Building2 className="h-3 w-3" />
                          bank_transfer
                        </span>
                      ) : (
                        <span className="text-gray-500">{p.provider}</span>
                      )}
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs text-gray-400">{p.providerReference || "—"}</td>
                    <td className="py-3 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div variants={stagger.item} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">User Search</h2>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>
          <div className="space-y-2">
            {users
              .filter(
                (u) =>
                  u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 10)
              .map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-gray-50">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{u.name || "Unnamed"}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
