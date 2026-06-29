"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Footer } from "@/components/layout/footer"
import {
  ArrowRight,
  Sparkles,
  Target,
  FlaskConical,
  Building2,
  Brain,
  ChevronRight,
  Users,
  BookOpen,
  BarChart3,
  Layers,
  Mail,
} from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: 0.15, duration: 0.5 },
}

const tiers = [
  {
    icon: Sparkles,
    name: "Primary",
    description: "Spiral curriculum with gamified loops that make learning addictive for young minds.",
    stat: "10K+ active scholars",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Target,
    name: "Secondary",
    description: "IGCSE, WASSCE, SAT & IB mapped curricula with 95% predictive exam accuracy.",
    stat: "95% exam accuracy",
    color: "from-blue-400 to-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FlaskConical,
    name: "University",
    description: "Research tools, code playgrounds, and peer networks for higher education.",
    stat: "500+ university courses",
    color: "from-slate-400 to-slate-600",
    bg: "bg-slate-50",
  },
  {
    icon: Building2,
    name: "Business",
    description: "Case studies, compliance tracking, and growth marketing for professionals.",
    stat: "200+ business modules",
    color: "from-gray-500 to-gray-800",
    bg: "bg-gray-50",
  },
]

const plans = [
  {
    name: "Foundation Spark",
    tagline: "For primary learners",
    monthly: "₦1,500",
    yearly: "₦12,000",
    accent: "emerald",
    features: ["Spiral curriculum access", "Gamified learning loops", "Progress tracking", "Parent dashboard"],
  },
  {
    name: "Academic Vanguard",
    tagline: "For secondary students",
    monthly: "₦4,500",
    yearly: "₦36,000",
    accent: "blue",
    features: ["All Foundation features", "Exam-specific prep", "Predictive analytics", "Practice tests", "Tutor support"],
  },
  {
    name: "Enterprise Catalyst",
    tagline: "For university & business",
    monthly: "₦12,000",
    yearly: "₦96,000",
    accent: "slate",
    features: [
      "All Academic features",
      "Research tools",
      "Code playgrounds",
      "Compliance tracking",
      "Growth marketing tools",
      "Priority support",
    ],
  },
  {
    name: "The Haven Guild",
    tagline: "Custom enterprise",
    monthly: "Custom",
    yearly: "Custom",
    accent: "gray",
    features: [
      "Everything in Enterprise",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "On-site training",
      "SLA guarantees",
    ],
  },
]

const stats = [
  { icon: Users, value: "10,000+", label: "Students" },
  { icon: BookOpen, value: "500+", label: "Courses" },
  { icon: BarChart3, value: "95%", label: "Exam Accuracy" },
  { icon: Layers, value: "4", label: "Learning Tracks" },
]

function AnimatedCounter({ value, label, icon: Icon }: { value: string; label: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-2"
    >
      <Icon className="h-8 w-8 text-indigo-400" />
      <span className="text-4xl font-bold text-white">{value}</span>
      <span className="text-sm text-indigo-200">{label}</span>
    </motion.div>
  )
}

