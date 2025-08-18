#!/usr/bin/env node
import { z } from "zod";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { createTool } from "@mastra/core";

const perplexityAskSchema = z.object({
  messages: z.array(z.object({
    role: z.string().describe("Role of the message (e.g., system, user, assistant)"),
    content: z.string().describe("The content of the message"),
  })),
});

export const perplexityAskTool = createTool({
  id: "perplexityAsk",
  description: `Ask a question to the Perplexity API. Use this tool to perform research on a given topic.
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
    const model = "sonar";
    const result = await performChatCompletion(messages, model);
    return result;
  },
});
// Retrieve the Perplexity API key from environment variables
const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;
if (!PERPLEXITY_API_KEY) {
  console.error("Error: PERPLEXITY_API_KEY environment variable is required");
  process.exit(1);
}

async function performChatCompletion(
  messages: Array<{ role: string; content: string }>,
  model: string = "sonar-pro"
): Promise<string> {
  // Construct the API endpoint URL and request body
  const url = new URL("https://api.perplexity.ai/chat/completions");
  const body = {
    model: model, // Model identifier passed as parameter
    messages: messages,
    // Additional parameters can be added here if required (e.g., max_tokens, temperature, etc.)
    // See the Sonar API documentation for more details: 
    // https://docs.perplexity.ai/api-reference/chat-completions
  };

  let response;
  try {
    response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new Error(`Network error while calling Perplexity API: ${error}`);
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
      `Perplexity API error: ${response.status} ${response.statusText}\n${errorText}`
    );
  }

  // Attempt to parse the JSON response from the API
  let data;
  try {
    data = await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse JSON response from Perplexity API: ${jsonError}`);
  }

  // Directly retrieve the main message content from the response 
  let messageContent = data.choices[0].message.content;

  // If citations are provided, append them to the message content
  if (data.citations && Array.isArray(data.citations) && data.citations.length > 0) {
    messageContent += "\n\nCitations:\n";
    data.citations.forEach((citation: string, index: number) => {
      messageContent += `[${index + 1}] ${citation}\n`;
    });
  }

  return messageContent;
}