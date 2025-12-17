import express from 'express';
import { IntegrationService } from '../services/integrations.js';

export const integrationsRouter = express.Router();

integrationsRouter.get('/', (req, res) => {
  const integrations = IntegrationService.getAvailableIntegrations();
  res.json({ success: true, integrations });
});

integrationsRouter.post('/connect', async (req, res) => {
  try {
    const { userId, integrationId, config } = req.body;
    const connection = await IntegrationService.connectIntegration(
      userId || 'default-user',
      integrationId,
      config
    );
    res.json({ success: true, connection });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

integrationsRouter.get('/connections/:userId', (req, res) => {
  const connections = IntegrationService.getUserConnections(req.params.userId);
  res.json({ success: true, connections });
});

integrationsRouter.post('/disconnect/:connectionId', async (req, res) => {
  try {
    const connection = await IntegrationService.disconnectIntegration(req.params.connectionId);
    res.json({ success: true, connection });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

integrationsRouter.get('/test/:connectionId', async (req, res) => {
  try {
    const result = await IntegrationService.testConnection(req.params.connectionId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

integrationsRouter.get('/stats', (req, res) => {
  const stats = IntegrationService.getIntegrationStats();
  res.json({ success: true, stats });
});
