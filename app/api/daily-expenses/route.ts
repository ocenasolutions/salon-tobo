import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
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

    const { itemName, price, date } = await request.json()

    if (!itemName || !price) {
      return NextResponse.json({ error: "Item name and price are required" }, { status: 400 })
    }

    const { database } = await connectToDatabase()

    const dailyExpense = {
      userId: new ObjectId(decoded.userId),
      itemName: itemName.trim(),
      price: Number(price),
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    }

    const result = await database.collection("dailyExpenses").insertOne(dailyExpense)

    return NextResponse.json({
      success: true,
      expenseId: result.insertedId,
      message: "Daily expense added successfully",
    })
  } catch (error) {
    console.error("Error adding daily expense:", error)
    return NextResponse.json({ error: "Failed to add daily expense" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const date = searchParams.get("date")

    const { database } = await connectToDatabase()

    // Default to today if no date provided
    const targetDate = date ? new Date(date) : new Date()
    const startOfDay = new Date(targetDate)
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date(targetDate)
    endOfDay.setHours(23, 59, 59, 999)

    const expenses = await database
      .collection("dailyExpenses")
      .find({
        userId: new ObjectId(decoded.userId),
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .sort({ createdAt: -1 })
      .toArray()

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.price, 0)

    return NextResponse.json({
      expenses,
      totalAmount,
      date: targetDate.toISOString().split("T")[0],
      count: expenses.length,
    })
  } catch (error) {
    console.error("Error fetching daily expenses:", error)
    return NextResponse.json({ error: "Failed to fetch daily expenses" }, { status: 500 })
  }
}
