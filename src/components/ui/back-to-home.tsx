"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export function BackToHome() {
  const pathname = usePathname()
  if (pathname === "/") return null

  return (
    <Link
      href="/"
      className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm ring-1 ring-gray-200 backdrop-blur transition-all hover:bg-white hover:shadow-md"
      aria-label="Back to home"
    >
      <ArrowLeft className="h-4 w-4 text-gray-700" />
    </Link>
  )
}
