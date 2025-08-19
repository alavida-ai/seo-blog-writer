import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

export function ensureMCPConfig(projectRoot: string): void {
  const cursorDir = join(projectRoot, '.cursor');
  if (!existsSync(cursorDir)) {
    mkdirSync(cursorDir, { recursive: true });
  }
  
  const mcpConfig = {
    "mcpServers": {
      "seo-blogs-mcp": {
        "url": "http://localhost:4111/api/mcp/seoBlogsMCP/sse"
      }
    }
  };
  
  const mcpConfigFile = join(cursorDir, 'mcp.json');
  let shouldWrite = false;
  let action = '';
  
  if (!existsSync(mcpConfigFile)) {
    shouldWrite = true;
    action = 'Created';
  } else {
    // File exists, check if it needs updating
    try {
              const existingContent = readFileSync(mcpConfigFile, 'utf8');
      
      // If file is empty or whitespace only
      if (!existingContent.trim()) {
        shouldWrite = true;
        action = 'Updated';
      } else {
        // Parse existing config and check if our server is configured correctly
        const existingConfig = JSON.parse(existingContent);
        const existingMcpServers = existingConfig.mcpServers || {};
        
        // Check if our specific server config is missing or different
        if (!existingMcpServers['seo-blogs-mcp'] || 
            existingMcpServers['seo-blogs-mcp'].url !== mcpConfig.mcpServers['seo-blogs-mcp'].url) {
          
          // Merge our config with existing
          const mergedConfig = {
            ...existingConfig,
            mcpServers: {
              ...existingMcpServers,
              ...mcpConfig.mcpServers
            }
          };
          
          writeFileSync(mcpConfigFile, JSON.stringify(mergedConfig, null, 2));
          console.log(chalk.gray('📂 Updated: .cursor/mcp.json (added seo-blogs-mcp server)'));
          return;
        }
      }
    } catch (error) {
      // If we can't parse the existing file, overwrite it
      shouldWrite = true;
      action = 'Fixed';
    }
  }
  
  if (shouldWrite) {
    writeFileSync(mcpConfigFile, JSON.stringify(mcpConfig, null, 2));
    console.log(chalk.gray(`📂 ${action}: .cursor/mcp.json (Cursor MCP configuration)`));
  }
}

interface InitOptions {
  projectRoot: string;
  projectName: string;
  projectDescription: string;
}

interface InitResult {
  success: boolean;
  message: string;
  alreadyInitialized?: boolean;
}

