# SEO Blog Generation: Agentic Workflow System

A sophisticated AI-powered content creation system that uses specialized agents to research, analyze, and produce high-quality SEO-optimized blog posts with images. Built with [Mastra](https://mastra.ai) framework, this project demonstrates the power of agentic workflows where multiple AI agents collaborate to accomplish complex tasks.

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

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd seo-blogs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file with required API keys:
   ```env
   OPENROUTER_API_KEY=your_openrouter_key
   DATA_FOR_SEO_KEY=your_dataforseo_key  
   FIRECRAWL_API_KEY=your_firecrawl_key
   TAVILY_API_KEY=your_tavily_key
   ```

4. **Run the workflow**
   ```bash
   npm run dev
   ```

## 📈 Usage

The system accepts simple inputs and produces comprehensive outputs:

**Input**:
```typescript
{
  topic: "cross-border payments blockchain",
  brand: "FinTech Startup"
}
```

**Output**:
- SEO-optimized blog post (1500+ words)
- Relevant images with captions  
- Keyword integration and citations
- Competitive differentiation
- Actionable insights

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

## 🤝 Contributing

This project demonstrates advanced agentic workflow patterns. Contributions welcome for:
- New specialized agents
- Additional tool integrations  
- Workflow optimizations
- Documentation improvements

## 📄 License

[Add your preferred license]

---

**Built with ❤️ using [Mastra](https://mastra.ai) - The future of agentic AI workflows**
