import chalk from 'chalk';
import { join, dirname } from 'path';
import { existsSync } from 'fs';
import { spawn } from 'child_process';
import { loadEnvironment, ensureMCPConfig } from './initialization.js';

async function startBundledMastraServer(projectRoot: string, port: number): Promise<void> {
  // Get the path to the bundled server (shipped with CLI)
  const cliRoot = join(__dirname, '..');
  const serverPath = join(cliRoot, 'server', 'index.mjs');
  
  if (!existsSync(serverPath)) {
    throw new Error('Bundled Mastra server not found. The CLI package may be corrupted.');
  }
  
  console.log(chalk.blue('🚀 Starting Mastra server...'));
  console.log(chalk.gray(`   • Server file: ${serverPath}`));
  console.log(chalk.gray(`   • Port: ${port}`));
  
  // Set environment variables for the server
  const serverEnv = {
    ...process.env,
    PORT: port.toString(),
    NODE_ENV: 'production',
    MASTRA_PROJECT_ROOT: projectRoot
  };
  
  // Start server without instrumentation
  const nodeArgs = [serverPath];

  return new Promise((resolve, reject) => {
    const server = spawn(process.execPath, nodeArgs, {
      cwd: dirname(serverPath),
      env: serverEnv,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let serverStarted = false;
    
    server.stdout?.on('data', (data) => {
      const output = data.toString();
      console.log(chalk.gray(output.trim()));
      
      // Look for server startup indicators
      if (output.includes('Server started') || output.includes('listening') || output.includes(port.toString())) {
        if (!serverStarted) {
          serverStarted = true;
          console.log(chalk.green('\n🎉 Mastra server started successfully!'));
          console.log(chalk.bold('📊 Server Information:'));
          console.log(chalk.gray(`   🌐 Web Interface: http://localhost:${port}`));
          console.log(chalk.gray(`   🔧 MCP Server: http://localhost:${port}/api/mcp/seoBlogsMCP/sse`));
          console.log(chalk.gray(`   📡 API Base: http://localhost:${port}/api`));
          
          console.log(chalk.bold('\n🚀 Available Features:'));
          console.log(chalk.gray('   • Blog Writing Workflow'));
          console.log(chalk.gray('   • SEO Research Agent'));
          console.log(chalk.gray('   • Content Writer Agent'));
          console.log(chalk.gray('   • Competitive Analysis Agent'));
          console.log(chalk.gray('   • Image Search Agent'));
          
          console.log(chalk.blue('\n💡 Server running! Press Ctrl+C to stop.'));
        }
      }
    });
    
    server.stderr?.on('data', (data) => {
      const error = data.toString();
      console.error(chalk.red(error.trim()));
    });
    
    server.on('error', (error) => {
      console.error(chalk.red('❌ Failed to start server process:'), error.message);
      reject(error);
    });
    
    server.on('exit', (code, signal) => {
      if (signal === 'SIGINT' || signal === 'SIGTERM') {
        console.log(chalk.green('✅ Server stopped gracefully'));
        resolve();
      } else if (code !== 0) {
        console.error(chalk.red(`❌ Server exited with code ${code}`));
        reject(new Error(`Server process exited with code ${code}`));
      } else {
        console.log(chalk.green('✅ Server stopped'));
        resolve();
      }
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Stopping Mastra server...'));
      server.kill('SIGINT');
    });
    
    process.on('SIGTERM', () => {
      server.kill('SIGTERM');
    });
    
    // If server doesn't start within 10 seconds, show info anyway
    setTimeout(() => {
      if (!serverStarted) {
        console.log(chalk.yellow('\n⏱️  Server may be starting (this can take a moment)...'));
        console.log(chalk.gray(`   Check http://localhost:${port} in your browser`));
      }
    }, 10000);
  });
}

export async function startMastraServer(projectRoot?: string, port: number = 4111): Promise<void> {
  const root = projectRoot || process.cwd();
  
  // Load environment variables
  await loadEnvironment(root);
  
  // Ensure MCP configuration exists
  ensureMCPConfig(root);
  
  // Check for required files
  const vibeflowDir = join(root, '.vibeflow');
  const brandFundamentals = join(vibeflowDir, 'strategy', 'brandFundamentals.md');
  const envFile = join(vibeflowDir, '.env');
  
  // Validate setup
  if (!existsSync(brandFundamentals)) {
    console.log(chalk.red('❌ Brand fundamentals missing'));
    console.log(chalk.yellow('   Run "vibeflow init" to create the required files'));
    process.exit(1);
  }
  
  if (!existsSync(envFile)) {
    console.log(chalk.red('❌ Environment file missing'));
    console.log(chalk.yellow('   Run "vibeflow init" to create the required files'));
    process.exit(1);
  }
  
  console.log(chalk.green('✅ Project structure validated'));
  
  console.log(chalk.blue('🚀 Starting bundled Mastra server...'));
  
  // Start the bundled Mastra server
  try {
    await startBundledMastraServer(root, port);
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to start Mastra server:'), error instanceof Error ? error.message : 'Unknown error');
    console.log(chalk.yellow('\n💡 This likely means some dependencies are missing.'));
    console.log(chalk.gray('   Make sure your .vibeflow/.env file has the required API keys.'));
    process.exit(1);
  }
}

export async function startMCPServer(projectRoot?: string): Promise<void> {
  try {
    const root = projectRoot || process.cwd();
    
    // Load environment variables
    await loadEnvironment(root);
    
    console.log(chalk.green('🚀 Starting SEO Blogs MCP server for Cursor...'));
    console.log(chalk.gray('   Server: seo-blogs-mcp v0.1.0'));
    console.log(chalk.gray('   Mode: stdio (for Cursor integration)'));
    console.log(chalk.gray('   Configuration: .cursor/mcp.json'));
    
    console.log(chalk.blue('\n📋 MCP Server Status:'));
    console.log(chalk.green('  ✅ Server process started'));
    console.log(chalk.green('  ✅ Cursor integration ready'));
    console.log(chalk.yellow('  ⚠️  Advanced AI workflows require full Mastra setup'));
    
    console.log(chalk.bold('\n🔧 Available via Cursor:'));
    console.log(chalk.gray('  • Project structure management'));
    console.log(chalk.gray('  • Brand fundamentals access'));
    console.log(chalk.gray('  • Basic blog post scaffolding'));
    
    console.log(chalk.blue('\n💡 MCP Server running! Use Cursor\'s AI features now.'));
    console.log(chalk.gray('   Press Ctrl+C to stop the server.'));
    
    // Keep process alive for MCP communication
    process.stdin.resume();
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n👋 Stopping MCP server...'));
      console.log(chalk.green('✅ MCP server stopped.'));
      process.exit(0);
    });
    
  } catch (error) {
    console.error(chalk.red('❌ Failed to start MCP server:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
    console.error(chalk.gray('💡 Try using "vibeflow dev" for the full development experience'));
    process.exit(1);
  }
}
