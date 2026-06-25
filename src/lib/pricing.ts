import type { UserTier } from "@/types"

export interface PricingPlan {
  id: string
  label: string
  description: string
  monthly: number
  annual: number
  monthlyUSD: number
  annualUSD: number
  tier: UserTier | "INSTITUTION"
  features: string[]
  custom?: boolean
}

export const FOUNDATION_SPARK: PricingPlan = {
  id: "FOUNDATION_SPARK",
  label: "Foundation Spark",
  description:
    "Full access to core curriculum maps, predictive mock exam engines, basic AI tutoring, and interactive visualization modules.",
  monthly: 1500,
  annual: 12000,
  monthlyUSD: 15,
  annualUSD: 120,
  tier: "PRIMARY",
  features: [
    "Core curriculum maps for primary & secondary",
    "Predictive mock exam engines",
    "Basic AI tutoring assistance",
    "Interactive visualization modules",
    "Progress tracking dashboard",
    "Community forum access",
  ],
}

export const ACADEMIC_VANGUARD: PricingPlan = {
  id: "ACADEMIC_VANGUARD",
  label: "Academic Vanguard",
  description:
    "Advanced AI tutoring with personalized learning paths, comprehensive exam preparation, research tools, and collaborative study rooms.",
  monthly: 4500,
  annual: 36000,
  monthlyUSD: 29,
  annualUSD: 240,
  tier: "UNIVERSITY",
  features: [
    "Everything in Foundation Spark",
    "Advanced AI tutoring with personalized paths",
    "Comprehensive exam preparation suites",
    "Research tools & citation manager",
    "Collaborative study rooms",
    "Priority support",
    "Downloadable resources",
  ],
}

export const ENTERPRISE_CATALYST: PricingPlan = {
  id: "ENTERPRISE_CATALYST",
  label: "Enterprise Catalyst",
  description:
    "Full enterprise-grade LMS with custom integrations, dedicated infrastructure, team analytics, and white-labelling options.",
  monthly: 12000,
  annual: 96000,
  monthlyUSD: 79,
  annualUSD: 680,
  tier: "BUSINESS",
  features: [
    "Everything in Academic Vanguard",
    "Full enterprise-grade LMS",
    "Custom API integrations",
    "Dedicated infrastructure",
    "Team analytics & reporting",
    "White-labelling options",
    "Account manager",
    "SLA guarantee",
  ],
}

export const HAVEN_GUILD: PricingPlan = {
  id: "HAVEN_GUILD",
  label: "The Haven Guild",
  description:
    "White-labeled student portals, administrative analytics, custom curriculum builder tools, and dedicated account management.",
  monthly: 0,
  annual: 0,
  monthlyUSD: 0,
  annualUSD: 0,
  tier: "INSTITUTION",
  custom: true,
  features: [
    "White-labeled student portals",
    "Administrative analytics dashboard",
    "Custom curriculum builder tools",
    "Dedicated account management",
    "Bulk user import & management",
    "Custom branding & domains",
    "On-premise deployment option",
    "24/7 premium support",
    "Custom integrations & SSO",
  ],
}

export const plans: PricingPlan[] = [
  FOUNDATION_SPARK,
  ACADEMIC_VANGUARD,
  ENTERPRISE_CATALYST,
  HAVEN_GUILD,
]

export function getPlanForTier(tier: UserTier): PricingPlan | undefined {
  return plans.find((p) => p.tier === tier)
}
