import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, description: true, priceInKobo: true, tier: true, currency: true },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    return NextResponse.json(course)
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
