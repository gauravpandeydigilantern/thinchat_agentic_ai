import { NextResponse } from "next/server"
import { z } from "zod"
import { OpenAI } from "openai"
import { Anthropic } from "@anthropic-ai/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"

// Input validation schema
const generateSchema = z.object({
  prompt: z.string().min(1),
  model: z.string().default("gpt-4o"),
  temperature: z.number().min(0).max(1).default(0.7),
  maxTokens: z.number().min(1).max(4000).default(2000),
})

export async function POST(req: Request) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Parse and validate request body
    const body = await req.json()
    const { prompt, model, temperature, maxTokens } = generateSchema.parse(body)
    
    // Check if user has permission to use AI features
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { productTier: true, features: true }
    })
    
    if (!user || !["professional", "enterprise"].includes(user.productTier)) {
      return NextResponse.json(
        { message: "AI Writer is only available on Professional and Enterprise plans" },
        { status: 403 }
      )
    }
    
    // Check cache for identical prompt (with same parameters)
    const cacheKey = `ai:${model}:${temperature}:${maxTokens}:${prompt}`
    const cachedResponse = await redis.get(cacheKey)
    
    if (cachedResponse) {
      // Return cached response as a stream
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(cachedResponse as string))
          controller.close()
        }
      })
      
      return new Response(stream)
    }
    
    // Get API keys from database (in a real app, these would be encrypted)
    const apiKeys = await db.apiKey.findMany({
      where: { userId: session.user.id, isActive: true }
    })
    
    // Select the appropriate API client based on the model
    let response: string = ""
    
    if (model.startsWith("gpt")) {
      // OpenAI models
      const openaiKey = apiKeys.find(key => key.provider === "openai")?.key
      
      if (!openaiKey) {
        return NextResponse.json(
          { message: "OpenAI API key not configured" },
          { status: 400 }
        )
      }
      
      const openai = new OpenAI({ apiKey: openaiKey })
      
      const stream = await openai.chat.completions.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      })
      
      // Create a stream to send the response
      const textEncoder = new TextEncoder()
      const responseStream = new ReadableStream({
        async start(controller) {
          let fullResponse = ""
          
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ""
            if (content) {
              fullResponse += content
              controller.enqueue(textEncoder.encode(content))
            }
          }
          
          // Cache the full response
          await redis.set(cacheKey, fullResponse, { ex: 60 * 60 * 24 }) // 24 hours
          
          controller.close()
        }
      })
      
      return new Response(responseStream)
    } else if (model.startsWith("claude")) {
      // Anthropic models
      const anthropicKey = apiKeys.find(key => key.provider === "anthropic")?.key
      
      if (!anthropicKey) {
        return NextResponse.json(
          { message: "Anthropic API key not configured" },
          { status: 400 }
        )
      }
      
      const anthropic = new Anthropic({ apiKey: anthropicKey })
      
      const stream = await anthropic.messages.create({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: temperature,
        max_tokens: maxTokens,
        stream: true,
      })
      
      // Create a stream to send the response
      const textEncoder = new TextEncoder()
      const responseStream = new ReadableStream({
        async start(controller) {
          let fullResponse = ""
          
          for await (const chunk of stream) {
            const content = chunk.delta?.text || ""
            if (content) {
              fullResponse += content
              controller.enqueue(textEncoder.encode(content))
            }
          }
          
          // Cache the full response
          await redis.set(cacheKey, fullResponse, { ex: 60 * 60 * 24 }) // 24 hours
          
          controller.close()
        }
      })
      
      return new Response(responseStream)
    } else if (model.startsWith("gemini")) {
      // Google models
      const googleKey = apiKeys.find(key => key.provider === "google")?.key
      
      if (!googleKey) {
        return NextResponse.json(
          { message: "Google API key not configured" },
          { status: 400 }
        )
      }
      
      const genAI = new GoogleGenerativeAI(googleKey)
      const geminiModel = genAI.getGenerativeModel({ model: model })
      
      const result = await geminiModel.generateContentStream(prompt, {
        temperature: temperature,
        maxOutputTokens: maxTokens,
      })
      
      // Create a stream to send the response
      const textEncoder = new TextEncoder()
      const responseStream = new ReadableStream({
        async start(controller) {
          let fullResponse = ""
          
          for await (const chunk of result.stream) {
            const content = chunk.text()
            if (content) {
              fullResponse += content
              controller.enqueue(textEncoder.encode(content))
            }
          }
          
          // Cache the full response
          await redis.set(cacheKey, fullResponse, { ex: 60 * 60 * 24 }) // 24 hours
          
          controller.close()
        }
      })
      
      return new Response(responseStream)
    } else {
      return NextResponse.json(
        { message: "Unsupported model" },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("AI generation error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { message: "Failed to generate content" },
      { status: 500 }
    )
  }
}