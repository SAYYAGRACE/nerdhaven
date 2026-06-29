import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { sendEmail } from "@/lib/email"
import { generatePdfReport } from "@/lib/pdf-report"

const CEO_EMAIL = "khalifamuhammad091@gmail.com"
const COO_EMAIL = "coo.nextwave@gmail.com"
const HOO_EMAIL = "hoo.nextwave@proton.me"

function monthlyReportHtml(data: {
  month: string
  year: number
  newUsers: number
  totalUsers: number
  newPayments: number
  revenueInKobo: number
  pendingPayments: number
  newEnrollments: number
  totalEnrollments: number
  unreadMessages: number
  newMessages: number
  totalCourses: number
  topCourse: { title: string; enrollments: number } | null
}) {
  const revenueNgn = (data.revenueInKobo / 100).toLocaleString("en-NG", { style: "currency", currency: "NGN" })

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6">
    <tr><td align="center" style="padding:40px 16px">
      <table role="presentation" width="100%" style="max-width:600px;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.08)">
        <tr><td style="background:linear-gradient(135deg,#6366f1,#a855f7);padding:32px 24px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:24px">Nerdhaven Monthly Report</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,.85)">${data.month} ${data.year}</p>
        </td></tr>
        <tr><td style="padding:32px 24px">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6">Here is your monthly platform summary.</p>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <tr>
              <td style="width:50%;padding:12px;background:#f9fafb;border-radius:8px">
                <p style="margin:0;font-size:12px;color:#6b7280">NEW USERS</p>
                <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#111827">${data.newUsers}</p>
                <p style="margin:0;font-size:12px;color:#9ca3af">Total: ${data.totalUsers}</p>
              </td>
              <td style="width:8px"></td>
              <td style="width:50%;padding:12px;background:#f9fafb;border-radius:8px">
                <p style="margin:0;font-size:12px;color:#6b7280">REVENUE</p>
                <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#059669">${revenueNgn}</p>
                <p style="margin:0;font-size:12px;color:#9ca3af">${data.newPayments} payments</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
            <tr>
              <td style="width:50%;padding:12px;background:#f9fafb;border-radius:8px">
                <p style="margin:0;font-size:12px;color:#6b7280">ENROLLMENTS</p>
                <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#111827">${data.newEnrollments}</p>
                <p style="margin:0;font-size:12px;color:#9ca3af">Total: ${data.totalEnrollments}</p>
              </td>
              <td style="width:8px"></td>
              <td style="width:50%;padding:12px;background:#f9fafb;border-radius:8px">
                <p style="margin:0;font-size:12px;color:#6b7280">MESSAGES</p>
                <p style="margin:4px 0 0;font-size:28px;font-weight:700;color:#111827">${data.newMessages}</p>
                <p style="margin:0;font-size:12px;color:#9ca3af">${data.unreadMessages} unread</p>
              </td>
            </tr>
          </table>

          <table role="presentation" width="100%" style="margin-bottom:20px">
            <tr><td style="padding:12px 0;border-top:1px solid #e5e7eb;font-size:14px;color:#6b7280">
              <strong style="color:#374151">Courses:</strong> ${data.totalCourses} total
              ${data.topCourse ? `<br><strong style="color:#374151">Top Course:</strong> ${data.topCourse.title} (${data.topCourse.enrollments} enrollments)` : ""}
            </td></tr>
            <tr><td style="padding:12px 0;border-top:1px solid #e5e7eb;font-size:14px;color:#6b7280">
              <strong style="color:#374151">Pending payments:</strong> ${data.pendingPayments}
            </td></tr>
          </table>

          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="margin:0;color:#6b7280;font-size:13px">This report was auto-generated from the Nerdhaven admin panel.</p>
          <p style="margin:4px 0 0;color:#9ca3af;font-size:12px">© 2026 Nerdhaven · Nextwave Infotech</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// Get the start of the current month
function monthStart() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

export async function POST() {
  const session = await auth()
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  try {
    const start = monthStart()
    const now = new Date()
    const month = now.toLocaleString("default", { month: "long" })
    const year = now.getFullYear()

    const [
      newUsers,
      totalUsers,
      newPayments,
      pendingPayments,
      newEnrollments,
      totalEnrollments,
      newMessages,
      unreadMessages,
      totalCourses,
      revenueAgg,
    ] = await Promise.all([
      prisma.user.count({ where: { createdAt: { gte: start } } }),
      prisma.user.count(),
      prisma.payment.count({ where: { createdAt: { gte: start }, status: "SUCCESS" } }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.enrollment.count({ where: { enrolledAt: { gte: start } } }),
      prisma.enrollment.count(),
      prisma.contactMessage.count({ where: { createdAt: { gte: start } } }),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.course.count(),
      prisma.payment.aggregate({ _sum: { amountInKobo: true }, where: { status: "SUCCESS", createdAt: { gte: start } } }),
    ])

    // Find top course by enrollment count this month
    const topCourseRaw = await prisma.enrollment.groupBy({
      by: ["courseId"],
      _count: { id: true },
      where: { enrolledAt: { gte: start } },
      orderBy: { _count: { id: "desc" } },
      take: 1,
    })

    let topCourse = null
    if (topCourseRaw.length > 0) {
      const course = await prisma.course.findUnique({ where: { id: topCourseRaw[0].courseId } })
      if (course) topCourse = { title: course.title, enrollments: topCourseRaw[0]._count.id }
    }

    const data = {
      month,
      year,
      newUsers,
      totalUsers,
      newPayments,
      revenueInKobo: revenueAgg._sum.amountInKobo || 0,
      pendingPayments,
      newEnrollments,
      totalEnrollments,
      unreadMessages,
      newMessages,
      totalCourses,
      topCourse,
    }

    const html = monthlyReportHtml(data)
    const subject = `Nerdhaven Monthly Report — ${month} ${year}`

    const pdfBuffer = generatePdfReport(data)
    const pdfBase64 = pdfBuffer.toString("base64")
    const pdfAttachment = {
      filename: `Nerdhaven_Report_${month}_${year}.pdf`,
      content: pdfBase64,
      type: "application/pdf",
    }

    const recipients = [CEO_EMAIL, COO_EMAIL, HOO_EMAIL]

    const results = await Promise.all(
      recipients.map((to) => sendEmail(to, subject, html, [pdfAttachment])),
    )

    const sent = results.filter((r) => r.sent).length
    const failed = results.filter((r) => !r.sent).length

    return NextResponse.json({
      success: true,
      sent,
      failed,
      recipients: recipients.length,
      month,
      year,
      summary: { newUsers, revenue: data.revenueInKobo, newEnrollments },
    })
  } catch (error: any) {
    console.error("Report generation error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
