"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, PackageIcon, Edit, Trash2, Search, Filter, ChevronDown, ChevronUp } from "lucide-react"
import type { Package } from "@/lib/models/Package"
import CreatePackageDialog from "@/components/packages/create-package-dialog"
import EditPackageDialog from "@/components/packages/edit-package-dialog"
import DeletePackageDialog from "@/components/packages/delete-package-dialog"
import DashboardLayout from "@/components/dashboard-layout"

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const [deletingPackage, setDeletingPackage] = useState<Package | null>(null)
  const [expandedPackages, setExpandedPackages] = useState<Set<string>>(new Set())

  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [sortBy, setSortBy] = useState("name")

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
    fetchPackages()
  }, [])

  const handlePackageCreated = () => {
    fetchPackages()
    setShowCreateDialog(false)
  }

  const handlePackageUpdated = () => {
    fetchPackages()
    setEditingPackage(null)
  }

  const handlePackageDeleted = () => {
    fetchPackages()
    setDeletingPackage(null)
  }

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

  const filteredAndSortedPackages = useMemo(() => {
    const filtered = packages.filter((pkg) => {
      const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
      let matchesGender = true
      if (genderFilter === "men") {
        matchesGender = !!pkg.menPricing
      } else if (genderFilter === "women") {
        matchesGender = !!pkg.womenPricing
      }
      let matchesLevel = true
      if (levelFilter === "basic") {
        matchesLevel = !!(pkg.menPricing?.basic || pkg.womenPricing?.basic)
      } else if (levelFilter === "advance") {
        matchesLevel = !!(pkg.menPricing?.advance || pkg.womenPricing?.advance)
      }
      return matchesSearch && matchesGender && matchesLevel
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "date-new":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "date-old":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [packages, searchTerm, genderFilter, levelFilter, sortBy])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading packages...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Service Packages</h1>
            <p className="text-muted-foreground">Manage your salon service offerings</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2 self-start sm:self-auto">
            <Plus className="h-5 w-5" />
            Create Package
          </Button>
        </div>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter Packages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="men">Men</SelectItem>
                  <SelectItem value="women">Women</SelectItem>
                </SelectContent>
              </Select>

              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="advance">Advance</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="date-new">Newest First</SelectItem>
                  <SelectItem value="date-old">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setGenderFilter("all")
                  setLevelFilter("all")
                  setSortBy("name")
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              Showing {filteredAndSortedPackages.length} of {packages.length} packages
            </div>
          </CardContent>
        </Card>

        {filteredAndSortedPackages.length === 0 ? (
          <Card className="border-border/40">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <PackageIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-2">
                {packages.length === 0 ? "No packages yet" : "No packages match your filters"}
              </h3>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                {packages.length === 0
                  ? "Create your first service package to start managing your salon offerings"
                  : "Try adjusting your search terms or filters to find packages"}
              </p>
              {packages.length === 0 ? (
                <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Package
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setGenderFilter("all")
                    setLevelFilter("all")
                    setSortBy("name")
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPackages.map((pkg) => {
              const packageId = pkg._id?.toString() || ""
              const isExpanded = expandedPackages.has(packageId)

              return (
                <Card key={packageId} className="border-border/40 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-serif mb-2">{pkg.name}</CardTitle>
                        <div className="flex gap-2 mb-2">
                          {pkg.menPricing && <Badge variant="secondary">Men</Badge>}
                          {pkg.womenPricing && <Badge variant="secondary">Women</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePackageExpansion(packageId)}
                          className="h-8 w-8 p-0"
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPackage(pkg)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingPackage(pkg)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 leading-relaxed">{pkg.description}</CardDescription>

                    {isExpanded && (
                      <div className="space-y-3 mb-4 p-3 bg-muted/50 rounded-lg">
                        {pkg.menPricing && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Men's Pricing:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {pkg.menPricing.basic && (
                                <div className="flex justify-between">
                                  <span>Basic:</span>
                                  <span className="font-medium">₹{pkg.menPricing.basic}</span>
                                </div>
                              )}
                              {pkg.menPricing.advance && (
                                <div className="flex justify-between">
                                  <span>Advance:</span>
                                  <span className="font-medium">₹{pkg.menPricing.advance}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        {pkg.womenPricing && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Women's Pricing:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {pkg.womenPricing.basic && (
                                <div className="flex justify-between">
                                  <span>Basic:</span>
                                  <span className="font-medium">₹{pkg.womenPricing.basic}</span>
                                </div>
                              )}
                              {pkg.womenPricing.advance && (
                                <div className="flex justify-between">
                                  <span>Advance:</span>
                                  <span className="font-medium">₹{pkg.womenPricing.advance}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">Click to view pricing details</span>
                      <span className="text-sm text-muted-foreground">
                        Created {new Date(pkg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <CreatePackageDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handlePackageCreated}
      />

      {editingPackage && (
        <EditPackageDialog
          open={!!editingPackage}
          onOpenChange={() => setEditingPackage(null)}
          package={editingPackage}
          onSuccess={handlePackageUpdated}
        />
      )}

      {deletingPackage && (
        <DeletePackageDialog
          open={!!deletingPackage}
          onOpenChange={() => setDeletingPackage(null)}
          package={deletingPackage}
          onSuccess={handlePackageDeleted}
        />
      )}
    </DashboardLayout>
  )
}
