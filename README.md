# SEO Blog Generation: Agentic Workflow System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Mastra](https://img.shields.io/badge/Built%20with-Mastra-blue)](https://mastra.ai)

A sophisticated AI-powered content creation system that uses specialized agents to research, analyze, and produce high-quality SEO-optimized blog posts with images. Built with [Mastra](https://mastra.ai) framework, this project demonstrates the power of agentic workflows where multiple AI agents collaborate to accomplish complex tasks.

> 🚀 **Transform a simple topic into a comprehensive, SEO-optimized blog post in minutes, not hours.**

## 🚀 Overview

This system implements an **agentic workflow** - a collaborative AI architecture where specialized agents work together, each handling specific aspects of the content creation process. The workflow transforms a simple topic input into a complete, SEO-optimized blog post with relevant images.

### What is an Agentic Workflow?

An agentic workflow is an AI system design where multiple specialized agents collaborate to complete complex tasks. Each agent has:
- **Specialized expertise** in their domain
- **Specific tools** tailored to their responsibilities  
- **Clear objectives** within the larger workflow
- **Autonomy** to make decisions within their scope

This approach provides better quality, reliability, and maintainability compared to monolithic AI systems.

## 🏗️ Architecture

The system consists of **5 specialized agents** orchestrated through **2 main workflows**:

### Main Blog Research Workflow
```mermaid
graph LR
    A[Topic Input] --> B[SEO Research Agent]
    B --> C[Competitive Analysis Agent]
    C --> D[Content Writer Agent]
    D --> E[Blog Image Workflow]
    E --> F[Final Blog Post]
```

### Blog Image Workflow
```mermaid
graph LR
    G[Blog Content] --> H[Content Writer Agent]
    H --> I[Image Search Agent]
    I --> J[Enhanced Blog with Images]
```

## 🤖 Agent Specifications

### 1. SEO Research Agent
**Purpose**: Identifies high-value keyword opportunities and analyzes search intent.

**Model**: GPT-4O  
**Specialization**: Keyword research and SEO analysis  
**Tools**:
- DataForSEO API integration
  - `dataForSEO_datalabs_search_intent`
  - `dataForSEO_search` 
  - `dataForSEO_fetch`

**Key Capabilities**:
- Long-tail keyword discovery
- Search volume and difficulty analysis
- Search intent classification (informational, commercial, transactional, navigational)
- Traffic potential estimation
- Keyword relevance scoring

**Output**: 
- Primary keyword with metrics
- 3-5 secondary keywords
- Content angle strategy
- Estimated traffic potential

---

### 2. Competitive Analysis Agent
**Purpose**: Reverse-engineers competitor content to identify gaps and opportunities.

**Model**: GPT-4O  
**Specialization**: Content gap analysis and competitive intelligence  
**Tools**:
- Firecrawl MCP suite:
  - `firecrawl_scrape` - Extract content from competitor pages
  - `firecrawl_map` - Discover site structure
  - `firecrawl_crawl` - Deep content analysis
  - `firecrawl_search` - Find ranking content
  - `firecrawl_extract` - Structure data extraction
  - `firecrawl_deep_research` - Comprehensive analysis
- `perplexityAskTool` - Research enhancement

**Key Capabilities**:
- Top 3-4 ranking article analysis
- Content structure mapping (heading hierarchy)
- Content depth assessment per section
- Identification of content gaps and opportunities
- Competitive advantage discovery

**Output**:
- Detailed content gap analysis
- Specific opportunities to exploit
- Structural insights from top performers

---

### 3. Content Writer Agent
**Purpose**: Creates high-quality, value-dense content that serves user intent while incorporating SEO.

**Model**: Claude Sonnet 4 (preferred for superior writing quality)  
**Specialization**: Content creation and research synthesis  
**Tools**:
- `perplexityAsk_perplexity_ask` - Real-time research and fact-checking

**Key Capabilities**:
- Research-backed content creation
- SEO keyword integration (1-2% density)
- Value-dense writing (no filler content)
- Specific examples and case studies
- Proper citation integration
- Content structuring for scannability

**Output**:
- Comprehensive 1500+ word articles
- Markdown-formatted content
- SEO-optimized titles
- Research citations embedded

---

### 4. Image Search Agent  
**Purpose**: Finds contextually relevant images to enhance blog posts.

**Model**: GPT-4O  
**Specialization**: Visual content discovery  
**Tools**:
- `searchImage` - Tavily-powered image search

**Key Capabilities**:
- Contextual image discovery
- Query optimization for image search
- Image relevance assessment
- URL validation and quality checking

**Output**:
- Curated image URLs
- Context-appropriate visual content

---

### 5. Todo Agent
**Purpose**: Manages workflow tasks and project organization.

**Model**: GPT-4O  
**Specialization**: Task management  
**Tools**:
- `todoReadTool` - Task status tracking
- `todoWriteTool` - Task management

## 📋 Workflow Execution

### Blog Research Workflow Steps

1. **SEO Research Step**
   - Analyzes topic for keyword opportunities
   - Validates keywords with DataForSEO
   - Identifies content angle and traffic potential

2. **Competitive Analysis Step**  
   - Scrapes top-ranking content with Firecrawl
   - Identifies content gaps and weak coverage areas
   - Maps competitor content structures

3. **Content Research & Outline Step**
   - Conducts deep research using Perplexity
   - Creates detailed content outline
   - Incorporates competitive insights and research findings

4. **Content Writing Step**
   - Writes comprehensive, research-backed article
   - Naturally integrates target keywords  
   - Includes specific examples and citations

5. **Prepare Blog Post Step**
   - Normalizes content formatting
   - Ensures consistent structure
   - Prepares for image integration

6. **Add Images Step**
   - Triggers Blog Image Workflow
   - Enhances content with relevant visuals
   - Writes final blog post to file

### Blog Image Workflow Steps

1. **Image Placeholder Step**
   - Identifies strategic image placement locations
   - Creates specific image search queries
   - Generates compelling captions

2. **Extract Image Queries Step**
   - Parses image requirements from content
   - Prepares search parameters

3. **Image Search Step**
   - Executes image searches via Tavily
   - Validates image URLs and relevance

4. **Inject Images Step**  
   - Replaces placeholders with actual images
   - Formats images in markdown
   - Produces final enhanced content

## 🛠️ Technology Stack

- **Framework**: [Mastra](https://mastra.ai) - Agentic workflow orchestration
- **Language Models**: 
  - Claude Sonnet 4 (via OpenRouter) - Content writing
  - GPT-4O (via OpenRouter) - Research and analysis
  - Perplexity Sonar - Real-time research
- **External APIs**:
  - DataForSEO - Keyword research and SEO data
  - Firecrawl - Web scraping and content analysis  
  - Tavily - Image search
- **MCP Integrations**: Model Context Protocol for tool connectivity

## 🔧 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- API keys for external services (see Environment Setup)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/seo-blogs.git
   cd seo-blogs
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or npm install
   ```

3. **Set up the CLI globally**
   ```bash
   pnpm run cli:link
   # This installs the 'vibeflow' command globally
   ```

4. **Environment Setup**
   The CLI will create a template `.env` file for you:
   ```bash
   vibeflow init  # Creates .env template and project structure
   ```
   
   Then fill in your API keys in the `.env` file:
   ```env
   # AI Models (choose one or both)
   OPENROUTER_API_KEY=your_openrouter_key        # For Claude/GPT access
   ANTHROPIC_API_KEY=your_anthropic_key          # Direct Anthropic access
   
   # SEO Research
   TAVILY_API_KEY=your_tavily_key                # For research and image search
   
   # Optional: Enhanced SEO features
   DATA_FOR_SEO_KEY=your_dataforseo_key          # Advanced keyword research
   FIRECRAWL_API_KEY=your_firecrawl_key          # Competitor analysis
   
   # Optional: Notifications and GitHub
   SLACK_WEBHOOK_URL=your_slack_webhook          # Blog notifications
   GITHUB_TOKEN=your_github_token                # Auto PR creation
   
   # Optional: Image generation
   REPLICATE_API_TOKEN=your_replicate_token      # AI image generation
   ```

5. **Start the development server**
   ```bash
   vibeflow dev
   ```
   
   This starts:
   - 🌐 Web interface at `http://localhost:4000`
   - 🔧 MCP server for Cursor integration
   - 📡 API endpoints for workflows

### Alternative: Direct Development
If you prefer not to use the CLI:
```bash
cd apps/mastra-app
pnpm run dev
```

## 📈 Usage

### CLI Commands

```bash
# Check system status
vibeflow status

# Start development environment
vibeflow dev

# Start MCP server only (for Cursor)
vibeflow mcp

# Initialize new project
vibeflow init
```

### Creating Blog Posts

#### Method 1: Web Interface
1. Start the development server: `vibeflow dev`
2. Open `http://localhost:4000` in your browser
3. Navigate to Workflows → Blog Writing Workflow
4. Input your topic and brand information
5. Monitor the progress as agents collaborate

#### Method 2: Programmatic Usage
```typescript
import { blogWritingWorkflow } from 'seo-blog-mastra/workflows';

const result = await blogWritingWorkflow.execute({
  topic: "cross-border payments blockchain",
  brand: "FinTech Startup"
});
```

#### Method 3: Cursor Integration (MCP)
With the MCP server running, use Cursor's AI to:
```
Write a blog post about "sustainable fashion trends" for brand "EcoStyle"
```

### Expected Output
The system produces:
- 📝 **1500+ word SEO-optimized blog post**
- 🖼️ **Contextual images with captions**
- 🎯 **Strategic keyword integration**
- 📊 **Competitive insights and differentiation**
- 📚 **Research citations and sources**
- 📁 **Markdown file saved to `apps/docs/content/blogs/`**

## 🎯 Key Benefits

### For Content Teams
- **Speed**: 10x faster than manual content creation
- **Quality**: Research-backed, professionally written content
- **SEO**: Data-driven keyword integration and optimization
- **Consistency**: Standardized quality across all content

### For Developers  
- **Modular**: Each agent can be modified independently
- **Scalable**: Easy to add new agents or tools
- **Maintainable**: Clear separation of concerns
- **Extensible**: Built on open standards (MCP)

### For Businesses
- **Cost-effective**: Reduces content creation costs by 80%
- **Competitive**: Built-in competitive analysis and differentiation
- **Data-driven**: SEO decisions based on real search data
- **Autonomous**: Minimal human intervention required

## 🔮 Future Enhancements

- **Multi-language support** for global content creation
- **Brand voice customization** per company/client
- **Social media optimization** for cross-platform publishing
- **Performance tracking** and content optimization
- **Custom agent creation** for specialized industries

## 🛠️ Development

### Project Structure
```
seo-blogs/
├── apps/
│   ├── cli/                 # Vibeflow CLI tool
│   ├── docs/               # Generated blog content
│   └── mastra-app/         # Main Mastra application
├── packages/
│   └── mastra/             # Core agents, tools, workflows
│       ├── src/agents/     # Specialized AI agents
│       ├── src/tools/      # External API integrations
│       ├── src/workflows/  # Orchestration logic
│       └── src/mcp/        # MCP server configuration
```

### Building and Testing

```bash
# Build all packages
pnpm run build

# Run type checking
pnpm run check-types

# Format code
pnpm run format

# Lint code
pnpm run lint
```

### Adding New Agents

1. Create agent in `packages/mastra/src/agents/`
2. Define tools in `packages/mastra/src/tools/`
3. Update workflow in `packages/mastra/src/workflows/`
4. Export from `packages/mastra/src/index.ts`

Example agent:
```typescript
import { Agent } from '@mastra/core';

export const myNewAgent = new Agent({
  name: 'My New Agent',
  instructions: 'You are a specialized agent for...',
  model: {
    provider: 'openrouter',
    name: 'anthropic/claude-3.5-sonnet',
  },
  tools: {
    myTool: myCustomTool,
  },
});
```

## 🤝 Contributing

We welcome contributions! This project demonstrates advanced agentic workflow patterns and there are many opportunities to enhance it.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation
4. **Test your changes**
   ```bash
   pnpm run build
   pnpm run check-types
   ```
5. **Commit and push**
   ```bash
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Ideas

- 🤖 **New specialized agents** (social media, email marketing, etc.)
- 🔧 **Additional tool integrations** (more APIs, databases)
- ⚡ **Workflow optimizations** (parallel processing, caching)
- 📚 **Documentation improvements** (tutorials, examples)
- 🌍 **Multi-language support** for global content
- 🎨 **Brand voice customization** features
- 📊 **Analytics and performance tracking**
- 🧪 **Testing and quality assurance**

### Code of Conduct

Please be respectful and inclusive. We're building something amazing together! 🚀

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### What this means:
- ✅ Commercial use allowed
- ✅ Modification allowed  
- ✅ Distribution allowed
- ✅ Private use allowed
- ❗ License and copyright notice must be included

## ⭐ Star History

If this project helps you, please consider giving it a star! It helps others discover this work.

[![Star History Chart](https://api.star-history.com/svg?repos=yourusername/seo-blogs&type=Date)](https://star-history.com/#yourusername/seo-blogs&Date)

## 🙏 Acknowledgments

- [Mastra](https://mastra.ai) - The incredible agentic workflow framework that powers this system
- [Anthropic](https://anthropic.com) - Claude AI for superior content generation
- [OpenRouter](https://openrouter.ai) - Unified LLM API access
- [Tavily](https://tavily.com) - Real-time research and image search
- [DataForSEO](https://dataforseo.com) - SEO data and keyword research
- [Firecrawl](https://firecrawl.dev) - Web scraping and content analysis

## 📞 Support

- 📖 [Documentation](https://github.com/yourusername/seo-blogs/wiki)
- 💬 [Discussions](https://github.com/yourusername/seo-blogs/discussions)
- 🐛 [Issues](https://github.com/yourusername/seo-blogs/issues)
- 🔗 [Mastra Community](https://mastra.ai/community)

---

**Built with ❤️ using [Mastra](https://mastra.ai) - The future of agentic AI workflows**

*Like this project? [⭐ Star it on GitHub](https://github.com/yourusername/seo-blogs) and [🐦 share it on X](https://twitter.com/intent/tweet?text=Check%20out%20this%20amazing%20AI-powered%20blog%20generation%20system!%20https://github.com/yourusername/seo-blogs)*
