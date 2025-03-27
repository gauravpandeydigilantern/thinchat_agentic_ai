"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CreateListModalProps {
  onClose: () => void
  onCreateList: (name: string, isDefault: boolean) => void
}

export function CreateListModal({ onClose, onCreateList }: CreateListModalProps) {
  const [listName, setListName] = useState("")
  const [isDefault, setIsDefault] = useState(false)

  const handleSubmit = () => {
    if (listName.trim()) {
      onCreateList(listName, isDefault)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Create New List</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">List Name</h3>
              <Input
                placeholder="Enter list name"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="default-list" checked={isDefault} onCheckedChange={(checked) => setIsDefault(!!checked)} />
              <Label htmlFor="default-list">Set as Default List</Label>
            </div>
          </div>
        </div>
        <div className="flex justify-end p-4 border-t space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmit} disabled={!listName.trim()}>
            Save List
          </Button>
        </div>
      </div>
    </div>
  )
}

