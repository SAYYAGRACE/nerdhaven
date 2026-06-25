import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const tier = searchParams.get("tier")
  const published = searchParams.get("published")

  const where: any = {}
  if (tier) where.tier = tier.toUpperCase()
  if (published === "true") where.published = true

  const courses = await prisma.course.findMany({
    where,
    select: {
      id: true, title: true, slug: true, description: true, shortDescription: true,
      tier: true, category: true, difficulty: true, priceInKobo: true, currency: true,
      thumbnailUrl: true, published: true,
      _count: { select: { enrollments: true, curriculumNodes: true } },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(courses)
}
