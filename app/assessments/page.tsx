"use client"

import { JSX, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Brain, Code, Database, Server, ThumbsUp, ThumbsDown, Clock } from "lucide-react"
import { motion } from "framer-motion"
import AssessmentsSkeleton from "@/components/assessments-skeleton"
import { useToast } from "@/hooks/use-toast"
import type { Assessment } from "@/lib/models"

export default function AssessmentsPage() {
  const [categories, setCategories] = useState<
    {
      id: string
      name: string
      icon: JSX.Element
      description: string
      assessments: Assessment[]
    }[]
  >([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const response = await fetch("/api/assessments")

        if (!response.ok) {
          throw new Error("Failed to fetch assessments")
        }

        const assessments: Assessment[] = await response.json()

        // Group assessments by category
        const groupedAssessments: Record<string, Assessment[]> = {}

        assessments.forEach((assessment) => {
          if (!groupedAssessments[assessment.category]) {
            groupedAssessments[assessment.category] = []
          }
          groupedAssessments[assessment.category].push(assessment)
        })

        // Create categories array
        const categoriesData = Object.entries(groupedAssessments).map(([name, assessments]) => {
          let icon
          let id

          switch (name) {
            case "AI & Machine Learning":
              icon = <Brain className="h-6 w-6" />
              id = "aiml"
              break
            case "Web Development":
              icon = <Code className="h-6 w-6" />
              id = "webdev"
              break
            case "Database Systems":
              icon = <Database className="h-6 w-6" />
              id = "database"
              break
            case "Backend & DevOps":
              icon = <Server className="h-6 w-6" />
              id = "devops"
              break
            default:
              icon = <Code className="h-6 w-6" />
              id = name.toLowerCase().replace(/\s+/g, "-")
          }

          return {
            id,
            name,
            icon,
            description: `Test your knowledge in ${name.toLowerCase()} concepts and technologies.`,
            assessments,
          }
        })

        setCategories(categoriesData)
      } catch (error) {
        console.error("Error fetching assessments:", error)
        toast({
          title: "Error",
          description: "Failed to load assessments. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [toast])

  const handleVote = async (assessmentId: string, voteType: "upvote" | "downvote") => {
    try {
      const response = await fetch(`/api/assessments/${assessmentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: voteType }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${voteType}`)
      }

      // Update the local state to reflect the vote
      setCategories((prevCategories) => {
        return prevCategories.map((category) => {
          return {
            ...category,
            assessments: category.assessments.map((assessment) => {
              if (assessment._id === assessmentId) {
                return {
                  ...assessment,
                  [voteType === "upvote" ? "upvotes" : "downvotes"]:
                    (assessment[voteType === "upvote" ? "upvotes" : "downvotes"] || 0) + 1,
                }
              }
              return assessment
            }),
          }
        })
      })

      toast({
        title: "Success",
        description: `Your ${voteType} has been recorded.`,
      })
    } catch (error) {
      console.error(`Error ${voteType}ing:`, error)
      toast({
        title: "Error",
        description: `Failed to record your ${voteType}. Please try again.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Assessments</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose from a variety of assessments across different computer science domains to test your knowledge and
          skills.
        </p>
      </div>

      {loading ? (
        <AssessmentsSkeleton />
      ) : (
        <div className="space-y-16">
          {categories.length > 0 ? (
            categories.map((category, index) => (
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
                      key={assessment._id}
                      className="bg-[#2C2C2C] border-[#522546] hover:border-[#F7374F] transition-all"
                    >
                      <CardHeader>
                        <CardTitle className="text-xl">{assessment.title}</CardTitle>
                        <CardDescription className="text-gray-400">{assessment.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="outline" className="bg-[#522546] text-white border-none">
                            {assessment.questions.length} Questions
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="h-4 w-4" />
                            {assessment.timeLimit} min
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleVote(assessment._id as string, "upvote")}
                              className="flex items-center gap-1 hover:text-green-500 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4 text-green-500" />
                              <span className="text-sm">{assessment.upvotes || 0}</span>
                            </button>
                            <button
                              onClick={() => handleVote(assessment._id as string, "downvote")}
                              className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            >
                              <ThumbsDown className="h-4 w-4 text-red-500" />
                              <span className="text-sm">{assessment.downvotes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Link href={`/assessments/${assessment._id}`} className="w-full">
                          <Button className="w-full bg-[#88304E] hover:bg-[#F7374F]">Start Assessment</Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </motion.section>
            ))
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-medium mb-4">No assessments available</h3>
              <p className="text-gray-400 mb-6">Check back later for new assessments or contact an administrator.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

