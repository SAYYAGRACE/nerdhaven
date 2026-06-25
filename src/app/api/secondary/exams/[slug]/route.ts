import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const exam = await prisma.exam.findUnique({
    where: { slug },
    include: {
      subjects: {
        include: { _count: { select: { pastQuestions: true } } },
        orderBy: { name: "asc" },
      },
      resources: { where: { free: true }, take: 5 },
    },
  })
  if (!exam) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(exam)
}
