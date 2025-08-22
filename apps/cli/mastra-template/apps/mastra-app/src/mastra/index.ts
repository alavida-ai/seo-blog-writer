import { researchAgent } from "../../../../packages/mastra/src/agents/seo-research-agent";
import { blogWritingWorkflow } from "../../../../packages/mastra/src/workflows/blog-writing-workflow";
import { contentWriterAgent } from "../../../../packages/mastra/src/agents/content-writer-agent";
import { competitiveAnalysisAgent } from "../../../../packages/mastra/src/agents/competitive-analysis-agent";
import { imageSearchAgent } from "../../../../packages/mastra/src/agents/image-search-agent";
import { blogImageWorkflow } from "../../../../packages/mastra/src/workflows/blog-image-workflow";
import { seoBlogsMCP } from "../../../../packages/mastra/src/mcp/seo-blog-mcp";
import { Mastra } from "@mastra/core";

import dotenv from 'dotenv';
// Load environment variables if a local .env file exists. In serverless (e.g., Vercel),
// environment variables are provided by the platform and this call is a no-op.
// Load .env file for local development
if (!process.env.GITHUB_ACTIONS && process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: '../../.vibeflow/.env' });
    console.log('Local development mode - loaded .env file');
  } else if (process.env.GITHUB_ACTIONS) {
    console.log('GitHub Actions mode - using workflow secrets');
  } else {
    console.log('Production mode - using environment variables');
  }

export const mastra = new Mastra({
  agents: { researchAgent, contentWriterAgent, competitiveAnalysisAgent, imageSearchAgent },
  workflows: { blogWritingWorkflow, blogImageWorkflow },
  mcpServers: {
    seoBlogsMCP: seoBlogsMCP,
  },
  telemetry: {
    enabled: false,
  },
});

