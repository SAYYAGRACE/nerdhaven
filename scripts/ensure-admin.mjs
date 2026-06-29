import { prisma } from "../src/lib/db.js"

const admin = await prisma.user.findUnique({ where: { email: "admin@nerdhaven.com" } })
if (admin) {
  console.log("Admin user found:", admin.name, admin.email, "Role:", admin.role)
} else {
  console.log("Admin user not found — creating...")
  const encoder = new TextEncoder()
  const data = encoder.encode("admin" + "nerdhaven-salt")
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", data)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@nerdhaven.com",
      password: hash,
      role: "ADMIN",
      profile: { create: { tier: "UNIVERSITY" } },
    },
  })
  console.log("Created admin user: admin@nerdhaven.com / admin")
}

await prisma.$disconnect()
