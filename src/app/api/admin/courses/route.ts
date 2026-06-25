import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const courses = await prisma.course.findMany({
      select: { id: true, title: true },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Admin courses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
