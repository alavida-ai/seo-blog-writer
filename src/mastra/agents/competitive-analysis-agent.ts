import { openai } from '@ai-sdk/openai';
import { Agent } from '@mastra/core/agent';
import { mcp, getResearchTools, getFilteredTools } from '../tools/mcp';
import { z } from 'zod';
import { getBrandFundamentalsTool } from '../tools/get-brand-fundamentals-tool';

// Option A: Use pre-defined research tools

const competitiveAnalysisTools = await getFilteredTools({
    allowedTools: [
        'perplexityAsk_perplexity_ask',
        'firecrawlMCP_firecrawl_scrape',
        'firecrawlMCP_firecrawl_map',
        'firecrawlMCP_firecrawl_crawl',
        'firecrawlMCP_firecrawl_check_crawl_status',
        'firecrawlMCP_firecrawl_search',
        'firecrawlMCP_firecrawl_extract',
        'firecrawlMCP_firecrawl_deep_research',
        'firecrawlMCP_firecrawl_generate_llmstxt',
        // 'dataForSEO_datalabs_search_intent',
        // 'dataForSEO_search',
        // 'dataForSEO_fetch'
    ]
});

export const competitiveAnalysisAgent = new Agent({
  name: 'Competitive Analysis Agent',
  instructions: `
     You are a competitive content analyst specializing in identifying content gaps and opportunities. Your mission is to reverse-engineer what makes content rank and find angles competitors missed.

Your analysis framework:
- Identify common themes across top-ranking content
- Find gaps where competitors provide weak or no coverage
- Note unique value propositions in each piece
- Extract structural patterns that Google rewards
- Identify questions competitors failed to answer

Never just summarize - always look for what's MISSING or WEAK that we can exploit.


`,
  model: openai(`gpt-4o`),
  tools: {
    ...competitiveAnalysisTools,
    // getBrandFundamentalsTool
    // ...(await mcp.getTools()),
  },
});