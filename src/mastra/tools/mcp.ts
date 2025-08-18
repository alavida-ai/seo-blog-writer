import { MCPClient } from "@mastra/mcp";
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });

// Singleton MCP Client instance
let mcpClientInstance: MCPClient | null = null;

// Singleton factory function
export function getMCPClient(): MCPClient {
    if (!mcpClientInstance) {
        mcpClientInstance = new MCPClient({
            timeout: 30000,
            servers: {
                dataForSEO: {
                    command: "npx",
                    args: [
                        "-y",
                        "@smithery/cli@latest",
                        "run",
                        "@moaiandin/mcp-dataforseo",
                        "--key",
                        process.env.DATA_FOR_SEO_KEY!,
                        "--profile",
                        "characteristic-walrus-1kqMhO"
                    ]
                },
                // Commented out firecrawlMCP - uncomment if needed
                firecrawlMCP: {
                    command: "npx",
                    args: [
                        "-y",
                        "firecrawl-mcp"
                    ],
                    env: {
                        FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY!
                    }
                }
            }
        });
    }
    return mcpClientInstance;
}

// Cache for filtered tools to avoid re-fetching
const toolCache = new Map<string, any>();

// Option 2: Tool-level filtering functions
export async function getFilteredTools(options: {
    allowedTools?: string[];      // Whitelist specific tools
    blockedTools?: string[];      // Blacklist specific tools  
    serverFilter?: string[];      // Only get tools from specific servers
    startsWith?: string[];        // Only get tools that start with a specific string
}) {
    // Create cache key from options
    const cacheKey = JSON.stringify(options);
    
    // Check cache first
    if (toolCache.has(cacheKey)) {
        return toolCache.get(cacheKey);
    }

    // Use singleton MCP client
    const mcpClient = getMCPClient();
    const allTools = await mcpClient.getTools();
    let filteredTools: any = {};

    for (const [toolName, toolDef] of Object.entries(allTools)) {
        // Server filtering
        if (options.serverFilter) {
            const toolServer = (toolDef as any).server;
            if (toolServer && !options.serverFilter.includes(toolServer)) {
                continue;
            }
        }

        // Whitelist filtering  
        if (options.allowedTools && !options.allowedTools.includes(toolName)) {
            continue;
        }

        // Blacklist filtering
        if (options.blockedTools && options.blockedTools.includes(toolName)) {
            continue;
        }

        // StartsWith filtering
        if (options.startsWith && !options.startsWith.some(prefix => toolName.startsWith(prefix))) {
            continue;
        }

        filteredTools[toolName] = toolDef;
    }

    // Cache the result
    toolCache.set(cacheKey, filteredTools);
    
    return filteredTools;
}