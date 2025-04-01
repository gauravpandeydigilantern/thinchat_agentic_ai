"use client"

import { useState, useEffect } from "react"
import { X, Plus, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApiKeyConfig {
  provider: string
  key: string
  isActive: boolean
}

interface AiSettingsDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSettingsDialog({ isOpen, onClose }: AiSettingsDialogProps) {
  const [activeTab, setActiveTab] = useState("api-keys")
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig[]>([])
  const [newProvider, setNewProvider] = useState("")
  const [newApiKey, setNewApiKey] = useState("")
  const [showApiKey, setShowApiKey] = useState(false)
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2000)
  const [streamResponse, setStreamResponse] = useState(true)
  
  useEffect(() => {
    // Load saved API keys from localStorage
    const savedKeys = localStorage.getItem("aiApiKeys")
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    } else {
      // Default keys (empty/placeholder)
      setApiKeys([
        { provider: "OpenAI", key: "", isActive: true },
        { provider: "Anthropic", key: "", isActive: false },
        { provider: "Google", key: "", isActive: false },
      ])
    }
    
    // Load other settings
    const savedTemperature = localStorage.getItem("aiTemperature")
    if (savedTemperature) setTemperature(parseFloat(savedTemperature))
    
    const savedMaxTokens = localStorage.getItem("aiMaxTokens")
    if (savedMaxTokens) setMaxTokens(parseInt(savedMaxTokens))
    
    const savedStreamResponse = localStorage.getItem("aiStreamResponse")
    if (savedStreamResponse) setStreamResponse(savedStreamResponse === "true")
  }, [])
  
  const saveSettings = () => {
    // Save API keys
    localStorage.setItem("aiApiKeys", JSON.stringify(apiKeys))
    
    // Save other settings
    localStorage.setItem("aiTemperature", temperature.toString())
    localStorage.setItem("aiMaxTokens", maxTokens.toString())
    localStorage.setItem("aiStreamResponse", streamResponse.toString())
    
    onClose()
  }
  
  const handleAddApiKey = () => {
    if (!newProvider.trim() || !newApiKey.trim()) return
    
    const newKeys = [...apiKeys, {
      provider: newProvider,
      key: newApiKey,
      isActive: false
    }]
    
    setApiKeys(newKeys)
    setNewProvider("")
    setNewApiKey("")
  }
  
  const handleRemoveApiKey = (index: number) => {
    const newKeys = [...apiKeys]
    newKeys.splice(index, 1)
    setApiKeys(newKeys)
  }
  
  const handleToggleApiKey = (index: number) => {
    const newKeys = apiKeys.map((key, i) => ({
      ...key,
      isActive: i === index
    }))
    
    setApiKeys(newKeys)
  }
  
  const handleUpdateApiKey = (index: number, key: string) => {
    const newKeys = [...apiKeys]
    newKeys[index].key = key
    setApiKeys(newKeys)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>AI Writer Settings</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="generation">Generation Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-4 py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                API keys are stored securely in your browser and never sent to our servers.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              {apiKeys.map((apiKey, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1 grid grid-cols-5 gap-2">
                    <Input
                      className="col-span-2"
                      value={apiKey.provider}
                      readOnly
                    />
                    <div className="col-span-3 relative">
                      <Input
                        type={showApiKey ? "text" : "password"}
                        value={apiKey.key}
                        onChange={(e) => handleUpdateApiKey(index, e.target.value)}
                        placeholder={`Enter ${apiKey.provider} API key`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Switch
                    checked={apiKey.isActive}
                    onCheckedChange={() => handleToggleApiKey(index)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveApiKey(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Provider (e.g., Cohere)"
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
              />
              <Input
                type={showApiKey ? "text" : "password"}
                placeholder="API Key"
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button onClick={handleAddApiKey}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="generation" className="space-y-6 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Temperature: {temperature.toFixed(1)}</Label>
                <span className="text-sm text-gray-500">
                  {temperature < 0.3 ? "More deterministic" : 
                   temperature > 0.7 ? "More creative" : "Balanced"}
                </span>
              </div>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <p className="text-xs text-gray-500">
                Lower values produce more consistent outputs, higher values produce more varied outputs.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Max Tokens: {maxTokens}</Label>
              </div>
              <Slider
                min={100}
                max={4000}
                step={100}
                value={[maxTokens]}
                onValueChange={(value) => setMaxTokens(value[0])}
              />
              <p className="text-xs text-gray-500">
                Maximum number of tokens to generate. Higher values allow for longer responses.
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Stream Response</Label>
                <p className="text-xs text-gray-500">
                  Show responses as they're generated instead of waiting for completion.
                </p>
              </div>
              <Switch
                checked={streamResponse}
                onCheckedChange={setStreamResponse}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}