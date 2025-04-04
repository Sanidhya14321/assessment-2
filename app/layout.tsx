import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
// import { ThemeProvider } from "@/components/theme-provider"
import { Toaster} from "@/components/ui/sonner"
import AuthProvider from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CS Assessment Platform",
  description: "Test your knowledge in various computer science domains",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#2C2C2C] text-white`}>
        <AuthProvider>
         
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <footer className="py-6 px-4 bg-[#522546] text-center">
                <p>© {new Date().getFullYear()} CS Assessment Platform. All rights reserved.</p>
              </footer>
            </div>
            <Toaster />
          
        </AuthProvider>
      </body>
    </html>
  )
}

