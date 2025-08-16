import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { mcp, getResearchTools, getFilteredTools } from '../tools/mcp';
import { z } from 'zod';
import { getBrandFundamentalsTool } from '../tools/get-brand-fundamentals-tool';

// Option A: Use pre-defined research tools

const researchTools = await getFilteredTools({
    allowedTools: [
        // 'perplexityAsk_perplexity_ask',
        // 'firecrawlMCP_firecrawl_scrape',
        // 'firecrawlMCP_firecrawl_map',
        // 'firecrawlMCP_firecrawl_crawl',
        // 'firecrawlMCP_firecrawl_check_crawl_status',
        // 'firecrawlMCP_firecrawl_search',
        // 'firecrawlMCP_firecrawl_extract',
        // 'firecrawlMCP_firecrawl_deep_research',
        // 'firecrawlMCP_firecrawl_generate_llmstxt',
        'dataForSEO_datalabs_search_intent',
        'dataForSEO_search',
        'dataForSEO_fetch'
    ]
});

export const researchAgent = new Agent({
  name: 'Research Agent',
  instructions: `
      You are a keyword research specialist focused on identifying high-value, bottom-of-funnel keywords for SaaS content marketing. Your role is to analyze keyword opportunities and determine search intent to maximize conversion potential.

    Your approach:
    - Prioritize transactional and commercial investigation intent keywords
    - Focus on keywords that indicate buyer readiness (alternatives, vs, pricing, reviews)
    - Consider keyword difficulty vs. potential traffic value
    - Always classify search intent (informational, navigational, commercial, transactional)

    You make decisions based on:
    - Search volume (min 100/month)
    - Keyword difficulty (<70 for new sites, <85 for established)
    - Business relevance score
    - Competition gap opportunities
`,
  model: openai(`gpt-4o`),
  tools: {
    ...researchTools,
    getBrandFundamentalsTool
    // ...(await mcp.getTools()),
  },
});