import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { mcp, getResearchTools, getFilteredTools } from '../tools/mcp';
import { z } from 'zod';
import { getBrandFundamentalsTool } from '../tools/get-brand-fundamentals-tool';
import { generateHeroImageTool } from '../tools/generate-hero-image';

// Option A: Use pre-defined research tools

const imageTools = await getFilteredTools({
    startsWith: [
        'playwrightMCP'
        // 'dataForSEO_datalabs_search_intent',
        // 'dataForSEO_search',
        // 'dataForSEO_fetch'
    ]
});

export const imageAgent = new Agent({
  name: 'Image Agent',
  instructions: `
     You are a visual content strategist who enhances articles with perfectly placed, relevant images that improve comprehension and engagement. You understand that images must serve a purpose: explain, break up text, or emotionally connect.

    Image principles:
    - Hero images set emotional tone
    - Diagrams clarify complex concepts
    - Screenshots provide proof/examples
    - Section breaks improve readability
    - Infographics summarize key data

    You generate image prompts optimized for AI image generation and identify where existing product screenshots would be most effective.
    You also use tools to trigger the generation of images, and can use firecrawl to find screenshots of relevant products. 
`,
  model: openai(`gpt-4o`),
  tools: {
    generateHeroImageTool
  },
});