"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Home, BookOpen, Award, User, LogOut, Sparkles, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { icon: Home, label: "Home", href: "/youth", color: "from-emerald-400 to-emerald-500" },
  { icon: BookOpen, label: "My Courses", href: "/youth/courses", color: "from-sky-400 to-sky-500" },
  { icon: Award, label: "Leaderboard", href: "/youth/leaderboard", color: "from-amber-400 to-amber-500" },
  { icon: User, label: "Profile", href: "/youth/profile", color: "from-purple-400 to-purple-500" },
]

export default function PrimaryLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/youth" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-emerald-900">Nerdhaven</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100 hover:text-emerald-900"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="hidden items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-sm font-medium text-emerald-600 transition-all hover:bg-emerald-50 md:flex"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-emerald-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-emerald-600" />
                  <span className="font-bold text-emerald-900">Nerdhaven</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="rounded-lg p-1 hover:bg-emerald-50">
                  <X className="h-5 w-5 text-emerald-600" />
                </button>
              </div>
              <div className="px-3 py-4">
                {navItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-800 transition-all hover:bg-emerald-50"
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${item.color} shadow`}>
                      <item.icon className="h-4 w-4 text-white" />
                    </div>
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-emerald-100 px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-sm font-bold text-white shadow">
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-900">{session?.user?.name || "Explorer"}</p>
                    <p className="text-xs text-emerald-500">Primary</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
