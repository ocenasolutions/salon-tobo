import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import type { Package } from "@/lib/models/Package"
import { ObjectId } from "mongodb"

export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.userId

    const db = await getDatabase()
    const packagesCollection = db.collection<Package>("packages")

    const packages = await packagesCollection
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json({ packages }, { status: 200 })
  } catch (error) {
    console.error("Get packages error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token =
      request.cookies.get("auth-token")?.value || request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const userId = decoded.userId

    const { name, description, menPricing, womenPricing } = await request.json()

    // Validation
    if (!name || !description) {
      return NextResponse.json({ error: "Package name and description are required" }, { status: 400 })
    }

    if (!menPricing && !womenPricing) {
      return NextResponse.json({ error: "Please provide pricing for at least one gender" }, { status: 400 })
    }

    // Validate men's pricing if provided
    if (menPricing) {
      if (menPricing.basic && (typeof menPricing.basic !== "number" || menPricing.basic <= 0)) {
        return NextResponse.json({ error: "Men's basic price must be a positive number" }, { status: 400 })
      }
      if (menPricing.advance && (typeof menPricing.advance !== "number" || menPricing.advance <= 0)) {
        return NextResponse.json({ error: "Men's advance price must be a positive number" }, { status: 400 })
      }
    }

    // Validate women's pricing if provided
    if (womenPricing) {
      if (womenPricing.basic && (typeof womenPricing.basic !== "number" || womenPricing.basic <= 0)) {
        return NextResponse.json({ error: "Women's basic price must be a positive number" }, { status: 400 })
      }
      if (womenPricing.advance && (typeof womenPricing.advance !== "number" || womenPricing.advance <= 0)) {
        return NextResponse.json({ error: "Women's advance price must be a positive number" }, { status: 400 })
      }
    }

    const db = await getDatabase()
    const packagesCollection = db.collection<Package>("packages")

    const newPackage: Package = {
      name: name.trim(),
      description: description.trim(),
      menPricing: menPricing || undefined,
      womenPricing: womenPricing || undefined,
      userId: new ObjectId(userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await packagesCollection.insertOne(newPackage)

    return NextResponse.json({ message: "Package created successfully", packageId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Create package error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
