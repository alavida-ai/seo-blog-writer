import chalk from 'chalk';
import { spawn } from 'child_process';
import { join } from 'path';
import { loadEnvironment, ensureMCPConfig } from './initialization.js';

export async function startMCPServer(projectRoot?: string): Promise<void> {
  try {
    const root = projectRoot || process.cwd();
    
    // Load environment variables
    loadEnvironment(root);
    
    console.log(chalk.green('🚀 Starting SEO Blogs MCP server for Cursor...'));
    console.log(chalk.gray('   Server: seo-blogs-mcp v0.1.0'));
    console.log(chalk.gray('   Tools: discoverRepositoryContext, writeBlogPost'));
    console.log(chalk.gray('   Mode: stdio (for Cursor integration)'));
    
    // For MCP server over stdio, we need to import the MCP server directly
    // and start it in stdio mode (this is for Cursor integration)
    const { seoBlogsMCP } = await import('seo-blog-mastra/mcp');
    
    if (!seoBlogsMCP || typeof seoBlogsMCP.run !== 'function') {
      throw new Error('MCP server does not support stdio mode');
    }
    
    // Start MCP server in stdio mode for Cursor
    await seoBlogsMCP.run();
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to start MCP server:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
    console.error(chalk.gray('💡 Try using "vibeflow dev" instead for the full development server'));
    process.exit(1);
  }
}

export async function startMastraDev(projectRoot?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const root = projectRoot || process.cwd();
    
    // Load environment variables
    loadEnvironment(root);
    
    // Ensure MCP configuration exists
    ensureMCPConfig(root);
    
    console.log(chalk.blue('🔧 Starting Mastra development server...'));
    console.log(chalk.gray('   Location: apps/mastra-app/'));
    console.log(chalk.gray('   Command: mastra dev'));
    console.log(chalk.gray('   MCP: Available at http://localhost:4111/api/mcp/seoBlogsMCP/sse'));
    console.log(chalk.gray('   Web UI: http://localhost:4111'));
    
    // Change to the mastra-app directory and run mastra dev
    const mastraAppPath = join(root, 'apps', 'mastra-app');
    
    const child = spawn('npm', ['run', 'dev'], {
      cwd: mastraAppPath,
      stdio: 'inherit',
      env: { ...process.env },
      shell: true  // Use shell to resolve npm path
    });
    
    child.on('error', (error) => {
      console.error(chalk.red('❌ Failed to start Mastra dev:'), error.message);
      reject(error);
    });
    
    child.on('exit', (code) => {
      if (code === 0) {
        console.log(chalk.green('✅ Mastra development server stopped'));
        resolve();
      } else {
        console.error(chalk.red(`❌ Mastra dev exited with code ${code}`));
        reject(new Error(`Process exited with code ${code}`));
      }
    });
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n🔄 Stopping Mastra development server...'));
      child.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      child.kill('SIGTERM');
    });
  });
}
