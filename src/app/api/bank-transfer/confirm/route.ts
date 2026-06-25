import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { paymentId } = await request.json()
    if (!paymentId || typeof paymentId !== "string") {
      return NextResponse.json({ error: "paymentId is required" }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } })
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    if (payment.status !== "PENDING") {
      return NextResponse.json({ error: "Payment is not in PENDING status" }, { status: 400 })
    }

    if (payment.provider !== "bank_transfer") {
      return NextResponse.json({ error: "Payment is not a bank transfer" }, { status: 400 })
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCESS" },
    })

    await prisma.paymentStateTransition.create({
      data: {
        paymentId: payment.id,
        fromStatus: "PENDING",
        toStatus: "SUCCESS",
        reason: "Bank transfer confirmed by admin",
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
        provider: "bank_transfer",
        providerEventId: `admin-confirm-${paymentId}`,
        type: "bank_transfer.confirmed",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Bank transfer confirm error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
