import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  const exams = await prisma.exam.findMany({
    include: { _count: { select: { subjects: true, pastQuestions: true } } },
    orderBy: { name: "asc" },
  })
  return NextResponse.json(exams)
}
