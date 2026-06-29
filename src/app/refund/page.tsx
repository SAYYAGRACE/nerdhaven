export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <h2 className="text-xl font-semibold text-gray-900">Refund Eligibility</h2>
          <p>
            Due to the digital nature of our products, all sales are final. Refunds are considered
            on a case-by-case basis under the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Duplicate payment for the same course</li>
            <li>Technical issue preventing access to purchased content for more than 48 hours</li>
            <li>Accidental purchase of the wrong course (must be reported within 24 hours)</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900">How to Request a Refund</h2>
          <p>
            Email{" "}
            <a href="mailto:nextwavehq@outlook.com" className="text-indigo-600 hover:underline">
              nextwavehq@outlook.com
            </a>{" "}
            with your account email, the course name, and the reason for your request. We will
            respond within 3 business days.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">Payment Disputes</h2>
          <p>
            For bank transfer payments, please contact us directly. For Paystack card payments,
            you may also reach out to Paystack support.
          </p>
        </div>
      </div>
    </div>
  )
}
