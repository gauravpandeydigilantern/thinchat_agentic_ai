"use client"

import { X, RefreshCw, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { ContactData } from "@/lib/types"
import { useState } from "react"

interface DataEnrichmentPanelProps {
  selectedContacts: ContactData[]
  onClose: () => void
}

export function DataEnrichmentPanel({ selectedContacts, onClose }: DataEnrichmentPanelProps) {
  const [enrichmentStatus, setEnrichmentStatus] = useState<"idle" | "processing" | "complete" | "error">("idle")
  const [progress, setProgress] = useState(0)

  const handleStartEnrichment = () => {
    setEnrichmentStatus("processing")
    setProgress(0)

    // Simulate enrichment process
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10
        if (newProgress >= 100) {
          clearInterval(interval)
          setEnrichmentStatus("complete")
          return 100
        }
        return newProgress
      })
    }, 500)
  }

  return (
    <div className="w-96 border-l border-gray-200 bg-white overflow-auto h-full">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">Data Enrichment</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">Selected Contacts ({selectedContacts.length})</h3>
          <div className="max-h-40 overflow-y-auto border rounded-md divide-y">
            {selectedContacts.map((contact) => (
              <div key={contact.id} className="p-2 flex items-center justify-between">
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-xs text-gray-500">{contact.company}</p>
                </div>
                {enrichmentStatus === "complete" && <Check className="h-5 w-5 text-green-500" />}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium">Enrichment Sources</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="source-linkedin" className="rounded" defaultChecked />
                <label htmlFor="source-linkedin">LinkedIn</label>
              </div>
              <span className="text-xs text-gray-500">5 credits per contact</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="source-clearbit" className="rounded" defaultChecked />
                <label htmlFor="source-clearbit">Clearbit</label>
              </div>
              <span className="text-xs text-gray-500">3 credits per contact</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="source-hunter" className="rounded" defaultChecked />
                <label htmlFor="source-hunter">Hunter.io</label>
              </div>
              <span className="text-xs text-gray-500">2 credits per contact</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium">Data to Enrich</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="data-email" className="rounded" defaultChecked />
              <label htmlFor="data-email">Email Addresses</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="data-phone" className="rounded" defaultChecked />
              <label htmlFor="data-phone">Phone Numbers</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="data-social" className="rounded" defaultChecked />
              <label htmlFor="data-social">Social Profiles</label>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="data-company" className="rounded" defaultChecked />
              <label htmlFor="data-company">Company Information</label>
            </div>
          </div>
        </div>

        {enrichmentStatus === "processing" && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Enrichment Progress</h3>
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-gray-500 mt-2">Enriching data from multiple sources...</p>
          </div>
        )}

        {enrichmentStatus === "complete" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Enrichment Complete</h3>
              <p className="text-xs text-green-700 mt-1">
                Successfully enriched {selectedContacts.length} contacts. New data has been added to your contacts.
              </p>
            </div>
          </div>
        )}

        {enrichmentStatus === "error" && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Enrichment Failed</h3>
              <p className="text-xs text-red-700 mt-1">
                There was an error enriching your contacts. Please try again later.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        {enrichmentStatus === "idle" && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Total Credits Required</p>
              <p className="text-xs text-gray-500">{selectedContacts.length * 10} credits</p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleStartEnrichment}
              disabled={selectedContacts.length === 0}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Start Enrichment
            </Button>
          </div>
        )}

        {enrichmentStatus === "processing" && (
          <Button variant="outline" className="w-full" onClick={onClose} disabled>
            Processing...
          </Button>
        )}

        {(enrichmentStatus === "complete" || enrichmentStatus === "error") && (
          <Button className="w-full" onClick={onClose}>
            Close
          </Button>
        )}
      </div>
    </div>
  )
}

