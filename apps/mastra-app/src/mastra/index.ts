
import { VercelDeployer } from "@mastra/deployer-vercel";

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
    dotenv.config({ path: '../../.env' });
    console.log('Local development mode - loaded .env file');
  } else if (process.env.GITHUB_ACTIONS) {
    console.log('GitHub Actions mode - using workflow secrets');
  } else {
    console.log('Production mode - using environment variables');
  }
  

// // Configure console logging for serverless environments
// const logger = new PinoLogger({
//   name: 'seo-blogs-mastra',
//   level: 'debug'
// });

export const mastra = new Mastra({
  agents: { researchAgent, contentWriterAgent, competitiveAnalysisAgent, imageSearchAgent },
  workflows: { blogWritingWorkflow, blogImageWorkflow },
  mcpServers: {
    seoBlogsMCP: seoBlogsMCP,
  },
  // Do not configure LibSQLStore in serverless environments. Mastra defaults to an
  // in-memory store suitable for ephemeral runtimes.
  
  // Configure Vercel deployment
  deployer: process.env.NODE_ENV === 'production' ? new VercelDeployer() : undefined,
  
  // Enable telemetry with Langfuse for LLM-focused observability
  telemetry: {
    serviceName: "seo-blogs-app",
    enabled: true,
    sampling: {
      type: "always_on", // Capture all traces for debugging
    },
    export: {
      type: "otlp",
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "https://cloud.langfuse.com/api/public/otel/v1/traces",
      headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? 
        Object.fromEntries(
          process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map(header => {
            const [key, value] = header.trim().split('=');
            return [key, value];
          })
        ) : 
        undefined,
    },
  },
  
  // Configure file-based logging
  // logger: logger,
});

