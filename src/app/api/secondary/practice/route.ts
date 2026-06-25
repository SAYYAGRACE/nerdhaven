import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const body = await req.json()
  const { examSlug, subjectSlug, title, questionCount = 10, timeLimit } = body

  const where: any = {}
  if (examSlug) where.exam = { slug: examSlug }
  if (subjectSlug) where.subject = { slug: subjectSlug }

  const allQuestions = await prisma.pastQuestion.findMany({ where })
  const selected = allQuestions.sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, allQuestions.length))

  const test = await prisma.practiceTest.create({
    data: {
      userId: user.id,
      examId: selected[0]?.examId || null,
      subjectId: selected[0]?.subjectId || null,
      title: title || "Practice Test",
      questionCount: selected.length,
      timeLimit: timeLimit || null,
      status: "IN_PROGRESS",
      answers: JSON.stringify(selected.map(q => ({ questionId: q.id, selectedAnswer: null }))),
    },
  })

  const safeQuestions = selected.map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options || "[]"),
    questionType: q.questionType,
    year: q.year,
    difficulty: q.difficulty,
  }))

  return NextResponse.json({ test: { ...test, answers: undefined }, questions: safeQuestions })
}
