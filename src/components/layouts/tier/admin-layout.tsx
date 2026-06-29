"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BookOpen,
  MessageSquare,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  GraduationCap,
  Bell,
  UserCheck,
  BarChart3,
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin", exact: true },
  { icon: Users, label: "Users", href: "/admin?tab=users" },
  { icon: BookOpen, label: "Courses", href: "/admin/courses" },
  { icon: CreditCard, label: "Payments", href: "/admin?tab=payments" },
  { icon: UserCheck, label: "Enrollments", href: "/admin/enrollments" },
  { icon: MessageSquare, label: "Messages", href: "/admin?tab=messages" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileNav, setMobileNav] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white shadow-sm lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-gray-100 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-800 shadow">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-sm font-bold text-gray-900">Admin Panel</span>
            <p className="text-xs font-medium text-indigo-600">Nerdhaven</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-indigo-600" : "text-gray-400")} />
                {item.label}
                {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-xs font-bold text-white shadow">
              {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileNav(true)} className="text-gray-500 hover:text-gray-700 lg:hidden">
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden h-8 w-px bg-gray-200 lg:block" />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 hover:text-gray-800"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {mobileNav && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileNav(false)} />
            <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <span className="text-sm font-bold text-gray-900">Admin Panel</span>
                <button onClick={() => setMobileNav(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="space-y-1 px-3 py-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNav(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  >
                    <item.icon className="h-5 w-5 text-gray-400" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
