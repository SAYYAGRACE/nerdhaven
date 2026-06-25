"use client"

import { useSearchParams, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, Loader2, ArrowRight, Clock, AlertTriangle, Building2 } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import Link from "next/link"

type PaymentStatus = "PENDING" | "CONFIRMED" | "FAILED" | "TIMEOUT"

export default function PaymentReturnPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const reference = searchParams.get("reference")
  const method = searchParams.get("method")
  const courseId = params.courseId as string
  const isBankTransfer = method === "bank_transfer"
  const [status, setStatus] = useState<PaymentStatus>("PENDING")
  const [courseName, setCourseName] = useState("your course")
  const [dots, setDots] = useState("")
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const elapsedRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!reference || isBankTransfer) return

    async function verify() {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`)
        const data = await res.json()
        if (data.status === "success") {
          setStatus("CONFIRMED")
          if (data.data?.courseName) setCourseName(data.data.courseName)
          if (pollRef.current) clearInterval(pollRef.current)
        } else if (data.status === "failed") {
          setStatus("FAILED")
          if (pollRef.current) clearInterval(pollRef.current)
        }
      } catch {
        // poll continues
      }
    }

    verify()
    pollRef.current = setInterval(() => {
      elapsedRef.current += 2
      if (elapsedRef.current >= 60) {
        setStatus("TIMEOUT")
        if (pollRef.current) clearInterval(pollRef.current)
        return
      }
      verify()
    }, 2000)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [reference, isBankTransfer])

  if (isBankTransfer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
            >
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </motion.div>
            <h2 className="text-xl font-bold text-gray-900">Transfer Submitted</h2>
            <p className="mt-2 text-sm text-gray-500">
              Your bank transfer notification has been received. Our team will verify the payment and grant access
              within 1-2 hours. You&apos;ll receive a confirmation email once processed.
            </p>
            <Link
              href="/courses"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
            >
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
          <AnimatePresence mode="wait">
            {status === "PENDING" && (
              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
                  <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Verifying your payment<span className="tabular-nums">{dots}</span>
                </h2>
                <p className="mt-2 text-sm text-gray-500">Please wait while we confirm your transaction</p>
                <div className="mt-6 flex justify-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                      className="h-2.5 w-2.5 rounded-full bg-indigo-400"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {status === "CONFIRMED" && (
              <motion.div
                key="confirmed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50"
                >
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
                <p className="mt-2 text-sm text-gray-500">
                  You now have access to{" "}
                  <span className="font-semibold text-gray-700">{courseName}</span>
                </p>
                <Link
                  href={`/courses/${courseId}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                >
                  Go to Course <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}

            {status === "FAILED" && (
              <motion.div
                key="failed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50"
                >
                  <XCircle className="h-10 w-10 text-red-500" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900">Payment Failed</h2>
                <p className="mt-2 text-sm text-gray-500">We couldn&apos;t process your payment. Please try again.</p>
                <Link
                  href={`/checkout/${courseId}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                >
                  Retry Payment <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}

            {status === "TIMEOUT" && (
              <motion.div
                key="timeout"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
                  <AlertTriangle className="h-10 w-10 text-amber-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Still Processing</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Check your email for a confirmation receipt or contact support.
                </p>
                <Link
                  href="/courses"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
                >
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
