"use client"

import { useState } from "react"
import { X, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { List } from "@/lib/types"

interface ManageListModalProps {
  onClose: () => void
  onCreateList: (name: string, isDefault: boolean) => void
  lists: List[]
}

export function ManageListModal({ onClose, onCreateList, lists }: ManageListModalProps) {
  const [newListName, setNewListName] = useState("")
  const [isNewListDefault, setIsNewListDefault] = useState(false)
  const [selectedLists, setSelectedLists] = useState<string[]>([])

  const handleCreateList = () => {
    if (newListName.trim()) {
      onCreateList(newListName, isNewListDefault)
      setNewListName("")
      setIsNewListDefault(false)
    }
  }

  const handleToggleList = (listId: string, checked: boolean) => {
    if (checked) {
      setSelectedLists([...selectedLists, listId])
    } else {
      setSelectedLists(selectedLists.filter((id) => id !== listId))
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Manage Lists</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">Create a new list or select from existing list(s) below.</p>

          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="New list name"
              className="flex-1"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
              onClick={handleCreateList}
              disabled={!newListName.trim()}
            >
              + Create List
            </Button>
          </div>

          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="default-new-list"
              checked={isNewListDefault}
              onCheckedChange={(checked) => setIsNewListDefault(!!checked)}
            />
            <Label htmlFor="default-new-list">Set new list as default</Label>
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Set as Default list</span>
                <ChevronDown className="h-4 w-4" />
              </div>
              <span className="text-sm text-gray-500">Options</span>
            </div>

            {lists.length > 0 ? (
              <div className="divide-y">
                {lists.map((list) => (
                  <div key={list.id} className="flex items-center justify-between p-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`list-${list.id}`}
                        checked={selectedLists.includes(list.id)}
                        onCheckedChange={(checked) => handleToggleList(list.id, !!checked)}
                      />
                      <Label htmlFor={`list-${list.id}`} className="font-medium">
                        {list.name}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">Default</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Rename List</DropdownMenuItem>
                          <DropdownMenuItem>Delete List</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No lists available.</div>
            )}
          </div>
        </div>

        <div className="flex justify-end p-4 border-t">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

