import express from 'express';
import { AgentService } from '../services/agents.js';

export const agentsRouter = express.Router();

agentsRouter.post('/create', async (req, res) => {
  try {
    const agent = AgentService.createAgent(req.body);
    res.json({ success: true, agent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

agentsRouter.get('/', (req, res) => {
  const agents = AgentService.getAllAgents();
  res.json({ success: true, agents });
});

agentsRouter.get('/:agentId', (req, res) => {
  const agent = AgentService.getAgent(req.params.agentId);
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  res.json({ success: true, agent });
});

agentsRouter.post('/:agentId/chat', async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const result = await AgentService.chat(req.params.agentId, message, conversationId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

agentsRouter.delete('/:agentId', (req, res) => {
  const deleted = AgentService.deleteAgent(req.params.agentId);
  res.json({ success: true, deleted });
});
