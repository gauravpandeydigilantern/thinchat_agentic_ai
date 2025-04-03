"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface UploadSuccessModalProps {
  fileName: string
  onClose: () => void
}

export function UploadSuccessModal({ fileName, onClose }: UploadSuccessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
            <Check className="h-8 w-8" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-4">Upload Success!</h2>

        <p className="text-center text-gray-600 mb-6">
          Your list is now being enriched. Please check back soon and we will also alert you once your list has been
          completely researched. you can view your list and current research progress by clicking below.
        </p>

        <div className="flex justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700 w-full" onClick={onClose}>
            View My List
          </Button>
        </div>
      </div>
    </div>
  )
}

