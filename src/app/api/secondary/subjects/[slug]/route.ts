import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      exam: true,
      pastQuestions: { orderBy: [{ year: "desc" }, { difficulty: "asc" }] },
      resources: true,
    },
  })
  if (!subject) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(subject)
}
