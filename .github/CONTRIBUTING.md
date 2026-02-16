# Contributing to SEO Blogs

Thank you for your interest in contributing to SEO Blogs! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended)
- Git

### Development Setup

1. Fork and clone the repository
```bash
git clone https://github.com/yourusername/seo-blogs.git
cd seo-blogs
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment
```bash
pnpm run cli:link
vibeflow init
# Fill in your API keys in .env
```

4. Start development server
```bash
vibeflow dev
```

## 🏗️ Project Architecture

### Monorepo Structure
- `apps/cli/` - Command line interface
- `apps/docs/` - Generated content and documentation
- `apps/mastra-app/` - Main Mastra application
- `packages/mastra/` - Core agents, tools, and workflows

### Key Concepts
- **Agents**: Specialized AI components with specific roles
- **Tools**: External API integrations and utilities
- **Workflows**: Orchestration logic connecting agents
- **MCP**: Model Context Protocol for tool connectivity

## 🤝 How to Contribute

### 1. Issues
- Check existing issues before creating new ones
- Use issue templates when available
- Provide clear reproduction steps for bugs
- Include relevant system information

### 2. Pull Requests
- Fork the repository and create a feature branch
- Make atomic commits with clear messages
- Update documentation and tests as needed
- Ensure CI passes before requesting review

### 3. Code Style
- Follow existing TypeScript conventions
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Run `pnpm run format` before committing

### 4. Testing
- Add tests for new functionality
- Ensure existing tests pass
- Test manually with different configurations

## 📝 Contribution Types

### 🤖 New Agents
Create specialized agents for specific domains:

```typescript
import { Agent } from '@mastra/core';

export const myAgent = new Agent({
  name: 'My Specialized Agent',
  instructions: 'Clear instructions for the agent role',
  model: {
    provider: 'openrouter',
    name: 'anthropic/claude-3.5-sonnet',
  },
  tools: {
    myTool: myCustomTool,
  },
});
```

### 🔧 New Tools
Integrate external APIs or services:

```typescript
import { createTool } from '@mastra/core';

export const myTool = createTool({
  id: 'my-tool',
  description: 'What this tool does',
  inputSchema: z.object({
    input: z.string().describe('Input description'),
  }),
  execute: async ({ input }) => {
    // Tool implementation
    return { result: 'success' };
  },
});
```

### ⚡ Workflow Improvements
Enhance existing workflows or create new ones:

```typescript
import { Workflow } from '@mastra/core';

export const myWorkflow = new Workflow({
  name: 'my-workflow',
  triggerSchema: z.object({
    topic: z.string(),
  }),
  steps: [
    // Define workflow steps
  ],
});
```

### 📚 Documentation
- README improvements
- Code comments and JSDoc
- Tutorial content
- API documentation

## 🔄 Development Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages
Follow conventional commits:
- `feat: add new agent for social media`
- `fix: resolve image search timeout issue`
- `docs: update installation instructions`
- `refactor: simplify workflow execution`

### Pull Request Process
1. Update documentation
2. Add or update tests
3. Ensure CI passes
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## 🐛 Reporting Issues

### Bug Reports
Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node.js version, OS, etc.)
- Error messages and logs

### Feature Requests
Include:
- Problem statement
- Proposed solution
- Use cases
- Implementation considerations

## 📋 Code Guidelines

### TypeScript
- Use strict type checking
- Prefer interfaces over types for object shapes
- Use proper generics for reusable components
- Add return type annotations for public functions

### Error Handling
- Use proper error types
- Provide meaningful error messages
- Handle async errors appropriately
- Log errors with context

### Performance
- Avoid blocking operations
- Use streaming where appropriate
- Implement proper caching
- Consider memory usage

## 🧪 Testing

### Unit Tests
- Test individual functions and components
- Mock external dependencies
- Use descriptive test names
- Aim for good coverage

### Integration Tests
- Test workflows end-to-end
- Use test data and environments
- Verify external integrations work

### Manual Testing
- Test CLI commands
- Verify web interface functionality
- Check MCP server integration

## 📖 Resources

- [Mastra Documentation](https://mastra.ai/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [MCP Specification](https://modelcontextprotocol.io/)
- [OpenRouter API](https://openrouter.ai/docs)

## ❓ Questions?

- Open a [discussion](https://github.com/yourusername/seo-blogs/discussions)
- Join the [Mastra community](https://mastra.ai/community)
- Check existing [documentation](https://github.com/yourusername/seo-blogs/wiki)

Thank you for contributing! 🚀
