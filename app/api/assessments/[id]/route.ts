import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const client = await clientPromise
    const db = client.db()

    const assessment = await db.collection("assessments").findOne({
      _id: new ObjectId(id),
    })

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
    const session = await getServerSession()

    // Check if user is authenticated and is an admin
    if (!session || session.user?.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const client = await clientPromise
    const db = client.db()

    const result = await db.collection("assessments").deleteOne({
      _id: new ObjectId(id),
    })

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

    const client = await clientPromise
    const db = client.db()

    const updateField = action === "upvote" ? "upvotes" : "downvotes"

    const result = await db
      .collection("assessments")
      .updateOne({ _id: new ObjectId(id) }, { $inc: { [updateField]: 1 } })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating assessment:", error)
    return NextResponse.json({ error: "Failed to update assessment" }, { status: 500 })
  }
}

