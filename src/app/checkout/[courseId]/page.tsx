"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import { Lock, ShieldCheck, CreditCard, Building2, Copy, CheckCircle, Loader2, ArrowLeft } from "lucide-react"
import { cn, formatNaira } from "@/lib/utils"
import { getBankAccount } from "@/lib/bank"
import { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"

interface CourseInfo {
  id: string
  title: string
  priceInKobo: number
  description?: string
  tier?: string
}

const FALLBACK_COURSE: CourseInfo = {
  id: "",
  title: "Course",
  priceInKobo: 0,
  tier: "PRIMARY",
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const { data: session } = useSession()
  const [course, setCourse] = useState<CourseInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "bank">("paystack")
  const [bankSubmitted, setBankSubmitted] = useState(false)
  const [bankSubmitting, setBankSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  const bankAccount = getBankAccount()

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(`/api/courses/${courseId}`)
        if (res.ok) {
          const data = await res.json()
          setCourse(data)
        } else {
          throw new Error("not found")
        }
      } catch {
        setCourse({ ...FALLBACK_COURSE, id: courseId })
      } finally {
        setLoading(false)
      }
    }
    loadCourse()
  }, [courseId])

  async function handlePayment() {
    if (!session?.user?.email) {
      toast.error("Please sign in to continue")
      return
    }
    setPaying(true)
    try {
      const res = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to initialize payment")
      window.location.href = data.authorization_url
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
      setPaying(false)
    }
  }

  async function handleBankSubmit() {
    if (!session?.user?.email) {
      toast.error("Please sign in to continue")
      return
    }
    setBankSubmitting(true)
    try {
      const res = await fetch("/api/bank-transfer/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      })
      if (!res.ok) throw new Error((await res.json()).error || "Failed to submit transfer notification")
      setBankSubmitted(true)
      toast.success("Transfer notification sent")
    } catch (err: any) {
      toast.error(err.message || "Something went wrong")
    } finally {
      setBankSubmitting(false)
    }
  }

  async function copyAccountNumber() {
    try {
      await navigator.clipboard.writeText(bankAccount.accountNumber)
      setCopied(true)
      toast.success("Account number copied")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (bankSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-lg px-4 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
            >
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900">Transfer Notification Sent</h2>
            <p className="mt-2 text-sm text-gray-500">
              Our team will verify your transfer and grant access within 1-2 hours. You&apos;ll receive a confirmation
              email.
            </p>
            <Button variant="primary" size="lg" className="mt-6" onClick={() => router.push("/courses")}>
              Back to Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    )
  }

  const pricingText =
    course?.tier === "BUSINESS"
      ? "Enterprise Catalyst — Full access plus business tools"
      : course?.tier === "UNIVERSITY"
        ? "Academic Vanguard — Advanced research & AI tutoring"
        : "Foundation Spark — Core curriculum & progress tracking"

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <a
            href="/courses"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to courses
          </a>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-white">
              <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
              <p className="mt-1 text-white/70">You&apos;re one step away from unlocking this course</p>
            </div>

            <div className="space-y-6 px-8 py-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{course?.title || "Course"}</p>
              </div>

              <div className="flex items-center justify-between border-b border-t border-gray-100 py-4">
                <span className="text-gray-600">Amount</span>
                <span className="text-3xl font-bold text-gray-900">
                  {course ? formatNaira(course.priceInKobo) : "—"}
                </span>
              </div>

              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-700">Pricing Plan</p>
                <p className="mt-1 text-sm text-gray-500">{pricingText}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentMethod("paystack")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                    paymentMethod === "paystack"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  )}
                >
                  <CreditCard className="h-4 w-4" />
                  Pay with Card
                </button>
                <button
                  onClick={() => setPaymentMethod("bank")}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all",
                    paymentMethod === "bank"
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  Direct Bank Transfer
                </button>
              </div>

              {paymentMethod === "paystack" ? (
                <Button
                  onClick={handlePayment}
                  disabled={paying}
                  size="lg"
                  className="w-full"
                >
                  {paying ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5" />
                      Pay with Paystack
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-4 rounded-xl border border-amber-200 bg-amber-50 p-5">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">Direct Bank Deposit</p>
                      <p className="mt-1 text-xs text-amber-700">
                        Transfer the exact amount to the account below. Use your email or phone number as narration for
                        easy identification.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-300 bg-white p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Bank Name</span>
                      <span className="text-sm font-medium text-gray-900">{bankAccount.bankName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Account Name</span>
                      <span className="text-sm font-medium text-gray-900">{bankAccount.accountName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Account Number</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold tracking-wider text-gray-900">
                          {bankAccount.accountNumber}
                        </span>
                        <button
                          onClick={copyAccountNumber}
                          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600 transition"
                        >
                          {copied ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-amber-200 pt-3">
                      <p className="text-xs text-gray-500">{bankAccount.instruction}</p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-100/50 px-3 py-2">
                    <p className="text-xs text-amber-800">
                      <strong>Important:</strong> Transfers are confirmed manually by our team. Access is granted within
                      1-2 hours after payment is verified.
                    </p>
                  </div>

                  <Button
                    onClick={handleBankSubmit}
                    disabled={bankSubmitting}
                    size="lg"
                    className="w-full"
                    variant="primary"
                  >
                    {bankSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Building2 className="h-5 w-5" />
                        I&apos;ve Made the Transfer
                      </>
                    )}
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-6 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" /> Secure payment
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" /> SSL encrypted
                </span>
                <span>Paystack</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4" />
            Your payment information is processed securely. We never store your card details.
          </div>
        </motion.div>
      </div>
    </div>
  )
}