function FloatingParticles() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="absolute -right-40 top-20 h-96 w-96 rounded-full bg-purple-200/30 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-emerald-200/20 blur-3xl" />
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-indigo-400/30"
          style={{
            left: `${((i * 97 + 13) % 100)}%`,
            top: `${((i * 53 + 71) % 100)}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: (i * 0.3) % 2 }}
        />
      ))}
    </div>
  )
}

export default function MarketingHome() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <FloatingParticles />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 pb-32 pt-24 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
          >
            Where Curiosity Meets{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Mastery
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-600 sm:text-xl"
          >
            Nerdhaven is the unified learning ecosystem for primary scholars, secondary exam warriors,
            university researchers, and business founders. One platform. Four distinct minds.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/courses">
              <Button variant="primary" size="lg" className="gap-2">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quad-Tier */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Four Tiers, One Ecosystem</h2>
            <p className="mt-4 text-lg text-gray-600">
              Personalized learning paths engineered for every stage of intellectual development.
            </p>
          </motion.div>
          <motion.div {...stagger} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((tier) => {
              const Icon = tier.icon
              return (
                <motion.div
                  key={tier.name}
                  {...stagger}
                  className="group relative overflow-hidden rounded-2xl border border-gray-100 p-6 transition-shadow hover:shadow-lg"
                >
                  <div className={`mb-4 inline-flex rounded-xl p-3 ${tier.bg}`}>
                    <Icon className={`h-6 w-6 bg-gradient-to-br ${tier.color} bg-clip-text text-transparent`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{tier.description}</p>
                  <p className="mt-4 text-xs font-medium text-indigo-600">{tier.stat}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ACM Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div {...fadeInUp}>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-4 py-1.5 text-sm text-indigo-300">
                <Brain className="h-4 w-4" /> Adaptive Cognitive Mapping
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                The Engine Behind Every Learning Path
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-indigo-200">
                ACM detects precisely where a learner struggles, why they struggle, and dynamically
                rebuilds their curriculum path in real-time.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { step: "Detect", desc: "Real-time assessment pinpoints conceptual gaps" },
                  { step: "Diagnose", desc: "Multi-dimensional analysis identifies root causes" },
                  { step: "Rebuild", desc: "Curriculum path restructured for optimal mastery" },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/30 text-sm font-bold text-indigo-300">
                      {item.step[0]}
                    </div>
                    <div>
                      <p className="font-medium text-white">{item.step}</p>
                      <p className="text-sm text-indigo-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative flex items-center justify-center"
            >
              <div className="relative h-80 w-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl" />
                <div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-400 shadow-lg shadow-indigo-500/50" />
                {[
                  { angle: 0, label: "Detect" },
                  { angle: 120, label: "Diagnose" },
                  { angle: 240, label: "Rebuild" },
                ].map((node) => {
                  const rad = (node.angle * Math.PI) / 180
                  const x = Math.round(60 * Math.cos(rad))
                  const y = Math.round(60 * Math.sin(rad))
                  return (
                    <motion.div
                      key={node.label}
                      className="absolute flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/80 text-xs font-bold text-white shadow-lg"
                      style={{
                        left: `calc(50% + ${x - 28}px)`,
                        top: `calc(50% + ${y - 28}px)`,
                      }}
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: node.angle / 120 }}
                    >
                      {node.label}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-lg text-gray-600">Choose the plan that fits your learning journey.</p>
          </motion.div>
          <motion.div {...stagger} className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                {...stagger}
                className={`relative rounded-2xl border p-6 transition-shadow hover:shadow-lg ${
                  plan.accent === "emerald"
                    ? "border-emerald-200 bg-emerald-50/50"
                    : plan.accent === "blue"
                      ? "border-blue-200 bg-blue-50/50"
                      : plan.accent === "slate"
                        ? "border-slate-200 bg-slate-50/50"
                        : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{plan.tagline}</p>
                <p className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.monthly}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                </p>
                <p className="mt-1 text-xs text-gray-500">{plan.yearly}/year</p>
                <ul className="mt-6 space-y-2">
                  {plan.features.slice(0, 3).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <ChevronRight className="mt-0.5 h-3 w-3 shrink-0 text-indigo-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  {plan.name === "The Haven Guild" ? (
                    <Link href="/contact">
                      <Button variant="outline" size="sm" className="w-full">
                        Contact Us
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/pricing">
                      <Button variant="primary" size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <AnimatedCounter key={stat.label} {...stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Begin Your Nerdhaven Journey</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of learners mastering their craft across every stage of life.
            </p>
            <div className="mx-auto mt-10 flex max-w-md items-center gap-3">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <Link href="/auth/signup">
                <Button variant="primary" size="lg" className="gap-2 shrink-0">
                  Start Learning <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </>
  )
}
