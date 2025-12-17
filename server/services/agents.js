import { v4 as uuidv4 } from 'uuid';
import fetch from 'node-fetch';

const agents = new Map();
const conversations = new Map();

class AgentServiceClass {
  constructor() {
    this.providers = {
      openai: {
        name: 'OpenAI',
        models: ['gpt-4', 'gpt-3.5-turbo'],
        endpoint: 'https://api.openai.com/v1/chat/completions'
      },
      anthropic: {
        name: 'Anthropic',
        models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229'],
        endpoint: 'https://api.anthropic.com/v1/messages'
      },
      xai: {
        name: 'xAI Grok',
        models: ['grok-beta'],
        endpoint: 'https://api.x.ai/v1/chat/completions'
      }
    };
  }

  createAgent(config) {
    const agentId = uuidv4();
    const agent = {
      id: agentId,
      name: config.name,
      description: config.description,
      provider: config.provider,
      model: config.model,
      systemPrompt: config.systemPrompt,
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 1000,
      createdAt: new Date().toISOString(),
      status: 'active',
      conversationCount: 0,
      lastUsed: null
    };

    agents.set(agentId, agent);
    return agent;
  }

  getAgent(agentId) {
    return agents.get(agentId);
  }

  getAllAgents() {
    return Array.from(agents.values());
  }

  deleteAgent(agentId) {
    return agents.delete(agentId);
  }

  updateAgent(agentId, updates) {
    const agent = agents.get(agentId);
    if (!agent) return null;

    const updatedAgent = { ...agent, ...updates };
    agents.set(agentId, updatedAgent);
    return updatedAgent;
  }

  async chat(agentId, message, conversationId = null) {
    const agent = agents.get(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Get or create conversation
    if (!conversationId) {
      conversationId = uuidv4();
      conversations.set(conversationId, {
        id: conversationId,
        agentId,
        messages: [],
        createdAt: new Date().toISOString()
      });
    }

    const conversation = conversations.get(conversationId);
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });

    // Call AI provider
    let response;
    try {
      response = await this.callAIProvider(agent, conversation.messages);
    } catch (error) {
      throw new Error(`AI Provider Error: ${error.message}`);
    }

    conversation.messages.push({
      role: 'assistant',
      content: response,
      timestamp: new Date().toISOString()
    });

    // Update agent stats
    agent.conversationCount++;
    agent.lastUsed = new Date().toISOString();

    return {
      conversationId,
      message: response,
      agentId,
      timestamp: new Date().toISOString()
    };
  }

  async callAIProvider(agent, messages) {
    const provider = this.providers[agent.provider];
    if (!provider) {
      throw new Error('Invalid AI provider');
    }

    // For demo purposes, return simulated responses if no API keys
    if (!this.hasAPIKey(agent.provider)) {
      return this.getSimulatedResponse(agent, messages);
    }

    // Actual API call would go here
    // This is a placeholder for the full implementation
    return this.getSimulatedResponse(agent, messages);
  }

  hasAPIKey(provider) {
    const keyMap = {
      openai: process.env.OPENAI_API_KEY,
      anthropic: process.env.ANTHROPIC_API_KEY,
      xai: process.env.XAI_API_KEY
    };
    return keyMap[provider] && !keyMap[provider].includes('your-');
  }

  getSimulatedResponse(agent, messages) {
    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    
    if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
      return `Hello! I'm ${agent.name}, your AI assistant. How can I help you today?`;
    }
    if (lastMessage.includes('integrate') || lastMessage.includes('connect')) {
      return `I can help you integrate with various services. I have access to VS Code, Google Drive, Google Docs, Vercel, Resend, Supabase, and Lovable. Which integration would you like to set up?`;
    }
    if (lastMessage.includes('status') || lastMessage.includes('health')) {
      return `All systems are operational! The AI Agent Gateway is running smoothly with all integrations ready.`;
    }
    
    return `I understand you're asking about: "${messages[messages.length - 1].content}". As ${agent.name}, I'm here to assist you with AI-powered tasks and integrations. How can I help you further?`;
  }

  getConversation(conversationId) {
    return conversations.get(conversationId);
  }

  getAllConversations() {
    return Array.from(conversations.values());
  }
}

export const AgentService = new AgentServiceClass();
