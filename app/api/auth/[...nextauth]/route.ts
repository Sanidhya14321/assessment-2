import NextAuth, { Session, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Extend the Session type to include the role property
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

// Extend the User type to include the role property
declare module "next-auth" {
  interface User {
    role?: string
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // This is where you would typically verify the user credentials
        // For demo purposes, we'll accept any credentials
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For admin access
        if (credentials.email === "admin@example.com" && credentials.password === "admin") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin",
          }
        }

        // For regular users
        return {
          id: "2",
          name: "John Doe",
          email: credentials.email,
          role: "user",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/",
    error: "/auth/error",
  },
})

export { handler as GET, handler as POST }

