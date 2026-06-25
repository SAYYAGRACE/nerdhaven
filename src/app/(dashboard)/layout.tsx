"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Trophy,
  User,
  FlaskConical,
  Code2,
  Network,
  BarChart3,
  TrendingUp,
  CheckSquare,
  Menu,
  X,
  GraduationCap,
  LogOut,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

type Tier = "PRIMARY" | "SECONDARY" | "UNIVERSITY" | "BUSINESS"

interface NavItem {
  icon: any
  label: string
  href: string
}

const tierNav: Record<Tier, { items: NavItem[]; accent: string; sidebarBg: string; iconBg: string }> = {
  PRIMARY: {
    accent: "emerald",
    sidebarBg: "bg-gradient-to-b from-emerald-500 to-emerald-700",
    iconBg: "bg-emerald-400/20",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/youth" },
      { icon: BookOpen, label: "My Courses", href: "/youth/courses" },
      { icon: Award, label: "Achievements", href: "/youth" },
      { icon: Trophy, label: "Leaderboard", href: "/youth" },
      { icon: User, label: "Profile", href: "/youth/profile" },
    ],
  },
  SECONDARY: {
    accent: "blue",
    sidebarBg: "bg-gradient-to-b from-blue-500 to-blue-700",
    iconBg: "bg-blue-400/20",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/secondary/dashboard" },
      { icon: BookOpen, label: "Exams", href: "/secondary/exams" },
      { icon: Award, label: "Past Questions", href: "/secondary/past-questions" },
      { icon: Trophy, label: "Study Plan", href: "/secondary/study-plan" },
      { icon: User, label: "Resources", href: "/secondary/resources" },
    ],
  },
  UNIVERSITY: {
    accent: "slate",
    sidebarBg: "bg-gradient-to-b from-slate-600 to-slate-800",
    iconBg: "bg-slate-500/20",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/scholar" },
      { icon: FlaskConical, label: "Research", href: "/scholar/research" },
      { icon: BookOpen, label: "Courses", href: "/scholar/courses" },
      { icon: Code2, label: "Code Labs", href: "/scholar/labs" },
      { icon: Network, label: "Network", href: "/scholar/network" },
      { icon: User, label: "Profile", href: "/scholar/profile" },
    ],
  },
  BUSINESS: {
    accent: "gray",
    sidebarBg: "bg-gradient-to-b from-gray-800 to-gray-950",
    iconBg: "bg-gray-700/20",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/founder" },
      { icon: BarChart3, label: "KPIs", href: "/founder/kpis" },
      { icon: BookOpen, label: "Courses", href: "/founder/courses" },
      { icon: CheckSquare, label: "Compliance", href: "/founder/compliance" },
      { icon: TrendingUp, label: "Growth", href: "/founder/growth" },
      { icon: User, label: "Profile", href: "/founder/profile" },
    ],
  },
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    )
  }

  if (!session) return null

  const tier = ((session.user as any)?.tier || "PRIMARY") as Tier
  const nav = tierNav[tier] || tierNav.PRIMARY

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {(sidebarOpen || true) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-64 flex-col transition-all lg:static lg:translate-x-0",
              nav.sidebarBg,
              !sidebarOpen && "-translate-x-full lg:translate-x-0",
            )}
          >
            <div className="flex h-16 items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2 text-white">
                <GraduationCap className="h-7 w-7" />
                <span className="text-lg font-bold">Nerdhaven</span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white/70 hover:text-white lg:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {nav.items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-white/10 px-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white",
                    nav.iconBg,
                  )}
                >
                  {session.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium text-white">{session.user?.name}</p>
                  <p className="text-xs text-white/60">{tier.charAt(0) + tier.slice(1).toLowerCase()}</p>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:px-6">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-500 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
