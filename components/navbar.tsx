"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Assessments", href: "/assessments" },
    { name: "Profile", href: "/profile" },
  ]

  // Add admin link if user is admin
  if (session?.user?.email === "admin@example.com") {
    navLinks.push({ name: "Admin", href: "/admin" })
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#2C2C2C]/90 backdrop-blur-md shadow-md" : "bg-transparent"}`}
    >
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#F7374F] to-[#88304E] text-transparent bg-clip-text">
                CS Assessment
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-lg transition-colors hover:text-[#F7374F] ${pathname === link.href ? "text-[#F7374F] font-medium" : "text-white"}`}
              >
                {link.name}
              </Link>
            ))}

            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#88304E]">
                      <User className="h-5 w-5" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="border-[#F7374F] text-[#F7374F] hover:bg-[#F7374F] hover:text-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button className="bg-[#F7374F] hover:bg-[#88304E]">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:bg-[#522546]"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="flex flex-col space-y-4 pt-4 pb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg transition-colors hover:text-[#F7374F] ${pathname === link.href ? "text-[#F7374F] font-medium" : "text-white"}`}
                  >
                    {link.name}
                  </Link>
                ))}

                {status === "authenticated" ? (
                  <Button
                    variant="ghost"
                    onClick={() => signOut()}
                    className="justify-start px-0 hover:bg-transparent hover:text-[#F7374F]"
                  >
                    Log out
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2">
                    <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                      <Button
                        variant="outline"
                        className="w-full border-[#F7374F] text-[#F7374F] hover:bg-[#F7374F] hover:text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-[#F7374F] hover:bg-[#88304E]">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

