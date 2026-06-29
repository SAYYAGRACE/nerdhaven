import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await request.json()
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const course = await prisma.course.findFirst({
      where: { OR: [{ id: courseId }, { slug: courseId }] },
    })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (!course.published) {
      return NextResponse.json({ error: "Course is not available for purchase" }, { status: 400 })
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId: course.id } },
    })
    if (existingEnrollment?.status === "ACTIVE") {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId: course.id,
        amountInKobo: course.priceInKobo,
        provider: "bank_transfer",
        status: "PENDING",
        metadata: JSON.stringify({ paymentMethod: "bank_transfer", submittedAt: new Date().toISOString() }),
      },
    })

    await prisma.paymentStateTransition.create({
      data: {
        paymentId: payment.id,
        fromStatus: "INITIATED",
        toStatus: "PENDING",
        reason: "Bank transfer submitted, awaiting confirmation",
      },
    })

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      message: "Payment submitted. Admin will confirm after transfer clears.",
    })
  } catch (error) {
    console.error("Bank transfer submit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
