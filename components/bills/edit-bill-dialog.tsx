"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Plus,
  Search,
  X,
  Minus,
  User,
  Phone,
  Calendar,
  CreditCard,
  Banknote,
  Smartphone,
  Edit3,
} from "lucide-react"

interface Bill {
  _id: string
  items: { packageId: string }[]
  clientName?: string
  customerMobile?: string
  attendantBy?: string
  productSales?: { name: string; price: number; quantity: number }[]
  expenditures?: { name: string; amount: number; description: string }[]
  upiAmount: number
  cardAmount: number
  cashAmount: number
  inventoryProductSales?: {
    inventoryId: string
    quantitySold: number
    productName: string
    brandName: string
    pricePerUnit: number
    totalPrice: number
  }[]
}

interface Package {
  _id: string
  name: string
  description: string
  type: string
  price: number
}

interface EditBillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bill: Bill
  packages: Package[]
  onSuccess: () => void
}

interface ProductSale {
  name: string
  price: number
  quantity: number
}

interface Expenditure {
  name: string
  amount: number
  description: string
}

interface InventoryItem {
  _id: string
  name: string
  brandName: string
  category: string
  quantity: number
  pricePerUnit: number
}

interface InventoryProductSale {
  inventoryId: string
  productName: string
  brandName: string
  quantitySold: number
  pricePerUnit: number
  totalPrice: number
}

