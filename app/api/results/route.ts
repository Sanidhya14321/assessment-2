import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    const results = await db
      .collection("results")
      .find({ userEmail: session.user?.email })
      .sort({ completedAt: -1 })
      .toArray()

    return NextResponse.json(results)
  } catch (error) {
    console.error("Error fetching results:", error)
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.assessmentId || !data.score || !data.answers) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get assessment details
    const assessment = await db.collection("assessments").findOne({
      _id: data.assessmentId,
    })

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    const result = {
      userEmail: session.user?.email,
      userName: session.user?.name,
      assessmentId: data.assessmentId,
      assessmentTitle: assessment.title,
      category: assessment.category,
      score: data.score,
      answers: data.answers,
      timeSpent: data.timeSpent || 0,
      completedAt: new Date(),
    }

    await db.collection("results").insertOne(result)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving result:", error)
    return NextResponse.json({ error: "Failed to save result" }, { status: 500 })
  }
}

