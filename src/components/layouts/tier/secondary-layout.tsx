"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  Calendar,
  Library,
  LogOut,
  GraduationCap,
  BookMarked,
  ChevronLeft,
  Flame,
} from "lucide-react"
import { motion } from "framer-motion"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/secondary/dashboard" },
  { icon: BookOpen, label: "Exams", href: "/secondary/exams" },
  { icon: FileText, label: "Past Questions", href: "/secondary/past-questions" },
  { icon: Calendar, label: "Study Plan", href: "/secondary/study-plan" },
  { icon: Library, label: "Resources", href: "/secondary/resources" },
]

export default function SecondaryLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        className="relative flex shrink-0 flex-col border-r border-slate-200 bg-white"
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-100 px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <BookMarked className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm font-bold text-slate-800"
            >
              Study Hub
            </motion.span>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-blue-600" : "text-slate-400")} />
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {item.label}
                  </motion.span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 px-2 py-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>
      </motion.aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>7-day streak</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-700">{session?.user?.name || "Student"}</p>
              <p className="text-xs text-slate-400">Secondary</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "S"}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
