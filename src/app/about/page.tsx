import Link from "next/link"
import { GraduationCap, Target, Brain, Users } from "lucide-react"

const values = [
  {
    icon: Brain,
    title: "Adaptive Cognitive Mapping",
    description: "Our proprietary ACM technology identifies learning bottlenecks in real-time, adapting each curriculum to the individual mind.",
  },
  {
    icon: Target,
    title: "Exam-First Precision",
    description: "Every resource, question, and study plan is engineered around real examination formats — WAEC, NECO, JAMB, IGCSE, SAT, and more.",
  },
  {
    icon: Users,
    title: "Peer Learning Ecosystem",
    description: "Join study groups, collaborate on projects, and learn alongside a community of driven peers across every tier.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-4xl font-bold text-gray-900">About Nerdhaven</h1>
          <p className="mt-4 text-lg text-gray-600">
            The unified learning ecosystem powered by Adaptive Cognitive Mapping.
            From primary scholars to business founders — one platform, four distinct minds.
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Nerdhaven exists to close the gap between potential and achievement. We believe every
            learner deserves a curriculum that bends to their strengths, addresses their weaknesses,
            and prepares them for the examinations that shape their future. Founded in Kaduna,
            Nigeria, we serve the African continent and beyond with examination prep that is
            rigorous, accessible, and deeply personalised.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => {
            const Icon = value.icon
            return (
              <div key={value.title} className="rounded-xl border border-gray-200 bg-white p-6">
                <Icon className="h-8 w-8 text-indigo-600" />
                <h3 className="mt-4 font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{value.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  )
}
