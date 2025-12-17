import express from 'express';
import { GodModeOrchestrator } from '../services/god-mode-orchestrator.js';

export const vibeCodingRouter = express.Router();

// Get available agents
vibeCodingRouter.get('/agents', (req, res) => {
  const agents = GodModeOrchestrator.getAvailableAgents();
  res.json({ success: true, agents });
});

// Start a new VibeCoding session
vibeCodingRouter.post('/session/start', async (req, res) => {
  try {
    const { userId, projectGoal } = req.body;
    const session = await GodModeOrchestrator.startVibeCodingSession(
      userId || 'user-' + Date.now(),
      projectGoal
    );
    res.json({ success: true, session });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get session details
vibeCodingRouter.get('/session/:sessionId', (req, res) => {
  const session = GodModeOrchestrator.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ success: true, session });
});

// Get all sessions
vibeCodingRouter.get('/sessions', (req, res) => {
  const sessions = GodModeOrchestrator.getAllSessions();
  res.json({ success: true, sessions });
});

// Chat with specific agent
vibeCodingRouter.post('/session/:sessionId/agent/:agentType/chat', async (req, res) => {
  try {
    const { sessionId, agentType } = req.params;
    const { message } = req.body;
    
    const guidance = await GodModeOrchestrator.agentGuidance(sessionId, agentType, message);
    res.json({ success: true, guidance });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Connect VS Code
vibeCodingRouter.post('/session/:sessionId/vscode/connect', async (req, res) => {
  try {
    const { workspace } = req.body;
    await GodModeOrchestrator.connectVSCode(req.params.sessionId, { workspace });
    res.json({ 
      success: true, 
      message: 'VS Code connected. Agents have full permission to implement code.',
      autonomousMode: true
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get God Mode stats
vibeCodingRouter.get('/godmode/stats', (req, res) => {
  const stats = GodModeOrchestrator.getGodModeStats();
  res.json({ success: true, stats });
});
