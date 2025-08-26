"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Plus, Trash2, Coffee, ShoppingBag, Loader2 } from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"

interface DailyExpense {
  _id: string
  itemName: string
  price: number
  date: string
  createdAt: string
}

interface DailyExpenseReport {
  expenses: DailyExpense[]
  totalAmount: number
  date: string
  count: number
}

export default function DailyExpensesPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [customItemName, setCustomItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [report, setReport] = useState<DailyExpenseReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const { toast } = useToast()

  const predefinedCategories = ["Tea", "Coffee", "Milk", "Food", "Other"]

  useEffect(() => {
    fetchDailyExpenses()
  }, [selectedDate])

  const fetchDailyExpenses = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/daily-expenses?date=${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch daily expenses")
      }

      const data = await response.json()
      setReport(data)
    } catch (error) {
      console.error("[v0] Error fetching daily expenses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch daily expenses",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addExpense = async () => {
    const itemName = selectedCategory === "Other" ? customItemName.trim() : selectedCategory

    if (!itemName || !itemPrice.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const price = Number.parseFloat(itemPrice)
    if (isNaN(price) || price <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/daily-expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          itemName,
          price,
          date: selectedDate,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add expense")
      }

      // Reset form
      setSelectedCategory("")
      setCustomItemName("")
      setItemPrice("")

      // Refresh the report
      await fetchDailyExpenses()

      toast({
        title: "Success",
        description: "Daily expense added successfully",
      })
    } catch (error) {
      console.error("[v0] Error adding expense:", error)
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  const deleteExpense = async (expenseId: string) => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/daily-expenses/${expenseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to delete expense")
      }

      await fetchDailyExpenses()
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      })
    } catch (error) {
      console.error("[v0] Error deleting expense:", error)
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      })
    }
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Daily Expenses</h1>
            <p className="text-muted-foreground">Track your daily business expenses</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Expense Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Daily Expense
              </CardTitle>
              <CardDescription>
                Add expenses for {isToday ? "today" : new Date(selectedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Item Category *</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {predefinedCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customItem">Custom Item Name *</Label>
                  <Input
                    id="customItem"
                    placeholder="Enter item name"
                    value={customItemName}
                    onChange={(e) => setCustomItemName(e.target.value)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="Enter amount"
                  value={itemPrice}
                  onChange={(e) => setItemPrice(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>

              <Button
                onClick={addExpense}
                disabled={
                  isAdding ||
                  !selectedCategory ||
                  !itemPrice.trim() ||
                  (selectedCategory === "Other" && !customItemName.trim())
                }
                className="w-full"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Daily Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Daily Report
              </CardTitle>
              <CardDescription>
                Expenses for {isToday ? "today" : new Date(selectedDate).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading expenses...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Expenses</div>
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{report?.totalAmount.toFixed(2) || "0.00"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Items</div>
                      <div className="text-xl font-semibold">{report?.count || 0}</div>
                    </div>
                  </div>

                  {/* Expense List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {report?.expenses && report.expenses.length > 0 ? (
                      report.expenses.map((expense) => (
                        <div
                          key={expense._id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <Coffee className="h-4 w-4 text-orange-500" />
                            <div>
                              <div className="font-medium">{expense.itemName}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(expense.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-orange-50 text-orange-700">
                              ₹{expense.price.toFixed(2)}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteExpense(expense._id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Coffee className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
                        <p className="text-muted-foreground">
                          {isToday ? "Add your first expense for today" : "No expenses recorded for this date"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
