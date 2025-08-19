#!/usr/bin/env node
import { Command } from 'commander';
import Table from 'cli-table3';
import chalk from 'chalk';
import boxen from 'boxen';
import figlet from 'figlet';
import prompts from 'prompts';
import slant from 'figlet/importable-fonts/Slant.js';
import gradient from 'gradient-string';
import { initializeVibeflow, loadEnvironment } from './lib/initialization.js';
import { startMCPServer, startMastraDev } from './lib/mcp-server.js';

const program = new Command();
program.name('vibeflow').description('SEO Blogs AI Workflow Tool').version('0.0.1');

// Custom error handler
program.exitOverride((err) => {
  if (err.code === 'commander.helpDisplayed') {
    // Help was displayed, exit normally
    process.exit(0);
  }
  if (err.code === 'commander.missingArgument') {
    console.error(chalk.red(`❌ Error: ${err.message}`));
    console.error(chalk.gray('Use --help for usage information'));
    process.exit(1);
  }
  if (err.code === 'commander.unknownCommand') {
    console.error(chalk.red(`❌ Error: Unknown command '${err.message}'`));
    console.error(chalk.gray('Use --help to see available commands'));
    process.exit(1);
  }
  throw err;
});

program
  .command('init')
  .description('Initialize SEO Blogs project structure (for new projects only)')
  .option('--project-root <path>', 'Project root directory (defaults to current directory)')
  .action(async (options) => {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      
      figlet.parseFont('Slant', slant);

      const coolGradient = gradient(['#00b4d8', '#0077b6', '#03045e']);
      const bannerText = figlet.textSync('SEO Blogs', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });
      console.log(coolGradient(bannerText));
      
      const response = await prompts([
        {
          type: 'text',
          name: 'projectName',
          message: 'What is the name of your SEO blog project?',
          initial: 'My Awesome Blog'
        },
        {
          type: 'text',
          name: 'projectDescription',
          message: 'Describe your blog project in a few words.',
          initial: 'AI-powered SEO blog generation'
        }
      ]);

      console.log(chalk.blue('🚀 Initializing SEO Blogs project...'));
      
      const result = await initializeVibeflow({ 
        projectRoot,
        projectName: response.projectName,
        projectDescription: response.projectDescription
      });
      
      if (result.success) {
        const icon = result.alreadyInitialized ? '✅' : '🎉';
        const color = result.alreadyInitialized ? 'yellow' : 'green';
        
        console.log(boxen(
          chalk[color](`${icon} ${result.message}`),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: color
          }
        ));
        
        if (!result.alreadyInitialized) {
          console.log(chalk.gray('📁 Created: .vibeflow/'));
          console.log(chalk.gray('📄 Created: .vibeflow/state.json'));
          console.log(chalk.gray('📂 Created: .vibeflow/cache/'));
          console.log(chalk.gray('📂 Created: strategy/ (with example workflows)'));
          console.log(chalk.gray('📂 Created: .cursor/ (with MCP configuration)'));
          console.log(chalk.gray('📄 Created: .env (add your API keys here)'));
          console.log(chalk.blue('\n🎯 You can now run "vibeflow dev" to start the development server!'));
        }
      } else {
        console.error(boxen(
          chalk.red(`❌ ${result.message}`),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'red'
          }
        ));
        process.exit(1);
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Error initializing project:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

program
  .command('dev')
  .description('Start Mastra development server with MCP integration')
  .option('--project-root <path>', 'Project root directory (defaults to current directory)')
  .action(async (options) => {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      
      // Show cool banner
      figlet.parseFont('Slant', slant);
      const coolGradient = gradient(['#00b4d8', '#0077b6', '#03045e']);
      const bannerText = figlet.textSync('SEO Blogs', {
        font: 'Slant',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      });
      console.log(coolGradient(bannerText));
      
      console.log(chalk.bold.cyan('🚀 Starting Development Server\n'));
      console.log(chalk.gray('This will start the full Mastra development environment with:'));
      console.log(chalk.gray('  • 🌐 Web interface for workflows and agents'));
      console.log(chalk.gray('  • 🔧 MCP server for Cursor integration'));
      console.log(chalk.gray('  • 📡 API endpoints for blog generation'));
      console.log(chalk.gray('  • 🤖 5 specialized AI agents'));
      console.log(chalk.gray('  • 📝 Automated blog generation workflows\n'));
      
      await startMastraDev(projectRoot);
      
    } catch (error) {
      console.error(chalk.red('❌ Error starting development server:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

program
  .command('mcp')
  .description('Start SEO Blogs MCP server over stdio')
  .option('--project-root <path>', 'Project root directory (defaults to current directory)')
  .action(async (options) => {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      await startMCPServer(projectRoot);
    } catch (error) {
      console.error(chalk.red('❌ Error starting MCP server:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show project status and configuration')
  .option('--project-root <path>', 'Project root directory (defaults to current directory)')
  .action(async (options) => {
    try {
      const projectRoot = options.projectRoot || process.cwd();
      const { existsSync } = await import('fs');
      const { join } = await import('path');
      
      console.log(chalk.bold.cyan('📊 SEO Blogs Project Status\n'));
      
      // Check initialization
      const vibeflowDir = join(projectRoot, '.vibeflow');
      const stateFile = join(vibeflowDir, 'state.json');
      const envFile = join(projectRoot, '.env');
      const mcpFile = join(projectRoot, '.cursor', 'mcp.json');
      
      const table = new Table({
        head: [chalk.bold.white('Component'), chalk.bold.white('Status')],
        colWidths: [30, 15],
        style: {
          head: [],
          border: ['gray']
        }
      });
      
      table.push([
        'Project Initialized',
        existsSync(stateFile) ? chalk.green('✅ Yes') : chalk.red('❌ No')
      ]);
      
      table.push([
        'Environment Configuration',
        existsSync(envFile) ? chalk.green('✅ Found') : chalk.yellow('⚠️ Missing')
      ]);
      
      table.push([
        'MCP Configuration',
        existsSync(mcpFile) ? chalk.green('✅ Found') : chalk.yellow('⚠️ Missing')
      ]);
      
      console.log(table.toString());
      
      if (!existsSync(stateFile)) {
        console.log(chalk.yellow('\n💡 Run "vibeflow init" to initialize your project'));
      } else {
        console.log(chalk.green('\n🚀 Ready to run "vibeflow dev"'));
      }
      
    } catch (error) {
      console.error(chalk.red('❌ Error checking status:'), chalk.yellow(error instanceof Error ? error.message : 'Unknown error'));
      process.exit(1);
    }
  });

// Fallback: if no args & !process.stdin.isTTY, assume Cursor spawned us
if (process.argv.length === 2 && !process.stdin.isTTY) {
  const projectRoot = process.cwd();
  startMCPServer(projectRoot);
} else {
  program.parse();
}
