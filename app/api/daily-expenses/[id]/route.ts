import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { database } = await connectToDatabase()

    const result = await database.collection("dailyExpenses").deleteOne({
      _id: new ObjectId(params.id),
      userId: new ObjectId(decoded.userId),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting daily expense:", error)
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}
