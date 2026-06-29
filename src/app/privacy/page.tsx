export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <p>
            Nextwave Infotech Limited (&quot;Nerdhaven&quot;) respects your privacy. This policy explains how
            we collect, use, and protect your personal data when you use our platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">1. Data We Collect</h2>
          <p>
            We collect your name, email address, phone number, and learning activity data (practice
            test scores, study plans, completed lessons) to personalise your experience.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">2. How We Use Your Data</h2>
          <p>
            Your data is used to deliver personalised learning recommendations, process payments,
            send course updates, and improve our platform. We never sell your personal data to third
            parties.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">3. Payment Data</h2>
          <p>
            Payment processing is handled securely by Paystack. We do not store credit card numbers
            or bank account details on our servers.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">4. Contact</h2>
          <p>
            For privacy inquiries, email us at{" "}
            <a href="mailto:nextwavehq@outlook.com" className="text-indigo-600 hover:underline">
              nextwavehq@outlook.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  )
}
