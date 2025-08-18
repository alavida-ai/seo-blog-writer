import { MCPClient } from "@mastra/mcp";
import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });
 
// Only include the MCP servers whose tools you want
export const mcp = new MCPClient({
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