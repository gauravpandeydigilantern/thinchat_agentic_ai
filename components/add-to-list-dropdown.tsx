"use client"

import { Check } from "lucide-react"
import type { List } from "@/lib/types"

interface AddToListDropdownProps {
  position: { x: number; y: number }
  onClose: () => void
  lists: List[]
  onCreateNewList: () => void
}

export function AddToListDropdown({ position, onClose, lists, onCreateNewList }: AddToListDropdownProps) {
  // Calculate position to ensure dropdown stays within viewport
  const style = {
    top: `${position.y}px`,
    left: `${position.x}px`,
  }

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div
        className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 w-64 overflow-hidden"
        style={style}
      >
        <div className="p-2 border-b border-gray-200 font-medium text-gray-700">ADD TO LIST</div>
        <div className="max-h-60 overflow-y-auto">
          {lists.map((list) => (
            <div key={list.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <span>{list.name}</span>
              {list.id === "1" && <Check className="h-4 w-4 text-blue-600" />}
            </div>
          ))}
        </div>
        <div
          className="p-3 border-t border-gray-200 text-blue-600 hover:bg-gray-50 cursor-pointer flex items-center"
          onClick={onCreateNewList}
        >
          <span className="mr-1">+</span> Create New List
        </div>
      </div>
    </>
  )
}

