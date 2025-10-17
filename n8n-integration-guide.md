# AI助手与n8n工作流集成指南

## 方案概述

本指南提供三种将AI助手连接到n8n工作流的方案：

### 方案1：通过n8n Webhook（推荐）
- 前端 → n8n Webhook → AI服务 → 返回结果
- 优点：灵活、可扩展、支持复杂工作流

### 方案2：Supabase Edge Functions
- 前端 → Supabase函数 → n8n → AI服务
- 优点：安全性高、与Supabase生态集成

### 方案3：直接AI API调用
- 前端 → 直接调用AI服务
- 优点：简单直接、延迟低

## 实施步骤

### 1. 配置n8n工作流

1. 导入工作流配置文件：
   ```bash
   # 将n8n-workflow-ai-chat.json导入到n8n
   ```

2. 配置环境变量：
   - 在n8n中设置`OPENAI_API_KEY`等AI服务密钥

3. 启动工作流并获取Webhook URL

### 2. 前端配置

1. 复制环境变量文件：
   ```bash
   cp .env.example .env
   ```

2. 配置实际参数：
   ```env
   VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/ai-chat
   VITE_N8N_API_KEY=your_actual_api_key
   ```

### 3. n8n工作流节点说明

#### Webhook节点
- 路径：`/webhook/ai-chat`
- 接收前端聊天请求

#### AI处理器节点
- 集成OpenAI、文心一言等AI服务
- 可添加业务逻辑处理

#### 响应节点
- 返回格式化结果给前端

## 高级功能

### 1. 对话历史管理
在n8n中添加数据库节点保存对话上下文

### 2. 多AI服务切换
根据问题类型选择不同的AI模型

### 3. 内容审核
集成内容安全检测

### 4. 性能监控
添加日志和性能追踪

## 部署建议

### 开发环境
- 使用本地n8n实例
- Webhook URL: `http://localhost:5678/webhook/ai-chat`

### 生产环境
- 使用云托管的n8n
- 配置HTTPS和认证
- 设置速率限制

## 故障排除

### 常见问题

1. **Webhook连接失败**
   - 检查n8n服务状态
   - 验证URL和API密钥

2. **AI服务超时**
   - 调整超时设置
   - 添加重试机制

3. **响应格式错误**
   - 检查n8n工作流输出格式
   - 验证前端数据处理

## 安全考虑

1. **API密钥保护**
   - 不要在前端暴露敏感密钥
   - 使用环境变量

2. **输入验证**
   - 在n8n中验证用户输入
   - 防止注入攻击

3. **速率限制**
   - 配置适当的请求限制
   - 防止滥用