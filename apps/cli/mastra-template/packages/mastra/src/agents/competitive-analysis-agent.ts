import { Agent } from '@mastra/core/agent';
import { getFilteredTools } from '../tools/mcp';
import { perplexityAskTool } from '../tools/perplexity-research';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { GPT_4O } from '../constants/models';
// Initialize OpenRouter provider

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});



// Lazy-loaded tools function
async function getCompetitiveAnalysisTools() {
    const tools = await getFilteredTools({
        allowedTools: [
            'firecrawlMCP_firecrawl_scrape',
            'firecrawlMCP_firecrawl_map',
            'firecrawlMCP_firecrawl_crawl',
            'firecrawlMCP_firecrawl_check_crawl_status',
            'firecrawlMCP_firecrawl_search',
            'firecrawlMCP_firecrawl_extract',
            'firecrawlMCP_firecrawl_deep_research',
            'firecrawlMCP_firecrawl_generate_llmstxt',
        ]
    });
    
    return {
        ...tools,
        perplexityAskTool,
    };
}

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

All tools now have automatic retry logic:
- External APIs: 5 retries with 2s base delay
- Expensive operations: 2 retries with 3s base delay  
- Standard tools: 3 retries with 1s base delay

If a tool fails, you'll get clear instructions on what to try next.
`,
  model: openrouter(GPT_4O),
  tools: async () => {
    return await getCompetitiveAnalysisTools();
  },
});