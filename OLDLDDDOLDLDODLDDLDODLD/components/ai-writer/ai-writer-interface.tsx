"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Send, Loader2, ThumbsUp, ThumbsDown, Copy, Download, RefreshCw, Settings, Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ModelSelector } from "./model-selector"
import { Checkbox } from "@radix-ui/react-checkbox"
import { PromptHistory } from "./prompt-history"
import { PromptTemplate } from "./prompt-template"
import { AiSettingsDialog } from "./ai-setting-dialog"


interface AiWriterInterfaceProps {
  initialPrompt?: string
}

export function AiWriterInterface({ initialPrompt = "" }: AiWriterInterfaceProps) {
  const router = useRouter()
  const responseRef = useRef<HTMLDivElement>(null)
  
  const [prompt, setPrompt] = useState(initialPrompt)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState("")
  const [selectedModel, setSelectedModel] = useState("gpt-4o")
  const [activeTab, setActiveTab] = useState("editor")
  const [isCopied, setIsCopied] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [includeUserInfo, setIncludeUserInfo] = useState(true)
  
  // Sample prompt templates
  const promptTemplates = [
    {
      id: "linkedin-connection",
      title: "LinkedIn Connection Request",
      description: "Write a personalized LinkedIn connection request that establishes rapport with the prospect",
      prompt: "Write a personalized LinkedIn connection request to {{name}} who is a {{position}} at {{company}}. The message should establish rapport, demonstrate understanding of their role, and provide a clear reason for connecting."
    },
    {
      id: "sales-email",
      title: "Sales Email",
      description: "Compose a persuasive sales email that showcases your value proposition",
      prompt: "Compose a persuasive sales email for {{company}} that showcases our unique value proposition, addresses their pain points, and includes a clear call to action."
    },
    {
      id: "follow-up",
      title: "Follow-Up Email",
      description: "Write a follow-up email for prospects who haven't responded",
      prompt: "Write a follow-up email for {{name}} at {{company}} who hasn't responded to my initial outreach. The email should be concise, provide additional value, and include a gentle call to action."
    },
    {
      id: "voicemail",
      title: "Voicemail Script",
      description: "Develop a compelling voicemail script highlighting customer success",
      prompt: "Develop a compelling voicemail script for {{name}} that highlights a customer success story, shares how our company has helped similar businesses, and includes a clear next step."
    },
    {
      id: "social-post",
      title: "Social Media Post",
      description: "Draft a shareable social media post highlighting your company",
      prompt: "Draft a shareable social media post for LinkedIn that highlights our company's innovative features, includes an eye-catching hook, and encourages engagement."
    },
    {
      id: "cold-call",
      title: "Cold Call Script",
      description: "Create a compelling phone call script for initial outreach",
      prompt: "Create a compelling phone call script for initial outreach to {{name}} at {{company}}. The script should include an introduction, value proposition, qualifying questions, and next steps."
    }
  ]
  
  const handleSelectTemplate = (template: typeof promptTemplates[0]) => {
    setPrompt(template.prompt)
  }
  
  const handleGenerateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter a prompt or select a template",
        variant: "destructive"
      })
      return
    }
    
    setIsGenerating(true)
    setGeneratedContent("")
    
    try {
      // Prepare the prompt with user info if enabled
      let fullPrompt = prompt
      if (includeUserInfo) {
        fullPrompt = `${fullPrompt}\n\nUse the following information about me in your response:\nName: John Smith\nCompany: Acme Inc\nRole: Sales Director\nIndustry: Software`
      }
      
      // Call the AI generation API
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: selectedModel,
        }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to generate content")
      }
      
      // Handle streaming response
      const reader = response.body?.getReader()
      if (!reader) throw new Error("Failed to read response")
      
      const decoder = new TextDecoder()
      let content = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        content += chunk
        setGeneratedContent(content)
        
        // Auto-scroll to bottom of response
        if (responseRef.current) {
          responseRef.current.scrollTop = responseRef.current.scrollHeight
        }
      }
      
      // Save to history
      saveToHistory(prompt, content)
      
      // Switch to editor tab to show the result
      setActiveTab("editor")
    } catch (error) {
      console.error("Generation error:", error)
      toast({
        variant: "destructive",
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate content",
      })
    } finally {
      setIsGenerating(false)
    }
  }
  
  const saveToHistory = (prompt: string, response: string) => {
    const history = JSON.parse(localStorage.getItem("promptHistory") || "[]")
    history.unshift({
      id: Date.now().toString(),
      prompt,
      response,
      model: selectedModel,
      timestamp: new Date().toISOString(),
    })
    
    // Keep only the last 20 items
    const trimmedHistory = history.slice(0, 20)
    localStorage.setItem("promptHistory", JSON.stringify(trimmedHistory))
  }
  
  const handleCopyContent = () => {
    if (!generatedContent) return
    
    navigator.clipboard.writeText(generatedContent)
    setIsCopied(true)
    
    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
    
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    })
  }
  
  const handleDownloadContent = () => {
    if (!generatedContent) return
    
    const blob = new Blob([generatedContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    
    link.href = url
    link.download = `ai-content-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: "Content downloaded",
      description: "Your content has been downloaded as a text file",
    })
  }
  
  const handleFeedback = (isPositive: boolean) => {
    // In a real app, this would send feedback to the server
    toast({
      title: isPositive ? "Positive feedback sent" : "Negative feedback sent",
      description: "Thank you for your feedback!",
    })
  }
  
  const handleRegenerateContent = () => {
    handleGenerateContent()
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">AI Writer</h1>
        <div className="flex items-center space-x-2">
          <ModelSelector
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <div className="flex flex-col">
              <label className="text-sm font-medium mb-2">Prompt</label>
              <Textarea
                placeholder="Enter your prompt here or select a template..."
                className="flex-1 min-h-[200px] resize-none"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Checkbox
                    id="include-user-info"
                    checked={includeUserInfo}
                    onCheckedChange={(checked) => setIncludeUserInfo(!!checked)}
                  />
                  <label
                    htmlFor="include-user-info"
                    className="text-sm ml-2 cursor-pointer"
                  >
                    Include my profile info
                  </label>
                </div>
                
                <Button
                  className="bg-blue-600"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !prompt.trim()}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Generated Content</label>
                
                {generatedContent && (
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleFeedback(true)}
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      <span className="text-xs">Good</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => handleFeedback(false)}
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" />
                      <span className="text-xs">Bad</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={handleCopyContent}
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-xs">Copy</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={handleDownloadContent}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      <span className="text-xs">Save</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={handleRegenerateContent}
                      disabled={isGenerating}
                    >
                      <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? 'animate-spin' : ''}`} />
                      <span className="text-xs">Regenerate</span>
                    </Button>
                  </div>
                )}
              </div>
              
              <div
                ref={responseRef}
                className="flex-1 border rounded-md p-3 overflow-y-auto bg-white"
              >
                {isGenerating && !generatedContent ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                  </div>
                ) : generatedContent ? (
                  <div className="whitespace-pre-wrap">{generatedContent}</div>
                ) : (
                  <div className="text-gray-400 flex items-center justify-center h-full text-center">
                    <p>Generated content will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Recent Prompts</h3>
            <PromptHistory onSelectPrompt={(item) => {
              setPrompt(item.prompt)
              setGeneratedContent(item.response)
              setSelectedModel(item.model)
            }} />
          </div>
        </TabsContent>
        
        <TabsContent value="templates" className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {promptTemplates.map((template) => (
              <PromptTemplate
                key={template.id}
                title={template.title}
                description={template.description}
                onClick={() => handleSelectTemplate(template)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <AiSettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}