export default function EditBillDialog({ open, onOpenChange, bill, packages, onSuccess }: EditBillDialogProps) {
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [clientName, setClientName] = useState("")
  const [customerMobile, setCustomerMobile] = useState("")
  const [attendantBy, setAttendantBy] = useState("")
  const [productSales, setProductSales] = useState<ProductSale[]>([])
  const [expenditures, setExpenditures] = useState<Expenditure[]>([])
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "CASH">("CASH")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [inventoryProductSales, setInventoryProductSales] = useState<InventoryProductSale[]>([])
  const [productSearchQuery, setProductSearchQuery] = useState("")
  const [loadingInventory, setLoadingInventory] = useState(false)
  const [serviceSearchQuery, setServiceSearchQuery] = useState("")

  // New states for add forms
  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newProductQuantity, setNewProductQuantity] = useState("1")
  const [newExpenseName, setNewExpenseName] = useState("")
  const [newExpenseAmount, setNewExpenseAmount] = useState("")

  useEffect(() => {
    if (open) {
      fetchInventory()
    }
  }, [open])

  const fetchInventory = async () => {
    setLoadingInventory(true)
    try {
      const token = localStorage.getItem("auth-token")
      console.log("[v0] Fetching inventory for edit dialog with token:", !!token)

      const response = await fetch("/api/inventory", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("[v0] Edit dialog inventory response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Edit dialog inventory data received:", data)
        setInventory(data.inventory || [])
      } else {
        const errorText = await response.text()
        console.error("[v0] Failed to fetch inventory in edit dialog:", response.status, errorText)
        setInventory([])
      }
    } catch (error) {
      console.error("[v0] Error fetching inventory in edit dialog:", error)
      setInventory([])
    } finally {
      setLoadingInventory(false)
    }
  }

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

  const filteredPackages = useMemo(() => {
    if (!serviceSearchQuery.trim()) return packages
    const query = serviceSearchQuery.toLowerCase().trim()
    return packages.filter(
      (pkg) =>
        pkg.name.toLowerCase().includes(query) ||
        pkg.description.toLowerCase().includes(query) ||
        pkg.type.toLowerCase().includes(query),
    )
  }, [packages, serviceSearchQuery])

  useEffect(() => {
    if (bill) {
      setSelectedPackages(bill.items.map((item) => item.packageId.toString()))
      setClientName(bill.clientName || "")
      setCustomerMobile(bill.customerMobile || "")
      setAttendantBy(bill.attendantBy || "")

      const loadedProductSales = (bill.productSales || []).map((product) => ({
        name: product.name || "",
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 1,
      }))
      setProductSales(loadedProductSales)

      const loadedExpenditures = (bill.expenditures || []).map((expense) => ({
        name: expense.name || "",
        amount: Number(expense.amount) || 0,
        description: expense.description || "",
      }))
      setExpenditures(loadedExpenditures)

      if (bill.inventoryProductSales && Array.isArray(bill.inventoryProductSales)) {
        const loadedInventoryProductSales = bill.inventoryProductSales.map((sale: any) => ({
          inventoryId: sale.inventoryId || sale._id || "",
          productName: sale.productName || sale.name || "",
          brandName: sale.brandName || "",
          quantitySold: Number(sale.quantitySold) || Number(sale.quantity) || 1,
          pricePerUnit: Number(sale.pricePerUnit) || Number(sale.price) || 0,
          totalPrice:
            Number(sale.totalPrice) ||
            Number(sale.pricePerUnit || sale.price || 0) * Number(sale.quantitySold || sale.quantity || 1),
        }))
        setInventoryProductSales(loadedInventoryProductSales)
        console.log("[v0] Loaded existing inventory product sales:", loadedInventoryProductSales)
      }

      if (bill.upiAmount > 0) setPaymentMethod("UPI")
      else if (bill.cardAmount > 0) setPaymentMethod("CARD")
      else setPaymentMethod("CASH")
    }
  }, [bill])

  const handlePackageToggle = (packageId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId) ? prev.filter((id) => id !== packageId) : [...prev, packageId],
    )
  }

  const addProductSale = () => {
    if (!newProductName.trim() || !newProductPrice.trim()) return

    const newProduct: ProductSale = {
      name: newProductName.trim(),
      price: Number.parseFloat(newProductPrice) || 0,
      quantity: Number.parseInt(newProductQuantity) || 1,
    }

    setProductSales([...productSales, newProduct])
    setNewProductName("")
    setNewProductPrice("")
    setNewProductQuantity("1")
  }

  const updateProductSale = (index: number, field: keyof ProductSale, value: string | number) => {
    const updated = [...productSales]
    updated[index] = { ...updated[index], [field]: value }
    setProductSales(updated)
  }

  const removeProductSale = (index: number) => {
    setProductSales(productSales.filter((_, i) => i !== index))
  }

  const addInventoryProductSale = (item: InventoryItem) => {
    const existingSale = inventoryProductSales.find((sale) => sale.inventoryId === item._id)
    if (existingSale) {
      updateInventoryProductQuantity(item._id, existingSale.quantitySold + 1)
    } else {
      const newSale: InventoryProductSale = {
        inventoryId: item._id,
        productName: item.name,
        brandName: item.brandName,
        quantitySold: 1,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.pricePerUnit,
      }
      setInventoryProductSales((prev) => [...prev, newSale])
    }
  }

  const updateInventoryProductQuantity = (inventoryId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setInventoryProductSales((prev) => prev.filter((sale) => sale.inventoryId !== inventoryId))
      return
    }

    const item = inventory.find((item) => item._id === inventoryId)
    if (!item || newQuantity > item.quantity) return

    setInventoryProductSales((prev) =>
      prev.map((sale) =>
        sale.inventoryId === inventoryId
          ? { ...sale, quantitySold: newQuantity, totalPrice: newQuantity * sale.pricePerUnit }
          : sale,
      ),
    )
  }

  const removeInventoryProductSale = (inventoryId: string) => {
    setInventoryProductSales((prev) => prev.filter((sale) => sale.inventoryId !== inventoryId))
  }

  const addExpenditure = () => {
    if (!newExpenseName.trim() || !newExpenseAmount.trim()) return

    const newExpense: Expenditure = {
      name: newExpenseName.trim(),
      amount: Number.parseFloat(newExpenseAmount) || 0,
      description: "",
    }

    setExpenditures([...expenditures, newExpense])
    setNewExpenseName("")
    setNewExpenseAmount("")
  }

  const updateExpenditure = (index: number, field: keyof Expenditure, value: string | number) => {
    const updated = [...expenditures]
    updated[index] = { ...updated[index], [field]: value }
    setExpenditures(updated)
  }

  const removeExpenditure = (index: number) => {
    setExpenditures(expenditures.filter((_, i) => i !== index))
  }

  const calculateServicesTotal = () => {
    return packages
      .filter((pkg) => selectedPackages.includes(pkg._id!.toString()))
      .reduce((sum, pkg) => sum + pkg.price, 0)
  }

  const calculateProductSalesTotal = () => {
    return productSales.reduce((sum, product) => {
      const price = Number(product.price) || 0
      const quantity = Number(product.quantity) || 0
      return sum + price * quantity
    }, 0)
  }

  const calculateInventoryProductSalesTotal = () => {
    return inventoryProductSales.reduce((sum, sale) => sum + sale.totalPrice, 0)
  }

  const calculateExpendituresTotal = () => {
    return expenditures.reduce((sum, exp) => {
      const amount = Number(exp.amount) || 0
      return sum + amount
    }, 0)
  }

  const calculateGrandTotal = () => {
    return (
      calculateServicesTotal() +
      calculateProductSalesTotal() +
      calculateInventoryProductSalesTotal() +
      calculateExpendituresTotal()
    )
  }

  const handleSubmit = async () => {
    setError("")

    if (selectedPackages.length === 0) {
      setError("Please select at least one service")
      return
    }

    if (!attendantBy.trim()) {
      setError("Attendant name is required")
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth-token")

      const paymentData = {
        upiAmount: paymentMethod === "UPI" ? calculateGrandTotal() : 0,
        cardAmount: paymentMethod === "CARD" ? calculateGrandTotal() : 0,
        cashAmount: paymentMethod === "CASH" ? calculateGrandTotal() : 0,
      }

      const billData = {
        packageIds: selectedPackages,
        clientName: clientName.trim() || "Walk-in Customer",
        customerMobile: customerMobile.trim() || undefined,
        ...paymentData,
        attendantBy: attendantBy.trim(),
        paymentMethod,
        productSales: productSales,
        inventoryProductSales: inventoryProductSales.map((sale) => ({
          inventoryId: sale.inventoryId,
          quantitySold: sale.quantitySold,
          productName: sale.productName,
          brandName: sale.brandName,
          pricePerUnit: sale.pricePerUnit,
          totalPrice: sale.totalPrice,
        })),
        expenditures: expenditures.map((exp) => ({
          name: exp.name,
          amount: exp.amount,
          description: exp.description || "",
        })),
      }

      console.log("[v0] Updating bill with data:", billData)

      const response = await fetch(`/api/bills/${bill._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(billData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update bill")
      }

      const result = await response.json()
      console.log("[v0] Bill updated successfully:", result)

      onSuccess()
    } catch (err) {
      console.error("[v0] Error updating bill:", err)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4 shrink-0">
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-bold text-gradient bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
              <Edit3 className="h-6 w-6 text-orange-600" />
              Edit Bill
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Update details for Bill #{bill._id?.toString().slice(-6).toUpperCase()}
            </DialogDescription>
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-medium">HUSN Beauty Salon</span>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
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
            <div className="grid grid-cols-4 gap-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
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
                  className="border-orange-200 focus:border-orange-400"
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
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-red-600">Attendant *</Label>
                <Input
                  placeholder="Required"
                  value={attendantBy}
                  onChange={(e) => setAttendantBy(e.target.value)}
                  disabled={loading}
                  className="border-orange-200 focus:border-orange-400"
                  required
                />
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
                    {selectedPackages.length} selected
                  </Badge>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search services..."
                    value={serviceSearchQuery}
                    onChange={(e) => setServiceSearchQuery(e.target.value)}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="flex items-center p-3 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                      onClick={() => handlePackageToggle(pkg._id)}
                    >
                      <Checkbox
                        checked={selectedPackages.includes(pkg._id)}
                        onChange={() => handlePackageToggle(pkg._id)}
                        disabled={loading}
                        className="mr-3"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{pkg.name}</div>
                        <div className="text-xs text-muted-foreground truncate">{pkg.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">₹{pkg.price}</div>
                        <Badge variant="secondary" className="text-xs">
                          {pkg.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Products Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-emerald-700">Products</h3>
                  <Badge variant="outline" className="bg-emerald-50">
                    {productSales.length + inventoryProductSales.length} items
                  </Badge>
                </div>

                {/* Inventory Products */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-emerald-600">From Inventory</h4>

                  {inventoryProductSales.length > 0 && (
                    <div className="space-y-1 mb-3 p-2 bg-emerald-100 rounded-lg">
                      <div className="text-xs font-medium text-emerald-700 mb-1">Items in Bill:</div>
                      {inventoryProductSales.map((sale) => (
                        <div
                          key={sale.inventoryId}
                          className="flex justify-between items-center p-2 bg-white rounded border border-emerald-200"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-xs text-emerald-800">{sale.productName}</div>
                            <div className="text-xs text-emerald-600">
                              {sale.brandName} | ₹{sale.pricePerUnit}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateInventoryProductQuantity(sale.inventoryId, sale.quantitySold - 1)}
                              className="h-5 w-5 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-medium w-6 text-center bg-emerald-50 rounded px-1">
                              {sale.quantitySold}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => updateInventoryProductQuantity(sale.inventoryId, sale.quantitySold + 1)}
                              className="h-5 w-5 p-0"
                              disabled={
                                sale.quantitySold >=
                                (inventory.find((item) => item._id === sale.inventoryId)?.quantity || 0)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeInventoryProductSale(sale.inventoryId)}
                              className="h-5 w-5 p-0 text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <span className="text-xs font-semibold ml-1 text-emerald-700">₹{sale.totalPrice}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search to add more items..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      className="pl-10 text-sm"
                      disabled={loading || loadingInventory}
                    />
                  </div>

                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {loadingInventory ? (
                      <div className="text-center py-4">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">Loading...</p>
                      </div>
                    ) : filteredInventory.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-xs text-muted-foreground">
                          {inventory.length === 0 ? "No inventory items found" : "No items match your search"}
                        </p>
                      </div>
                    ) : (
                      filteredInventory.map((item) => {
                        const existingSale = inventoryProductSales.find((sale) => sale.inventoryId === item._id)
                        if (existingSale) return null

                        return (
                          <div key={item._id} className="border rounded-lg p-2 hover:bg-emerald-50 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex-1">
                                <div className="font-medium text-xs">{item.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {item.brandName} | ₹{item.pricePerUnit} | Stock: {item.quantity}
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addInventoryProductSale(item)}
                              className="w-full h-5 text-xs"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add to Bill
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>

                {/* Manual Products */}
                <div className="space-y-2 border-t pt-2">
                  <h4 className="text-sm font-medium text-emerald-600">Manual Entry</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      placeholder="Product name"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex gap-1">
                      <Input
                        placeholder="Price"
                        type="number"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                        className="flex-1 text-xs"
                      />
                      <Input
                        placeholder="Qty"
                        type="number"
                        value={newProductQuantity}
                        onChange={(e) => setNewProductQuantity(e.target.value)}
                        className="w-14 text-xs"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={addProductSale}
                    disabled={!newProductName.trim() || !newProductPrice.trim()}
                    size="sm"
                    className="w-full h-6 text-xs"
                  >
                    Add Product
                  </Button>

                  {productSales.length > 0 && (
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {productSales.map((product, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-emerald-50 rounded text-xs"
                        >
                          <span>
                            {product.name} × {product.quantity}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeProductSale(index)}
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
              </div>

              {/* Expenses & Total Column */}
              <div className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-700">Expenses</h3>

                  <div className="space-y-2">
                    <Input
                      placeholder="Expense name"
                      value={newExpenseName}
                      onChange={(e) => setNewExpenseName(e.target.value)}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Amount"
                        type="number"
                        value={newExpenseAmount}
                        onChange={(e) => setNewExpenseAmount(e.target.value)}
                        className="flex-1 text-sm"
                      />
                      <Button
                        type="button"
                        onClick={addExpenditure}
                        disabled={!newExpenseName.trim() || !newExpenseAmount.trim()}
                        size="sm"
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {expenditures.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {expenditures.map((exp, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-orange-50 rounded text-sm">
                          <span>{exp.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">₹{exp.amount}</span>
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
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border border-orange-200">
                  <h4 className="font-semibold mb-3 text-orange-800">Updated Bill Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Services:</span>
                      <span className="font-medium">₹{calculateServicesTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Manual Products:</span>
                      <span className="font-medium">₹{calculateProductSalesTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Inventory Products:</span>
                      <span className="font-medium">₹{calculateInventoryProductSalesTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expenses:</span>
                      <span className="font-medium">₹{calculateExpendituresTotal().toFixed(2)}</span>
                    </div>
                    <hr className="border-orange-200" />
                    <div className="flex justify-between text-lg font-bold text-orange-700">
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
                onClick={handleSubmit}
                disabled={loading || selectedPackages.length === 0 || !attendantBy.trim()}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Update Bill - ₹{calculateGrandTotal().toFixed(2)}
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
