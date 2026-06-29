"use client"

import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"

export default function SettingsPage() {
  const { data: session } = useSession()

  if (!session) {
    redirect("/auth/signin")
    return null
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Manage your account settings and preferences.</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Profile</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <p className="mt-1 text-gray-900">{session.user?.name || "Not set"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{session.user?.email}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-gray-900">{(session.user as any)?.role || "STUDENT"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Tier</label>
            <p className="mt-1 text-gray-900">{(session.user as any)?.tier || "PRIMARY"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
