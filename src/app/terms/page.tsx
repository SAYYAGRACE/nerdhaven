export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: June 2026</p>

        <div className="mt-8 space-y-6 text-gray-600 leading-relaxed">
          <p>
            By using Nerdhaven, you agree to these terms. If you do not agree, do not use the platform.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">1. Account</h2>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials. You
            must be at least 13 years old to create an account.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">2. Payments &amp; Refunds</h2>
          <p>
            All payments are processed in Nigerian Naira (NGN) via Paystack or direct bank transfer.
            Refund requests are handled on a case-by-case basis. See our Refund Policy for details.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">3. Intellectual Property</h2>
          <p>
            All content on Nerdhaven — including curriculum materials, practice questions, and
            study resources — is owned by Nextwave Infotech Limited. You may not reproduce,
            distribute, or create derivative works without explicit permission.
          </p>

          <h2 className="text-xl font-semibold text-gray-900">4. Limitation of Liability</h2>
          <p>
            Nerdhaven provides educational preparation resources but does not guarantee specific
            examination results. We are not liable for any indirect damages arising from use of
            the platform.
          </p>
        </div>
      </div>
    </div>
  )
}
