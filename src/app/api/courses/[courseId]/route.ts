import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const session = await auth()

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { id: courseId },
          { slug: courseId },
        ],
      },
      select: {
        id: true, title: true, slug: true, description: true, shortDescription: true,
        priceInKobo: true, tier: true, currency: true, difficulty: true,
        thumbnailUrl: true, published: true,
        curriculumNodes: {
          orderBy: { order: "asc" },
          include: {
            children: { orderBy: { order: "asc" } },
          },
        },
        resources: {
          select: { id: true, title: true, type: true, url: true, description: true, free: true, fileSize: true, duration: true, downloads: true },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { enrollments: true, curriculumNodes: true, resources: true } },
      },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    let isEnrolled = false
    if (session?.user?.id) {
      const enrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
        select: { status: true },
      })
      isEnrolled = enrollment?.status === "ACTIVE"
    }

    return NextResponse.json({ ...course, isEnrolled })
  } catch (error) {
    console.error("Error fetching course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
