import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { saveResult, getUserResults } from "@/lib/db"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const results = await getUserResults(session.user.id)
    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.assessmentId || data.score === undefined || !data.answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await saveResult({
      userId: session.user.id,
      userEmail: session.user.email || "",
      userName: session.user.name || "",
      assessmentId: data.assessmentId,
      assessmentTitle: data.assessmentTitle,
      category: data.category,
      score: data.score,
      answers: data.answers,
      timeSpent: data.timeSpent || 0,
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error saving result:", error)
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
  }
}

