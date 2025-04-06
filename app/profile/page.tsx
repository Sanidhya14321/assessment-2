"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Brain, Code, Database, Server, Trophy, Calendar, Clock } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Result } from "@/lib/models"

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <Skeleton className="h-[200px] w-full md:w-1/3 rounded-xl" />
        <Skeleton className="h-[200px] w-full md:w-2/3 rounded-xl" />
      </div>
      <Skeleton className="h-[400px] w-full rounded-xl" />
    </div>
  )
}

function getCategoryIcon(category: string) {
  switch (category) {
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

function getScoreColor(score: number) {
  if (score >= 90) return "text-green-500"
  if (score >= 75) return "text-blue-500"
  if (score >= 60) return "text-yellow-500"
  return "text-red-500"
}

function getProgressColor(score: number) {
  if (score >= 90) return "bg-green-500"
  if (score >= 75) return "bg-blue-500"
  if (score >= 60) return "bg-yellow-500"
  return "bg-red-500"
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<{
    name: string
    email: string
    joinedDate: string
    completedAssessments: number
    averageScore: number
    categoryPerformance: { category: string; score: number; assessments: number }[]
  }>({
    name: "",
    email: "",
    joinedDate: "",
    completedAssessments: 0,
    averageScore: 0,
    categoryPerformance: [],
  })

  useEffect(() => {
    // Redirect if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }

    if (status === "authenticated") {
      fetchUserResults()
    }
  }, [status, router])

  const fetchUserResults = async () => {
    try {
      const response = await fetch("/api/results")

      if (!response.ok) {
        throw new Error("Failed to fetch results")
      }

      const data = await response.json()
      setResults(data)

      // Calculate user stats
      if (data.length > 0) {
        // Calculate average score
        const totalScore = data.reduce((sum: number, result: Result) => sum + result.score, 0)
        const averageScore = Math.round(totalScore / data.length)

        // Group by category
        const categories: Record<string, { scores: number[]; count: number }> = {}

        data.forEach((result: Result) => {
          if (!categories[result.category]) {
            categories[result.category] = { scores: [], count: 0 }
          }

          categories[result.category].scores.push(result.score)
          categories[result.category].count++
        })

        // Calculate category performance
        const categoryPerformance = Object.entries(categories).map(([category, data]) => {
          const avgScore = Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length)

          return {
            category,
            score: avgScore,
            assessments: data.count,
          }
        })

        setUserData({
          name: session?.user?.name || "",
          email: session?.user?.email || "",
          joinedDate: new Date().toISOString(), // This would come from the user record in a real app
          completedAssessments: data.length,
          averageScore,
          categoryPerformance,
        })
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching results:", error)
      toast({
        title: "Error",
        description: "Failed to load your profile data. Please try again later.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <ProfileSkeleton />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#2C2C2C] border-[#522546]">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Name</p>
                <p className="text-lg font-medium">{userData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-lg font-medium">{userData.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Joined</p>
                <p className="text-lg font-medium">{new Date(userData.joinedDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-[#522546] md:col-span-2">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center justify-center p-4 bg-[#522546] rounded-lg">
                <div className="text-4xl font-bold mb-2">{userData.completedAssessments}</div>
                <p className="text-gray-300">Assessments Completed</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#522546] rounded-lg">
                <div className="text-4xl font-bold mb-2">{userData.averageScore}%</div>
                <p className="text-gray-300">Average Score</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-[#522546] rounded-lg">
                <div className="text-4xl font-bold mb-2">
                  {userData.categoryPerformance.length > 0
                    ? userData.categoryPerformance
                        .reduce((max, cat) => (cat.score > max.score ? cat : max))
                        .category.split(" ")[0]
                    : "N/A"}
                </div>
                <p className="text-gray-300">Strongest Category</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="results" className="space-y-6">
        <TabsList className="bg-[#522546]">
          <TabsTrigger value="results">Recent Results</TabsTrigger>
          <TabsTrigger value="categories">Category Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="results" className="space-y-6">
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader>
              <CardTitle>Recent Assessment Results</CardTitle>
              <CardDescription>Your most recent assessment completions</CardDescription>
            </CardHeader>
            <CardContent>
              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((result) => (
                    <div key={result._id} className="p-4 bg-[#522546] rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <div className="bg-[#88304E] p-2 rounded-full">{getCategoryIcon(result.category)}</div>
                          <div>
                            <h3 className="font-semibold">{result.assessmentTitle}</h3>
                            <p className="text-sm text-gray-400">{result.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              {new Date(result.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">{Math.round(result.timeSpent / 60)} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex-grow">
                          <div className="flex justify-between mb-1">
                            <span>Score</span>
                            <span className={getScoreColor(result.score)}>{result.score}%</span>
                          </div>
                          <Progress value={result.score} className={`h-2 ${getProgressColor(result.score)}`} />
                        </div>
                        <Badge className="bg-[#F7374F] hover:bg-[#88304E]">
                          <Trophy className="h-3 w-3 mr-1" />
                          {result.score >= 90
                            ? "Excellent"
                            : result.score >= 75
                              ? "Good"
                              : result.score >= 60
                                ? "Average"
                                : "Needs Improvement"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">You haven't completed any assessments yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Your performance across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              {userData.categoryPerformance.length > 0 ? (
                <div className="space-y-6">
                  {userData.categoryPerformance.map((category, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="bg-[#88304E] p-1 rounded-md">{getCategoryIcon(category.category)}</div>
                          <span>{category.category}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-[#522546] border-none">
                            {category.assessments} Assessments
                          </Badge>
                          <span className={getScoreColor(category.score)}>{category.score}%</span>
                        </div>
                      </div>
                      <Progress value={category.score} className={`h-2 ${getProgressColor(category.score)}`} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">Complete assessments to see your category performance.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

