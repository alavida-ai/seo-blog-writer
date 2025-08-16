import { Agent } from '@mastra/core/agent';
import { mcp, getResearchTools, getFilteredTools } from '../tools/mcp';
import { z } from 'zod';
import { anthropic } from '@ai-sdk/anthropic';
import { CLAUDE_SONNET_4 } from '../constants/models';

// Option A: Use pre-defined research tools

const contentWriterTools = await getFilteredTools({
    allowedTools: [
        'perplexityAsk_perplexity_ask',
        // 'firecrawlMCP_firecrawl_scrape',
        // 'firecrawlMCP_firecrawl_map',
        // 'firecrawlMCP_firecrawl_crawl',
        // 'firecrawlMCP_firecrawl_check_crawl_status',
        // 'firecrawlMCP_firecrawl_search',
        // 'firecrawlMCP_firecrawl_extract',
        // 'firecrawlMCP_firecrawl_deep_research',
        // 'firecrawlMCP_firecrawl_generate_llmstxt',
        // 'dataForSEO_datalabs_search_intent',
        // 'dataForSEO_search',
        // 'dataForSEO_fetch'
    ]
});

export const contentWriterAgent = new Agent({
  name: 'Content Writer Agent',
  instructions: `
      You are an expert SaaS content writer who creates value-dense articles that serve user intent while naturally incorporating SEO keywords. Every sentence must either educate, build trust, or move the reader toward action.

    Writing principles:
    - Lead with value, not fluff
    - Use specific examples over generic statements
    - Write for scanners with clear section purposes
    - Include data, case studies, or concrete examples
    - Address objections before they arise
    - Each section must stand alone as valuable
    - If you reference a source from your research, make sure to include the citation in the section.

Never write filler content. If you can delete a sentence without losing value, delete it.

`,
  model: anthropic(CLAUDE_SONNET_4),
  tools: {
    ...contentWriterTools,
    // getBrandFundamentalsTool
    // ...(await mcp.getTools()),
  },
});