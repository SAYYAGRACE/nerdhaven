import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    let paymentId = body.paymentId as string | undefined
    const userId = body.userId as string | undefined
    const courseId = body.courseId as string | undefined
    const amountInKobo = body.amountInKobo as number | undefined

    if (paymentId) {
      const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
      if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 })
      }

      if (payment.status !== "PENDING" && payment.status !== "INITIATED") {
        return NextResponse.json({ error: "Payment cannot be confirmed" }, { status: 400 })
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "SUCCESS" },
      })

      await prisma.paymentStateTransition.create({
        data: {
          paymentId: payment.id,
          fromStatus: payment.status,
          toStatus: "SUCCESS",
          reason: "Manually marked as paid by admin",
        },
      })

      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: payment.userId, courseId: payment.courseId } },
        update: { status: "ACTIVE" },
        create: {
          userId: payment.userId,
          courseId: payment.courseId,
          status: "ACTIVE",
        },
      })

      await prisma.paymentEvent.create({
        data: {
          provider: "manual",
          providerEventId: `admin-mark-paid-${payment.id}`,
          type: "payment.manually_confirmed",
        },
      })
    } else if (userId && courseId && typeof amountInKobo === "number") {
      const newPayment = await prisma.payment.create({
        data: {
          userId,
          courseId,
          amountInKobo,
          provider: "manual",
          status: "SUCCESS",
          metadata: JSON.stringify({ markedPaidBy: session.user.id, markedPaidAt: new Date().toISOString() }),
        },
      })

      await prisma.paymentStateTransition.create({
        data: {
          paymentId: newPayment.id,
          fromStatus: "INITIATED",
          toStatus: "SUCCESS",
          reason: "Manually created and marked as paid by admin",
        },
      })

      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { status: "ACTIVE" },
        create: {
          userId,
          courseId,
          status: "ACTIVE",
        },
      })

      await prisma.paymentEvent.create({
        data: {
          provider: "manual",
          providerEventId: `admin-create-paid-${newPayment.id}`,
          type: "payment.manually_created_and_confirmed",
        },
      })
    } else {
      return NextResponse.json({
        error: "Provide either paymentId, or userId + courseId + amountInKobo",
      }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Admin mark paid error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
