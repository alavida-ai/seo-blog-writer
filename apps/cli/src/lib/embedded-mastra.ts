import { join } from 'path';
import { createServer } from 'http';
import chalk from 'chalk';

export async function createMastraServer(projectRoot: string, port: number) {
  // For now, create a basic HTTP server that provides the essential endpoints
  // In a full implementation, this would embed the actual Mastra server
  
  const server = createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    const url = new URL(req.url!, `http://localhost:${port}`);
    
    // Handle different routes
    if (url.pathname === '/') {
      // Serve a basic web interface
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>Vibeflow - SEO Blog Generator</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2563eb; margin-bottom: 30px; }
        .status { background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .endpoint { background: #f8fafc; padding: 15px; margin: 10px 0; border-radius: 4px; font-family: monospace; }
        .ready { color: #059669; font-weight: bold; }
        .warning { color: #d97706; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Vibeflow SEO Blog Generator</h1>
        
        <div class="status">
            <div class="ready">✅ Server Running</div>
            <p>Your Vibeflow server is up and running!</p>
        </div>
        
        <h2>Available Endpoints</h2>
        <div class="endpoint">GET /api/health - Health check</div>
        <div class="endpoint">POST /api/mcp/seoBlogsMCP/sse - MCP Server (for Cursor)</div>
        <div class="endpoint">GET /api/status - Project status</div>
        
        <h2>Getting Started</h2>
        <ol>
            <li>Configure your brand fundamentals in <code>.vibeflow/strategy/brandFundamentals.md</code></li>
            <li>Add your API keys to <code>.vibeflow/.env</code></li>
            <li>Use Cursor with the MCP integration</li>
            <li>Start generating SEO-optimized blog posts!</li>
        </ol>
        
        <div class="status">
            <div class="warning">⚠️ Note:</div>
            <p>This is the embedded Vibeflow server. For full AI agent workflows, consider using the complete Mastra setup.</p>
        </div>
    </div>
</body>
</html>
      `);
    } else if (url.pathname === '/api/health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', server: 'vibeflow', version: '0.1.0' }));
    } else if (url.pathname === '/api/status') {
      const { existsSync } = require('fs');
      const vibeflowDir = join(projectRoot, '.vibeflow');
      const brandFundamentals = join(vibeflowDir, 'strategy', 'brandFundamentals.md');
      const envFile = join(vibeflowDir, '.env');
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        project: 'vibeflow',
        brandFundamentals: existsSync(brandFundamentals),
        environment: existsSync(envFile),
        ready: existsSync(brandFundamentals) && existsSync(envFile)
      }));
    } else if (url.pathname.startsWith('/api/mcp/')) {
      // Handle MCP server requests
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        message: 'MCP server endpoint - connect via Cursor',
        server: 'seoBlogsMCP',
        version: '0.1.0'
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  });
  
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      resolve(server);
    });
    
    server.on('error', (err) => {
      reject(err);
    });
  });
}
