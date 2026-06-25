"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { motion } from "framer-motion"
import { Save, LogOut, Loader2, BadgeCheck, User } from "lucide-react"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.06 } } },
  item: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  },
}

interface ProfileData {
  id: string
  name: string | null
  email: string
  role: string
  profile: { tier: string; displayName: string | null; phone: string | null } | null
}

export default function FounderProfile() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [name, setName] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [phone, setPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data)
        setName(data.name || "")
        setDisplayName(data.profile?.displayName || "")
        setPhone(data.profile?.phone || "")
        setLoading(false)
      })
      .catch(() => {
        toast.error("Failed to load profile")
        setLoading(false)
      })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, displayName, phone }),
      })
      if (res.ok) {
        toast.success("Profile updated!")
      } else {
        throw new Error("Failed")
      }
    } catch {
      toast.error("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  const initial = session?.user?.name?.charAt(0)?.toUpperCase() || "?"

  return (
    <motion.div
      variants={stagger.container}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-950 p-6 text-white lg:p-10"
    >
      <div className="mx-auto max-w-2xl">
        <motion.div variants={stagger.item} className="mb-8 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-600 to-gray-800 text-3xl font-bold text-white shadow-lg">
            {initial}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sm text-gray-400">{profile?.email}</p>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
            <BadgeCheck className="h-3.5 w-3.5" /> Business Tier
          </span>
        </motion.div>

        <motion.div variants={stagger.item} className="space-y-5 rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Full Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Display Name</label>
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+234..."
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-gray-600 focus:ring-2 focus:ring-gray-700"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-300">Email</label>
            <input
              value={profile?.email || ""}
              disabled
              className="w-full rounded-lg border border-gray-800 bg-gray-800/50 px-4 py-2.5 text-sm text-gray-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-gray-700 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-600 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
