import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getServerSession } from "next-auth/next"

export async function GET() {
  try {
    const session = await getServerSession()

    // Check if user is authenticated and is an admin
    if (!session || session.user?.email !== "admin@example.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db()

    // Get user stats
    const totalUsers = await db.collection("users").countDocuments()

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const newUsers = await db.collection("users").countDocuments({
      createdAt: { $gte: oneWeekAgo },
    })

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const activeUsers = await db.collection("results").distinct("userEmail", {
      completedAt: { $gte: today },
    })

    // Get assessment stats
    const assessments = await db.collection("assessments").find({}).toArray()

    const categories: Record<string, number> = {}
    assessments.forEach((assessment) => {
      if (!categories[assessment.category]) {
        categories[assessment.category] = 0
      }
      categories[assessment.category]++
    })

    // Get most popular assessment
    const popularAssessments = await db
      .collection("results")
      .aggregate([{ $group: { _id: "$assessmentTitle", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 1 }])
      .toArray()

    const mostPopular = popularAssessments.length > 0 ? popularAssessments[0]._id : ""

    // Get average score
    const scores = await db
      .collection("results")
      .aggregate([{ $group: { _id: null, average: { $avg: "$score" } } }])
      .toArray()

    const averageScore = scores.length > 0 ? Math.round(scores[0].average) : 0

    return NextResponse.json({
      users: {
        total: totalUsers,
        newThisWeek: newUsers,
        activeToday: activeUsers.length,
      },
      assessments: {
        total: assessments.length,
        categories,
        mostPopular,
        averageScore,
      },
    })
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}

