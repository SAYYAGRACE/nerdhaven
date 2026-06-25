export interface BankAccount {
  bankName: string
  accountName: string
  accountNumber: string
  instruction: string
  supportEmail: string
}

export function getBankAccount(): BankAccount {
  return {
    bankName: process.env.BANK_NAME || "OPay Digital Services Limited",
    accountName: process.env.BANK_ACCOUNT_NAME || "Nextwave Infotech Limited",
    accountNumber: process.env.BANK_ACCOUNT_NUMBER || "1234567890",
    instruction:
      process.env.BANK_INSTRUCTION ||
      "Send exact amount as shown on checkout. Use your email or phone number as narration.",
    supportEmail: process.env.DEPOSIT_CONFIRM_EMAIL || "nextwavehq@outlook.com",
  }
}
