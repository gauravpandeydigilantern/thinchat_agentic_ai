"use client"

import { useState } from "react"

export default function CompaniesPage() {
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-sm max-w-lg w-full text-center">
        <div className="mb-6">
          <img src="/placeholder.svg?height=120&width=120" alt="No companies" className="mx-auto" />
        </div>
        <h2 className="text-xl font-semibold mb-2">No companies added yet</h2>
        <p className="text-gray-600 mb-6">Find companies to add</p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium">
          Upload Companies
        </button>
      </div>
    </div>
  )
}
