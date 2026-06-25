import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

async function verifySignature(
  body: string,
  signature: string | null
): Promise<boolean> {
  if (!signature) return false
  const secret = process.env.PAYSTACK_SECRET_KEY
  if (!secret) return false

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const messageData = encoder.encode(body)

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  )

  const signatureBytes = await crypto.subtle.sign("HMAC", key, messageData)
  const computedSignature = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")

  return timingSafeEqual(computedSignature, `sha512=${signature}`)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("x-paystack-signature")

    const isValid = await verifySignature(body, signature)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    let event: any
    try {
      event = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }

    const providerEventId = `${event.id || "unknown"}-${event.event || "unknown"}`

    const existing = await prisma.paymentEvent.findUnique({
      where: { provider_providerEventId: { provider: "paystack", providerEventId } },
    })
    if (existing) {
      return NextResponse.json({ status: "duplicate" }, { status: 200 })
    }

    await prisma.paymentEvent.create({
      data: {
        provider: "paystack",
        providerEventId,
        type: event.event || "unknown",
        data: JSON.stringify(event),
      },
    })

    if (event.event === "charge.success") {
      const paystackRef = event.data?.reference
      if (!paystackRef) {
        return NextResponse.json({ error: "Missing reference" }, { status: 400 })
      }

      const payment = await prisma.payment.findUnique({
        where: { providerReference: paystackRef },
      })

      if (!payment) {
        console.error(`No payment found for reference: ${paystackRef}`)
        return NextResponse.json({ status: "ignored", reason: "payment_not_found" }, { status: 200 })
      }

      if (payment.status === "SUCCESS") {
        return NextResponse.json({ status: "duplicate", reason: "already_success" }, { status: 200 })
      }

      const paystackAmount = event.data?.amount
      const paystackCurrency = event.data?.currency

      if (paystackAmount !== payment.amountInKobo || paystackCurrency !== payment.currency) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "FAILED" },
        })
        await prisma.paymentStateTransition.create({
          data: {
            paymentId: payment.id,
            fromStatus: payment.status,
            toStatus: "FAILED",
            reason: "Webhook amount/currency mismatch",
          },
        })
        return NextResponse.json({ status: "failed", reason: "amount_mismatch" }, { status: 200 })
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
          reason: "Webhook charge.success",
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
    }

    return NextResponse.json({ status: "success" }, { status: 200 })
  } catch (error) {
    console.error("Paystack webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
