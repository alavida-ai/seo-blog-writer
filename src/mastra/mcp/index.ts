import { MCPServer } from "@mastra/mcp";
import { writeBlogPostTool } from "../tools/write-blog-post";
 
export const seoBlogsMCP = new MCPServer({
    name: "seo-blogs-mcp",
    version: "0.1.0",
    description: "An MCP server for writing blog posts ",
    tools: {
      writeBlogPost: writeBlogPostTool,
    },
});