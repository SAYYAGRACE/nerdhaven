import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { sendEmail, contactAutoReplyHtml } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!email || !message) {
      return NextResponse.json({ error: "Email and message are required" }, { status: 400 })
    }

    const senderName = name || "Anonymous"

    await prisma.contactMessage.create({
      data: { name: senderName, email, subject, message },
    })

    const autoReply = await sendEmail(email, "We received your message — Nerdhaven", contactAutoReplyHtml(senderName))

    return NextResponse.json({
      success: true,
      stored: true,
      autoReplySent: autoReply.sent,
      autoReplyError: autoReply.error,
    })
  } catch (error: any) {
    console.error("Contact form error:", error?.message || error?.toString?.() || error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
