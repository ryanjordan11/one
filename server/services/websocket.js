import { WebSocketServer } from 'ws';

class WebSocketServiceClass {
  constructor() {
    this.wss = null;
    this.clients = new Map();
  }

  init(server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws, req) => {
      const clientId = this.generateClientId();
      this.clients.set(clientId, ws);

      console.log(`✅ WebSocket client connected: ${clientId}`);

      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(clientId, message);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`❌ WebSocket client disconnected: ${clientId}`);
      });

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connected',
        clientId,
        timestamp: new Date().toISOString()
      }));
    });

    console.log('✅ WebSocket service initialized');
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  handleMessage(clientId, message) {
    console.log(`Message from ${clientId}:`, message.type);
    
    // Echo back for now
    const client = this.clients.get(clientId);
    if (client) {
      client.send(JSON.stringify({
        type: 'echo',
        originalMessage: message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  sendToClient(clientId, message) {
    const client = this.clients.get(clientId);
    if (client && client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  }
}

export const WebSocketService = new WebSocketServiceClass();
