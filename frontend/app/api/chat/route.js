import { streamText, convertToModelMessages, tool } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { analyzeWebsiteTool } from "../../../lib/tools/analyzeWebsite";

const openrouter = createOpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req)
 {
  
  try {
    const { messages } = await req.json();

    const result = streamText({
      model: openrouter("openrouter/free"),

      system:
        "You are a helpful AI assistant for a professional AI-powered web application. When the user asks you to analyze a website, use the analyzeWebsite tool.",

      messages: await convertToModelMessages(messages),

      tools: {
        analyzeWebsite: tool(analyzeWebsiteTool),
      },

      maxSteps: 5,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to generate AI response.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}