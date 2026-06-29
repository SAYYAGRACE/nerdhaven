import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const [totalUsers, totalCourses, totalPayments, totalEnrollments, pendingPayments, unreadMessages] =
    await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.payment.count(),
      prisma.enrollment.count(),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.contactMessage.count({ where: { read: false } }),
    ])

  const revenueAgg = await prisma.payment.aggregate({
    _sum: { amountInKobo: true },
    where: { status: "SUCCESS" },
  })

  return NextResponse.json({
    totalUsers,
    totalCourses,
    totalPayments,
    totalEnrollments,
    pendingPayments,
    unreadMessages,
    revenueInKobo: revenueAgg._sum.amountInKobo || 0,
  })
}
