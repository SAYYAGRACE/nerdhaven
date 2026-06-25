"use client"

import Link from "next/link"
import { GraduationCap } from "lucide-react"

const quickLinks = [
  { href: "/courses", label: "All Courses" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
]

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/refund", label: "Refund Policy" },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-indigo-400" />
              <span className="text-xl font-bold text-white">Nerdhaven</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              The unified learning ecosystem powered by Adaptive Cognitive Mapping. From primary
              scholars to business founders — one platform, four distinct minds.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Legal
            </h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">
              Contact
            </h3>
            <p className="text-sm text-gray-400">nextwavehq@outlook.com</p>
            <p className="text-sm text-gray-400">Kaduna, Nigeria</p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6">
          <p className="text-center text-xs leading-relaxed text-gray-500">
            &copy; 2026 Nerdhaven. All Rights Reserved. This platform, its proprietary curriculum
            mapping algorithms, and all associated media are protected under international copyright
            laws. Copyright owned by Nextwave Infotech.
          </p>
        </div>
      </div>
    </footer>
  )
}
