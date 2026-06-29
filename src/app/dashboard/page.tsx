import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const role = (session.user as any)?.role
  const tier = (session.user as any)?.tier

  if (role === "ADMIN") {
    redirect("/admin")
  }

  switch (tier) {
    case "SECONDARY":
      redirect("/secondary/dashboard")
    case "UNIVERSITY":
      redirect("/scholar")
    case "BUSINESS":
      redirect("/founder")
    default:
      redirect("/youth")
  }
}
