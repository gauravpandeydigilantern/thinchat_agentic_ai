"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Download, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

interface UploadCsvModalProps {
  type: "contact" | "company" | "email"
  onClose: () => void
  onUploadSuccess: (fileName: string) => void
}

export function UploadCsvModal({ type, onClose, onUploadSuccess }: UploadCsvModalProps) {
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [addToContacts, setAddToContacts] = useState(true)

  const getTitle = () => {
    switch (type) {
      case "contact":
        return "Enrich my Contact List"
      case "company":
        return "Enrich my Company List"
      case "email":
        return "Enrich my Email List"
      default:
        return "Upload CSV to Enrich Your List"
    }
  }

  const getRequiredFields = () => {
    switch (type) {
      case "contact":
        return (
          <ul className="list-disc pl-6 space-y-1">
            <li>Contact Name, Company Name</li>
            <li>LinkedIn Profile Url</li>
            <li>LinkedIn Sales Nav Url</li>
            <li>LinkedIn Recruiter Url</li>
          </ul>
        )
      case "company":
        return (
          <ul className="list-disc pl-6 space-y-1">
            <li>Company Name</li>
            <li>Website</li>
            <li>Company LinkedIn Url</li>
          </ul>
        )
      case "email":
        return (
          <ul className="list-disc pl-6 space-y-1">
            <li>Business Email</li>
          </ul>
        )
      default:
        return null
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleUpload = () => {
    if (!fileName) return

    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      onUploadSuccess(fileName)
    }, 1500)
  }

  const handleDownloadSample = () => {
    // In a real app, this would download a sample CSV file
    console.log("Downloading sample file for", type)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Upload CSV to Enrich Your List</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select how you'd like to enrich your lists with the best sales intelligence from ThinkChat.AI
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Select enrichment type</label>
            <div className="relative">
              <Input value={getTitle()} readOnly className="pr-8" />
              <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm font-medium mb-2">
              You must include one of the below options as a header included in your CSV file:
            </p>
            {getRequiredFields()}
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-4 text-center">
            {fileName ? (
              <div className="flex items-center justify-center">
                <Check className="h-6 w-6 text-green-500 mr-2" />
                <span>{fileName}</span>
              </div>
            ) : (
              <>
                <div className="mb-4 flex justify-center">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <Upload className="h-6 w-6" />
                  </div>
                </div>
                <p className="text-blue-600 font-medium mb-1">Click to upload</p>
                <p className="text-sm text-gray-500 mb-2">or drag and drop a .CSV file</p>
                <p className="text-xs text-gray-400">Only one .CSV file is allowed at a time.</p>
              </>
            )}
            <input
              type="file"
              accept=".csv"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          <div className="mb-6">
            <Button variant="outline" className="flex items-center text-blue-600" onClick={handleDownloadSample}>
              <Download className="h-4 w-4 mr-2" />
              Download Sample File
            </Button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Name your Enrich List (Required)</label>
            <Input placeholder="Name your List" value={fileName} readOnly />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Set List Tags(s)</label>
            <Input placeholder="Set List Tags" />
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox
              id="add-to-contacts"
              checked={addToContacts}
              onCheckedChange={(checked) => setAddToContacts(!!checked)}
            />
            <label htmlFor="add-to-contacts" className="text-sm">
              Add these records to My {type === "company" ? "Companies" : "Contacts"}
            </label>
          </div>
        </div>

        <div className="flex justify-end p-4 border-t space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpload} disabled={!fileName || isUploading}>
            {isUploading ? "Uploading..." : `Enrich My List`}
          </Button>
        </div>
      </div>
    </div>
  )
}

