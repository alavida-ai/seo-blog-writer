# Langfuse Observability Setup

This project uses **Langfuse** for AI-focused observability and tracing of your SEO blog research workflows.

## Why Langfuse?

- **AI-Focused**: Specifically designed for LLM applications
- **Rich LLM Telemetry**: Detailed insights into agent calls, tool executions, and token usage
- **Cloud-based**: No local infrastructure needed
- **Cost Tracking**: Monitor LLM API costs
- **Prompt Management**: Version and manage your prompts

## Setup Steps

### 1. Get Langfuse API Keys

1. Go to [Langfuse Cloud](https://cloud.langfuse.com) (or [US region](https://us.cloud.langfuse.com))
2. Create an account/sign in
3. Create a new project
4. Go to **Settings** → **API Keys**
5. Create a new API key pair:
   - **Public Key** (starts with `pk-lf-`)
   - **Secret Key** (starts with `sk-lf-`)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Langfuse Configuration
OTEL_EXPORTER_OTLP_ENDPOINT="https://cloud.langfuse.com/api/public/otel/v1/traces"
# For US region: "https://us.cloud.langfuse.com/api/public/otel/v1/traces"

OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic YOUR_BASE64_AUTH_STRING"
```

**⚠️ IMPORTANT**: Replace `YOUR_BASE64_AUTH_STRING` with your actual encoded credentials (see step 3).

### 3. Generate Auth String

The `YOUR_AUTH_STRING_HERE` is a base64-encoded combination of your API keys:

```bash
# Replace with your actual keys
echo -n "pk-lf-your-public-key:sk-lf-your-secret-key" | base64
```

Copy the output and use it in your `.env` file.

### 4. Test Your Setup

First, verify your environment variables are loaded:

```bash
# Check if env vars are set
echo $OTEL_EXPORTER_OTLP_ENDPOINT
echo $OTEL_EXPORTER_OTLP_HEADERS
```

Then run the debug script:

```bash
node debug-tracing.js
```

### 5. Start Your App

```bash
npm run dev
```

**Generate some traces** by using your agents/workflows to see data in Langfuse.

## What You'll See in Langfuse

### Traces & Spans
- **Agent operations**: LLM calls with prompts, responses, and token counts
- **Tool executions**: Brand fundamentals tool, MCP tools
- **Workflow steps**: Each step in your blog research workflow
- **Performance metrics**: Latency, success rates

### LLM-Specific Data
- **Token usage**: Input/output tokens per call
- **Cost tracking**: Estimated costs per operation
- **Model performance**: Response times and error rates
- **Prompt engineering**: See how prompts perform

### Dashboard Features
- **Sessions**: Group related operations together
- **Users**: Track operations by user (if applicable)
- **Scores**: Rate and evaluate LLM outputs
- **Analytics**: Usage trends and cost analysis

## Accessing the Dashboard

Visit your Langfuse dashboard at:
- **EU**: https://cloud.langfuse.com
- **US**: https://us.cloud.langfuse.com

Navigate to your project to see traces and analytics.

## File-based Logs

Application logs are still written to `src/mastra/logs/mastra.log` for detailed debugging.

## Troubleshooting

1. **No traces appearing**: Check your API keys and endpoint URL
2. **Authorization errors**: Verify your base64 auth string is correct
3. **Limited data**: Remember that detailed telemetry is currently only for AI-related calls

## Cost Monitoring

Langfuse provides cost estimates for your LLM usage. Monitor these in the dashboard to:
- Track spending per agent/workflow
- Optimize expensive operations
- Set usage alerts
