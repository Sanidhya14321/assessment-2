import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { createAssessment, getAllAssessments } from "@/lib/db"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    const assessments = await getAllAssessments()
    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category || !data.description || !data.questions || data.questions.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const assessment = await createAssessment({
      title: data.title,
      category: data.category,
      description: data.description,
      questions: data.questions,
      timeLimit: data.timeLimit || 30,
    })

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("Error creating assessment:", error)
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
  }
}

