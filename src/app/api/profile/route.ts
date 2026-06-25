import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET() {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  })
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { name, displayName, phone } = body
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: {
      name: name ?? undefined,
      profile: {
        upsert: {
          create: { displayName: displayName ?? null, phone: phone ?? null, tier: "PRIMARY" },
          update: { displayName: displayName ?? undefined, phone: phone ?? undefined },
        },
      },
    },
    include: { profile: true },
  })
  return NextResponse.json(user)
}
