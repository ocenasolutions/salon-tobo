"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

interface CreatePackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function CreatePackageDialog({ open, onOpenChange, onSuccess }: CreatePackageDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    menEnabled: false,
    menBasic: "",
    menAdvance: "",
    womenEnabled: false,
    womenBasic: "",
    womenAdvance: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.name || !formData.description) {
      setError("Package name and description are required")
      return
    }

    if (!formData.menEnabled && !formData.womenEnabled) {
      setError("Please enable at least one gender option")
      return
    }

    const packageData: any = {
      name: formData.name,
      description: formData.description,
    }

    if (formData.menEnabled) {
      packageData.menPricing = {}
      if (formData.menBasic) {
        const basicPrice = Number.parseFloat(formData.menBasic)
        if (Number.isNaN(basicPrice) || basicPrice <= 0) {
          setError("Please enter valid men's basic price")
          return
        }
        packageData.menPricing.basic = basicPrice
      }
      if (formData.menAdvance) {
        const advancePrice = Number.parseFloat(formData.menAdvance)
        if (Number.isNaN(advancePrice) || advancePrice <= 0) {
          setError("Please enter valid men's advance price")
          return
        }
        packageData.menPricing.advance = advancePrice
      }
    }

    if (formData.womenEnabled) {
      packageData.womenPricing = {}
      if (formData.womenBasic) {
        const basicPrice = Number.parseFloat(formData.womenBasic)
        if (Number.isNaN(basicPrice) || basicPrice <= 0) {
          setError("Please enter valid women's basic price")
          return
        }
        packageData.womenPricing.basic = basicPrice
      }
      if (formData.womenAdvance) {
        const advancePrice = Number.parseFloat(formData.womenAdvance)
        if (Number.isNaN(advancePrice) || advancePrice <= 0) {
          setError("Please enter valid women's advance price")
          return
        }
        packageData.womenPricing.advance = advancePrice
      }
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(packageData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        menEnabled: false,
        menBasic: "",
        menAdvance: "",
        womenEnabled: false,
        womenBasic: "",
        womenAdvance: "",
      })

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif">Create New Service Package</DialogTitle>
          <DialogDescription>Add a new service package with flexible pricing options</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Hair Cut & Styling"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what's included in this package..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="menEnabled"
                checked={formData.menEnabled}
                onCheckedChange={(checked) => handleChange("menEnabled", checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="menEnabled" className="text-lg font-medium">
                Men Package
              </Label>
            </div>

            {formData.menEnabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="menBasic">Basic Price (₹)</Label>
                  <Input
                    id="menBasic"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.menBasic}
                    onChange={(e) => handleChange("menBasic", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="menAdvance">Advance Price (₹)</Label>
                  <Input
                    id="menAdvance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.menAdvance}
                    onChange={(e) => handleChange("menAdvance", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="womenEnabled"
                checked={formData.womenEnabled}
                onCheckedChange={(checked) => handleChange("womenEnabled", checked as boolean)}
                disabled={loading}
              />
              <Label htmlFor="womenEnabled" className="text-lg font-medium">
                Women Package
              </Label>
            </div>

            {formData.womenEnabled && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="womenBasic">Basic Price (₹)</Label>
                  <Input
                    id="womenBasic"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.womenBasic}
                    onChange={(e) => handleChange("womenBasic", e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="womenAdvance">Advance Price (₹)</Label>
                  <Input
                    id="womenAdvance"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.womenAdvance}
                    onChange={(e) => handleChange("womenAdvance", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Package"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
