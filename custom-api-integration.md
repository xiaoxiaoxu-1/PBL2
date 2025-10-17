# 自定义API端点集成指南

## 已配置的API端点

根据您提供的ID，系统已集成以下端点：

- **GET端点**: `bb172159-c181-4ac7-b813-f5bd644eb5a0`
- **POST端点**: `4580e39a-7fd1-4193-9c02-0d3458fcdcf4`

## 集成架构

```
前端(Vue组件) → n8n工作流 → 自定义API服务 → AI处理 → 返回结果
```

## 配置步骤

### 1. 环境变量配置

在 `Poetry Display/.env` 文件中添加：

```env
# 自定义API配置
VITE_CUSTOM_AI_API_KEY=your_custom_api_key_here
VITE_CUSTOM_AI_BASE_URL=https://your-ai-service.com/api

# n8n配置（已存在）
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ai-chat
VITE_N8N_API_KEY=your_n8n_api_key
```

### 2. n8n工作流配置

工作流已更新为支持您的自定义端点：

1. **优先使用POST端点** (`4580e39a-7fd1-4193-9c02-0d3458fcdcf4`)
2. **备用方案**: OpenAI服务
3. **默认回复**: 基础智能回复

### 3. API调用示例

#### 直接调用您的端点

```javascript
// 调用POST端点进行AI处理
const response = await fetch(`https://your-ai-service.com/api/4580e39a-7fd1-4193-9c02-0d3458fcdcf4`, {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: "用户的问题",
    context: "诗歌创作助手",
    max_tokens: 500
  })
});
```

#### 通过n8n工作流调用

```javascript
// 前端发送到n8n
const requestData = {
  message: "用户消息",
  timestamp: "2023-01-01T00:00:00Z",
  sessionId: "session-123",
  apiEndpoints: {
    get: "bb172159-c181-4ac7-b813-f5bd644eb5a0",
    post: "4580e39a-7fd1-4193-9c02-0d3458fcdcf4"
  }
};
```

## 测试集成

### 1. 启动测试环境

```bash
# 配置n8n环境
node setup-n8n.js

# 启动n8n
./start-n8n.sh
```

### 2. 导入工作流

1. 访问 http://localhost:5678
2. 导入 `n8n-workflow-ai-chat.json`
3. 配置环境变量：
   - `CUSTOM_AI_API_KEY`: 您的API密钥
   - `OPENAI_API_KEY`: 备用API密钥

### 3. 运行测试

```bash
# 测试自定义API集成
node test-custom-api.js
```

## 自定义配置

### 修改API端点URL

编辑 `api-config.js`:

```javascript
// 修改端点URL格式
customService: {
  getEndpoint: function() {
    return `https://your-service.com/data/${this.endpoints.get}`;
  },
  postEndpoint: function() {
    return `https://your-service.com/process/${this.endpoints.post}`;
  }
}
```

### 添加请求参数

在n8n工作流中修改请求体：

```javascript
body: JSON.stringify({
  prompt: message,
  context: '诗歌创作助手',
  max_tokens: 500,
  temperature: 0.7,
  // 添加其他参数
  model: 'your-model-name',
  stream: false
})
```

## 故障排除

### 常见问题

**API调用失败**
- 检查端点URL是否正确
- 验证API密钥有效性
- 确认服务可用性

**n8n工作流错误**
- 查看n8n日志输出
- 检查环境变量配置
- 验证网络连接

**响应格式不匹配**
- 调整n8n中的响应处理逻辑
- 添加错误处理机制

### 日志调试

在n8n工作流中添加调试节点：

```javascript
// 调试节点代码
console.log('API端点:', apiEndpoints);
console.log('用户消息:', message);
console.log('请求数据:', requestData);
```

## 性能优化建议

### 1. 缓存策略
- 实现对话历史缓存
- 使用Redis存储会话数据

### 2. 负载均衡
- 配置多个API端点
- 实现故障转移机制

### 3. 监控指标
- 记录API调用成功率
- 监控响应时间
- 设置告警阈值

## 安全考虑

### 1. API密钥保护
- 使用环境变量存储密钥
- 定期轮换密钥
- 限制API调用权限

### 2. 输入验证
- 验证用户输入内容
- 防止注入攻击
- 设置请求频率限制

### 3. 数据传输安全
- 使用HTTPS加密
- 验证SSL证书
- 保护敏感数据

## 扩展开发

### 添加新功能

1. **诗歌生成**
   ```javascript
   // 在n8n中添加诗歌生成节点
   const poetryPrompt = `根据主题"${theme}"创作一首诗`;
   ```

2. **诗歌分析**
   ```javascript
   // 添加文本分析功能
   const analysisResult = await analyzePoetry(text);
   ```

3. **多模态支持**
   ```javascript
   // 支持图像和文本结合
   const multimodalResponse = await processMultimodal(input);
   ```

## 支持与维护

如有问题，请参考：
- [n8n集成指南](n8n-integration-guide.md)
- [API配置文档](api-config.js)
- 项目文档和示例

通过以上配置，您的AI助手现在可以充分利用提供的API端点，实现更智能的诗歌相关对话功能。