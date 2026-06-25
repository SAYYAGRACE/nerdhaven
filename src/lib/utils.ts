import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNaira(amountInKobo: number): string {
  const naira = amountInKobo / 100
  return `₦${naira.toLocaleString("en-NG")}`
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`
}
