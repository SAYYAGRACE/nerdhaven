import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const examSlug = searchParams.get("exam")
  const subjectSlug = searchParams.get("subject")
  const year = searchParams.get("year")
  const difficulty = searchParams.get("difficulty")
  const search = searchParams.get("search")

  const where: any = {}
  if (examSlug) where.exam = { slug: examSlug }
  if (subjectSlug) where.subject = { slug: subjectSlug }
  if (year) where.year = parseInt(year)
  if (difficulty) where.difficulty = difficulty.toUpperCase()
  if (search) where.question = { contains: search }

  const questions = await prisma.pastQuestion.findMany({
    where,
    include: { subject: { select: { name: true, slug: true } }, exam: { select: { name: true, slug: true } } },
    orderBy: [{ year: "desc" }, { difficulty: "asc" }],
    take: 50,
  })
  return NextResponse.json(questions)
}
