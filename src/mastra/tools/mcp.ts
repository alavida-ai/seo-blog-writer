import { MCPClient } from "@mastra/mcp";
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });
 
// Only include the MCP servers whose tools you want
export const mcp = new MCPClient({
    timeout: 30000,
    servers: {
        // Remove servers you don't want tools from
        perplexityAsk: {
            command: "npx",
            args: [
                "-y",
                "server-perplexity-ask"
            ],
            env: {
                PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY!
            }
        },
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
        playwrightMCP: {
            command: "npx",
            args: [
                "-y",
                "@smithery/cli@latest",
                "run",
                "@microsoft/playwright-mcp",
                "--key",
                "b59019bc-fc5e-4a64-8152-2b1d3bf7ab0d"
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

// Option 2: Tool-level filtering functions
export async function getFilteredTools(options: {
    allowedTools?: string[];      // Whitelist specific tools
    blockedTools?: string[];      // Blacklist specific tools  
    serverFilter?: string[];      // Only get tools from specific servers
    startsWith?: string[];        // Only get tools that start with a specific string
}) {
    const allTools = await mcp.getTools();
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

    return filteredTools;
}

// Convenience functions for common use cases
export const getResearchTools = () => getFilteredTools({
    allowedTools: [
        'mcp_perplexity-ask_perplexity_ask',  // Perplexity research
        'mcp_dataforseo_keyword_research',    // DataForSEO keyword research  
        'mcp_dataforseo_serp_analysis',       // DataForSEO SERP analysis
        // Add other specific tool names you want
    ]
});