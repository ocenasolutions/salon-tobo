"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Package, Receipt, Calendar, User, MessageCircle, Edit, Trash2, Plus, Eye, ChevronRight, MoreVertical } from "lucide-react"
import type { Bill } from "@/lib/models/Bill"
import EditBillDialog from "@/components/bills/edit-bill-dialog"
import DeleteBillDialog from "@/components/bills/delete-bill-dialog"
import CreateBillDialog from "@/components/bills/create-bill-dialog"
import type { Package as PackageType } from "@/lib/models/Package"
import DashboardLayout from "@/components/dashboard-layout"

interface DashboardAnalytics {
  todaysTotalSales: number
  highestBillToday: Bill | null
  totalPackages: number
  totalBills: number
  recentBills: Bill[]
  thisWeeksTotalSales: number
  thisMonthsTotalSales: number
  todaysBillsCount: number
  totalMorningPackages: number
  mostUsedPackage: { name: string; count: number } | null
  todaysExpenditures: number
  thisWeeksExpenditures: number
  thisMonthsExpenditures: number
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null)
  const [packages, setPackages] = useState<PackageType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBill, setEditingBill] = useState<Bill | null>(null)
  const [deletingBill, setDeletingBill] = useState<Bill | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [expandedBills, setExpandedBills] = useState<Set<string>>(new Set())

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/dashboard/analytics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Dashboard analytics data received:", data)
        console.log("[v0] Recent bills from API:", data.recentBills?.length || 0)
        console.log(
          "[v0] Recent bills data:",
          data.recentBills?.map((bill: any) => ({
            id: bill._id,
            clientName: bill.clientName,
            totalAmount: bill.totalAmount,
            createdAt: bill.createdAt,
          })),
        )
        setAnalytics(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    }
  }

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setPackages(data.packages)
      }
    } catch (error) {
      console.error("Error fetching packages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    fetchPackages()
  }, [])

  const handleBillUpdated = () => {
    fetchAnalytics()
    setEditingBill(null)
  }

  const handleBillDeleted = () => {
    fetchAnalytics()
    setDeletingBill(null)
  }

  const handleBillCreated = () => {
    fetchAnalytics()
    setShowCreateDialog(false)
  }

  const isBillEditable = (bill: Bill) => {
    const now = new Date()
    const billCreatedAt = new Date(bill.createdAt)
    const timeDifferenceInMinutes = (now.getTime() - billCreatedAt.getTime()) / (1000 * 60)
    return timeDifferenceInMinutes <= 15
  }

  const toggleBillExpanded = (billId: string) => {
    setExpandedBills(prev => {
      const newSet = new Set(prev)
      if (newSet.has(billId)) {
        newSet.delete(billId)
      } else {
        newSet.add(billId)
      }
      return newSet
    })
  }

  const handleWhatsAppShare = (bill: Bill) => {
    if (!bill.customerMobile) return

    const message = `Hello ${bill.clientName}! 🌸

Your bill from *HUSN Beauty Salon* has been processed.

💰 *Total Amount: ₹${(bill.upiAmount + bill.cardAmount + bill.cashAmount + bill.productSale).toFixed(2)}*

Thank you for visiting HUSN Beauty Salon! ✨
We hope you loved your experience with us.

Visit us again soon! 💕`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${bill.customerMobile.replace(/[^0-9]/g, "")}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-primary/40 animate-pulse mx-auto"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-foreground">Loading Dashboard</p>
              <p className="text-sm text-muted-foreground">Fetching today's data...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 pb-24 px-2 sm:px-4 lg:px-6">
        {analytics && (
          <>
            {/* Enhanced Header Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent rounded-2xl"></div>
              <div className="relative text-center py-6 sm:py-8 px-4 sm:px-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live Dashboard
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-serif font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Daily Bills
                </h1>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-8 text-sm sm:text-base lg:text-lg">
                  <div className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full border shadow-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="font-semibold">HUSN Beauty Salon</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-background/80 backdrop-blur-sm rounded-full border shadow-sm">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    <span className="font-medium">{new Date().toLocaleDateString('en-IN', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="group border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-green-50/50 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-green-700 transition-colors">Today's Revenue</CardTitle>
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                    ₹{analytics.todaysTotalSales.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {analytics.todaysBillsCount} transaction{analytics.todaysBillsCount !== 1 ? "s" : ""} today
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      +{((analytics.todaysTotalSales / (analytics.thisWeeksTotalSales || 1)) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="group border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-blue-700 transition-colors">Peak Transaction</CardTitle>
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    ₹{analytics.highestBillToday ? analytics.highestBillToday.totalAmount.toLocaleString('en-IN') : "0"}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {analytics.highestBillToday ? `by ${analytics.highestBillToday.clientName}` : "No transactions yet"}
                  </p>
                </CardContent>
              </Card>

              <Card className="group border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-purple-50/50 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-purple-700 transition-colors">Service Packages</CardTitle>
                  <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Package className="h-4 w-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">{analytics.totalPackages}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">Active service options</p>
                </CardContent>
              </Card>

              <Card className="group border-border/40 hover:border-primary/20 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-gradient-to-br from-orange-50/50 to-transparent">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-orange-700 transition-colors">Total Invoices</CardTitle>
                  <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Receipt className="h-4 w-4 text-orange-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{analytics.totalBills}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">All time records</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Bills Section */}
            <Card className="border-border/40 shadow-lg">
              <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-background to-muted/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-serif flex items-center gap-2">
                      <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      Today's Transactions
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base mt-1">
                      Complete record of today's salon activities with detailed payment breakdown
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs sm:text-sm px-3 py-1">
                      {analytics.recentBills.length} Bills
                    </Badge>
                    <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1">
                      ₹{analytics.todaysTotalSales.toLocaleString('en-IN')} Total
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-3 sm:px-6">
                {analytics.recentBills.length === 0 ? (
                  <div className="text-center py-12 sm:py-16">
                    <div className="relative mb-6">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted/50 rounded-full mx-auto flex items-center justify-center">
                        <Receipt className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/50" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary/20 rounded-full animate-ping"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">No Bills Created Yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Start your day by creating the first bill for today's customers
                    </p>
                    <Button 
                      size="lg" 
                      onClick={() => setShowCreateDialog(true)} 
                      disabled={packages.length === 0}
                      className="px-8 py-3 text-base font-semibold"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create First Bill
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Desktop Table View - Enhanced */}
                    <div className="hidden xl:block">
                      <div className="overflow-hidden rounded-lg border border-border/40">
                        <div className="bg-muted/30 border-b border-border/40">
                          <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm text-muted-foreground">
                            <div className="col-span-1">Sr.</div>
                            <div className="col-span-2">Client Details</div>
                            <div className="col-span-2">Services</div>
                            <div className="col-span-1 text-center">UPI</div>
                            <div className="col-span-1 text-center">Card</div>
                            <div className="col-span-1 text-center">Cash</div>
                            <div className="col-span-1">Attendant</div>
                            <div className="col-span-1 text-center">Products</div>
                            <div className="col-span-1 text-center">Total</div>
                            <div className="col-span-1 text-center">Actions</div>
                          </div>
                        </div>

                        <div className="divide-y divide-border/40">
                          {analytics.recentBills.map((bill, index) => {
                            const isEditable = isBillEditable(bill)
                            const srNo = analytics.recentBills.length - index

                            return (
                              <div
                                key={bill._id?.toString()}
                                className="grid grid-cols-12 gap-4 p-4 hover:bg-muted/20 transition-all duration-200 group"
                              >
                                <div className="col-span-1 flex items-center">
                                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                    {srNo}
                                  </div>
                                </div>
                                
                                <div className="col-span-2 flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
                                    <User className="h-5 w-5 text-primary" />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-semibold text-sm truncate">{bill.clientName}</span>
                                    {bill.customerMobile && (
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-muted-foreground">{bill.customerMobile}</span>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-5 w-5 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                          onClick={() => handleWhatsAppShare(bill)}
                                          title="Share on WhatsApp"
                                        >
                                          <MessageCircle className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="col-span-2 flex items-center">
                                  <div className="flex flex-wrap gap-1 max-w-full">
                                    {bill.items.slice(0, 2).map((item, itemIndex) => (
                                      <Badge
                                        key={itemIndex}
                                        variant={item.packageType === "Premium" ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {item.packageName}
                                      </Badge>
                                    ))}
                                    {bill.items.length > 2 && (
                                      <Badge variant="outline" className="text-xs">
                                        +{bill.items.length - 2}
                                      </Badge>
                                    )}
                                  </div>
                                </div>

                                <div className="col-span-1 text-center flex items-center justify-center">
                                  {bill.upiAmount > 0 ? (
                                    <div className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-sm font-medium">
                                      ₹{bill.upiAmount.toFixed(0)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </div>

                                <div className="col-span-1 text-center flex items-center justify-center">
                                  {bill.cardAmount > 0 ? (
                                    <div className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium">
                                      ₹{bill.cardAmount.toFixed(0)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </div>

                                <div className="col-span-1 text-center flex items-center justify-center">
                                  {bill.cashAmount > 0 ? (
                                    <div className="px-2 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-medium">
                                      ₹{bill.cashAmount.toFixed(0)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </div>

                                <div className="col-span-1 flex items-center">
                                  <span className="text-sm font-medium truncate">{bill.attendantBy}</span>
                                </div>

                                <div className="col-span-1 text-center flex items-center justify-center">
                                  {bill.productSale > 0 ? (
                                    <div className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-sm font-medium">
                                      ₹{bill.productSale.toFixed(0)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">-</span>
                                  )}
                                </div>

                                <div className="col-span-1 text-center flex items-center justify-center">
                                  <div className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm font-bold">
                                    ₹{bill.totalAmount.toFixed(0)}
                                  </div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center gap-1">
                                  {isEditable ? (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setEditingBill(bill)}
                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                        title="Edit bill"
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setDeletingBill(bill)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                        title="Delete bill"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Locked</span>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Enhanced Desktop Total Row */}
                        <div className="bg-primary/5 border-t-2 border-primary/20">
                          <div className="grid grid-cols-12 gap-4 p-4 font-bold text-sm">
                            <div className="col-span-1 text-primary">TOTAL</div>
                            <div className="col-span-2 text-primary">{analytics.recentBills.length} Clients</div>
                            <div className="col-span-2 text-primary">{analytics.totalMorningPackages} Services</div>
                            <div className="col-span-1 text-center text-green-600">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.upiAmount, 0).toFixed(0)}
                            </div>
                            <div className="col-span-1 text-center text-blue-600">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.cardAmount, 0).toFixed(0)}
                            </div>
                            <div className="col-span-1 text-center text-orange-600">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.cashAmount, 0).toFixed(0)}
                            </div>
                            <div className="col-span-1">-</div>
                            <div className="col-span-1 text-center text-purple-600">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.productSale, 0).toFixed(0)}
                            </div>
                            <div className="col-span-1 text-center">
                              <div className="px-3 py-1 bg-primary text-primary-foreground rounded-lg font-bold text-base">
                                ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString('en-IN')}
                              </div>
                            </div>
                            <div className="col-span-1">-</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Tablet View - Enhanced */}
                    <div className="hidden lg:block xl:hidden">
                      <div className="space-y-3">
                        {analytics.recentBills.map((bill, index) => {
                          const isEditable = isBillEditable(bill)
                          const srNo = analytics.recentBills.length - index

                          return (
                            <Card key={bill._id?.toString()} className="border-border/40 hover:shadow-lg transition-all duration-300 group">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                      {srNo}
                                    </div>
                                    <div>
                                      <h3 className="font-semibold text-lg flex items-center gap-2">
                                        {bill.clientName}
                                        {bill.customerMobile && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => handleWhatsAppShare(bill)}
                                            title="Share on WhatsApp"
                                          >
                                            <MessageCircle className="h-3 w-3" />
                                          </Button>
                                        )}
                                      </h3>
                                      {bill.customerMobile && (
                                        <p className="text-sm text-muted-foreground">{bill.customerMobile}</p>
                                      )}
                                      <p className="text-xs text-muted-foreground mt-1">by {bill.attendantBy}</p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-primary">₹{bill.totalAmount.toLocaleString('en-IN')}</div>
                                    <Badge variant="secondary" className="text-xs">Grand Total</Badge>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div>
                                    <div className="text-sm font-medium text-muted-foreground mb-2">Services:</div>
                                    <div className="flex flex-wrap gap-1">
                                      {bill.items.map((item, itemIndex) => (
                                        <Badge
                                          key={itemIndex}
                                          variant={item.packageType === "Premium" ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {item.packageName}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-4 gap-2">
                                    {bill.upiAmount > 0 && (
                                      <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                        <div className="text-xs text-green-700 font-medium">UPI</div>
                                        <div className="font-bold text-green-600">₹{bill.upiAmount.toFixed(0)}</div>
                                      </div>
                                    )}
                                    {bill.cardAmount > 0 && (
                                      <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="text-xs text-blue-700 font-medium">Card</div>
                                        <div className="font-bold text-blue-600">₹{bill.cardAmount.toFixed(0)}</div>
                                      </div>
                                    )}
                                    {bill.cashAmount > 0 && (
                                      <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                        <div className="text-xs text-orange-700 font-medium">Cash</div>
                                        <div className="font-bold text-orange-600">₹{bill.cashAmount.toFixed(0)}</div>
                                      </div>
                                    )}
                                    {bill.productSale > 0 && (
                                      <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                                        <div className="text-xs text-purple-700 font-medium">Products</div>
                                        <div className="font-bold text-purple-600">₹{bill.productSale.toFixed(0)}</div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {isEditable && (
                                  <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setEditingBill(bill)}
                                      className="flex-1"
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setDeletingBill(bill)}
                                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </Button>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mobile Card View - Enhanced */}
                    <div className="block lg:hidden space-y-3">
                      {analytics.recentBills.map((bill, index) => {
                        const isEditable = isBillEditable(bill)
                        const srNo = analytics.recentBills.length - index
                        const isExpanded = expandedBills.has(bill._id?.toString() || '')

                        return (
                          <Card key={bill._id?.toString()} className="border-border/40 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-4">
                              {/* Mobile Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-sm font-bold text-primary">
                                    {srNo}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <h3 className="font-semibold text-base sm:text-lg truncate">{bill.clientName}</h3>
                                      {bill.customerMobile && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                          onClick={() => handleWhatsAppShare(bill)}
                                          title="Share on WhatsApp"
                                        >
                                          <MessageCircle className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-muted-foreground">by {bill.attendantBy}</span>
                                      <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(bill.createdAt).toLocaleTimeString('en-IN', { 
                                          hour: '2-digit', 
                                          minute: '2-digit',
                                          hour12: true 
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleBillExpanded(bill._id?.toString() || '')}
                                  className="h-8 w-8 p-0"
                                >
                                  <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                </Button>
                              </div>

                              {/* Amount Display */}
                              <div className="flex items-center justify-between mb-3 p-3 bg-primary/5 rounded-lg">
                                <span className="text-sm font-medium text-primary">Total Amount</span>
                                <span className="text-xl sm:text-2xl font-bold text-primary">
                                  ₹{bill.totalAmount.toLocaleString('en-IN')}
                                </span>
                              </div>

                              {/* Services Preview */}
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                  {bill.items.slice(0, isExpanded ? bill.items.length : 3).map((item, itemIndex) => (
                                    <Badge
                                      key={itemIndex}
                                      variant={item.packageType === "Premium" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {item.packageName}
                                    </Badge>
                                  ))}
                                  {!isExpanded && bill.items.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{bill.items.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Expanded Content */}
                              {isExpanded && (
                                <div className="space-y-4 border-t border-border/40 pt-4">
                                  {bill.customerMobile && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                                      <span className="text-sm text-muted-foreground">Mobile:</span>
                                      <span className="text-sm font-medium">{bill.customerMobile}</span>
                                    </div>
                                  )}

                                  {/* Payment Breakdown */}
                                  <div>
                                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Payment Breakdown:</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                      {bill.upiAmount > 0 && (
                                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                                          <div className="text-xs text-green-700 font-medium">UPI Payment</div>
                                          <div className="font-bold text-green-600">₹{bill.upiAmount.toFixed(0)}</div>
                                        </div>
                                      )}
                                      {bill.cardAmount > 0 && (
                                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                                          <div className="text-xs text-blue-700 font-medium">Card Payment</div>
                                          <div className="font-bold text-blue-600">₹{bill.cardAmount.toFixed(0)}</div>
                                        </div>
                                      )}
                                      {bill.cashAmount > 0 && (
                                        <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                                          <div className="text-xs text-orange-700 font-medium">Cash Payment</div>
                                          <div className="font-bold text-orange-600">₹{bill.cashAmount.toFixed(0)}</div>
                                        </div>
                                      )}
                                      {bill.productSale > 0 && (
                                        <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                                          <div className="text-xs text-purple-700 font-medium">Product Sale</div>
                                          <div className="font-bold text-purple-600">₹{bill.productSale.toFixed(0)}</div>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Complimentary Items */}
                                  {bill.expenditures && bill.expenditures.length > 0 && (
                                    <div>
                                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Complimentary Add-ons:</h4>
                                      <div className="flex flex-wrap gap-1">
                                        {bill.expenditures.map((exp, expIndex) => (
                                          <Badge key={expIndex} variant="outline" className="text-xs text-red-600">
                                            {exp.name}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Action Buttons */}
                              {isEditable && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-border/40">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingBill(bill)}
                                    className="flex-1"
                                  >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Bill
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setDeletingBill(bill)}
                                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </Button>
                                </div>
                              )}

                              {/* Time-based Edit Status */}
                              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/40">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${isEditable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                  <span className="text-xs text-muted-foreground">
                                    {isEditable ? 'Editable (15 min window)' : 'Edit window expired'}
                                  </span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(bill.createdAt).toLocaleTimeString('en-IN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {/* Enhanced Summary Cards - All Devices */}
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/3 mt-6">
                      <CardContent className="p-4 sm:p-6">
                        <div className="text-center mb-6">
                          <h3 className="text-xl sm:text-2xl font-bold text-primary mb-2">Today's Summary</h3>
                          <p className="text-sm text-muted-foreground">Complete breakdown of today's business</p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
                            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                              {analytics.recentBills.length}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Total Clients</div>
                          </div>
                          
                          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
                            <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                              {analytics.totalMorningPackages}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Services Provided</div>
                          </div>

                          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
                            <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.upiAmount, 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">UPI Collections</div>
                          </div>

                          <div className="text-center p-4 bg-background/80 backdrop-blur-sm rounded-xl border shadow-sm">
                            <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                              ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.cashAmount, 0).toLocaleString('en-IN')}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground">Cash Collections</div>
                          </div>
                        </div>

                        <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl border-2 border-primary/20">
                          <div className="text-sm text-primary font-medium mb-2">Total Revenue Today</div>
                          <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
                            ₹{analytics.recentBills.reduce((sum, bill) => sum + bill.totalAmount, 0).toLocaleString('en-IN')}
                          </div>
                          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span>Live updates</span>
                            </div>
                            <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                            <span>Last updated: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Enhanced Floating Action Button */}
      <div className="fixed bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <Button
          size="lg"
          className="shadow-2xl hover:shadow-3xl transition-all duration-300 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary group relative overflow-hidden"
          onClick={() => setShowCreateDialog(true)}
          disabled={packages.length === 0}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          <span className="relative z-10">Create New Bill</span>
        </Button>
      </div>

      {/* Dialogs */}
      <CreateBillDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        packages={packages}
        onSuccess={handleBillCreated}
      />

      {editingBill && (
        <EditBillDialog
          open={!!editingBill}
          onOpenChange={() => setEditingBill(null)}
          bill={editingBill}
          packages={packages}
          onSuccess={handleBillUpdated}
        />
      )}

      {deletingBill && (
        <DeleteBillDialog
          open={!!deletingBill}
          onOpenChange={() => setDeletingBill(null)}
          bill={deletingBill}
          onSuccess={handleBillDeleted}
        />
      )}
    </DashboardLayout>
  )
}
