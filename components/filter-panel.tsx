"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState } from "react"

interface FilterPanelProps {
  filters: any
  onApplyFilters: (filters: any) => void
  onClose: () => void
}

export function FilterPanel({ filters, onApplyFilters, onClose }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters)

  const handleFilterChange = (category: string, value: string, checked: boolean) => {
    setLocalFilters((prev) => {
      const newFilters = { ...prev }
      if (checked) {
        newFilters[category] = [...(prev[category] || []), value]
      } else {
        newFilters[category] = (prev[category] || []).filter((item: string) => item !== value)
      }
      return newFilters
    })
  }

  const handleApply = () => {
    onApplyFilters(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters = {
      seniority: [],
      department: [],
      location: [],
      employeeSize: [],
    }
    setLocalFilters(resetFilters)
    onApplyFilters(resetFilters)
  }

  return (
    <div className="w-80 border-l border-gray-200 bg-white overflow-auto h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Filters</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Seniority</h3>
          <div className="space-y-2">
            {["Entry-Level", "Mid-Level", "Senior", "Executive"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <Checkbox
                  id={`seniority-${level}`}
                  checked={(localFilters.seniority || []).includes(level)}
                  onCheckedChange={(checked) => handleFilterChange("seniority", level, !!checked)}
                />
                <Label htmlFor={`seniority-${level}`}>{level}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Department</h3>
          <div className="space-y-2">
            {["IT", "Sales", "Marketing", "Finance", "HR", "Engineering"].map((dept) => (
              <div key={dept} className="flex items-center space-x-2">
                <Checkbox
                  id={`department-${dept}`}
                  checked={(localFilters.department || []).includes(dept)}
                  onCheckedChange={(checked) => handleFilterChange("department", dept, !!checked)}
                />
                <Label htmlFor={`department-${dept}`}>{dept}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Location</h3>
          <div className="space-y-2">
            {["Delhi, IN", "Gurugram, IN", "Mumbai, IN", "Bangalore, IN"].map((loc) => (
              <div key={loc} className="flex items-center space-x-2">
                <Checkbox
                  id={`location-${loc}`}
                  checked={(localFilters.location || []).includes(loc)}
                  onCheckedChange={(checked) => handleFilterChange("location", loc, !!checked)}
                />
                <Label htmlFor={`location-${loc}`}>{loc}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Employee Size</h3>
          <div className="space-y-2">
            {[
              "1 - 50 employees",
              "51 - 200 employees",
              "201 - 500 employees",
              "501 - 1,000 employees",
              "1,001+ employees",
            ].map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={(localFilters.employeeSize || []).includes(size)}
                  onCheckedChange={(checked) => handleFilterChange("employeeSize", size, !!checked)}
                />
                <Label htmlFor={`size-${size}`}>{size}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex space-x-2">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Reset
        </Button>
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" onClick={handleApply}>
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

