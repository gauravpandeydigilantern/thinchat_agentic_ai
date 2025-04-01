"use client"

import { useState, useEffect } from "react"
import { Clock, ArrowRight } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

interface HistoryItem {
  id: string
  prompt: string
  response: string
  model: string
  timestamp: string
}

interface PromptHistoryProps {
  onSelectPrompt: (item: HistoryItem) => void
}

export function PromptHistory({ onSelectPrompt }: PromptHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  
  useEffect(() => {
    // Load history from localStorage
    const savedHistory = localStorage.getItem("promptHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])
  
  if (history.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p>No prompt history yet</p>
      </div>
    )
  }
  
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <ScrollArea className="h-[120px]">
      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            onClick={() => onSelectPrompt(item)}
          >
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {truncateText(item.prompt, 60)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimestamp(item.timestamp)} • {item.model}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}