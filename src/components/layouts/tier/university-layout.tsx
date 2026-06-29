"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FlaskConical,
  BookOpen,
  Code2,
  Network,
  User,
  LogOut,
  GraduationCap,
  Search,
  Bell,
  Library,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/scholar" },
  { icon: FlaskConical, label: "Research", href: "/scholar/research" },
  { icon: BookOpen, label: "Courses", href: "/scholar/courses" },
  { icon: Code2, label: "Labs", href: "/scholar/labs" },
  { icon: Network, label: "Network", href: "/scholar/network" },
  { icon: User, label: "Profile", href: "/scholar/profile" },
]

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <aside className="flex w-16 flex-col border-r border-slate-800 bg-slate-900 lg:w-64">
        <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="hidden text-sm font-semibold tracking-wide text-white lg:block">
            SCHOLAR
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all lg:justify-start",
                  isActive
                    ? "bg-indigo-500/10 text-indigo-400"
                    : "text-slate-500 hover:bg-slate-800 hover:text-slate-300",
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-indigo-400")} />
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-800 px-4 py-4">
          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-slate-200">{session?.user?.name || "Researcher"}</p>
              <p className="text-xs text-slate-500">Scholar</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-slate-800 bg-slate-900/50 px-6 backdrop-blur-xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
            <input
              type="text"
              placeholder="Search research papers, courses..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-indigo-500" />
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-400 transition-all hover:border-slate-600 hover:text-slate-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden lg:inline">Sign Out</span>
          </button>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-950 p-6">{children}</main>
      </div>
    </div>
  )
}
