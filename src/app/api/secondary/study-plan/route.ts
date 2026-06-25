import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const plans = await prisma.studyPlan.findMany({
    where: { userId: user.id },
    include: { exam: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(plans)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const { examSlug, targetDate, dailyHours, subjects } = body

  const exam = examSlug ? await prisma.exam.findUnique({ where: { slug: examSlug } }) : null
  if (!exam && examSlug) return NextResponse.json({ error: "Exam not found" }, { status: 404 })

  const plan = await prisma.studyPlan.create({
    data: {
      userId: user.id,
      examId: exam?.id || "",
      targetDate: targetDate ? new Date(targetDate) : null,
      dailyHours: dailyHours || 2,
      subjects: subjects ? JSON.stringify(subjects) : null,
    },
  })
  return NextResponse.json(plan)
}
