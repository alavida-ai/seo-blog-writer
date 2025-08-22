# Vibeflow CLI

[![npm version](https://badge.fury.io/js/vibeflow-ai.svg)](https://badge.fury.io/js/vibeflow-ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)

A powerful CLI tool for AI-powered SEO blog generation. Transform simple topics into comprehensive, SEO-optimized blog posts using specialized AI agents, with automated GitHub integration and Slack notifications.

## 🚀 Features

- **5 Specialized AI Agents**: SEO research, competitive analysis, content writing, image search, and task management
- **Complete Automation**: From topic to published blog with GitHub PR creation
- **SEO Optimization**: Built-in keyword research and competitive analysis using DataForSEO
- **Brand-Aware Writing**: Customizable brand voice and messaging
- **Slack Integration**: Real-time notifications when blog posts are generated
- **MCP Integration**: Works seamlessly with Cursor for AI-assisted editing
- **Beautiful CLI Interface**: Elegant commands with helpful feedback

## 📦 Installation

```bash
npm install -g vibeflow-ai
```

## 🎯 Quick Start

1. **Initialize a new project**
   ```bash
   vibeflow init
   ```

2. **Configure your API keys** (see Environment Setup below)
   ```bash
   # Edit the generated .env file
   code .vibeflow/.env
   ```

3. **Edit your brand fundamentals**
   ```bash
   # Edit the generated file with your brand information
   code .vibeflow/strategy/brandFundamentals.md
   ```

4. **Start the development server**
   ```bash
   vibeflow start
   ```

## 📖 Commands

### `vibeflow init`
Initialize a new SEO blog project with proper structure and configuration.

```bash
vibeflow init
vibeflow init --project-root /path/to/project
```

**Creates:**
- `.vibeflow/` - Main configuration directory
- `.vibeflow/.env` - Environment variables template for API keys
- `.vibeflow/strategy/brandFundamentals.md` - Your brand strategy template
- `.vibeflow/cache/` - Cache directory for optimization
- `strategy/` - Strategy documentation directory
- `.cursor/mcp.json` - Cursor MCP configuration

### `vibeflow start`
Start the Mastra development server with full AI agent capabilities.

```bash
vibeflow start
vibeflow start --project-root /path/to/project
```

**Provides:**
- 🌐 Web interface at `http://localhost:4111`
- 🔧 MCP server for Cursor integration
- 📡 API endpoints for blog generation
- 🤖 5 specialized AI agents (SEO Research, Competitive Analysis, Content Writer, Image Search, Todo)
- 📝 Automated blog writing workflows
- 🔄 Real-time workflow execution and monitoring
- ⚡ Instant startup with pre-bundled server

### `vibeflow status`
Check project configuration and setup status.

```bash
vibeflow status
vibeflow status --project-root /path/to/project
```

**Shows:**
- ✅ Project initialization status
- 📁 Environment configuration status
- 🔧 MCP configuration status
- 💡 Next steps recommendations

## 🏗️ Project Structure

After initialization, your project will have:

```
your-project/
├── .vibeflow/
│   ├── .env                        # API keys (you'll need to fill this)
│   ├── state.json                  # Project state
│   ├── cache/                      # Cache directory
│   └── strategy/
│       └── brandFundamentals.md    # Your brand strategy
├── strategy/
│   └── README.md                   # Strategy documentation
├── .cursor/
│   └── mcp.json                    # MCP configuration
└── [your-content-directory]/       # Where blog posts are written (configurable)
    └── blogs/                      # Default blog output directory
```

## 🔑 Environment Setup

The CLI creates an `.env` template in `.vibeflow/.env`. You'll need to add your API keys:

```env
# AI Models (at least one required)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here  
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Required for research and image search
TAVILY_API_KEY=your_tavily_api_key_here

# Required for GitHub integration (PR creation)
GITHUB_TOKEN=your_github_token_here

# Required for Slack notifications
SLACK_WEBHOOK_URL=your_slack_webhook_url_here

# Required for AI image generation
REPLICATE_API_TOKEN=your_replicate_api_token_here

# Optional: Telemetry and monitoring
OTEL_EXPORTER_OTLP_ENDPOINT=https://cloud.langfuse.com/api/public/otel/v1/traces
OTEL_EXPORTER_OTLP_HEADERS=Authorization=Bearer your_langfuse_secret_key
```

### 🔗 Where to Get API Keys

#### **Required Services**

1. **AI Models** (choose at least one):
   - **[OpenRouter](https://openrouter.ai/)** - Access to Claude Sonnet 4 and GPT-4o models
   - **[Anthropic](https://console.anthropic.com/)** - Direct Claude API access
   - **[OpenAI](https://platform.openai.com/)** - Direct GPT-4o access

2. **[Tavily API](https://tavily.com/)** - Research and image search capabilities
   - Sign up for free tier with 1,000 searches/month
   - Used for SEO research and image discovery

3. **[GitHub Personal Access Token](https://github.com/settings/tokens)**
   - Required for automated PR creation
   - Needs `repo` and `workflow` permissions

4. **[Slack Webhook URL](https://api.slack.com/messaging/webhooks)**
   - Required for blog post notifications
   - Create an incoming webhook in your Slack workspace

5. **[Replicate API](https://replicate.com/)**
   - Required for AI image generation
   - Used to create hero images for blog posts

#### **Optional Services**

- **[DataForSEO](https://dataforseo.com/)** - Enhanced keyword research (paid)
- **[Firecrawl](https://firecrawl.dev/)** - Advanced web scraping (paid)
- **[Langfuse](https://langfuse.com/)** - AI observability and telemetry (free tier available)

## 🤖 AI Agents

Vibeflow orchestrates 5 specialized AI agents that work together:

### 1. SEO Research Agent 
- **Model**: GPT-4o via OpenRouter
- **Purpose**: Keyword research and search intent analysis
- **Tools**: DataForSEO integration, search volume analysis
- **Output**: Primary/secondary keywords, traffic potential estimates

### 2. Competitive Analysis Agent
- **Model**: GPT-4o via OpenRouter  
- **Purpose**: Content gap analysis and competitive intelligence
- **Tools**: Firecrawl for web scraping, Perplexity for research
- **Output**: Content gaps, competitive opportunities, structural insights

### 3. Content Writer Agent
- **Model**: Claude Sonnet 4 via OpenRouter (preferred for superior writing)
- **Purpose**: High-quality, research-backed content creation
- **Tools**: Perplexity for real-time research and fact-checking
- **Output**: 1500+ word SEO-optimized articles with proper citations

### 4. Image Search Agent
- **Model**: GPT-4o via OpenRouter
- **Purpose**: Contextual image discovery and integration
- **Tools**: Tavily image search, Replicate for AI image generation
- **Output**: Relevant images with captions and hero image generation

### 5. Todo Agent
- **Model**: GPT-4o via OpenRouter
- **Purpose**: Workflow task management and progress tracking
- **Tools**: Internal task management system
- **Output**: Task updates, workflow progress, completion notifications

## 🔄 Complete Workflow

Vibeflow provides a fully automated blog creation pipeline:

### 1. **Blog Generation Process**
1. **Topic Input** → SEO Research Agent analyzes keywords and traffic potential
2. **Competitive Analysis** → Analyzes top-ranking content for gaps and opportunities
3. **Content Creation** → Writes comprehensive, research-backed articles
4. **Image Integration** → Adds relevant images and generates hero images
5. **GitHub Integration** → Creates a pull request with the blog post
6. **Slack Notification** → Sends detailed notification to your team

### 2. **Content Directory Structure**
- **Configurable Output**: Specify where blog posts should be written (e.g., `./apps/docs/content/blogs/`)
- **Automatic Directory Creation**: Creates directories if they don't exist
- **Markdown Format**: Outputs properly formatted markdown with frontmatter
- **SEO Metadata**: Includes meta descriptions, keywords, and schema data

### 3. **Slack Integration Features**
When a blog post is generated, your team receives a comprehensive Slack notification with:

```
🚀 New Blog Post Generated!

📝 Title: [Your Blog Title]
🎯 Content Angle: [Strategic content approach]
🔍 SEO Keywords:
• Primary: "primary keyword"
• Secondary: "keyword1", "keyword2", "keyword3"
📊 Expected Traffic Potential: 5,000 monthly searches

🔗 GitHub Pull Request: [PR Link]
📄 File Location: [File Link]

✏️ Next Steps:
1. Review the blog post content in the PR
2. Make any necessary edits directly in GitHub or pull the branch locally
3. Once satisfied, merge the PR to trigger automatic deployment
4. The blog will be live on your site after deployment completes

⚡ Quick Actions:
• View PR: [Direct link]
• Edit file: [Direct link]
• Repository: [Repository link]
```

This keeps your entire team informed and provides actionable next steps for review and publication.

### 4. **MCP Integration with Cursor**
- **Seamless IDE Integration**: Works directly within Cursor IDE
- **Real-time Communication**: Uses Model Context Protocol for smooth AI interactions
- **Brand-Aware Context**: Automatically loads your brand fundamentals for consistent messaging

## 💡 Use Cases

- **Content Teams**: 10x faster blog creation with consistent quality and brand voice
- **SEO Professionals**: Data-driven content optimization with keyword research and competitive analysis
- **Agencies**: Scalable content production for multiple clients with automated workflows
- **Developers**: AI-powered content workflows with GitHub and Slack integration
- **Marketing Teams**: Automated blog generation with real-time team notifications

## 📝 How to Use

### Method 1: Web Interface (Recommended)
1. **Start the server**: `vibeflow start`
2. **Open the web interface**: Go to `http://localhost:4111`
3. **Navigate to workflows**: Click on "Blog Writing Workflow"
4. **Fill in the form**:
   - **Topic**: Your blog topic (e.g., "AI in healthcare")
   - **Brand**: Your company/brand name
   - **GitHub Owner**: Your GitHub username/organization
   - **Repository**: Your content repository name
   - **Content Path**: Where to save blogs (e.g., `./content/blogs/`)
5. **Click "Run Workflow"** and watch the magic happen!

### Method 2: Cursor IDE Integration (For Developers)
1. **Start the server**: `vibeflow start`
2. **Open Cursor IDE** with MCP integration
3. **Use the write-blog-post tool** directly in your IDE
4. **Parameters needed**:
   ```
   topic: "Your blog topic"
   brand: "Your brand name"
   owner: "github-username"
   repo: "repository-name"
   contentPath: "./content/blogs/"
   ```

### 🎯 Tips for Best Results
- **Write clear topics**: "AI in healthcare diagnostics" vs "AI stuff"
- **Update your brand fundamentals**: Edit `.vibeflow/strategy/brandFundamentals.md`
- **Review generated content**: Always review the GitHub PR before merging
- **Monitor Slack notifications**: Stay informed about generation progress

## 🔧 Requirements

- **Node.js 18+**
- **API Keys**: At minimum, you need:
  - AI Model access (OpenRouter, Anthropic, or OpenAI)
  - Tavily API for research
  - GitHub Personal Access Token
  - Slack Webhook URL
  - Replicate API for image generation

## 🛠️ Technology Stack

- **[Mastra Framework](https://mastra.ai)** - Agentic workflow orchestration
- **[OpenRouter](https://openrouter.ai/)** - Multi-model AI access
- **[Tavily](https://tavily.com/)** - Research and image search
- **[GitHub API](https://docs.github.com/en/rest)** - Repository integration
- **[Slack Webhooks](https://api.slack.com/messaging/webhooks)** - Team notifications
- **[Replicate](https://replicate.com/)** - AI image generation

## 📚 Documentation & Support

- **[GitHub Repository](https://github.com/yourusername/seo-blogs)** - Source code and issues
- **[Mastra Documentation](https://docs.mastra.ai)** - Framework documentation
- **[CLI Source Code](https://github.com/yourusername/seo-blogs/tree/main/apps/cli)** - CLI implementation
- **[Agent Specifications](https://github.com/yourusername/seo-blogs/tree/main/packages/mastra/src/agents)** - AI agent details

## 🚨 Troubleshooting

### Common Issues

**"Project not initialized" error**
```bash
# Solution: Run initialization first
vibeflow init
```

**"API key not found" errors**
```bash
# Solution: Check your .vibeflow/.env file
cat .vibeflow/.env
# Ensure all required keys are set
```

**"GitHub token permissions" error**
```bash
# Solution: Ensure your GitHub token has 'repo' and 'workflow' permissions
# Generate a new token at: https://github.com/settings/tokens
```

**Slack notifications not working**
```bash
# Solution: Verify your webhook URL is correct
# Test it manually: https://api.slack.com/messaging/webhooks#posting_with_webhooks
```

## 🤝 Contributing

Contributions welcome! Please see our [Contributing Guide](https://github.com/yourusername/seo-blogs/blob/main/.github/CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Built With

- **[Mastra](https://mastra.ai)** - Agentic AI workflow framework
- **[Commander.js](https://github.com/tj/commander.js)** - CLI framework
- **[Chalk](https://github.com/chalk/chalk)** - Terminal styling
- **[Figlet](https://github.com/patorjk/figlet.js)** - ASCII art generation
- **[Boxen](https://github.com/sindresorhus/boxen)** - Terminal box styling
- **[Gradient String](https://github.com/bokub/gradient-string)** - Gradient text effects

---

**🌟 Like this project? Star it on [GitHub](https://github.com/yourusername/seo-blogs)!**

**📧 Questions or feedback? [Open an issue](https://github.com/yourusername/seo-blogs/issues) or reach out to the maintainers.**