"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown, HelpCircle } from "lucide-react"

type BillingPeriod = "monthly" | "annual"

const plans = [
  {
    name: "Foundation Spark",
    tagline: "For primary learners (ages 6–12)",
    monthlyPrice: "₦1,500",
    annualPrice: "₦12,000",
    annualPerMonth: "₦1,000",
    accent: "emerald",
    popular: false,
    features: [
      "Spiral curriculum access",
      "Gamified learning loops",
      "Progress tracking dashboard",
      "Parent/guardian dashboard",
      "Basic assessments",
      "Achievement badges",
      "Community access",
    ],
  },
  {
    name: "Academic Vanguard",
    tagline: "For secondary students (ages 13–18)",
    monthlyPrice: "₦4,500",
    annualPrice: "₦36,000",
    annualPerMonth: "₦3,000",
    accent: "blue",
    popular: true,
    features: [
      "All Foundation features",
      "IGCSE / WASSCE / SAT / IB prep",
      "Predictive exam analytics (95%)",
      "Adaptive practice tests",
      "Tutor Q&A sessions",
      "Performance reports",
      "Study group matching",
      "Priority community access",
    ],
  },
  {
    name: "Enterprise Catalyst",
    tagline: "For university & business professionals",
    monthlyPrice: "₦12,000",
    annualPrice: "₦96,000",
    annualPerMonth: "₦8,000",
    accent: "slate",
    popular: false,
    features: [
      "All Academic features",
      "Research collaboration tools",
      "Code playgrounds (8 languages)",
      "Compliance & certification tracking",
      "Growth marketing tools",
      "Advanced analytics dashboard",
      "API access",
      "Dedicated support",
      "Team management",
    ],
  },
  {
    name: "The Haven Guild",
    tagline: "Custom enterprise solutions",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    annualPerMonth: "Custom",
    accent: "gray",
    popular: false,
    features: [
      "Everything in Enterprise",
      "Dedicated account manager",
      "Custom integrations",
      "White-label options",
      "On-site training workshops",
      "SLA guarantees (99.9%)",
      "Custom curriculum design",
      "Priority 24/7 support",
      "Multi-tenant architecture",
    ],
  },
]

const planComparison = [
  { feature: "Spiral Curriculum", foundation: true, academic: true, enterprise: true, guild: true },
  { feature: "Gamified Learning", foundation: true, academic: true, enterprise: true, guild: true },
  { feature: "Exam-Specific Prep", foundation: false, academic: true, enterprise: true, guild: true },
  { feature: "Predictive Analytics", foundation: false, academic: true, enterprise: true, guild: true },
  { feature: "Research Tools", foundation: false, academic: false, enterprise: true, guild: true },
  { feature: "Code Playgrounds", foundation: false, academic: false, enterprise: true, guild: true },
  { feature: "Compliance Tracking", foundation: false, academic: false, enterprise: true, guild: true },
  { feature: "Dedicated Support", foundation: false, academic: false, enterprise: true, guild: true },
  { feature: "Custom Integrations", foundation: false, academic: false, enterprise: false, guild: true },
  { feature: "White-Label Options", foundation: false, academic: false, enterprise: false, guild: true },
]

const faqs = [
  {
    q: "Can I switch tiers later?",
    a: "Yes. You can upgrade or downgrade your subscription at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do you offer student discounts?",
    a: "Yes. We offer a 40% discount for verified students on the Academic Vanguard and Enterprise Catalyst plans.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major Nigerian bank cards, USSD transfers, Paystack, and international credit/debit cards.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Every plan comes with a 7-day free trial. No credit card required for Foundation Spark and Academic Vanguard.",
  },
  {
    q: "Can I get a refund?",
    a: "Absolutely. We offer a 30-day money-back guarantee on all annual plans and a 14-day guarantee on monthly plans.",
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 },
}

export default function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-gray-50">
      {/* Header */}
      <section className="bg-white py-20">
        <motion.div {...fadeInUp} className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Choose Your Path</h1>
          <p className="mt-4 text-lg text-gray-600">
            Invest in your mind. Pick the plan that matches your ambition.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={() => setBilling("monthly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                billing === "monthly" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("annual")}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                billing === "annual" ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              Annual
              {billing === "annual" && (
                <span className="absolute -right-8 -top-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  Save 30%
                </span>
              )}
            </button>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-6 transition-shadow hover:shadow-xl",
                plan.accent === "emerald" && "border-emerald-200",
                plan.accent === "blue" && "border-blue-200",
                plan.accent === "slate" && "border-slate-200",
                plan.accent === "gray" && "border-gray-200",
                plan.popular && "ring-2 ring-indigo-500",
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                  Most Popular
                </span>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{plan.tagline}</p>
                <div className="mt-4">
                  <span className="text-3xl font-bold text-gray-900">
                    {billing === "monthly" ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  {plan.name !== "The Haven Guild" && (
                    <span className="ml-1 text-sm text-gray-500">/{billing === "monthly" ? "mo" : "yr"}</span>
                  )}
                  {billing === "annual" && plan.annualPerMonth !== "Custom" && (
                    <p className="mt-1 text-xs text-emerald-600">{plan.annualPerMonth}/mo billed annually</p>
                  )}
                </div>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                {plan.name === "The Haven Guild" ? (
                  <Link href="/contact">
                    <Button variant="outline" className="w-full">
                      Contact Us
                    </Button>
                  </Link>
                ) : (
                  <Link href={billing === "annual" ? `/api/checkout?plan=${plan.name.toLowerCase().replace(/\s+/g, "-")}&billing=annual` : `/api/checkout?plan=${plan.name.toLowerCase().replace(/\s+/g, "-")}`}>
                    <Button variant={plan.popular ? "primary" : "outline"} className="w-full">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeInUp} className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Feature Comparison
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="overflow-x-auto"
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 pr-4 text-left font-medium text-gray-500">Feature</th>
                  <th className="py-3 px-4 text-center font-medium text-emerald-700">Foundation</th>
                  <th className="py-3 px-4 text-center font-medium text-blue-700">Academic</th>
                  <th className="py-3 px-4 text-center font-medium text-slate-700">Enterprise</th>
                  <th className="py-3 pl-4 text-center font-medium text-gray-700">Guild</th>
                </tr>
              </thead>
              <tbody>
                {planComparison.map((row) => (
                  <tr key={row.feature} className="border-b border-gray-100">
                    <td className="py-3 pr-4 text-gray-700">{row.feature}</td>
                    {(["foundation", "academic", "enterprise", "guild"] as const).map((key) => (
                      <td key={key} className="py-3 px-4 text-center">
                        {row[key] ? (
                          <Check className="mx-auto h-4 w-4 text-emerald-500" />
                        ) : (
                          <span className="text-gray-300">&mdash;</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeInUp} className="mb-10 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-gray-200 bg-white"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <HelpCircle className="h-4 w-4 text-indigo-500" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-gray-400 transition-transform",
                      openFaq === i && "rotate-180",
                    )}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-100 px-5 py-4">
                    <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
