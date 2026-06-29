"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn, formatNaira } from "@/lib/utils"
import toast from "react-hot-toast"
import {
  Users,
  BookOpen,
  CreditCard,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  User,
  Search,
  Loader2,
  Building2,
  Mail,
  ShieldAlert,
  BarChart3,
  ArrowUpRight,
} from "lucide-react"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, transition: { duration: 0.35 } } },
}

interface Stats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  pendingPayments: number
  unreadMessages: number
  revenueInKobo: number
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

interface ContactMessage {
  id: string
  name: string | null
  email: string
  subject: string | null
  message: string
  read: boolean
  createdAt: string
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" /></div>}>
      <AdminDashboard />
    </Suspense>
  )
}

function AdminDashboard() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === "ADMIN"
  const searchParams = useSearchParams()
  const router = useRouter()

  const [stats, setStats] = useState<Stats | null>(null)
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [users, setUsers] = useState<{ id: string; name: string | null; email: string; role: string }[]>([])
  const [loading, setLoading] = useState(true)
  const tab = searchParams.get("tab") || "overview"
  const [searchQuery, setSearchQuery] = useState("")
  const [sendingReport, setSendingReport] = useState(false)

  const loadData = useCallback(async () => {
    if (!isAdmin) return
    try {
      const [sRes, pRes, mRes, uRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/payments"),
        fetch("/api/admin/contact-messages"),
        fetch("/api/admin/users"),
      ])
      if (sRes.ok) setStats(await sRes.json())
      if (pRes.ok) setPayments(await pRes.json())
      if (mRes.ok) setMessages(await mRes.json())
      if (uRes.ok) setUsers(await uRes.json())
    } catch {
      toast.error("Failed to load admin data")
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    loadData()
  }, [loadData])

  async function handleMarkPendingPaid(paymentId: string) {
    try {
      const res = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast.success("Payment marked as paid")
      setPayments((prev) => prev.map((p) => (p.id === paymentId ? { ...p, status: "SUCCESS" } : p)))
    } catch (err: any) {
      toast.error(err.message || "Failed")
    }
  }

  async function toggleMessageRead(id: string, current: boolean) {
    try {
      await fetch("/api/admin/contact-messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !current }),
      })
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: !current } : m)))
    } catch {}
  }

  async function generateReport() {
    setSendingReport(true)
    try {
      const res = await fetch("/api/admin/generate-report", { method: "POST" })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to generate report")
      toast.success(`Report sent to ${data.recipients} recipient(s)`)
    } catch (err: any) {
      toast.error(err.message || "Failed to send report")
    } finally {
      setSendingReport(false)
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

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "payments", label: "Payments", icon: CreditCard, count: stats?.pendingPayments },
    { id: "messages", label: "Messages", icon: MessageSquare, count: stats?.unreadMessages },
    { id: "users", label: "Users", icon: Users },
  ]

  const pendingPayments = payments.filter((p) => p.status === "PENDING" || p.status === "INITIATED")

  return (
    <motion.div variants={stagger.container} initial="initial" animate="animate" className="p-6 lg:p-10">
      <motion.div variants={stagger.item} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-500">Manage your platform, users, and content</p>
        </div>
        <button
          onClick={generateReport}
          disabled={sendingReport}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold shadow-sm transition-all",
            sendingReport
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700",
          )}
        >
          <Mail className="h-4 w-4" />
          {sendingReport ? "Sending..." : "Generate Report"}
        </button>
      </motion.div>

      <motion.div variants={stagger.item} className="mb-8 flex gap-1 rounded-xl bg-white p-1 shadow-sm border border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => router.push(t.id === "overview" ? "/admin" : `/admin?tab=${t.id}`)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
              tab === t.id ? "bg-indigo-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.count !== undefined && t.count > 0 && (
              <span className={cn(
                "ml-1 rounded-full px-2 py-0.5 text-xs font-bold",
                tab === t.id ? "bg-white/20 text-white" : "bg-red-100 text-red-600",
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : tab === "overview" ? (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Users, label: "Total Users", value: stats?.totalUsers ?? 0, color: "bg-blue-500" },
              { icon: BookOpen, label: "Courses", value: stats?.totalCourses ?? 0, color: "bg-emerald-500" },
              { icon: CreditCard, label: "Revenue", value: formatNaira(stats?.revenueInKobo ?? 0), color: "bg-amber-500" },
              { icon: Clock, label: "Pending", value: stats?.pendingPayments ?? 0, color: "bg-red-500" },
            ].map((card) => (
              <div key={card.label} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", card.color, "bg-opacity-15")}>
                    <card.icon className={cn("h-6 w-6", card.color.replace("bg-", "text-"))} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{card.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Pending Payments ({pendingPayments.length})</h2>
<button onClick={() => router.push("/admin?tab=payments")} className="text-sm text-indigo-600 hover:underline">
              View all
            </button>
              </div>
              {pendingPayments.length === 0 ? (
                <p className="text-sm text-gray-400">No pending payments</p>
              ) : (
                <div className="space-y-2">
                  {pendingPayments.slice(0, 5).map((p) => (
                    <div key={p.id} className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{p.user.name || p.user.email}</p>
                        <p className="text-xs text-gray-500">{p.course.title} · {formatNaira(p.amountInKobo)}</p>
                      </div>
                      <button
                        onClick={() => handleMarkPendingPaid(p.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        Mark Paid
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Recent Messages ({stats?.unreadMessages ?? 0} unread)</h2>
<button onClick={() => router.push("/admin?tab=messages")} className="text-sm text-indigo-600 hover:underline">
              View all
            </button>
              </div>
              {messages.length === 0 ? (
                <p className="text-sm text-gray-400">No messages yet</p>
              ) : (
                <div className="space-y-2">
                  {messages.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      onClick={() => toggleMessageRead(m.id, m.read)}
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition hover:bg-gray-50",
                        m.read ? "border-gray-100" : "border-indigo-100 bg-indigo-50/40",
                      )}
                    >
                      <Mail className={cn("mt-0.5 h-4 w-4 shrink-0", m.read ? "text-gray-300" : "text-indigo-500")} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm font-medium", m.read ? "text-gray-700" : "text-gray-900")}>
                          {m.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">{m.message}</p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400">{timeAgo(m.createdAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : tab === "payments" ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">All Payments ({payments.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="px-6 py-3 font-medium">User</th>
                  <th className="px-6 py-3 font-medium">Course</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Provider</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">{p.user.name || p.user.email}</td>
                    <td className="px-6 py-4 text-gray-600">{p.course.title}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatNaira(p.amountInKobo)}</td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                        p.status === "SUCCESS" && "bg-emerald-50 text-emerald-700",
                        p.status === "FAILED" && "bg-red-50 text-red-700",
                        (p.status === "PENDING" || p.status === "INITIATED") && "bg-amber-50 text-amber-700",
                      )}>
                        {p.status === "SUCCESS" && <CheckCircle className="h-3 w-3" />}
                        {p.status === "FAILED" && <XCircle className="h-3 w-3" />}
                        {(p.status === "PENDING" || p.status === "INITIATED") && <Clock className="h-3 w-3" />}
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{p.provider}</td>
                    <td className="px-6 py-4 text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      {(p.status === "PENDING" || p.status === "INITIATED") && (
                        <button
                          onClick={() => handleMarkPendingPaid(p.id)}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : tab === "messages" ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">
              Contact Messages ({messages.filter((m) => !m.read).length} unread)
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {messages.length === 0 ? (
              <p className="p-6 text-sm text-gray-400">No messages yet</p>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => toggleMessageRead(m.id, m.read)}
                  className={cn(
                    "flex cursor-pointer items-start gap-4 px-6 py-4 transition hover:bg-gray-50",
                    !m.read && "bg-indigo-50/30",
                  )}
                >
                  <Mail className={cn("mt-1 h-5 w-5 shrink-0", m.read ? "text-gray-300" : "text-indigo-500")} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-sm font-medium", m.read ? "text-gray-700" : "text-gray-900")}>
                        {m.name || "Anonymous"}
                      </span>
                      {!m.read && <span className="h-2 w-2 rounded-full bg-indigo-500" />}
                    </div>
                    {m.subject && <p className="text-xs text-gray-400">{m.subject}</p>}
                    <p className="mt-1 text-sm text-gray-600">{m.message}</p>
                    <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
                      <span>{m.email}</span>
                      <span>{new Date(m.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={cn("shrink-0 text-xs", m.read ? "text-gray-400" : "text-indigo-600 font-medium")}>
                    {m.read ? "Read" : "Unread"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      ) : tab === "users" ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">All Users ({users.length})</h2>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {users
              .filter(
                (u) =>
                  u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()),
              )
              .map((u) => (
                <div key={u.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white",
                    u.role === "ADMIN" ? "bg-indigo-600" : "bg-gray-400",
                  )}>
                    {u.name?.charAt(0)?.toUpperCase() || u.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{u.name || "Unnamed"}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    u.role === "ADMIN" ? "bg-indigo-50 text-indigo-700" : "bg-gray-100 text-gray-600",
                  )}>
                    {u.role}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ) : null}
    </motion.div>
  )
}
