"use client"

import { Download, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { List } from "@/lib/types"

interface ViewMyListsProps {
  lists: List[]
}

export function ViewMyLists({ lists }: ViewMyListsProps) {
  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Lists</h1>
          <div className="flex space-x-2">
            <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
              <option>All List Types</option>
              <option>Contact Lists</option>
              <option>Company Lists</option>
              <option>Email Lists</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {lists.map((list) => (
          <div key={list.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="mr-4">
                    {list.name.includes("Sample") || list.name.endsWith(".csv") ? (
                      <div className="h-12 w-12 bg-green-100 rounded-md flex items-center justify-center">
                        <span className="text-green-600 font-medium text-xl">CSV</span>
                      </div>
                    ) : (
                      <div className="h-12 w-12 bg-blue-100 rounded-md flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xl">
                          {list.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .substring(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">{list.name}</h2>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <span className="mr-2">
                        Type: {list.name.includes("Sample") ? "Contact Enrich List" : "Contact List"}
                      </span>
                      <span>•</span>
                      <span className="mx-2">{list.contactCount} Researched</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Research Progress</span>
                  <span className="text-sm text-gray-600">1 of 1</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "100%" }}></div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">View List</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

