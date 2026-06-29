import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { ArrowRight, BookOpen, GraduationCap, BarChart3 } from "lucide-react"

const tierRoute: Record<string, string> = {
  PRIMARY: "/youth",
  SECONDARY: "/secondary/dashboard",
  UNIVERSITY: "/scholar",
  BUSINESS: "/founder",
}

export default async function MyCoursesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/signin")

  const tier = (session.user as any)?.tier || "PRIMARY"
  const dashboardHref = tierRoute[tier] || "/youth"

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id, status: "ACTIVE" },
    include: {
      course: {
        select: {
          id: true, title: true, slug: true, shortDescription: true,
          difficulty: true, tier: true, thumbnailUrl: true,
          _count: { select: { curriculumNodes: true } },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href={dashboardHref} className="text-sm text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="mt-1 text-gray-500">
            {enrollments.length} {enrollments.length === 1 ? "course" : "courses"} enrolled
          </p>
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-300" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">No courses yet</h2>
            <p className="mt-1 text-sm text-gray-500">Browse courses and start learning</p>
            <Link
              href="/courses"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Browse Courses <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => (
              <Link
                key={enrollment.course.id}
                href={`/courses/${enrollment.course.id}`}
                className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-indigo-50 p-2.5">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600">
                      {enrollment.course.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {enrollment.course._count.curriculumNodes} modules
                    </p>
                  </div>
                </div>
                {enrollment.course.shortDescription && (
                  <p className="mt-3 text-sm text-gray-500 line-clamp-2">
                    {enrollment.course.shortDescription}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 font-medium text-gray-600">
                    {enrollment.course.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-indigo-600 opacity-0 transition group-hover:opacity-100">
                    Continue <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
