import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAssessmentById, deleteAssessment, voteAssessment } from "@/lib/db"
import { authOptions } from "@/lib/auth-options"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const assessment = await getAssessmentById(id)

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json(assessment)
  } catch (error) {
    console.error("Error fetching assessment:", error)
    return NextResponse.json({ error: "Failed to fetch assessment" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const result = await deleteAssessment(id)

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting assessment:", error)
    return NextResponse.json({ error: "Failed to delete assessment" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { action } = await request.json()

    if (!action || (action !== "upvote" && action !== "downvote")) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const result = await voteAssessment(id, action as "upvote" | "downvote")

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating assessment:", error)
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
  }
}