export async function initializeVibeflow(options: InitOptions): Promise<InitResult> {
  const { projectRoot, projectName, projectDescription } = options;
  
  try {
    // Check if already initialized
    const vibeflowDir = join(projectRoot, '.vibeflow');
    const strategyDir = join(vibeflowDir, 'strategy');
    const brandFundamentalsFile = join(strategyDir, 'brandFundamentals.md');
    
    if (existsSync(brandFundamentalsFile)) {
      return {
        success: true,
        message: 'Project already initialized',
        alreadyInitialized: true
      };
    }
    
    // Create .vibeflow directory structure
    if (!existsSync(vibeflowDir)) {
      mkdirSync(vibeflowDir, { recursive: true });
    }
    
    // Create strategy directory
    if (!existsSync(strategyDir)) {
      mkdirSync(strategyDir, { recursive: true });
    }
    
    // Create brand fundamentals file with example structure
    const brandFundamentalsTemplate = `# ${projectName} - Brand Fundamentals

${projectDescription}

## Brand Overview

**Mission**: [Your company's mission statement]

**Vision**: [Your company's vision for the future]

**Values**: [Core values that guide your company]

## Target Audience

### Primary Persona
- **Demographics**: [Age, location, job title, etc.]
- **Pain Points**: [Key challenges they face]
- **Goals**: [What they're trying to achieve]
- **Communication Style**: [How they prefer to consume content]

### Secondary Persona
- **Demographics**: [Age, location, job title, etc.]
- **Pain Points**: [Key challenges they face]
- **Goals**: [What they're trying to achieve]
- **Communication Style**: [How they prefer to consume content]

## Brand Voice & Tone

**Voice Characteristics**:
- [e.g., Professional yet approachable]
- [e.g., Expert but not condescending] 
- [e.g., Innovative and forward-thinking]

**Tone Guidelines**:
- **Informative**: We provide valuable, actionable insights
- **Authoritative**: We speak with expertise and confidence
- **Accessible**: We explain complex topics clearly
- **Helpful**: We focus on solving real problems

## Key Messages

### Primary Value Proposition
[Your main value proposition - what makes you unique and valuable]

### Supporting Messages
1. [Key benefit/differentiator #1]
2. [Key benefit/differentiator #2] 
3. [Key benefit/differentiator #3]

## Content Strategy

### Content Pillars
1. **[Pillar 1 Name]**: [Description of content focus]
2. **[Pillar 2 Name]**: [Description of content focus]
3. **[Pillar 3 Name]**: [Description of content focus]

### Keywords & Topics
- **Primary Keywords**: [Main keywords you want to rank for]
- **Secondary Keywords**: [Supporting keywords]
- **Topic Areas**: [Broader topic categories]

## Competitive Positioning

### Key Competitors
1. **[Competitor 1]**: [How you differentiate]
2. **[Competitor 2]**: [How you differentiate]
3. **[Competitor 3]**: [How you differentiate]

### Unique Advantages
- [Advantage 1]
- [Advantage 2]  
- [Advantage 3]

## Style Guidelines

### Writing Style
- **Sentence Length**: [e.g., Mix of short and medium sentences]
- **Paragraph Length**: [e.g., 2-4 sentences max]
- **Technical Language**: [e.g., Explain jargon, use analogies]
- **Examples**: [e.g., Always include real-world examples]

### Content Structure
- **Headlines**: [Style preferences]
- **Subheadings**: [How to structure sections]
- **Lists**: [When and how to use]
- **CTAs**: [Call-to-action style and placement]

---

**Instructions**: Replace all bracketed placeholders with your actual brand information. This file will be used by the AI agents to ensure all generated content aligns with your brand strategy and voice.
`;
    
    writeFileSync(brandFundamentalsFile, brandFundamentalsTemplate);
    
    // Create public strategy directory with README
    const publicStrategyDir = join(projectRoot, 'strategy');
    if (!existsSync(publicStrategyDir)) {
      mkdirSync(publicStrategyDir, { recursive: true });
      
      const strategyReadme = `# ${projectName} - Strategy Directory

This directory contains your SEO blog strategy documentation.

## Getting Started

1. **Edit Brand Fundamentals**: Update \`.vibeflow/strategy/brandFundamentals.md\` with your brand information
2. **Run Blog Generation**: Use \`vibeflow dev\` to start the development server
3. **Create Content**: Use the web interface or MCP integration to generate blog posts

## Strategy Files

- **Brand Fundamentals** (\`.vibeflow/strategy/brandFundamentals.md\`): Core brand strategy and voice guidelines
- **Content Calendar**: Plan your content topics and publishing schedule
- **SEO Research**: Keyword research and competitive analysis
- **Performance Metrics**: Track content performance and optimization opportunities

## Content Creation Workflow

1. Define topic and target keywords
2. AI agents research and analyze competitive landscape  
3. Generate comprehensive, SEO-optimized blog posts
4. Review and publish content
5. Track performance and iterate

---

For more information, see the project README or run \`vibeflow --help\`
`;
      
      writeFileSync(join(publicStrategyDir, 'README.md'), strategyReadme);
    }
    
    // Ensure .cursor/mcp.json configuration is properly set up
    ensureMCPConfig(projectRoot);
    
    // Create .env file if it doesn't exist
    const envFile = join(projectRoot, '.env');
    if (!existsSync(envFile)) {
      const envTemplate = `# SEO Blogs Environment Configuration
# Add your API keys here

# Required for AI operations
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Required for research
TAVILY_API_KEY=your_tavily_api_key_here

# Required for GitHub integration
GITHUB_TOKEN=your_github_token_here

# Required for Slack notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Required for image generation
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Optional: Telemetry
OTEL_EXPORTER_OTLP_ENDPOINT=https://cloud.langfuse.com/api/public/otel/v1/traces
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer your_langfuse_secret_key
`;
      writeFileSync(envFile, envTemplate);
    }
    
    return {
      success: true,
      message: 'SEO Blogs project initialized successfully!'
    };
    
  } catch (error) {
    return {
      success: false,
      message: `Failed to initialize project: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export function loadEnvironment(projectRoot: string): void {
  const envFile = join(projectRoot, '.env');
  
  if (existsSync(envFile)) {
    // Use dynamic import for dotenv since we're in ESM
    import('dotenv').then(dotenv => {
      dotenv.config({ path: envFile });
      console.log(chalk.gray('✅ Loaded environment variables from .env'));
    }).catch(err => {
      console.warn(chalk.yellow('⚠️  Failed to load .env file:', err.message));
    });
  } else {
    console.warn(chalk.yellow('⚠️  No .env file found. Some features may not work.'));
  }
}
