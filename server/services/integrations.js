import { v4 as uuidv4 } from 'uuid';

// Integration management service
class IntegrationServiceClass {
  constructor() {
    this.connections = new Map();
    this.availableIntegrations = {
      vscode: {
        id: 'vscode',
        name: 'VS Code',
        icon: '💻',
        description: 'Connect your VS Code editor for AI-powered coding assistance',
        status: 'available',
        features: ['Code completion', 'Refactoring', 'Bug detection', 'Documentation'],
        setupComplexity: 'easy',
        requiresAuth: false
      },
      googleDrive: {
        id: 'googleDrive',
        name: 'Google Drive',
        icon: '📁',
        description: 'Access and manage files in your Google Drive',
        status: 'available',
        features: ['File access', 'Upload/Download', 'Sharing', 'Search'],
        setupComplexity: 'medium',
        requiresAuth: true,
        authType: 'oauth2'
      },
      googleDocs: {
        id: 'googleDocs',
        name: 'Google Docs',
        icon: '📝',
        description: 'Create and edit Google Docs with AI assistance',
        status: 'available',
        features: ['Document creation', 'AI editing', 'Collaboration', 'Templates'],
        setupComplexity: 'medium',
        requiresAuth: true,
        authType: 'oauth2'
      },
      lovable: {
        id: 'lovable',
        name: 'Lovable',
        icon: '💖',
        description: 'AI-powered app building platform integration',
        status: 'available',
        features: ['App generation', 'Design sync', 'Component library', 'Deploy'],
        setupComplexity: 'easy',
        requiresAuth: true,
        authType: 'apikey'
      },
      vercel: {
        id: 'vercel',
        name: 'Vercel',
        icon: '▲',
        description: 'Deploy and host your applications instantly',
        status: 'available',
        features: ['One-click deploy', 'Auto-scaling', 'Analytics', 'Domains'],
        setupComplexity: 'easy',
        requiresAuth: true,
        authType: 'apikey'
      },
      resend: {
        id: 'resend',
        name: 'Resend',
        icon: '📧',
        description: 'Email API for sending transactional emails',
        status: 'available',
        features: ['Email sending', 'Templates', 'Analytics', 'Webhooks'],
        setupComplexity: 'easy',
        requiresAuth: true,
        authType: 'apikey'
      },
      supabase: {
        id: 'supabase',
        name: 'Supabase',
        icon: '🗄️',
        description: 'Open source Firebase alternative with PostgreSQL',
        status: 'available',
        features: ['Database', 'Authentication', 'Storage', 'Realtime'],
        setupComplexity: 'medium',
        requiresAuth: true,
        authType: 'apikey'
      }
    };
  }

  getAvailableIntegrations() {
    return Object.values(this.availableIntegrations);
  }

  getIntegration(integrationId) {
    return this.availableIntegrations[integrationId];
  }

  async connectIntegration(userId, integrationId, config = {}) {
    const integration = this.availableIntegrations[integrationId];
    if (!integration) {
      throw new Error('Integration not found');
    }

    const connectionId = uuidv4();
    const connection = {
      id: connectionId,
      userId,
      integrationId,
      integrationName: integration.name,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      config: this.sanitizeConfig(config),
      lastUsed: null,
      usageCount: 0
    };

    this.connections.set(connectionId, connection);

    return connection;
  }

  sanitizeConfig(config) {
    // Remove sensitive data from config before storing
    const sanitized = { ...config };
    if (sanitized.apiKey) {
      sanitized.apiKey = '***' + sanitized.apiKey.slice(-4);
    }
    if (sanitized.accessToken) {
      sanitized.accessToken = '***' + sanitized.accessToken.slice(-4);
    }
    return sanitized;
  }

  getUserConnections(userId) {
    return Array.from(this.connections.values())
      .filter(conn => conn.userId === userId);
  }

  getConnection(connectionId) {
    return this.connections.get(connectionId);
  }

  async disconnectIntegration(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    connection.status = 'disconnected';
    connection.disconnectedAt = new Date().toISOString();

    return connection;
  }

  async testConnection(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    // Simulate connection test
    return {
      connectionId,
      status: 'success',
      message: 'Connection is healthy',
      latency: Math.floor(Math.random() * 100) + 50,
      testedAt: new Date().toISOString()
    };
  }

  async executeIntegrationAction(connectionId, action, params = {}) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      throw new Error('Connection not found');
    }

    connection.lastUsed = new Date().toISOString();
    connection.usageCount++;

    // Simulate action execution
    return {
      success: true,
      action,
      result: `Action '${action}' executed successfully`,
      timestamp: new Date().toISOString()
    };
  }

  getIntegrationStats() {
    const stats = {
      totalIntegrations: Object.keys(this.availableIntegrations).length,
      totalConnections: this.connections.size,
      activeConnections: Array.from(this.connections.values())
        .filter(c => c.status === 'connected').length,
      byIntegration: {}
    };

    for (const integration of Object.values(this.availableIntegrations)) {
      stats.byIntegration[integration.id] = {
        name: integration.name,
        connections: Array.from(this.connections.values())
          .filter(c => c.integrationId === integration.id && c.status === 'connected').length
      };
    }

    return stats;
  }
}

export const IntegrationService = new IntegrationServiceClass();
