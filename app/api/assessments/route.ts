import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()

    const assessments = await db.collection("assessments").find({}).toArray()

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Error fetching assessments:", error)
    return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession()

    // Check if user is authenticated and is an admin
    if (!session || session.user?.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.category || !data.description || !data.questions || data.questions.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    // Add creation date and expiration date (20 days from now)
    const now = new Date()
    const expiresAt = new Date()
    expiresAt.setDate(now.getDate() + 20)

    const assessment = {
      ...data,
      createdAt: now,
      expiresAt: expiresAt,
      upvotes: 0,
      downvotes: 0,
    }

    const result = await db.collection("assessments").insertOne(assessment)

    return NextResponse.json({
      id: result.insertedId,
      ...assessment,
    })
  } catch (error) {
    console.error("Error creating assessment:", error)
    return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
  }
}

