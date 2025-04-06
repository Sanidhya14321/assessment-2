"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Users,
  BookOpen,
  Brain,
  Code,
  Database,
  Server,
  BarChart3,
  PlusCircle,
  Trash2,
  Calendar,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import type { Assessment } from "@/lib/models"

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [stats, setStats] = useState<any>(null)
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [loading, setLoading] = useState(true)
  const [newAssessment, setNewAssessment] = useState({
    title: "",
    category: "",
    description: "",
    timeLimit: 30,
    questions: [] as { question: string; options: string[]; correctAnswer: number }[],
  })
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
  })

  // Check if user is admin
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin page.",
        variant: "destructive",
      })
      router.push("/")
    }

    if (status === "authenticated" && session?.user?.role === "admin") {
      fetchAdminData()
    }
  }, [session, status, router, toast])

  const fetchAdminData = async () => {
    try {
      // Fetch admin stats
      const statsResponse = await fetch("/api/admin/stats")

      if (!statsResponse.ok) {
        throw new Error("Failed to fetch admin stats")
      }

      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch assessments
      const assessmentsResponse = await fetch("/api/assessments")

      if (!assessmentsResponse.ok) {
        throw new Error("Failed to fetch assessments")
      }

      const assessmentsData = await assessmentsResponse.json()
      setAssessments(assessmentsData)

      setLoading(false)
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again later.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }

  // If loading or not authenticated, show loading state
  if (status === "loading" || loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-24 bg-[#522546] rounded-lg"></div>
            <div className="h-24 bg-[#522546] rounded-lg"></div>
            <div className="h-24 bg-[#522546] rounded-lg"></div>
          </div>
          <div className="h-64 bg-[#522546] rounded-lg"></div>
          <div className="h-96 bg-[#522546] rounded-lg"></div>
        </div>
      </div>
    )
  }

  // If not admin, show nothing
  if (status === "authenticated" && session?.user?.role !== "admin") {
    return null
  }

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some((opt) => !opt)) {
      toast({
        title: "Incomplete Question",
        description: "Please fill in the question and all options.",
        variant: "destructive",
      })
      return
    }

    setNewAssessment((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }],
    }))

    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    })

    toast({
      title: "Question Added",
      description: "The question has been added to the assessment.",
    })
  }

  const handleCreateAssessment = async () => {
    if (
      !newAssessment.title ||
      !newAssessment.category ||
      !newAssessment.description ||
      newAssessment.questions.length === 0
    ) {
      toast({
        title: "Incomplete Assessment",
        description: "Please fill in all required fields and add at least one question.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAssessment),
      })

      if (!response.ok) {
        throw new Error("Failed to create assessment")
      }

      const createdAssessment = await response.json()

      // Add the new assessment to the list
      setAssessments((prev) => [createdAssessment, ...prev])

      toast({
        title: "Assessment Created",
        description: "The assessment has been created successfully.",
      })

      // Reset form
      setNewAssessment({
        title: "",
        category: "",
        description: "",
        timeLimit: 30,
        questions: [],
      })
    } catch (error) {
      console.error("Error creating assessment:", error)
      toast({
        title: "Error",
        description: "Failed to create assessment. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAssessment = async (id: string) => {
    try {
      const response = await fetch(`/api/assessments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete assessment")
      }

      // Remove the assessment from the list
      setAssessments((prev) => prev.filter((assessment) => assessment._id !== id))

      toast({
        title: "Assessment Deleted",
        description: "The assessment has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting assessment:", error)
      toast({
        title: "Error",
        description: "Failed to delete assessment. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#F7374F]" />
                  <span className="text-2xl font-bold">{stats?.users?.total || 0}</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">New this week</div>
                  <div className="text-sm font-medium">+{stats?.users?.newThisWeek || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[#F7374F]" />
                  <span className="text-2xl font-bold">{stats?.assessments?.total || 0}</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Most popular</div>
                  <div className="text-sm font-medium truncate max-w-[120px]">
                    {stats?.assessments?.mostPopular || "N/A"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#F7374F]" />
                  <span className="text-2xl font-bold">{stats?.assessments?.averageScore || 0}%</span>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Active users today</div>
                  <div className="text-sm font-medium">{stats?.users?.activeToday || 0}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="bg-[#2C2C2C] border-[#522546] lg:col-span-2">
          <CardHeader>
            <CardTitle>Assessment Distribution</CardTitle>
            <CardDescription>Number of assessments by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.assessments?.categories &&
                Object.entries(stats.assessments.categories).map(([category, count]: [string, any]) => (
                  <div key={category} className="flex items-center gap-3">
                    <div className="bg-[#522546] p-2 rounded-md">
                      {category === "AI & Machine Learning" ? (
                        <Brain className="h-6 w-6" />
                      ) : category === "Web Development" ? (
                        <Code className="h-6 w-6" />
                      ) : category === "Database Systems" ? (
                        <Database className="h-6 w-6" />
                      ) : category === "Backend & DevOps" ? (
                        <Server className="h-6 w-6" />
                      ) : (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <span>{category}</span>
                        <span>{count}</span>
                      </div>
                      <div className="h-2 bg-[#522546] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#F7374F]"
                          style={{ width: `${(count / stats.assessments.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}

              {(!stats?.assessments?.categories || Object.keys(stats.assessments.categories).length === 0) && (
                <div className="text-center py-4">
                  <p className="text-gray-400">No assessment categories available.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-[#522546]">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-[#F7374F] hover:bg-[#88304E] justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Assessment
            </Button>
            <Button className="w-full bg-[#522546] hover:bg-[#88304E] justify-start">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
            <Button className="w-full bg-[#522546] hover:bg-[#88304E] justify-start">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="assessments" className="space-y-6">
        <TabsList className="bg-[#522546]">
          <TabsTrigger value="assessments">Manage Assessments</TabsTrigger>
          <TabsTrigger value="create">Create Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="assessments">
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader>
              <CardTitle>Recent Assessments</CardTitle>
              <CardDescription>Manage existing assessments</CardDescription>
            </CardHeader>
            <CardContent>
              {assessments.length > 0 ? (
                <div className="space-y-4">
                  {assessments.map((assessment) => (
                    <div key={assessment._id} className="p-4 bg-[#522546] rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-3 mb-2 md:mb-0">
                          <div className="bg-[#88304E] p-2 rounded-full">
                            {assessment.category === "AI & Machine Learning" ? (
                              <Brain className="h-6 w-6" />
                            ) : assessment.category === "Web Development" ? (
                              <Code className="h-6 w-6" />
                            ) : assessment.category === "Database Systems" ? (
                              <Database className="h-6 w-6" />
                            ) : assessment.category === "Backend & DevOps" ? (
                              <Server className="h-6 w-6" />
                            ) : (
                              <BookOpen className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{assessment.title}</h3>
                            <p className="text-sm text-gray-400">{assessment.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-400">
                              Expires: {new Date(assessment.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteAssessment(assessment._id as string)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{assessment.questions.length} Questions</span>
                          </div>
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No assessments available. Create your first assessment.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create">
          <Card className="bg-[#2C2C2C] border-[#522546]">
            <CardHeader>
              <CardTitle>Create New Assessment</CardTitle>
              <CardDescription>Add a new assessment to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Assessment Title</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Machine Learning Fundamentals"
                        value={newAssessment.title}
                        onChange={(e) => setNewAssessment({ ...newAssessment, title: e.target.value })}
                        className="bg-[#2C2C2C] border-[#522546]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newAssessment.category}
                        onValueChange={(value) => setNewAssessment({ ...newAssessment, category: value })}
                      >
                        <SelectTrigger className="bg-[#2C2C2C] border-[#522546]">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AI & Machine Learning">AI & Machine Learning</SelectItem>
                          <SelectItem value="Web Development">Web Development</SelectItem>
                          <SelectItem value="Database Systems">Database Systems</SelectItem>
                          <SelectItem value="Backend & DevOps">Backend & DevOps</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what this assessment covers..."
                      value={newAssessment.description}
                      onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                      className="bg-[#2C2C2C] border-[#522546] min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="5"
                      max="120"
                      value={newAssessment.timeLimit}
                      onChange={(e) =>
                        setNewAssessment({ ...newAssessment, timeLimit: Number.parseInt(e.target.value) })
                      }
                      className="bg-[#2C2C2C] border-[#522546] w-32"
                    />
                  </div>
                </div>

                <div className="border-t border-[#522546] pt-6">
                  <h3 className="text-lg font-medium mb-4">Questions ({newAssessment.questions.length} added)</h3>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="question">Question</Label>
                      <Textarea
                        id="question"
                        placeholder="Enter your question here..."
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                        className="bg-[#2C2C2C] border-[#522546]"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label>Options (select the correct answer)</Label>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="radio"
                            id={`option-${index}`}
                            name="correctAnswer"
                            checked={currentQuestion.correctAnswer === index}
                            onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                            className="text-[#F7374F] focus:ring-[#F7374F]"
                          />
                          <Input
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options]
                              newOptions[index] = e.target.value
                              setCurrentQuestion({ ...currentQuestion, options: newOptions })
                            }}
                            className="bg-[#2C2C2C] border-[#522546] flex-grow"
                          />
                        </div>
                      ))}
                    </div>

                    <Button onClick={handleAddQuestion} className="bg-[#88304E] hover:bg-[#F7374F]">
                      Add Question
                    </Button>
                  </div>

                  {newAssessment.questions.length > 0 && (
                    <div className="space-y-4 mb-6">
                      <h4 className="font-medium">Added Questions</h4>
                      <div className="space-y-2">
                        {newAssessment.questions.map((q, index) => (
                          <div key={index} className="p-3 bg-[#522546] rounded-lg">
                            <p className="font-medium mb-2">
                              Q{index + 1}: {q.question}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {q.options.map((opt, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded text-sm ${optIndex === q.correctAnswer ? "bg-green-900/30 border border-green-500" : "bg-[#2C2C2C]"}`}
                                >
                                  {opt}
                                  {optIndex === q.correctAnswer && (
                                    <span className="ml-2 text-green-500 text-xs">(Correct)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCreateAssessment}
                    className="w-full bg-[#F7374F] hover:bg-[#88304E]"
                    disabled={newAssessment.questions.length === 0}
                  >
                    Create Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

