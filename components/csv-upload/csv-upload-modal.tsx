"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, FileText, Loader2, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

interface CsvUploadModalProps {
  type: "contact" | "company" | "email"
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (fileName: string) => void
}

export function CsvUploadModal({ type, isOpen, onClose, onUploadSuccess }: CsvUploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [listName, setListName] = useState("")
  const [addToCollection, setAddToCollection] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [parsePreview, setParsePreview] = useState<any[] | null>(null)

  const getTitle = () => {
    switch (type) {
      case "contact":
        return "Upload Contact List"
      case "company":
        return "Upload Company List"
      case "email":
        return "Upload Email List"
      default:
        return "Upload CSV"
    }
  }

  const getRequiredFields = () => {
    switch (type) {
      case "contact":
        return (
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Full Name (required)</li>
            <li>Company Name (required)</li>
            <li>LinkedIn Profile URL</li>
            <li>Email</li>
            <li>Phone</li>
            <li>Job Title</li>
          </ul>
        )
      case "company":
        return (
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Company Name (required)</li>
            <li>Website (required)</li>
            <li>Industry</li>
            <li>Company Size</li>
            <li>Location</li>
          </ul>
        )
      case "email":
        return (
          <ul className="list-disc pl-6 space-y-1 text-sm">
            <li>Email (required)</li>
            <li>First Name</li>
            <li>Last Name</li>
            <li>Company</li>
          </ul>
        )
      default:
        return null
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      validateAndProcessFile(droppedFiles[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0])
    }
  }

  const validateAndProcessFile = (file: File) => {
    // Check file type
    if (!file.name.endsWith(".csv")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      })
      return
    }

    // Set file and generate preview
    setFile(file)
    setListName(file.name.replace(".csv", ""))

    // In a real implementation, we would parse the CSV here
    // For this example, we'll simulate a preview
    setTimeout(() => {
      setParsePreview([
        { name: "John Smith", company: "Acme Inc", email: "john@acme.com" },
        { name: "Jane Doe", company: "XYZ Corp", email: "jane@xyz.com" },
        { name: "Bob Johnson", company: "ABC Ltd", email: "bob@abc.com" },
      ])
    }, 500)
  }

  const handleUpload = () => {
    if (!file) return

    setIsUploading(true)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += 5
      setUploadProgress(progress)

      if (progress >= 100) {
        clearInterval(interval)
        setIsUploading(false)

        toast({
          title: "Upload successful",
          description: "Your file has been uploaded and is being processed",
        })

        onUploadSuccess(listName || file.name)
      }
    }, 200)
  }

  const handleDownloadSample = () => {
    toast({
      title: "Sample downloaded",
      description: `Sample ${type} CSV template has been downloaded`,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div>
            <p className="text-sm text-gray-600 mb-4">Upload a CSV file with the following fields:</p>
            {getRequiredFields()}
          </div>

          {!file ? (
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300",
                "hover:border-blue-400 hover:bg-blue-50/50",
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input id="file-upload" type="file" className="hidden" accept=".csv" onChange={handleFileChange} />

              <div className="mb-4 flex justify-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Upload className="h-6 w-6" />
                </div>
              </div>

              <p className="text-blue-600 font-medium mb-1">
                {isDragging ? "Drop your file here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500 mb-2">CSV files only (max 10MB)</p>
              <p className="text-xs text-gray-400">Make sure your CSV includes the required headers for {type} data</p>
            </div>
          ) : (
            <div className="border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-600 mr-3">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>

                {!isUploading && (
                  <Button variant="ghost" size="icon" onClick={() => setFile(null)} className="text-gray-500">
                    <X className="h-5 w-5" />
                  </Button>
                )}
              </div>

              {parsePreview && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Preview:</p>
                  <div className="border rounded-md overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {Object.keys(parsePreview[0]).map((header) => (
                            <th
                              key={header}
                              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {parsePreview.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, cellIndex) => (
                              <td key={cellIndex} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Uploading...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                placeholder="Enter a name for this list"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="add-to-collection"
                checked={addToCollection}
                onCheckedChange={(checked) => setAddToCollection(!!checked)}
              />
              <Label htmlFor="add-to-collection" className="text-sm font-medium leading-none">
                Add to My {type === "company" ? "Companies" : "Contacts"}
              </Label>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleDownloadSample}
              disabled={isUploading}
              className="flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sample
            </Button>

            <div className="space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isUploading}>
                Cancel
              </Button>

              <Button className="bg-blue-600" onClick={handleUpload} disabled={isUploading || !file}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : uploadProgress === 100 ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Uploaded
                  </>
                ) : (
                  "Upload File"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

