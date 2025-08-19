

import { createOpenRouter, OpenRouterProvider } from '@openrouter/ai-sdk-provider';

// Singleton MCP Client instance
let openRouterInstance: OpenRouterProvider | null = null;

// Singleton factory function
export function getOpenRouter(): OpenRouterProvider {
    if (!openRouterInstance) {
        openRouterInstance = createOpenRouter       ({
            apiKey: process.env.OPENROUTER_API_KEY!,
            baseURL: "https://openrouter.ai/api/v1",
        });
    }
    return openRouterInstance;
}
