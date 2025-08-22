import { MCPServer } from "@mastra/mcp";
import { writeBlogPostTool } from "../tools/write-blog-post";
import { discoverRepositoryContextTool } from "../tools/discover-repository-context";
import { promptHandlers } from "./prompts";

export const seoBlogsMCP = new MCPServer({
    name: "seo-blogs-mcp",
    version: "0.1.0",
    description: "An MCP server for repository-aware blog post generation",
    tools: {
        discoverRepositoryContext: discoverRepositoryContextTool,
        writeBlogPost: writeBlogPostTool,
    },
    releaseDate: new Date().toISOString(),
    // prompts: promptHandlers,
});