"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  DollarSign,
  Loader2,
  ShoppingCart,
  Receipt,
  Plus,
  Trash2,
  Coffee,
  ShoppingBag,
} from "lucide-react"
import DashboardLayout from "@/components/dashboard-layout"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface ExpenseReport {
  summary: {
    totalItems: number
    totalQuantity: number
    totalAmount: number
    paidAmount: number
    unpaidAmount: number
    items: any[]
    productSales: {
      totalProductsSold: number
      totalProductSalesAmount: number
      items: any[]
    }
    expenditures: {
      totalExpenditures: number
      totalExpenditureItems: number
      items: any[]
    }
  }
  dailyBreakdown: Array<{
    _id: string
    dailyTotal: number
    dailyItems: number
  }>
  dailySalesBreakdown: Array<{
    _id: string
    dailySalesTotal: number
    dailySalesItems: number
  }>
  dailyExpendituresBreakdown: Array<{
    _id: string
    dailyExpendituresTotal: number
    dailyExpendituresItems: number
  }>
  period: string
}

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

export default function ExpensesPage() {
  const [report, setReport] = useState<ExpenseReport | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("lastMonth")
  const [customStartDate, setCustomStartDate] = useState("")
  const [customEndDate, setCustomEndDate] = useState("")

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [customItemName, setCustomItemName] = useState("")
  const [itemPrice, setItemPrice] = useState("")
  const [dailyReport, setDailyReport] = useState<DailyExpenseReport | null>(null)
  const [isDailyLoading, setIsDailyLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)

  const { toast } = useToast()

  const predefinedCategories = ["Tea", "Coffee", "Milk", "Food", "Other"]

  const fetchExpenseReport = async (period: string, startDate?: string, endDate?: string) => {
    setIsLoading(true)
    try {
      console.log("[v0] Fetching expense report for period:", period)
      let url = `/api/reports/expenses?period=${period}`
      if (period === "custom" && startDate && endDate) {
        url += `&startDate=${startDate}&endDate=${endDate}`
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      })

      clearTimeout(timeoutId)

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Failed to fetch expense report: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("[v0] Received expense report data:", data)

      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format")
      }

      setReport(data)
    } catch (error) {
      console.error("[v0] Error fetching expense report:", error)

      if (error.name === "AbortError") {
        toast({
          title: "Request Timeout",
          description: "The request took too long to complete. Please try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch expense report",
          variant: "destructive",
        })
      }

      setReport({
        summary: {
          totalItems: 0,
          totalQuantity: 0,
          totalAmount: 0,
          paidAmount: 0,
          unpaidAmount: 0,
          items: [],
          productSales: {
            totalProductsSold: 0,
            totalProductSalesAmount: 0,
            items: [],
          },
          expenditures: {
            totalExpenditures: 0,
            totalExpenditureItems: 0,
            items: [],
          },
        },
        dailyBreakdown: [],
        dailySalesBreakdown: [],
        dailyExpendituresBreakdown: [],
        period: period || "all",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchDailyExpenses = async () => {
    setIsDailyLoading(true)
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
      setDailyReport(data)
    } catch (error) {
      console.error("[v0] Error fetching daily expenses:", error)
      toast({
        title: "Error",
        description: "Failed to fetch daily expenses",
        variant: "destructive",
      })
    } finally {
      setIsDailyLoading(false)
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

  useEffect(() => {
    if (selectedPeriod === "custom") {
      if (customStartDate && customEndDate) {
        fetchExpenseReport(selectedPeriod, customStartDate, customEndDate)
      }
    } else {
      fetchExpenseReport(selectedPeriod)
    }
  }, [selectedPeriod, customStartDate, customEndDate])

  useEffect(() => {
    fetchDailyExpenses()
  }, [selectedDate])

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    if (period !== "custom") {
      setCustomStartDate("")
      setCustomEndDate("")
    }
  }

  const getPeriodLabel = () => {
    switch (selectedPeriod) {
      case "yesterday":
        return "Yesterday"
      case "lastWeek":
        return "Last 7 Days"
      case "lastMonth":
        return "Last 30 Days"
      case "lastYear":
        return "Last Year"
      case "custom":
        return customStartDate && customEndDate ? `${customStartDate} to ${customEndDate}` : "Custom Period"
      default:
        return "All Time"
    }
  }

  const formatChartData = () => {
    try {
      if (!report) {
        console.log("[v0] No report data available for chart")
        return []
      }

      const purchaseData = Array.isArray(report.dailyBreakdown) ? report.dailyBreakdown : []
      const salesData = Array.isArray(report.dailySalesBreakdown) ? report.dailySalesBreakdown : []
      const expendituresData = Array.isArray(report.dailyExpendituresBreakdown) ? report.dailyExpendituresBreakdown : []

      console.log("[v0] Chart data arrays:", {
        purchaseData: purchaseData.length,
        salesData: salesData.length,
        expendituresData: expendituresData.length,
      })

      const combinedData: { [key: string]: any } = {}

      // Process purchase data
      purchaseData.forEach((day) => {
        if (!day || !day._id) return
        try {
          const date = new Date(day._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          combinedData[day._id] = {
            date,
            purchases: Number(day.dailyTotal) || 0,
            purchaseItems: Number(day.dailyItems) || 0,
            sales: 0,
            salesItems: 0,
            expenditures: 0,
            expenditureItems: 0,
          }
        } catch (error) {
          console.error("[v0] Error processing purchase data:", error, day)
        }
      })

      // Process sales data
      salesData.forEach((day) => {
        if (!day || !day._id) return
        try {
          const date = new Date(day._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          if (combinedData[day._id]) {
            combinedData[day._id].sales = Number(day.dailySalesTotal) || 0
            combinedData[day._id].salesItems = Number(day.dailySalesItems) || 0
          } else {
            combinedData[day._id] = {
              date,
              purchases: 0,
              purchaseItems: 0,
              sales: Number(day.dailySalesTotal) || 0,
              salesItems: Number(day.dailySalesItems) || 0,
              expenditures: 0,
              expenditureItems: 0,
            }
          }
        } catch (error) {
          console.error("[v0] Error processing sales data:", error, day)
        }
      })

      // Process expenditures data
      expendituresData.forEach((day) => {
        if (!day || !day._id) return
        try {
          const date = new Date(day._id).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          if (combinedData[day._id]) {
            combinedData[day._id].expenditures = Number(day.dailyExpendituresTotal) || 0
            combinedData[day._id].expenditureItems = Number(day.dailyExpendituresItems) || 0
          } else {
            combinedData[day._id] = {
              date,
              purchases: 0,
              purchaseItems: 0,
              sales: 0,
              salesItems: 0,
              expenditures: Number(day.dailyExpendituresTotal) || 0,
              expenditureItems: Number(day.dailyExpendituresItems) || 0,
            }
          }
        } catch (error) {
          console.error("[v0] Error processing expenditures data:", error, day)
        }
      })

      const result = Object.values(combinedData).sort((a: any, b: any) => {
        try {
          return a.date.localeCompare(b.date)
        } catch (error) {
          console.error("[v0] Error sorting chart data:", error)
          return 0
        }
      })

      console.log("[v0] Formatted chart data:", result)
      return result
    } catch (error) {
      console.error("[v0] Error in formatChartData:", error)
      return []
    }
  }

  const isToday = selectedDate === new Date().toISOString().split("T")[0]

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading expense report...</span>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Expense Reports</h1>
            <p className="text-muted-foreground">
              Track your inventory purchases, product sales, daily expenses, and expenditures
            </p>
          </div>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            <TabsTrigger value="daily">Daily Expenses</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="lastWeek">Last 7 Days</SelectItem>
                  <SelectItem value="lastMonth">Last 30 Days</SelectItem>
                  <SelectItem value="lastYear">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Date Range */}
            {selectedPeriod === "custom" && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Custom Date Range</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Period Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {getPeriodLabel()}
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Summary Stats */}
            {report && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Items Purchased
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{report.summary?.totalItems || 0}</div>
                      <p className="text-xs text-muted-foreground">
                        {report.summary?.totalQuantity || 0} total quantity
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Purchase Amount
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        ₹{(report.summary?.totalAmount || 0).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total expenses for period</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Products Sold
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {report.summary?.productSales?.totalProductsSold || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Items sold to customers</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Sales Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ₹{(report.summary?.productSales?.totalProductSalesAmount || 0).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Revenue from product sales</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Receipt className="h-4 w-4" />
                        Expenditures
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        ₹{(report.summary?.expenditures?.totalExpenditures || 0).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {report.summary?.expenditures?.totalExpenditureItems || 0} expense items
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingDown className="h-4 w-4" />
                        Net Position
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className={`text-2xl font-bold ${
                          (
                            (report.summary?.productSales?.totalProductSalesAmount || 0) -
                              (report.summary?.totalAmount || 0) -
                              (report.summary?.expenditures?.totalExpenditures || 0)
                          ) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹
                        {(
                          (report.summary?.productSales?.totalProductSalesAmount || 0) -
                          (report.summary?.totalAmount || 0) -
                          (report.summary?.expenditures?.totalExpenditures || 0)
                        ).toFixed(2)}
                      </div>
                      <p className="text-xs text-muted-foreground">Sales - Purchases - Expenditures</p>
                    </CardContent>
                  </Card>
                </div>

                {(Array.isArray(report.dailyBreakdown) && report.dailyBreakdown.length > 0) ||
                (Array.isArray(report.dailySalesBreakdown) && report.dailySalesBreakdown.length > 0) ||
                (Array.isArray(report.dailyExpendituresBreakdown) && report.dailyExpendituresBreakdown.length > 0) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Financial Activity</CardTitle>
                        <CardDescription>Purchases vs Sales vs Expenditures comparison</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={formatChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                              formatter={(value, name) => [
                                `₹${Number(value).toFixed(2)}`,
                                name === "purchases" ? "Purchases" : name === "sales" ? "Sales" : "Expenditures",
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="purchases"
                              stroke="#ef4444"
                              strokeWidth={2}
                              dot={{ fill: "#ef4444" }}
                              name="purchases"
                            />
                            <Line
                              type="monotone"
                              dataKey="sales"
                              stroke="#10b981"
                              strokeWidth={2}
                              dot={{ fill: "#10b981" }}
                              name="sales"
                            />
                            <Line
                              type="monotone"
                              dataKey="expenditures"
                              stroke="#f97316"
                              strokeWidth={2}
                              dot={{ fill: "#f97316" }}
                              name="expenditures"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Daily Item Activity</CardTitle>
                        <CardDescription>Items purchased vs sold vs expenditure items per day</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={formatChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                              formatter={(value, name) => [
                                value,
                                name === "purchaseItems"
                                  ? "Items Purchased"
                                  : name === "salesItems"
                                    ? "Items Sold"
                                    : "Expenditure Items",
                              ]}
                            />
                            <Bar dataKey="purchaseItems" fill="#ef4444" name="purchaseItems" />
                            <Bar dataKey="salesItems" fill="#10b981" name="salesItems" />
                            <Bar dataKey="expenditureItems" fill="#f97316" name="expenditureItems" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}

                {report.summary?.expenditures?.items?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Expenditures</CardTitle>
                      <CardDescription>Manual expenses added to bills in this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {report.summary?.expenditures?.items.slice(0, 10).map((exp: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg bg-orange-50/50"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{exp.name}</h4>
                                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                                  EXPENSE
                                </Badge>
                              </div>
                              {exp.description && (
                                <div className="text-sm text-muted-foreground">{exp.description}</div>
                              )}
                              <div className="text-xs text-muted-foreground">
                                Added to bill for: {exp.clientName} on {new Date(exp.addedAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-orange-600">-₹{(exp.price || 0).toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                        {report.summary?.expenditures?.items.length > 10 && (
                          <p className="text-center text-muted-foreground">
                            And {report.summary?.expenditures?.items.length - 10} more expenditures...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {report.summary?.productSales?.items?.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Product Sales</CardTitle>
                      <CardDescription>Products sold to customers in this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(report.summary?.productSales?.items || []).slice(0, 10).map((sale: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg bg-green-50/50"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{sale.productName}</h4>
                                <Badge variant={sale.brandName === "Paid" ? "default" : "destructive"}>
                                  {sale.brandName}
                                </Badge>
                                <Badge variant="secondary">SOLD</Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {sale.quantitySold} × ₹{sale.pricePerUnit.toFixed(2)} = ₹
                                {sale.totalPrice.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Sold to: {sale.clientName} on {new Date(sale.soldAt).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-green-600">+₹{sale.totalPrice.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                        {(report.summary?.productSales?.items?.length || 0) > 10 && (
                          <p className="text-center text-muted-foreground">
                            And {(report.summary?.productSales?.items?.length || 0) - 10} more sales...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Purchases */}
                {report.summary?.items.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Purchases</CardTitle>
                      <CardDescription>Items purchased for inventory in this period</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {report.summary?.items.slice(0, 10).map((item: any) => (
                          <div key={item._id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{item.name}</h4>
                                <Badge variant={item.paymentStatus === "Paid" ? "default" : "destructive"}>
                                  {item.paymentStatus}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.quantity} × ₹{item.pricePerUnit.toFixed(2)} = ₹{item.total.toFixed(2)}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(item.dateEntered).toLocaleDateString()}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-red-600">-₹{item.total.toFixed(2)}</div>
                            </div>
                          </div>
                        ))}
                        {report.summary?.items.length > 10 && (
                          <p className="text-center text-muted-foreground">
                            And {report.summary?.items.length - 10} more items...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* No Data State */}
                {report.summary?.totalItems === 0 &&
                  (report.summary?.productSales?.totalProductsSold || 0) === 0 &&
                  (report.summary?.expenditures?.totalExpenditureItems || 0) === 0 && (
                    <Card>
                      <CardContent className="py-8 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No activity found</h3>
                        <p className="text-muted-foreground">
                          No inventory items were purchased, sold, or expenditures added during the selected period.
                        </p>
                      </CardContent>
                    </Card>
                  )}
              </>
            )}
          </TabsContent>

          <TabsContent value="daily" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Daily Expenses</h2>
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
                  {isDailyLoading ? (
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
                            ₹{dailyReport?.totalAmount.toFixed(2) || "0.00"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Items</div>
                          <div className="text-xl font-semibold">{dailyReport?.count || 0}</div>
                        </div>
                      </div>

                      {/* Expense List */}
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {dailyReport?.expenses && dailyReport.expenses.length > 0 ? (
                          dailyReport.expenses.map((expense) => (
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
