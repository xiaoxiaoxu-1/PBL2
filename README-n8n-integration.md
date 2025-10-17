# AI助手与n8n工作流集成

## 项目结构

```
PBL2/
├── n8n-workflow-ai-chat.json          # n8n工作流配置文件
├── setup-n8n.js                       # n8n环境配置脚本
├── start-n8n.bat                      # Windows启动脚本
├── start-n8n.sh                       # Linux/Mac启动脚本
├── test-n8n.html                      # 集成测试页面
├── n8n-integration-guide.md           # 详细集成指南
└── Poetry Display/
    ├── .env.example                   # 环境变量模板
    └── src/components/
        └── AIChatAssistant.vue        # 已集成的AI助手组件
```

## 快速开始

### 1. 配置n8n环境

```bash
# 运行配置脚本
node setup-n8n.js

# 启动n8n服务
./start-n8n.sh  # Linux/Mac
# 或双击 start-n8n.bat (Windows)
```

### 2. 设置n8n工作流

1. 访问 http://localhost:5678
2. 登录: admin / password123
3. 导入工作流文件: `n8n-workflow-ai-chat.json`
4. 激活工作流

### 3. 配置前端环境

```bash
cd "Poetry Display"
cp .env.example .env
```

编辑 `.env` 文件:
```env
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ai-chat
VITE_N8N_API_KEY=your_n8n_api_key
```

### 4. 测试集成

1. 打开 `test-n8n.html` 文件
2. 输入测试消息
3. 点击"测试n8n连接"

### 5. 启动应用

```bash
cd "Poetry Display"
npm run dev
```

## 功能特性

### ✅ 已实现功能

- **智能回复**: 基于n8n工作流的AI对话
- **错误处理**: 网络异常和API失败处理
- **环境配置**: 灵活的环境变量配置
- **测试工具**: 独立的集成测试页面
- **安全认证**: n8n基础认证支持

### 🔄 工作流程

```
用户输入 → Vue组件 → n8n Webhook → AI处理 → 返回结果
```

### 🛠 自定义配置

#### 修改AI服务

编辑 `n8n-workflow-ai-chat.json` 中的AI处理器节点，支持:
- OpenAI GPT系列
- 文心一言
- 通义千问
- 自定义AI API

#### 添加业务逻辑

在n8n工作流中可以添加:
- 用户身份验证
- 对话历史管理
- 内容审核
- 多轮对话处理

## 故障排除

### 常见问题

**n8n服务无法启动**
```bash
# 检查n8n安装
n8n --version

# 重新安装
npm install -g n8n
```

**Webhook连接失败**
- 检查n8n服务是否运行在5678端口
- 验证Webhook URL是否正确
- 查看n8n日志排查问题

**AI服务无响应**
- 检查AI API密钥配置
- 验证网络连接
- 调整超时设置

### 日志查看

```bash
# n8n日志位置
tail -f ~/.n8n/logs/n8n.log
```

## 生产部署

### 安全配置

1. **修改默认密码**
   ```javascript
   // n8n-config/config.json
   "security": {
     "basicAuth": {
       "user": "自定义用户名",
       "password": "强密码"
     }
   }
   ```

2. **HTTPS配置**
   - 使用反向代理(nginx)
   - 配置SSL证书

3. **环境变量管理**
   - 使用密钥管理服务
   - 定期轮换API密钥

### 性能优化

- 配置n8n集群
- 使用Redis缓存
- 设置速率限制
- 监控系统资源

## 扩展开发

### 添加新功能

1. **诗歌创作助手**
   - 在n8n中添加诗歌生成节点
   - 集成创作模板和规则

2. **诗歌分析**
   - 添加文本分析工作流
   - 集成情感分析API

3. **多语言支持**
   - 配置翻译工作流
   - 支持中英文诗歌

### API文档

前端调用接口:
```javascript
POST /webhook/ai-chat
{
  "message": "用户消息",
  "timestamp": "2023-01-01T00:00:00Z",
  "sessionId": "会话ID"
}

响应:
{
  "response": "AI回复",
  "timestamp": "2023-01-01T00:00:00Z",
  "sessionId": "会话ID"
}
```

## 技术支持

如有问题请参考:
- [n8n官方文档](https://docs.n8n.io/)
- [集成指南](n8n-integration-guide.md)
- 项目Issue页面