"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Code, Database, Server, ThumbsUp, ThumbsDown, Clock } from "lucide-react"
import { motion } from "framer-motion"
import AssessmentsSkeleton from "@/components/assessments-skeleton"

// This would normally be fetched from the database
const categories = [
  {
    id: "aiml",
    name: "AI & Machine Learning",
    icon: <Brain className="h-6 w-6" />,
    description: "Test your knowledge in artificial intelligence and machine learning concepts.",
    assessments: [
      {
        id: "aiml-1",
        title: "Machine Learning Fundamentals",
        description: "Test your understanding of basic machine learning concepts and algorithms.",
        questions: 25,
        upvotes: 124,
        downvotes: 12,
        timeLimit: 30,
      },
      {
        id: "aiml-2",
        title: "Neural Networks & Deep Learning",
        description: "Evaluate your knowledge of neural network architectures and deep learning principles.",
        questions: 30,
        upvotes: 98,
        downvotes: 8,
        timeLimit: 45,
      },
      {
        id: "aiml-3",
        title: "Natural Language Processing",
        description: "Test your understanding of NLP techniques and applications.",
        questions: 20,
        upvotes: 76,
        downvotes: 5,
        timeLimit: 25,
      },
    ],
  },
  {
    id: "webdev",
    name: "Web Development",
    icon: <Code className="h-6 w-6" />,
    description: "Assess your skills in frontend and backend web development technologies.",
    assessments: [
      {
        id: "webdev-1",
        title: "Frontend Fundamentals",
        description: "Test your knowledge of HTML, CSS, and JavaScript fundamentals.",
        questions: 30,
        upvotes: 156,
        downvotes: 14,
        timeLimit: 35,
      },
      {
        id: "webdev-2",
        title: "React & Modern JavaScript",
        description: "Evaluate your understanding of React and modern JavaScript concepts.",
        questions: 25,
        upvotes: 132,
        downvotes: 9,
        timeLimit: 30,
      },
      {
        id: "webdev-3",
        title: "Backend Development",
        description: "Test your knowledge of server-side programming and API development.",
        questions: 28,
        upvotes: 89,
        downvotes: 7,
        timeLimit: 40,
      },
    ],
  },
  {
    id: "database",
    name: "Database Systems",
    icon: <Database className="h-6 w-6" />,
    description: "Evaluate your understanding of database design and management.",
    assessments: [
      {
        id: "db-1",
        title: "SQL Fundamentals",
        description: "Test your knowledge of SQL queries and database operations.",
        questions: 25,
        upvotes: 112,
        downvotes: 8,
        timeLimit: 30,
      },
      {
        id: "db-2",
        title: "NoSQL Databases",
        description: "Evaluate your understanding of NoSQL database concepts and technologies.",
        questions: 20,
        upvotes: 78,
        downvotes: 6,
        timeLimit: 25,
      },
      {
        id: "db-3",
        title: "Database Design & Normalization",
        description: "Test your knowledge of database design principles and normalization.",
        questions: 22,
        upvotes: 94,
        downvotes: 5,
        timeLimit: 35,
      },
    ],
  },
  {
    id: "devops",
    name: "Backend & DevOps",
    icon: <Server className="h-6 w-6" />,
    description: "Test your knowledge in server management and deployment processes.",
    assessments: [
      {
        id: "devops-1",
        title: "Docker & Containerization",
        description: "Test your understanding of Docker and container orchestration.",
        questions: 25,
        upvotes: 105,
        downvotes: 7,
        timeLimit: 30,
      },
      {
        id: "devops-2",
        title: "CI/CD Pipelines",
        description: "Evaluate your knowledge of continuous integration and deployment practices.",
        questions: 20,
        upvotes: 87,
        downvotes: 4,
        timeLimit: 25,
      },
      {
        id: "devops-3",
        title: "Cloud Services & Architecture",
        description: "Test your understanding of cloud platforms and architectural patterns.",
        questions: 28,
        upvotes: 96,
        downvotes: 6,
        timeLimit: 35,
      },
    ],
  },
]

export default function AssessmentsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Assessments</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose from a variety of assessments across different computer science domains to test your knowledge and
          skills.
        </p>
      </div>

      <Suspense fallback={<AssessmentsSkeleton />}>
        <div className="space-y-16">
          {categories.map((category, index) => (
            <motion.section
              key={category.id}
              id={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#88304E] p-2 rounded-lg">{category.icon}</div>
                <h2 className="text-3xl font-bold">{category.name}</h2>
              </div>
              <p className="text-gray-300 max-w-3xl">{category.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.assessments.map((assessment) => (
                  <Card
                    key={assessment.id}
                    className="bg-[#2C2C2C] border-[#522546] hover:border-[#F7374F] transition-all"
                  >
                    <CardHeader>
                      <CardTitle className="text-xl">{assessment.title}</CardTitle>
                      <CardDescription className="text-gray-400">{assessment.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="outline" className="bg-[#522546] text-white border-none">
                          {assessment.questions} Questions
                        </Badge>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="h-4 w-4" />
                          {assessment.timeLimit} min
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{assessment.upvotes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="h-4 w-4 text-red-500" />
                            <span className="text-sm">{assessment.downvotes}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Link href={`/assessments/${assessment.id}`} className="w-full">
                        <Button className="w-full bg-[#88304E] hover:bg-[#F7374F]">Start Assessment</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </Suspense>
    </div>
  )
}

