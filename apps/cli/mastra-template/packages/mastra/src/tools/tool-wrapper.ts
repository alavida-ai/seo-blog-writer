import { createTool } from "@mastra/core";
import { z } from "zod";

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number; // milliseconds
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000,
};

/**
 * Simple retry wrapper for Mastra tools
 */
export function withRetry<TInput extends z.ZodSchema, TOutput extends z.ZodSchema>(
  toolConfig: {
    id: string;
    description: string;
    inputSchema: TInput;
    outputSchema?: TOutput;
    execute: (params: {
      context: z.infer<TInput>;
      runtimeContext?: any;
    }) => Promise<z.infer<TOutput> | any>;
  },
  options: RetryOptions = {}
) {
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  return createTool({
    id: toolConfig.id,
    description: toolConfig.description,
    inputSchema: toolConfig.inputSchema,
    outputSchema: toolConfig.outputSchema,
    execute: async (params: { context: z.infer<TInput>; runtimeContext?: any }) => {
      let lastError: unknown;
      
      for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
          console.log(`[${toolConfig.id}] Attempt ${attempt}/${config.maxAttempts}`);
          
          const result = await toolConfig.execute(params);
          
          if (attempt > 1) {
            console.log(`[${toolConfig.id}] ✅ Succeeded on attempt ${attempt}`);
          }
          
          return result;
          
        } catch (error) {
          lastError = error;
          const errorMessage = error instanceof Error ? error.message : String(error);
          
          console.log(`[${toolConfig.id}] ❌ Attempt ${attempt} failed:`, errorMessage);
          
          // Don't retry if this is the last attempt
          if (attempt === config.maxAttempts) {
            const agentMessage = generateAgentErrorMessage(
              toolConfig.id,
              errorMessage,
              attempt,
              config.maxAttempts
            );
            throw new Error(agentMessage);
          }
          
          // Wait before retry with exponential backoff
          const delay = config.baseDelay * Math.pow(2, attempt - 1);
          console.log(`[${toolConfig.id}] ⏳ Retrying in ${delay}ms...`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      // This should never be reached, but TypeScript needs it
      throw lastError;
    },
  });
}

/**
 * Generates helpful error messages for agents
 */
function generateAgentErrorMessage(
  toolId: string,
  errorMessage: string,
  attempt: number,
  maxAttempts: number
): string {
  const isNetworkError = errorMessage.toLowerCase().includes('network') || 
                         errorMessage.toLowerCase().includes('connection') ||
                         errorMessage.toLowerCase().includes('timeout');
  
  const isRateLimit = errorMessage.toLowerCase().includes('rate limit') || 
                      errorMessage.toLowerCase().includes('429');
  
  const isAuthError = errorMessage.toLowerCase().includes('unauthorized') || 
                      errorMessage.toLowerCase().includes('401') ||
                      errorMessage.toLowerCase().includes('403') ||
                      errorMessage.toLowerCase().includes('api key');

  let suggestion = "";
  
  if (isNetworkError) {
    suggestion = "Network issue detected. Try reducing concurrent requests or check connectivity.";
  } else if (isRateLimit) {
    suggestion = "Rate limit hit. Wait longer between requests or use alternative data sources.";
  } else if (isAuthError) {
    suggestion = "Authentication failed. Check API credentials - DO NOT retry immediately.";
  } else {
    suggestion = "Check input parameters and consider using alternative tools if error persists.";
  }

  return `Tool "${toolId}" failed after ${maxAttempts} attempts.

**Agent Instructions:** ${suggestion}

**Error Details:** ${errorMessage}

**Next Steps:** Review the error above and adjust your approach accordingly.`;
}

/**
 * Wrap an existing tool with retry logic
 */
export function wrapTool(tool: ReturnType<typeof createTool>, options: RetryOptions = {}) {
  const toolConfig = {
    id: (tool as any).id,
    description: (tool as any).description,
    inputSchema: (tool as any).inputSchema,
    outputSchema: (tool as any).outputSchema,
    execute: (tool as any).execute,
  };
  
  return withRetry(toolConfig, options);
}

// Usage Examples:

// 1. Wrap an existing tool with custom retry settings
// import { searchImage } from './search';
// const searchToolWithRetry = wrapTool(searchImage, { maxAttempts: 5, baseDelay: 2000 });

// 2. Create a new tool with built-in retry logic
// export const robustSearchTool = withRetry({
//   id: "robust-search", 
//   description: "Search tool with automatic retry",
//   inputSchema: z.object({
//     query: z.string()
//   }),
//   execute: async ({ context }) => {
//     return await someAPICall(context.query);
//   }
// }, { maxAttempts: 3 });

// 3. Default retry (3 attempts, 1s base delay)
// const defaultRetryTool = wrapTool(myTool);
