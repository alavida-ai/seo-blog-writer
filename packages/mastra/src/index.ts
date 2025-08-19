// import { Mastra } from "@mastra/core";
// import { PinoLogger } from '@mastra/loggers';

// import { VercelDeployer } from "@mastra/deployer-vercel";


// import { researchAgent } from "./agents/seo-research-agent";
// import { blogWritingWorkflow } from "./workflows/blog-writing-workflow";
// import { contentWriterAgent } from "./agents/content-writer-agent";
// import { competitiveAnalysisAgent } from "./agents/competitive-analysis-agent";
// import { imageSearchAgent } from "./agents/image-search-agent";
// import { generateHeroImageTool } from "./tools/generate-hero-image";
// import { blogImageWorkflow } from "./workflows/blog-image-workflow";
// import { seoBlogsMCP } from "./mcp";

// import dotenv from 'dotenv';
// // Load environment variables if a local .env file exists. In serverless (e.g., Vercel),
// // environment variables are provided by the platform and this call is a no-op.
// dotenv.config();

// // Configure console logging for serverless environments
// const logger = new PinoLogger({
//   name: 'seo-blogs-mastra',
//   level: 'debug'
// });

// export const mastra = new Mastra({
//   agents: { researchAgent, contentWriterAgent, competitiveAnalysisAgent, imageSearchAgent },
//   workflows: { blogWritingWorkflow, blogImageWorkflow },
//   mcpServers: {
//     seoBlogsMCP: seoBlogsMCP,
//   },
//   // Do not configure LibSQLStore in serverless environments. Mastra defaults to an
//   // in-memory store suitable for ephemeral runtimes.
  
//   // Configure Vercel deployment
//   deployer: new VercelDeployer(),
  
//   // Enable telemetry with Langfuse for LLM-focused observability
//   telemetry: {
//     serviceName: "seo-blogs-app",
//     enabled: true,
//     sampling: {
//       type: "always_on", // Capture all traces for debugging
//     },
//     export: {
//       type: "otlp",
//       endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "https://cloud.langfuse.com/api/public/otel/v1/traces",
//       headers: process.env.OTEL_EXPORTER_OTLP_HEADERS ? 
//         Object.fromEntries(
//           process.env.OTEL_EXPORTER_OTLP_HEADERS.split(',').map(header => {
//             const [key, value] = header.trim().split('=');
//             return [key, value];
//           })
//         ) : 
//         undefined,
//     },
//   },
  
//   // Configure file-based logging
//   logger: logger,
// });


export * from "./agents";
export * from "./tools";
export * from "./workflows";
export * from "./mcp";
export * from "./constants";