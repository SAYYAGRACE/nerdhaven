import PDFDocument from "pdfkit"

interface ReportData {
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
}

export function generatePdfReport(data: ReportData): Buffer {
  const doc = new PDFDocument({ margin: 50, size: "A4" })
  const chunks: Buffer[] = []
  doc.on("data", (chunk) => chunks.push(chunk))

  const purple = "#6366f1"
  const dark = "#111827"
  const gray = "#6b7280"
  const lightBg = "#f3f4f6"

  const revenueNgn = (data.revenueInKobo / 100).toLocaleString("en-NG", { style: "currency", currency: "NGN" })

  // --- Header bar ---
  doc.rect(0, 0, doc.page.width, 100).fill(purple)
  doc.fill("#ffffff").fontSize(24).font("Helvetica-Bold").text("Nerdhaven", 50, 28)
  doc.fontSize(12).font("Helvetica").text("Monthly Report", 50, 60)
  doc.fontSize(10).text(`${data.month} ${data.year}`, 50, 78)

  // --- Key metrics ---
  const metrics = [
    { label: "New Users", value: String(data.newUsers) },
    { label: "Revenue", value: revenueNgn },
    { label: "New Enrollments", value: String(data.newEnrollments) },
    { label: "Pending Payments", value: String(data.pendingPayments) },
  ]

  let y = 130
  doc.fontSize(14).font("Helvetica-Bold").fillColor(dark).text("Key Metrics", 50, y)
  y += 24

  const boxW = 115
  const boxH = 55
  const gap = 15
  const startX = 50

  metrics.forEach((m, i) => {
    const x = startX + i * (boxW + gap)
    doc
      .roundedRect(x, y, boxW, boxH, 6)
      .fill(lightBg)
      .fillColor(gray)
      .fontSize(8)
      .font("Helvetica")
      .text(m.label.toUpperCase(), x + 10, y + 8, { width: boxW - 20 })
    doc
      .fillColor(dark)
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(m.value, x + 10, y + 22, { width: boxW - 20 })
  })

  y += boxH + 30

  // --- Detailed stats table ---
  doc.fontSize(14).font("Helvetica-Bold").fillColor(dark).text("Detailed Statistics", 50, y)
  y += 24

  const tableData = [
    ["Metric", "Value"],
    ["Total Users", String(data.totalUsers)],
    ["Revenue (NGN)", revenueNgn],
    ["Successful Payments", String(data.newPayments)],
    ["Pending Payments", String(data.pendingPayments)],
    ["New Enrollments", String(data.newEnrollments)],
    ["Total Enrollments", String(data.totalEnrollments)],
    ["New Messages", String(data.newMessages)],
    ["Unread Messages", String(data.unreadMessages)],
    ["Total Courses", String(data.totalCourses)],
  ]

  if (data.topCourse) {
    tableData.push(["Top Course", data.topCourse.title])
    tableData.push(["Top Course Enrollments", String(data.topCourse.enrollments)])
  }

  const colX = [50, 200]
  const rowH = 18

  tableData.forEach((row, i) => {
    const isHeader = i === 0
    if (isHeader) {
      doc.rect(colX[0], y, 300, rowH).fill(purple)
      doc.fill("#ffffff")
    } else {
      const bg = i % 2 === 0 ? "#f9fafb" : "#ffffff"
      doc.rect(colX[0], y, 300, rowH).fill(bg)
      doc.fillColor(dark)
    }
    doc
      .font(isHeader ? "Helvetica-Bold" : "Helvetica")
      .fontSize(9)
      .text(row[0], colX[0] + 8, y + 5, { width: 140 })
      .text(row[1], colX[1] + 8, y + 5, { width: 140 })
    y += rowH
  })

  y += 30

  // --- Footer ---
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(gray)
    .text("© 2026 Nerdhaven. Copyright owned by Nextwave Infotech.", 50, y)
  doc.text("This report was auto-generated from the Nerdhaven admin panel.", 50, y + 12)

  doc.end()

  return Buffer.concat(chunks)
}
