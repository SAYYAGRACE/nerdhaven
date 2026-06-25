import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const payments = await prisma.payment.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    const result = payments.map((p) => ({
      id: p.id,
      user: p.user,
      course: p.course,
      amountInKobo: p.amountInKobo,
      status: p.status,
      provider: p.provider,
      providerReference: p.providerReference,
      createdAt: p.createdAt,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Admin payments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
