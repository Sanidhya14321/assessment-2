import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { User, Assessment, Result } from "./models"
import bcrypt from "bcryptjs"

// Database name
const dbName = "assessment-platform"

// Get database connection
async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}

// User operations
export async function createUser(userData: Omit<User, "createdAt" | "role">) {
  const db = await getDb()

  // Check if user already exists
  const existingUser = await db.collection("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  // Create user with default role
  const newUser: User = {
    ...userData,
    password: hashedPassword,
    role: "user",
    createdAt: new Date(),
  }

  const { _id, ...userWithoutId } = newUser
  const result = await db.collection("users").insertOne(userWithoutId)
  return { ...newUser, _id: result.insertedId.toString() }
}

export async function getUserByEmail(email: string) {
  const db = await getDb()
  return db.collection("users").findOne({ email }) as Promise<User | null>
}

export async function validateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return user
}

// Assessment operations
export async function createAssessment(
  assessmentData: Omit<Assessment, "upvotes" | "downvotes" | "createdAt" | "expiresAt">,
) {
  const db = await getDb()

  // Add default values
  const now = new Date()
  const expiresAt = new Date()
  expiresAt.setDate(now.getDate() + 20) // Expires in 20 days

  const newAssessment: Assessment = {
    ...assessmentData,
    upvotes: 0,
    downvotes: 0,
    createdAt: now,
    expiresAt,
  }

  const { _id, ...assessmentWithoutId } = newAssessment
  const result = await db.collection("assessments").insertOne(assessmentWithoutId)
  return { ...newAssessment, _id: result.insertedId.toString() }
}

export async function getAllAssessments() {
  const db = await getDb()
  const assessments = await db.collection("assessments").find({}).toArray()
  return assessments.map((assessment) => ({
    ...assessment,
    _id: assessment._id.toString(),
  }))
}

export async function getAssessmentById(id: string) {
  const db = await getDb()
  try {
    const assessment = await db.collection("assessments").findOne({ _id: new ObjectId(id) })
    if (!assessment) return null

    return {
      ...assessment,
      _id: assessment._id.toString(),
    }
  } catch (error) {
    console.error("Error in getAssessmentById:", error)
    return null
  }
}

export async function deleteAssessment(id: string) {
  const db = await getDb()
  try {
    return await db.collection("assessments").deleteOne({ _id: new ObjectId(id) })
  } catch (error) {
    console.error("Error in deleteAssessment:", error)
    throw error
  }
}

export async function voteAssessment(id: string, voteType: "upvote" | "downvote") {
  const db = await getDb()
  const updateField = voteType === "upvote" ? "upvotes" : "downvotes"

  try {
    return await db.collection("assessments").updateOne({ _id: new ObjectId(id) }, { $inc: { [updateField]: 1 } })
  } catch (error) {
    console.error("Error in voteAssessment:", error)
    throw error
  }
}

// Result operations
export async function saveResult(resultData: Omit<Result, "completedAt">) {
  const db = await getDb()

  const newResult: Result = {
    ...resultData,
    completedAt: new Date(),
  }

  try {
    const { _id, ...resultWithoutId } = newResult
    const result = await db.collection("results").insertOne(resultWithoutId)
    return { ...newResult, _id: result.insertedId.toString() }
  } catch (error) {
    console.error("Error in saveResult:", error)
    throw error
  }
}

export async function getUserResults(userId: string) {
  const db = await getDb()
  try {
    const results = await db.collection("results").find({ userId }).sort({ completedAt: -1 }).toArray()

    return results.map((result) => ({
      ...result,
      _id: result._id.toString(),
    }))
  } catch (error) {
    console.error("Error in getUserResults:", error)
    throw error
  }
}

// Admin statistics
export async function getAdminStats() {
  const db = await getDb()

  try {
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
    assessments.forEach((assessment: any) => {
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

    return {
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
    }
  } catch (error) {
    console.error("Error in getAdminStats:", error)
    throw error
  }
}

