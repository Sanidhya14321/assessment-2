import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// This route is for development purposes only
// It creates an admin user if one doesn't exist
export async function GET(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not allowed in production" }, { status: 403 })
  }

  try {
    const client = await clientPromise
    const db = client.db("assessment-platform")

    // Check if admin user exists
    const adminUser = await db.collection("users").findOne({ email: "admin@example.com" })

    if (!adminUser) {
      // Create admin user
      const hashedPassword = await bcrypt.hash("admin123", 10)

      await db.collection("users").insertOne({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
      })

      return NextResponse.json({ message: "Admin user created successfully" })
    }

    return NextResponse.json({ message: "Admin user already exists" })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 })
  }
}

