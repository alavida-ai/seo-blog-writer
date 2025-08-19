import { Mastra } from "@mastra/core";
import { PinoLogger } from '@mastra/loggers';
import { FileTransport } from '@mastra/loggers/file';
import fs from 'fs';
import path from 'path';

import { LibSQLStore } from "@mastra/libsql";


import { researchAgent } from "./agents/seo-research-agent";
import { blogWritingWorkflow } from "./workflows/blog-writing-workflow";
import { contentWriterAgent } from "./agents/content-writer-agent";
import { competitiveAnalysisAgent } from "./agents/competitive-analysis-agent";
import { imageSearchAgent } from "./agents/image-search-agent";
import { generateHeroImageTool } from "./tools/generate-hero-image";
import { blogImageWorkflow } from "./workflows/blog-image-workflow";
import { seoBlogsMCP } from "./mcp";

import dotenv from 'dotenv';
dotenv.config({ path: '/Users/alexandergirardet/Code/vibeflow-projects/seo-blogs/.env' });

// Ensure logs directory exists with absolute path
const logsDir = path.resolve('./src/mastra/logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, 'mastra.log');

// Ensure log file exists
if (!fs.existsSync(logFilePath)) {
  fs.writeFileSync(logFilePath, '');
}

// Configure file-based logging
const logger = new PinoLogger({
  name: 'seo-blogs-mastra',
  level: 'debug',
  transports: {
    file: new FileTransport({
      path: logFilePath
    })
  }
});

export const mastra = new Mastra({
  agents: { researchAgent, contentWriterAgent, competitiveAnalysisAgent, imageSearchAgent },
  workflows: { blogWritingWorkflow, blogImageWorkflow },
  mcpServers: {
    seoBlogsMCP: seoBlogsMCP,
  },
  storage: new LibSQLStore({
    url: "file:./mastra.db",
  }),
  
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
  logger: logger,
});

