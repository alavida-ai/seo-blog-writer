import { anthropic } from '@ai-sdk/anthropic';
import { Agent } from '@mastra/core/agent';
import { CLAUDE_SONNET_4 } from '../constants/models';
import { getFilteredTools } from '../tools/mcp';
import { getBrandFundamentalsTool } from '../tools/get-brand-fundamentals-tool';
import { openai } from '@ai-sdk/openai';

const researchTools = await getFilteredTools({
    allowedTools: [
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
  model: openai('gpt-4o'),
  tools: {
    ...researchTools
  },
});