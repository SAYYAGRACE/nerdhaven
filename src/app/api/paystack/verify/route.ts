import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { verifyTransaction } from "@/lib/paystack"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const reference = request.nextUrl.searchParams.get("reference")
    if (!reference) {
      return NextResponse.json({ error: "reference is required" }, { status: 400 })
    }

    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
      include: { course: true },
    })

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const result = await verifyTransaction(reference)
    if (!result.status || !result.data) {
      return NextResponse.json({ status: "failed", error: result.message || "Verification failed" })
    }

    const paystackStatus = result.data.status
    const verifiedAmount = result.data.amount
    const verifiedCurrency = result.data.currency

    if (paystackStatus === "success") {
      if (verifiedAmount !== payment.amountInKobo || verifiedCurrency !== payment.currency) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        })
        await prisma.paymentStateTransition.create({
          data: {
            paymentId: payment.id,
            fromStatus: payment.status,
            toStatus: "FAILED",
            reason: "Amount/currency mismatch",
          },
        })
        return NextResponse.json({ status: "failed", data: { reason: "Amount mismatch" } })
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
          reason: "Paystack verify confirmed",
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

      const course = await prisma.course.findUnique({ where: { id: payment.courseId } })
      return NextResponse.json({
        status: "success",
        data: {
          reference,
          amount: verifiedAmount,
          currency: verifiedCurrency,
          courseName: course?.title || null,
        },
      })
    }

    if (paystackStatus === "failed" || paystackStatus === "reversed") {
      return NextResponse.json({ status: "failed", data: { status: paystackStatus } })
    }

    return NextResponse.json({ status: "pending", data: { status: paystackStatus } })
  } catch (error) {
    console.error("Paystack verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
