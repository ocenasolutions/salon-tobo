"use client"

import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Search,
  X,
  Calendar,
  Plus,
  Minus,
  Receipt,
  CreditCard,
  Banknote,
  Smartphone,
  User,
  Phone,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

interface InventoryItem {
  _id: string
  name: string
  brandName: string
  category: string
  quantity: number
  pricePerUnit: number
}

interface ProductSale {
  inventoryId: string
  productName: string
  brandName: string
  quantitySold: number
  pricePerUnit: number
  totalPrice: number
}

interface Expenditure {
  name: string
  price?: number // Made price optional for predefined expenses
  description?: string
}

interface PackageType {
  _id: string
  name: string
  description: string
  menPricing?: {
    basic?: number
    advance?: number
  }
  womenPricing?: {
    basic?: number
    advance?: number
  }
  type?: string
  price?: number
}

interface SelectedServiceItem {
  packageId: string
  packageName: string
  gender: "men" | "women"
  serviceLevel: "basic" | "advance"
  price: number
}

interface CreateBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packages: PackageType[]
  onSuccess: () => void
}

export default function CreateBillDialog({ open, onOpenChange, packages, onSuccess }: CreateBillDialogProps) {
  const [selectedServices, setSelectedServices] = useState<SelectedServiceItem[]>([])
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set())
  const [genderFilter, setGenderFilter] = useState<"all" | "men" | "women">("all")
  const [serviceLevelFilter, setServiceLevelFilter] = useState<"all" | "basic" | "advance">("all")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [clientName, setClientName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [attendantBy, setAttendantBy] = useState("")
  const [attendantList, setAttendantList] = useState<string[]>([])
  const [newAttendant, setNewAttendant] = useState("")
  const [isAddingAttendant, setIsAddingAttendant] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "CASH">("CASH")

  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [productSales, setProductSales] = useState<ProductSale[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [loadingInventory, setLoadingInventory] = useState(false)

  const [expenditures, setExpenditures] = useState<Expenditure[]>([])
  const [expenditureName, setExpenditureName] = useState("")
  const [expenditurePrice, setExpenditurePrice] = useState("")
  const [selectedExpenseCategory, setSelectedExpenseCategory] = useState("")

  const predefinedExpenses = ["Tea", "Coffee", "Milk", "Snacks", "Other"]

  useEffect(() => {
    if (open) {
      fetchInventory()
      loadAttendantList()
    }
  }, [open])

  const loadAttendantList = () => {
    const saved = localStorage?.getItem("attendant-list")
    if (saved) {
      setAttendantList(JSON.parse(saved))
    }
  }

  const saveAttendantList = (list: string[]) => {
    localStorage?.setItem("attendant-list", JSON.stringify(list))
    setAttendantList(list)
  }

  const addNewAttendant = () => {
    if (!newAttendant.trim()) return
    const trimmed = newAttendant.trim()
    if (!attendantList.includes(trimmed)) {
      const newList = [...attendantList, trimmed]
      saveAttendantList(newList)
      setAttendantBy(trimmed)
    } else {
      setAttendantBy(trimmed)
    }
    setNewAttendant("")
    setIsAddingAttendant(false)
  }

  const fetchInventory = async () => {
    setLoadingInventory(true)
    try {
      const token = localStorage.getItem("auth-token")
      console.log("[v0] Fetching inventory with token:", !!token)

      const response = await fetch("/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("[v0] Inventory response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Inventory data received:", data)
        setInventory(data.inventory || [])
      } else {
        const errorText = await response.text()
        console.error("[v0] Failed to fetch inventory:", response.status, errorText)
        setInventory([])
      }
    } catch (error) {
      console.error("[v0] Error fetching inventory:", error)
      setInventory([])
    } finally {
      setLoadingInventory(false)
    }
  }

  const filteredPackages = useMemo(() => {
    if (!searchQuery.trim()) return packages
    const query = searchQuery.toLowerCase().trim()
    return packages.filter(
      (pkg) => pkg.name.toLowerCase().includes(query) || pkg.description.toLowerCase().includes(query),
    )
  }, [packages, searchQuery])

  const filteredInventory = useMemo(() => {
    if (!productSearchQuery.trim()) return inventory
    const query = productSearchQuery.toLowerCase().trim()
    return inventory.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.brandName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query),
    )
  }, [inventory, productSearchQuery])

  const togglePackageExpansion = (packageId: string) => {
    setExpandedPackages((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(packageId)) {
        newSet.delete(packageId)
      } else {
        newSet.add(packageId)
      }
      return newSet
    })
  }

  const addServiceVariant = (pkg: PackageType, gender: "men" | "women", serviceLevel: "basic" | "advance") => {
    const pricing = gender === "men" ? pkg.menPricing : pkg.womenPricing
    const price = pricing?.[serviceLevel]

    if (!price) return

    const serviceItem: SelectedServiceItem = {
      packageId: pkg._id,
      packageName: pkg.name,
      gender,
      serviceLevel,
      price,
    }

    setSelectedServices((prev) => [...prev, serviceItem])
    if (error === "Please select at least one service") {
      setError("")
    }
  }

  const removeServiceVariant = (index: number) => {
    setSelectedServices((prev) => prev.filter((_, i) => i !== index))
    setError("")
  }

  const calculateServicesTotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price, 0)
  }

  const calculateProductSalesTotal = () => {
    return productSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  }

  const addExpenditure = () => {
    if (selectedExpenseCategory) {
      // Add predefined expense without price
      const newExpenditure: Expenditure = {
        name: selectedExpenseCategory,
      }
      setExpenditures((prev) => [...prev, newExpenditure])
      setSelectedExpenseCategory("")
    } else if (expenditureName.trim() && expenditurePrice.trim()) {
      // Add custom expense with price (for "Other" category)
      const newExpenditure: Expenditure = {
        name: expenditureName.trim(),
        price: Number.parseFloat(expenditurePrice),
      }
      setExpenditures((prev) => [...prev, newExpenditure])
      setExpenditureName("")
      setExpenditurePrice("")
    }
  }

  const removeExpenditure = (index: number) => {
    setExpenditures((prev) => prev.filter((_, i) => i !== index))
  }

  const calculateExpendituresTotal = () => {
    return expenditures.reduce((sum, exp) => sum + (exp.price || 0), 0)
  }

  const calculateGrandTotal = () => {
    return calculateServicesTotal() + calculateProductSalesTotal() + calculateExpendituresTotal()
  }

  const handleSubmit = async () => {
    setError("")

    console.log("[v0] Selected services count:", selectedServices.length)
    console.log("[v0] Selected services:", selectedServices)

    if (selectedServices.length === 0) {
      setError("Please select at least one service")
      return
    }

    if (!attendantBy.trim()) {
      setError("Please select an attendant")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth-token")

      // Prepare payment amounts based on selected method
      const paymentData = {
        upiAmount: paymentMethod === "UPI" ? calculateGrandTotal() : 0,
        cardAmount: paymentMethod === "CARD" ? calculateGrandTotal() : 0,
        cashAmount: paymentMethod === "CASH" ? calculateGrandTotal() : 0,
      }

      const billData = {
        services: selectedServices.map((service) => ({
          packageId: service.packageId,
          gender: service.gender,
          serviceLevel: service.serviceLevel,
          price: service.price,
        })),
        clientName: clientName.trim() || "Walk-in Customer",
        customerMobile: customerMobile.trim() || undefined,
        ...paymentData,
        attendantBy: attendantBy.trim(),
        productSales: productSales.map((sale) => ({
          inventoryId: sale.inventoryId,
          quantitySold: sale.quantitySold,
        })),
        expenditures: expenditures.map((exp) => ({
          name: exp.name,
          price: exp.price || 0,
          amount: exp.price || 0,
        })),
      }

      console.log("[v0] Creating bill with data:", billData)

      const response = await fetch("/api/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create bill")
      }

      const result = await response.json()
      console.log("[v0] Bill created successfully:", result)

      // Reset form
      setSelectedServices([])
      setExpandedPackages(new Set())
      setSearchQuery("")
      setClientName("")
      setCustomerMobile("")
      setAttendantBy("")
      setPaymentMethod("CASH")
      setProductSales([])
      setProductSearchQuery("")
      setExpenditures([])
      setExpenditureName("")
      setExpenditurePrice("")
      setSelectedExpenseCategory("")
      setGenderFilter("all")
      setServiceLevelFilter("all")
      onSuccess()
    } catch (err) {
      console.error("[v0] Error creating bill:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case "UPI":
        return <Smartphone className="h-4 w-4" />
      case "CARD":
        return <CreditCard className="h-4 w-4" />
      case "CASH":
        return <Banknote className="h-4 w-4" />
      default:
        return null
    }
  }

  const addProductSale = (item: InventoryItem) => {
    const existingSale = productSales.find((sale) => sale.inventoryId === item._id)
    if (existingSale) {
      updateProductQuantity(item._id, existingSale.quantitySold + 1)
    } else {
      setProductSales((prev) => [
        ...prev,
        {
          inventoryId: item._id,
          productName: item.name,
          brandName: item.brandName,
          quantitySold: 1,
          pricePerUnit: item.pricePerUnit,
          totalPrice: item.pricePerUnit,
        },
      ])
    }
  }

  const removeProductSale = (inventoryId: string) => {
    setProductSales((prev) => prev.filter((sale) => sale.inventoryId !== inventoryId))
  }

  const updateProductQuantity = (inventoryId: string, newQuantity: number) => {
    setProductSales((prev) =>
      prev.map((sale) => {
        if (sale.inventoryId === inventoryId) {
          return {
            ...sale,
            quantitySold: newQuantity,
            totalPrice: newQuantity * sale.pricePerUnit,
          }
        }
        return sale
      }),
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4 shrink-0">
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create New Bill
            </DialogTitle>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span className="font-medium">HUSN Beauty Salon</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-1">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Customer & Attendant Info - Compact Row */}
            <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Client Name
                </Label>
                <Input
                  placeholder="Optional"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  disabled={loading}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Mobile
                </Label>
                <Input
                  placeholder="Optional"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  disabled={loading}
                  className="border-blue-200 focus:border-blue-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-red-600">Attendant *</Label>
                {!isAddingAttendant ? (
                  <div className="flex gap-2">
                    <Select value={attendantBy} onValueChange={setAttendantBy} disabled={loading}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Select attendant" />
                      </SelectTrigger>
                      <SelectContent>
                        {attendantList.map((attendant) => (
                          <SelectItem key={attendant} value={attendant}>
                            {attendant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingAttendant(true)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New attendant"
                      value={newAttendant}
                      onChange={(e) => setNewAttendant(e.target.value)}
                      disabled={loading}
                      onKeyPress={(e) => e.key === "Enter" && addNewAttendant()}
                    />
                    <Button type="button" size="sm" onClick={addNewAttendant} disabled={!newAttendant.trim()}>
                      Add
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingAttendant(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Payment Method *</Label>
                <div className="flex gap-1">
                  {(["CASH", "UPI", "CARD"] as const).map((method) => (
                    <Button
                      key={method}
                      type="button"
                      variant={paymentMethod === method ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPaymentMethod(method)}
                      disabled={loading}
                      className="flex-1 text-xs"
                    >
                      {getPaymentIcon(method)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content - 3 Column Layout */}
            <div className="grid grid-cols-3 gap-6">
              {/* Services Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-blue-700">Services</h3>
                  <Badge variant="outline" className="bg-blue-50">
                    {selectedServices.length} selected
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Select
                    value={genderFilter}
                    onValueChange={(value: "all" | "men" | "women") => setGenderFilter(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Genders</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={serviceLevelFilter}
                    onValueChange={(value: "all" | "basic" | "advance") => setServiceLevelFilter(value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="advance">Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPackages.map((pkg) => {
                    const isExpanded = expandedPackages.has(pkg._id)
                    const hasOptions =
                      pkg.menPricing?.basic ||
                      pkg.menPricing?.advance ||
                      pkg.womenPricing?.basic ||
                      pkg.womenPricing?.advance

                    return (
                      <div key={pkg._id} className="border rounded-lg overflow-hidden">
                        {/* Package Header */}
                        <div
                          className="flex items-center p-3 hover:bg-blue-50 transition-colors cursor-pointer"
                          onClick={() => togglePackageExpansion(pkg._id)}
                        >
                          {hasOptions ? (
                            isExpanded ? (
                              <ChevronDown className="h-4 w-4 mr-2" />
                            ) : (
                              <ChevronRight className="h-4 w-4 mr-2" />
                            )
                          ) : (
                            <div className="w-6 mr-2" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm">{pkg.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{pkg.description}</div>
                          </div>
                          {/* Legacy price display for packages without gender pricing */}
                          {!hasOptions && pkg.price && (
                            <div className="text-right">
                              <div className="font-semibold text-blue-600">₹{pkg.price}</div>
                              <Badge variant="secondary" className="text-xs">
                                {pkg.type}
                              </Badge>
                            </div>
                          )}
                        </div>

                        {isExpanded && hasOptions && (
                          <div className="border-t bg-gray-50 p-3 space-y-2">
                            {/* Men's Options */}
                            {pkg.menPricing && (genderFilter === "all" || genderFilter === "men") && (
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-blue-600 mb-1">Men's Services</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {pkg.menPricing.basic &&
                                    (serviceLevelFilter === "all" || serviceLevelFilter === "basic") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          addServiceVariant(pkg, "men", "basic")
                                        }}
                                        className="text-xs h-8"
                                      >
                                        Basic ₹{pkg.menPricing.basic}
                                      </Button>
                                    )}
                                  {pkg.menPricing.advance &&
                                    (serviceLevelFilter === "all" || serviceLevelFilter === "advance") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          addServiceVariant(pkg, "men", "advance")
                                        }}
                                        className="text-xs h-8"
                                      >
                                        Advance ₹{pkg.menPricing.advance}
                                      </Button>
                                    )}
                                </div>
                              </div>
                            )}

                            {/* Women's Options */}
                            {pkg.womenPricing && (genderFilter === "all" || genderFilter === "women") && (
                              <div className="space-y-1">
                                <div className="text-xs font-medium text-pink-600 mb-1">Women's Services</div>
                                <div className="grid grid-cols-2 gap-2">
                                  {pkg.womenPricing.basic &&
                                    (serviceLevelFilter === "all" || serviceLevelFilter === "basic") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          addServiceVariant(pkg, "women", "basic")
                                        }}
                                        className="text-xs h-8"
                                      >
                                        Basic ₹{pkg.womenPricing.basic}
                                      </Button>
                                    )}
                                  {pkg.womenPricing.advance &&
                                    (serviceLevelFilter === "all" || serviceLevelFilter === "advance") && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          addServiceVariant(pkg, "women", "advance")
                                        }}
                                        className="text-xs h-8"
                                      >
                                        Advance ₹{pkg.womenPricing.advance}
                                      </Button>
                                    )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {selectedServices.length > 0 && (
                  <div className="space-y-2 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm font-medium text-blue-700">Selected Services:</div>
                    {selectedServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-center text-xs bg-white p-2 rounded">
                        <div>
                          <span className="font-medium">{service.packageName}</span>
                          <span className="text-muted-foreground ml-2">
                            ({service.gender} - {service.serviceLevel})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">₹{service.price}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeServiceVariant(index)}
                            className="h-4 w-4 p-0 text-red-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-emerald-700">Products</h3>
                  <Badge variant="outline" className="bg-emerald-50">
                    {productSales.length} added
                  </Badge>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={productSearchQuery}
                    onChange={(e) => setProductSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={loading || loadingInventory}
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {loadingInventory ? (
                    <div className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Loading inventory...</p>
                    </div>
                  ) : filteredInventory.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        {inventory.length === 0 ? "No inventory items found" : "No items match your search"}
                      </p>
                      {inventory.length === 0 && (
                        <p className="text-xs text-muted-foreground mt-1">Add products to inventory first</p>
                      )}
                    </div>
                  ) : (
                    filteredInventory.map((item) => {
                      const existingSale = productSales.find((sale) => sale.inventoryId === item._id)
                      return (
                        <div key={item._id} className="border rounded-lg p-3 hover:bg-emerald-50 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.brandName}</div>
                              <div className="text-xs text-emerald-600">
                                Stock: {item.quantity} | ₹{item.pricePerUnit}
                              </div>
                            </div>
                          </div>

                          {existingSale ? (
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateProductQuantity(item._id, existingSale.quantitySold - 1)}
                                className="h-6 w-6 p-0"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-6 text-center">{existingSale.quantitySold}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => updateProductQuantity(item._id, existingSale.quantitySold + 1)}
                                className="h-6 w-6 p-0"
                                disabled={existingSale.quantitySold >= item.quantity}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeProductSale(item._id)}
                                className="h-6 w-6 p-0 text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-semibold ml-auto">₹{existingSale.totalPrice}</span>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addProductSale(item)}
                              className="w-full h-6 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Extras & Total Column */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700">Add-Ons</h3>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Quick Add (Complimentary)</Label>
                      <Select value={selectedExpenseCategory} onValueChange={setSelectedExpenseCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complimentary item" />
                        </SelectTrigger>
                        <SelectContent>
                          {predefinedExpenses.map((expense) => (
                            <SelectItem key={expense} value={expense}>
                              {expense}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        onClick={addExpenditure}
                        disabled={!selectedExpenseCategory}
                        size="sm"
                        className="w-full mt-2"
                      >
                        Add Complimentary Item
                      </Button>
                    </div>

                    <div className="border-t pt-3">
                      <Label className="text-sm font-medium mb-2 block">Custom Item (with price)</Label>
                      <Input
                        placeholder="Custom item name"
                        value={expenditureName}
                        onChange={(e) => setExpenditureName(e.target.value)}
                        disabled={loading}
                        className="mb-2"
                      />
                      <div className="flex gap-2">
                        <Input
                          placeholder="Amount"
                          type="number"
                          value={expenditurePrice}
                          onChange={(e) => setExpenditurePrice(e.target.value)}
                          disabled={loading}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          onClick={addExpenditure}
                          disabled={!expenditureName.trim() || !expenditurePrice.trim()}
                          size="sm"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  {expenditures.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {expenditures.map((exp, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded text-sm">
                          <span>{exp.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{exp.price ? `₹${exp.price}` : "Complimentary"}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeExpenditure(index)}
                              className="h-4 w-4 p-0 text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Total Summary */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-200">
                  <h4 className="font-semibold mb-3 text-indigo-800">Bill Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <span className="font-medium">₹{calculateServicesTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Products:</span>
                      <span className="font-medium">₹{calculateProductSalesTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Add-Ons:</span>
                      <span className="font-medium">₹{calculateExpendituresTotal().toFixed(2)}</span>
                    </div>
                    {expenditures.some((exp) => !exp.price) && (
                      <div className="flex justify-between text-orange-600">
                        <span>Complimentary Items:</span>
                        <span className="font-medium">{expenditures.filter((exp) => !exp.price).length}</span>
                      </div>
                    )}
                    <hr className="border-indigo-200" />
                    <div className="flex justify-between text-lg font-bold text-indigo-700">
                      <span>Total:</span>
                      <span>₹{calculateGrandTotal().toFixed(2)}</span>
                    </div>
                    <div className="text-xs text-center text-muted-foreground mt-2">Payment via {paymentMethod}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || selectedServices.length === 0 || !attendantBy.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Receipt className="mr-2 h-4 w-4" />
                    Create Bill - ₹{calculateGrandTotal().toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
