"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import PrimaryLayout from "@/components/layouts/tier/primary-layout"
import SecondaryLayout from "@/components/layouts/tier/secondary-layout"
import UniversityLayout from "@/components/layouts/tier/university-layout"
import BusinessLayout from "@/components/layouts/tier/business-layout"
import AdminLayout from "@/components/layouts/tier/admin-layout"

type Tier = "PRIMARY" | "SECONDARY" | "UNIVERSITY" | "BUSINESS"

const layouts: Record<Tier, React.FC<{ children: React.ReactNode }>> = {
  PRIMARY: PrimaryLayout,
  SECONDARY: SecondaryLayout,
  UNIVERSITY: UniversityLayout,
  BUSINESS: BusinessLayout,
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()

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

  if ((session.user as any)?.role === "ADMIN") {
    return <AdminLayout>{children}</AdminLayout>
  }

  const tier = ((session.user as any)?.tier || "PRIMARY") as Tier
  const Layout = layouts[tier] || PrimaryLayout

  return <Layout>{children}</Layout>
}
