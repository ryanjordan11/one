import express from 'express';
import { AgentOrchestrator } from '../services/agent-orchestrator.js';
import { IntegrationService } from '../services/integrations.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/stats', (req, res) => {
  const stats = AgentOrchestrator.getDashboardStats();
  const integrationStats = IntegrationService.getIntegrationStats();
  
  res.json({
    success: true,
    stats: {
      ...stats,
      integrations: integrationStats
    }
  });
});

dashboardRouter.get('/builds/active', (req, res) => {
  const builds = AgentOrchestrator.getActiveBuilds();
  res.json({ success: true, builds });
});

dashboardRouter.get('/builds/completed', (req, res) => {
  const apps = AgentOrchestrator.getGeneratedApps();
  res.json({ success: true, apps });
});

dashboardRouter.get('/builds/queue', (req, res) => {
  const queue = AgentOrchestrator.getBuildQueue();
  res.json({ success: true, queue });
});

dashboardRouter.post('/builds/:buildId/approve', async (req, res) => {
  try {
    const { deploymentTarget } = req.body;
    const app = await AgentOrchestrator.approveForDeployment(
      req.params.buildId,
      deploymentTarget || 'vercel'
    );
    res.json({ success: true, app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

dashboardRouter.post('/builds/:buildId/payment', async (req, res) => {
  try {
    const app = await AgentOrchestrator.setupPayment(req.params.buildId, req.body);
    res.json({ success: true, app });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
