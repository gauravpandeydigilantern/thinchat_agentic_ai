"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EnrichView() {
  const handleUploadContactCsv = () => {
    // Logic for uploading contact CSV
  };

  const handleUploadCompanyCsv = () => {
    // Logic for uploading company CSV
  };

  const handleUploadEmailCsv = () => {
    // Logic for uploading email CSV
  };

  return (
    <div className="flex-1 bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">Enrich Your Lists</h1>
          <p className="text-gray-600">Enrich your data with the best sales intelligence from ThinkChat.AI</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-yellow-50 rounded-lg p-6 flex flex-col items-center">
            <div className="mb-4 bg-yellow-100 p-4 rounded-lg">
              <img src="/placeholder.svg?height=80&width=160" alt="Contact List" className="h-20" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Enrich my Contact List</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Upload a list of contacts and research their full contact info including emails, phones, and insights.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center"
              onClick={handleUploadContactCsv}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 flex flex-col items-center">
            <div className="mb-4 bg-blue-100 p-4 rounded-lg">
              <img src="/placeholder.svg?height=80&width=160" alt="Company List" className="h-20" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Enrich my Company List</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Upload a list of companies and research their full company profile data.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center"
              onClick={handleUploadCompanyCsv}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 flex flex-col items-center">
            <div className="mb-4 bg-purple-100 p-4 rounded-lg">
              <img src="/placeholder.svg?height=80&width=160" alt="Email List" className="h-20" />
            </div>
            <h2 className="text-lg font-semibold mb-2 text-center">Enrich my Email List</h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              Upload a list of emails and research their full profiles.
            </p>
            <Button
              className="bg-blue-600 hover:bg-blue-700 w-full flex items-center justify-center"
              onClick={handleUploadEmailCsv}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

