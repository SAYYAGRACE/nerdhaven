export interface InitializeTransactionParams {
  email: string
  amountInKobo: number
  metadata?: Record<string, unknown>
  callbackUrl?: string
}

export interface InitializeTransactionResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export interface VerifyTransactionResponse {
  status: boolean
  message: string
  data?: {
    id: number
    status: string
    reference: string
    amount: number
    currency: string
    paid_at: string
    created_at: string
    channel: string
    metadata: Record<string, unknown>
  }
}

const PAYSTACK_BASE_URL = "https://api.paystack.co"

function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  }
}

export async function initializeTransaction(
  params: InitializeTransactionParams
): Promise<InitializeTransactionResponse> {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      email: params.email,
      amount: params.amountInKobo,
      metadata: params.metadata,
      callback_url: params.callbackUrl,
    }),
  })

  return response.json()
}

export async function verifyTransaction(
  reference: string
): Promise<VerifyTransactionResponse> {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  )

  return response.json()
}
