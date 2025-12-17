import express from 'express';
import { WebSocketService } from '../services/websocket.js';

export const webhooksRouter = express.Router();

webhooksRouter.post('/event', (req, res) => {
  const { type, data } = req.body;
  
  // Broadcast event to all connected clients
  WebSocketService.broadcast({
    type: 'webhook-event',
    eventType: type,
    data,
    timestamp: new Date().toISOString()
  });
  
  res.json({ success: true, message: 'Event broadcasted' });
});

webhooksRouter.post('/github', (req, res) => {
  const event = req.headers['x-github-event'];
  console.log('GitHub webhook:', event);
  res.json({ success: true });
});

webhooksRouter.post('/vercel', (req, res) => {
  console.log('Vercel webhook:', req.body);
  res.json({ success: true });
});
