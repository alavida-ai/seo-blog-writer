import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const prompt = `🔍 Discover Repository Context

This tool helps you discover the current repository's structure and conventions before creating blog posts.

**Please run these commands and analyze the results:**

1. **Get repository info:**
   \`git remote get-url origin\` - Extract owner/repo (e.g., git@github.com:alavida-ai/seo-blog-writer.git → alavida-ai/seo-blog-writer)
   \`git branch --show-current\` - Get current branch

2. **Find content directories:**
   \`find . -type d \\( -name "*content*" -o -name "*blog*" -o -name "*docs*" \\) -not -path "*/node_modules/*"\`

**Example Analysis:**
- Repository: alavida-ai/seo-blog-writer
- Content Path: ./apps/docs/content/blogs/

**Return the discovered context using this exact format:**

{
  "owner": "alavida-ai",
  "repo": "seo-blog-writer",
  "currentBranch": "feat/content-blog",
  "contentPath": "./apps/docs/content/blogs/"
}
`


export const discoverRepositoryContextTool = createTool({
  id: "discover-repository-context",
  description: "This tool is used to discover the current repository's structure and conventions before creating blog posts.",
  outputSchema: z.object({
    prompt: z.string(),
  }),
  execute: async () => {
    return {
      prompt,
    };
  }
});
