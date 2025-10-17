// API配置管理
const apiConfig = {
  // 您提供的API端点配置
  endpoints: {
    get: 'bb172159-c181-4ac7-b813-f5bd644eb5a0',
    post: '4580e39a-7fd1-4193-9c02-0d3458fcdcf4'
  },
  
  // n8n工作流配置
  n8n: {
    baseUrl: process.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678',
    webhookPath: '/webhook/ai-chat',
    apiKey: process.env.VITE_N8N_API_KEY || ''
  },
  
  // AI服务配置
  aiServices: {
    // 可以集成您提供的API端点
    customService: {
      getEndpoint: function() {
        return `https://api.example.com/data/${this.endpoints.get}`;
      },
      postEndpoint: function() {
        return `https://api.example.com/process/${this.endpoints.post}`;
      }
    },
    
    // 备用AI服务
    openai: {
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-3.5-turbo'
    }
  },
  
  // 获取完整Webhook URL
  getWebhookUrl: function() {
    return `${this.n8n.baseUrl}${this.n8n.webhookPath}`;
  },
  
  // 构建请求头
  getHeaders: function() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.n8n.apiKey) {
      headers['Authorization'] = `Bearer ${this.n8n.apiKey}`;
    }
    
    return headers;
  }
};

module.exports = apiConfig;