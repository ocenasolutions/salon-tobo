import type { ObjectId } from "mongodb"

export interface Package {
  _id?: ObjectId
  name: string
  description: string
  // Gender-based pricing structure
  menPricing?: {
    basic?: number
    advance?: number
  }
  womenPricing?: {
    basic?: number
    advance?: number
  }
  // Legacy fields for backward compatibility
  price?: number
  type?: "Basic" | "Premium"
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface InventoryItem {
  _id?: ObjectId
  itemName: string
  brandName: string
  category: string
  quantity: number
  shadesCode?: string
  stockIn: number
  unitPrice: number
  userId: ObjectId
  createdAt: Date
  updatedAt: Date
}
