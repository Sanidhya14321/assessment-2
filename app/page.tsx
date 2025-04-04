"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Brain, Code, Database, Server } from "lucide-react"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#F7374F] to-[#88304E] text-transparent bg-clip-text">
            Enhance Your Computer Science Skills
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Take assessments in various computer science domains to test your knowledge and track your progress.
          </p>
          <Link href="/assessments">
            <Button className="bg-[#F7374F] hover:bg-[#88304E] text-white px-8 py-6 text-lg rounded-full transition-all">
              Start Exploring <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <section className="py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Featured Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: "AI & Machine Learning",
              icon: <Brain className="h-10 w-10" />,
              description: "Test your knowledge in artificial intelligence and machine learning concepts.",
            },
            {
              title: "Web Development",
              icon: <Code className="h-10 w-10" />,
              description: "Assess your skills in frontend and backend web development technologies.",
            },
            {
              title: "Database Systems",
              icon: <Database className="h-10 w-10" />,
              description: "Evaluate your understanding of database design and management.",
            },
            {
              title: "Backend & DevOps",
              icon: <Server className="h-10 w-10" />,
              description: "Test your knowledge in server management and deployment processes.",
            },
          ].map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#522546] p-6 rounded-xl hover:shadow-lg hover:shadow-[#F7374F]/20 transition-all"
            >
              <div className="bg-[#88304E] p-4 rounded-full inline-block mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-300 mb-4">{category.description}</p>
              <Link href={`/assessments#${category.title.toLowerCase().replace(/\s+/g, "-")}`}>
                <Button
                  variant="outline"
                  className="border-[#F7374F] text-[#F7374F] hover:bg-[#F7374F] hover:text-white"
                >
                  Explore
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[#522546] rounded-xl p-8 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Track Your Progress</h2>
          <p className="text-xl mb-8 text-gray-300">
            Create an account to save your assessment results and track your improvement over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button className="bg-[#F7374F] hover:bg-[#88304E] text-white px-6 py-2">Sign Up</Button>
            </Link>
            <Link href="/auth/signin">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#522546]">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

