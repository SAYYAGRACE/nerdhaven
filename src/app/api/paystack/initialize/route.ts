import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { initializeTransaction } from "@/lib/paystack"
import { absoluteUrl } from "@/lib/utils"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { courseId } = await request.json()
    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 })
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } })
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    if (!course.published) {
      return NextResponse.json({ error: "Course is not available for purchase" }, { status: 400 })
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.user.id, courseId } },
    })
    if (existingEnrollment?.status === "ACTIVE") {
      return NextResponse.json({ error: "Already enrolled in this course" }, { status: 409 })
    }

    const payment = await prisma.payment.create({
      data: {
        userId: session.user.id,
        courseId,
        amountInKobo: course.priceInKobo,
        currency: course.currency || "NGN",
        status: "INITIATED",
      },
    })

    const result = await initializeTransaction({
      email: session.user.email,
      amountInKobo: course.priceInKobo,
      metadata: {
        userId: session.user.id,
        courseId,
        paymentId: payment.id,
      },
      callbackUrl: absoluteUrl(`/checkout/${courseId}/return`),
    })

    if (!result.status || !result.data) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      })
      return NextResponse.json({ error: result.message || "Payment initialization failed" }, { status: 502 })
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerReference: result.data.reference,
        status: "PENDING",
      },
    })

    await prisma.paymentStateTransition.create({
      data: {
        paymentId: payment.id,
        fromStatus: "INITIATED",
        toStatus: "PENDING",
        reason: "Paystack initialize success",
      },
    })

    return NextResponse.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    })
  } catch (error) {
    console.error("Paystack initialize error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
