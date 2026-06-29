"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  CheckSquare,
  TrendingUp,
  User,
  LogOut,
  Building2,
  Menu,
  X,
  Bell,
  ArrowUpRight,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/founder" },
  { icon: BarChart3, label: "KPIs", href: "/founder/kpis" },
  { icon: BookOpen, label: "Courses", href: "/founder/courses" },
  { icon: CheckSquare, label: "Compliance", href: "/founder/compliance" },
  { icon: TrendingUp, label: "Growth", href: "/founder/growth" },
  { icon: User, label: "Profile", href: "/founder/profile" },
]

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      <aside className="hidden w-64 flex-col border-r border-gray-800 bg-gray-900/50 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-gray-800 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-900/20">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-white">Nerdhaven</span>
            <p className="text-xs font-medium text-amber-500/80">Executive Portal</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-amber-500/10 text-amber-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-amber-400" : "text-gray-500")} />
                {item.label}
                {isActive && <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-amber-400" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-800 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-xs font-bold text-white shadow">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "F"}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{session?.user?.name || "Founder"}</p>
              <p className="text-xs text-gray-500">Executive</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900/50 px-4 backdrop-blur-xl lg:px-6">
          <button onClick={() => setMobileNav(true)} className="text-gray-400 hover:text-gray-200 lg:hidden">
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden items-center gap-4 text-sm text-gray-500 lg:flex">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              All systems operational
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-200">
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-3 py-2 text-sm font-medium text-gray-400 transition-all hover:border-gray-600 hover:text-gray-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Exit</span>
            </button>
          </div>
        </header>

        {mobileNav && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileNav(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-gray-900 shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-800 px-5 py-4">
                <span className="text-sm font-bold text-white">Executive Portal</span>
                <button onClick={() => setMobileNav(false)} className="text-gray-400 hover:text-gray-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNav(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-950 p-6">{children}</main>
      </div>
    </div>
  )
}
