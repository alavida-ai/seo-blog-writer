#!/usr/bin/env node
import { z } from "zod";
import { createTool } from "@mastra/core";
import { PERPLEXITY_SONAR } from "../constants/models";

const perplexityAskSchema = z.object({
  messages: z.array(z.object({
    role: z.string().describe("Role of the message (e.g., system, user, assistant)"),
    content: z.string().describe("The content of the message"),
  })),
});

export const perplexityAskTool = createTool({
  id: "perplexityAsk",
  description: `Ask a question to the Perplexity Sonar model via OpenRouter API. Use this tool to perform research on a given topic.
  Example usage:
  \`\`\`json
  {
    "messages": [
      {
        "role": "user",
        "content": "What is the capital of France?"
      }
    ]
  }
  \`\`\``,
  inputSchema: perplexityAskSchema,
  execute: async ({ context, runtimeContext }) => {
    const messages = context.messages;
    const result = await performChatCompletion(messages);
    return result;
  },
});

// Retrieve the OpenRouter API key from environment variables
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("Error: OPENROUTER_API_KEY environment variable is required");
  process.exit(1);
}

async function performChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = PERPLEXITY_SONAR
): Promise<string> {
  const url = "https://openrouter.ai/api/v1/chat/completions";
  const body = {
    model: model,
    messages: messages,
    // Additional parameters can be added here if required (e.g., max_tokens, temperature, etc.)
    // See the OpenRouter API documentation for more details
  };

  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.SITE_URL || "", // Optional. Site URL for rankings on openrouter.ai.
        "X-Title": process.env.SITE_NAME || "", // Optional. Site title for rankings on openrouter.ai.
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(`Network error while calling OpenRouter API: ${error}`);
  }

  // Check for non-successful HTTP status
  if (!response.ok) {
    let errorText;
    try {
      errorText = await response.text();
    } catch (parseError) {
      errorText = "Unable to parse error response";
    }
    throw new Error(
      `OpenRouter API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  // Attempt to parse the JSON response from the API
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse JSON response from OpenRouter API: ${jsonError}`);
  }

  // Directly retrieve the main message content from the response 
  const messageContent = data.choices[0].message.content;

  return messageContent;
}