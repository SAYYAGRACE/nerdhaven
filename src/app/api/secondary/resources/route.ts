import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const examSlug = searchParams.get("exam")
  const subjectSlug = searchParams.get("subject")
  const type = searchParams.get("type")
  const free = searchParams.get("free")

  const where: any = {}
  if (examSlug) where.exam = { slug: examSlug }
  if (subjectSlug) where.subject = { slug: subjectSlug }
  if (type) where.type = type.toUpperCase()
  if (free === "true") where.free = true

  const resources = await prisma.studyResource.findMany({
    where,
    include: { exam: { select: { name: true, slug: true } }, subject: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(resources)
}
