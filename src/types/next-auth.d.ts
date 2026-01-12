import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Session (Oturum) nesnesini genişletiyoruz
   */
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }

  /**
   * User (Kullanıcı) nesnesini genişletiyoruz
   */
  interface User {
    role?: string
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT token nesnesini genişletiyoruz
   */
  interface JWT {
    role?: string
  }
}