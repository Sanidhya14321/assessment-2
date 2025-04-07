import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { getAdminStats } from "@/lib/db"
import { authOptions } from "@/lib/auth-options"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await getAdminStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}

