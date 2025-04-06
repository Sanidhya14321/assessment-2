"use client"

import { useEffect, useState } from "react"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Brain, Code, Database, Server, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import AssessmentQuestions from "@/components/assessment-questions"
import type { Assessment } from "@/lib/models"
import { useToast } from "@/hooks/use-toast"

export default function AssessmentPage() {
  const params = useParams()
  const id = params.id as string
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchAssessment() {
      try {
        const response = await fetch(`/api/assessments/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            notFound()
          }
          throw new Error("Failed to fetch assessment")
        }

        const data = await response.json()
        setAssessment(data)
      } catch (error) {
        console.error("Error fetching assessment:", error)
        toast({
          title: "Error",
          description: "Failed to load assessment. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [id, toast])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-[#522546] rounded"></div>
            <div className="h-8 w-3/4 bg-[#522546] rounded"></div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 bg-[#522546] rounded-md"></div>
              <div className="h-4 w-32 bg-[#522546] rounded"></div>
            </div>
            <div className="h-4 w-full bg-[#522546] rounded"></div>
            <div className="h-4 w-5/6 bg-[#522546] rounded"></div>
            <div className="h-32 w-full bg-[#522546] rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!assessment) {
    notFound()
  }

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName) {
      case "AI & Machine Learning":
        return <Brain className="h-5 w-5" />
      case "Web Development":
        return <Code className="h-5 w-5" />
      case "Database Systems":
        return <Database className="h-5 w-5" />
      case "Backend & DevOps":
        return <Server className="h-5 w-5" />
      default:
        return <Code className="h-5 w-5" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/assessments">
            <Button variant="link" className="text-[#F7374F] p-0 mb-4">
              ← Back to Assessments
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{assessment.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-[#522546] p-1 rounded-md">{getCategoryIcon(assessment.category)}</div>
            <span className="text-gray-300">{assessment.category}</span>
          </div>
          <p className="text-gray-300 mb-6">{assessment.description}</p>

          <Card className="bg-[#522546] border-none p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#88304E] p-2 rounded-full">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Questions</p>
                  <p className="text-xl font-semibold">{assessment.questions.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-[#88304E] p-2 rounded-full">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-300">Time Limit</p>
                  <p className="text-xl font-semibold">{assessment.timeLimit} minutes</p>
                </div>
              </div>
            </div>
          </Card>

          <AssessmentQuestions assessment={assessment} />
        </div>
      </div>
    </div>
  )
}

