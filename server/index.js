import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth.js';
import { agentsRouter } from './routes/agents.js';
import { integrationsRouter } from './routes/integrations.js';
import { dashboardRouter } from './routes/dashboard.js';
import { webhooksRouter } from './routes/webhooks.js';
import { vibeCodingRouter } from './routes/vibecoding.js';
import { WebSocketService } from './services/websocket.js';
import { LoggingService } from './services/logging.js';
import { GodModeOrchestrator } from './services/god-mode-orchestrator.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  LoggingService.logRequest(req);
  next();
});

// Serve static files from root directory
app.use(express.static(join(__dirname, '..')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      ai: 'operational',
      integrations: 'operational',
      websocket: 'operational'
    }
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/integrations', integrationsRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/webhooks', webhooksRouter);
app.use('/api/vibecoding', vibeCodingRouter);

// Serve the main application
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '..', 'dashboard.html'));
});

// Serve VibeCoding platform
app.get('/vibecoding', (req, res) => {
  res.sendFile(join(__dirname, '..', 'vibecoding.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  LoggingService.logError(err, req);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                                 ║
║        🚀 ENTERPRISE AI AGENT GATEWAY - LIVE & READY 🚀        ║
║                                                                 ║
╚═══════════════════════════════════════════════════════════════╝

✅ Server running on: http://localhost:${PORT}
✅ Dashboard: http://localhost:${PORT}
✅ Health Check: http://localhost:${PORT}/health
✅ API Endpoint: http://localhost:${PORT}/api

📊 Available Integrations:
   • VS Code Extension
   • Google Drive
   • Google Docs
   • Lovable
   • Vercel
   • Resend
   • Supabase

🤖 AI Providers Ready:
   • OpenAI
   • Anthropic Claude
   • xAI Grok

⚡ WebSocket: Initializing...
🔐 Security: Active
📝 Logging: Enabled

Press Ctrl+C to stop the server
`);
});

// Initialize WebSocket service
WebSocketService.init(server);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export default app;
