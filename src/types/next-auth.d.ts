import "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
    tier?: string
  }

  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      tier?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    tier?: string
  }
}
