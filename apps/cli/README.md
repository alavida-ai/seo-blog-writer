# SEO Blogs CLI

A command-line interface for managing SEO blog generation workflows powered by Mastra and MCP.

## Installation

From the workspace root:

```bash
# Build and link the CLI globally
npm run cli:link

# Or run directly for development
npm run cli:dev -- [command]
```

## Commands

### `vibeflow init`
Initialize a new SEO blogs project with proper directory structure and configuration.

**Note**: You probably don't need this if you already have a working project! This is for setting up brand new projects.

```bash
vibeflow init
vibeflow init --project-root /path/to/project
```

**What it creates:**
- `.vibeflow/` - Project state and cache directory
- `strategy/` - Directory for workflow strategies  
- `.cursor/mcp.json` - Cursor MCP configuration
- `.env` - Environment template with all required API keys

### `vibeflow dev`
Start the Mastra development server with MCP integration.

```bash
vibeflow dev
vibeflow dev --mcp-only  # Start only MCP server
vibeflow dev --project-root /path/to/project
```

### `vibeflow mcp`
Start the SEO Blogs MCP server over stdio (for Cursor integration).

```bash
vibeflow mcp
```

### `vibeflow status`
Show project status and configuration.

```bash
vibeflow status
```

## Environment Setup

The CLI will create a `.env` template file during initialization. Add your API keys:

```env
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
```

## Cursor Integration

The CLI automatically sets up `.cursor/mcp.json` for MCP integration:

```json
{
  "mcp-servers": {
    "seo-blogs": {
      "command": "vibeflow",
      "args": ["mcp"]
    }
  }
}
```

## Development

```bash
# Install dependencies
cd apps/cli
npm install

# Development mode
npm run dev -- [command]

# Build
npm run build

# Link globally
npm link
```
