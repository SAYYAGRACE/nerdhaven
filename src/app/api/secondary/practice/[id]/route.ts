import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const test = await prisma.practiceTest.findUnique({ where: { id } })
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const questions = await prisma.pastQuestion.findMany({
    where: test.subjectId ? { subjectId: test.subjectId } : test.examId ? { examId: test.examId } : {},
    take: test.questionCount,
    orderBy: { year: "desc" },
  })

  const safeQuestions = questions.map(q => ({
    id: q.id,
    question: q.question,
    options: JSON.parse(q.options || "[]"),
    year: q.year,
    difficulty: q.difficulty,
    ...(test.status === "COMPLETED" ? { correctAnswer: q.correctAnswer, explanation: q.explanation } : {}),
  }))

  return NextResponse.json({ test, questions: safeQuestions })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { answers } = body

  const test = await prisma.practiceTest.findUnique({ where: { id } })
  if (!test) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (test.status !== "IN_PROGRESS") return NextResponse.json({ error: "Test already completed" }, { status: 400 })

  let score = 0
  for (const answer of answers) {
    const question = await prisma.pastQuestion.findUnique({ where: { id: answer.questionId } })
    if (question && question.correctAnswer === answer.selectedAnswer) score++
  }

  await prisma.practiceTest.update({
    where: { id },
    data: {
      status: "COMPLETED",
      score,
      maxScore: test.questionCount,
      answers: JSON.stringify(answers),
      completedAt: new Date(),
    },
  })

  return NextResponse.json({ score, maxScore: test.questionCount, percentage: Math.round((score / test.questionCount) * 100) })
}
