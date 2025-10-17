<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

// 简单的Markdown渲染函数
const renderMarkdown = (text: string): string => {
  if (!text) return ''
  
  // 处理标题
  let html = text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
  
  // 处理粗体
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // 处理斜体
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // 处理代码块
  html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>')
  
  // 处理行内代码
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // 处理链接
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
  
  // 处理无序列表
  html = html.replace(/^\* (.+)/gim, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
  
  // 处理有序列表
  html = html.replace(/^\d+\. (.+)/gim, '<li>$1</li>')
  
  // 处理换行
  html = html.replace(/\n/g, '<br>')
  
  return html
}

// 聊天助手状态
const isOpen = ref(false)
const messages = ref<Array<{id: number, text: string, isUser: boolean, timestamp: Date}>>([])
const userInput = ref('')
const isLoading = ref(false)

// n8n工作流配置 - 使用生产环境远程爪云n8n服务
const n8nConfig = {
  webhookUrl: 'https://n8n-hiriavsw.ap-northeast-1.clawcloudrun.com/webhook/bb172159-c181-4ac7-b813-f5bd644eb5a0',
  apiKey: '',
  // 您提供的API端点ID
  customApiEndpoints: {
    get: 'bb172159-c181-4ac7-b813-f5bd644eb5a0',
    post: '4580e39a-7fd1-4193-9c02-0d3458fcdcf4'
  }
}

// 预定义问题和回答（已禁用，直接使用n8n返回结果）
const predefinedQA = {}

// 初始化欢迎消息
onMounted(() => {
  messages.value.push({
    id: Date.now(),
    text: '您好！我是诗歌展示平台的AI助手，通过n8n工作流提供服务。请确保n8n工作流已激活（点击"Execute workflow"按钮）。请问有什么可以帮助您的？',
    isUser: false,
    timestamp: new Date()
  })
})

// 处理用户输入
const handleSendMessage = () => {
  const text = userInput.value.trim()
  if (!text) return

  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    text: text,
    isUser: true,
    timestamp: new Date()
  }
  messages.value.push(userMessage)
  userInput.value = ''
  
  // 生成AI回复
  generateAIResponse(text)
}

// 生成AI回复
const generateAIResponse = async (userText: string) => {
  isLoading.value = true
  
  try {
    let response = ''
    
    // 完全依赖n8n服务，跳过预定义回答
    response = await callAIAPI(userText)
    
    // 添加AI回复
    messages.value.push({
      id: Date.now() + 1,
      text: response,
      isUser: false,
      timestamp: new Date()
    })
    
  } catch (error) {
    console.error('AI回复生成失败:', error)
    
    // 错误处理 - 提供具体的n8n激活指导
    let errorMessage = '抱歉，AI服务暂时不可用。'
    
    if (error.message.includes('404') || error.message.includes('webhook')) {
      errorMessage = 'n8n工作流未激活。请在n8n界面点击"Execute workflow"按钮激活Webhook服务，然后重试。'
    } else if (error.message.includes('timeout')) {
      errorMessage = 'n8n服务响应超时(30秒)。建议：1.检查网络连接 2.稍后重试 3.联系管理员检查n8n服务状态'
      
      // 自动重试逻辑
      if (messages.value.length < 3) {
        setTimeout(() => {
          messages.value.push({
            id: Date.now() + 1,
            text: '正在自动重试连接n8n服务...',
            isUser: false,
            timestamp: new Date()
          })
          generateAIResponse(userText)
        }, 3000)
        return
      }
    } else {
      errorMessage = 'AI服务暂时不可用。请确保n8n工作流已正确配置并激活。'
    }
    
    messages.value.push({
      id: Date.now() + 1,
      text: errorMessage,
      isUser: false,
      timestamp: new Date()
    })
  } finally {
    isLoading.value = false
  }
}

// 调用AI API（完全依赖n8n服务）
const callAIAPI = async (userText: string): Promise<string> => {
  if (!n8nConfig.webhookUrl) {
    throw new Error('n8n服务未配置')
  }
  
  console.log('调用n8n工作流...')
  return await callN8nWorkflow(userText)
}

// 调用n8n工作流
const callN8nWorkflow = async (userText: string): Promise<string> => {
  const requestData = {
    message: userText,
    timestamp: new Date().toISOString(),
    sessionId: 'poetry-chat-' + Date.now(),
    apiEndpoints: n8nConfig.customApiEndpoints
  }
  
  // 打印请求信息到控制台
  console.log('📤 发送到n8n的请求:', {
    url: n8nConfig.webhookUrl,
    data: requestData,
    timestamp: new Date().toLocaleString()
  })
  
  const response = await axios.post(n8nConfig.webhookUrl, requestData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': n8nConfig.apiKey ? `Bearer ${n8nConfig.apiKey}` : ''
    },
    timeout: 30000
  })
  
  // 打印响应信息到控制台
  console.log('📥 n8n返回的响应:', {
    status: response.status,
    data: response.data,
    timestamp: new Date().toLocaleString()
  })
  
  // 处理n8n响应
  if (response.data) {
    // 优先提取output属性中的内容
    if (response.data.output) {
      const reply = typeof response.data.output === 'string' 
        ? response.data.output 
        : JSON.stringify(response.data.output)
      console.log('✅ n8n返回的output内容:', reply)
      return reply
    }
    // 如果n8n返回了具体的回复内容
    else if (response.data.response || response.data.message) {
      const reply = response.data.response || response.data.message
      console.log('✅ n8n返回的具体回复:', reply)
      return reply
    }
    // 如果n8n只返回了工作流启动消息，直接返回该消息
    else if (typeof response.data === 'string' && response.data.includes('Workflow was started')) {
      console.log('⚠️ n8n只返回工作流启动消息')
      return response.data
    }
    // 其他响应格式，直接返回原始数据
    else {
      console.log('❓ n8n返回未知格式响应，返回原始数据')
      return typeof response.data === 'string' ? response.data : JSON.stringify(response.data)
    }
  } else {
    console.log('❌ n8n响应为空')
    throw new Error('n8n响应为空')
  }
}

// 智能回复函数（已禁用，完全依赖n8n返回结果）
const getSmartReply = (userText: string): string => {
  throw new Error('智能回复功能已禁用，请确保n8n工作流返回有效回复')
}

// 快速提问
const quickQuestions = Object.keys(predefinedQA).slice(0, 4)

// 切换聊天窗口状态
const toggleChat = () => {
  isOpen.value = !isOpen.value
}

// 处理键盘事件
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleSendMessage()
  }
}

// 滚动到底部
const scrollToBottom = () => {
  const container = document.getElementById('chat-messages')
  if (container) {
    container.scrollTop = container.scrollHeight
  }
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<template>
  <div class="ai-chat-assistant">
    <!-- 悬浮按钮 -->
    <button 
      @click="toggleChat" 
      class="chat-toggle-btn"
      :class="{ open: isOpen }"
    >
      <span v-if="!isOpen">💬</span>
      <span v-else>✕</span>
    </button>

    <!-- 聊天窗口 -->
    <div v-if="isOpen" class="chat-window">
      <div class="chat-header">
        <h3>AI诗歌助手</h3>
        <button @click="toggleChat" class="close-btn">✕</button>
      </div>

      <div class="chat-messages" id="chat-messages">
        <div 
          v-for="message in messages" 
          :key="message.id"
          class="message"
          :class="{ user: message.isUser, ai: !message.isUser }"
        >
          <div class="message-content">
            <div class="message-text" v-if="message.isUser">{{ message.text }}</div>
            <div class="message-text markdown-content" v-else v-html="renderMarkdown(message.text)"></div>
            <div class="message-time">{{ formatTime(message.timestamp) }}</div>
          </div>
        </div>
        
        <div v-if="isLoading" class="loading-indicator">
          <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <!-- 快速问题 -->
      <div v-if="messages.length <= 2" class="quick-questions">
        <div class="quick-questions-label">快速提问：</div>
        <div class="quick-buttons">
          <button 
            v-for="question in quickQuestions" 
            :key="question"
            @click="userInput = question; handleSendMessage()"
            class="quick-btn"
          >
            {{ question }}
          </button>
        </div>
      </div>

      <div class="chat-input-area">
        <div class="input-container">
          <textarea
            v-model="userInput"
            @keydown="handleKeydown"
            placeholder="输入您的问题..."
            class="chat-input"
            rows="1"
          ></textarea>
          <button 
            @click="handleSendMessage" 
            :disabled="!userInput.trim() || isLoading"
            class="send-btn"
          >
            📤
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ai-chat-assistant {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.chat-toggle-btn.open {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
}

.chat-window {
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message {
  display: flex;
  max-width: 85%;
}

.message.user {
  align-self: flex-end;
}

.message.ai {
  align-self: flex-start;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  position: relative;
  margin: 0.5rem 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
  margin-left: 20%;
  position: relative;
}

.message.user .message-content::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-left-color: #667eea;
}

.message.ai .message-content {
  background: #f1f3f5;
  color: #333;
  border-bottom-left-radius: 4px;
  margin-right: 20%;
  position: relative;
}

.message.ai .message-content::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 10px;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-right-color: #f1f3f5;
}

.message-text {
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.message-text h3 {
  color: inherit;
  font-size: 1.1em;
  margin: 1em 0 0.5em;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  padding-bottom: 0.3em;
}

.message-text ul, .message-text ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.message-text li {
  margin: 0.3em 0;
}

.message-text code {
  background: rgba(0,0,0,0.05);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

/* Markdown内容样式 */
.markdown-content h1, .markdown-content h2, .markdown-content h3 {
  color: inherit;
  margin: 1em 0 0.5em;
  font-weight: 600;
}

.markdown-content h1 { font-size: 1.3em; }
.markdown-content h2 { font-size: 1.2em; }
.markdown-content h3 { font-size: 1.1em; }

.markdown-content ul, .markdown-content ol {
  padding-left: 1.5em;
  margin: 0.5em 0;
}

.markdown-content li {
  margin: 0.3em 0;
}

.markdown-content pre {
  background: rgba(0,0,0,0.05);
  padding: 0.8em;
  border-radius: 5px;
  overflow-x: auto;
  margin: 0.5em 0;
}

.markdown-content pre code {
  background: none;
  padding: 0;
}

.markdown-content a {
  color: #667eea;
  text-decoration: none;
}

.markdown-content a:hover {
  text-decoration: underline;
}

.markdown-content strong {
  font-weight: 600;
}

.markdown-content em {
  font-style: italic;
}

.message.user .message-text h3,
.message.user .message-text ul,
.message.user .message-text ol,
.message.user .message-text code {
  color: inherit;
}

.message-time {
  font-size: 0.65rem;
  opacity: 0.8;
  margin-top: 0.5rem;
  text-align: right;
  font-family: monospace;
}

.message.user .message-time {
  color: rgba(255,255,255,0.8);
}

.message.ai .message-time {
  color: rgba(0,0,0,0.6);
}

.loading-indicator {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.typing-dots {
  display: flex;
  gap: 0.25rem;
}

.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #667eea;
  animation: typing 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes typing {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.quick-questions {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
}

.quick-questions-label {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quick-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-btn {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.quick-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.chat-input-area {
  padding: 1rem;
  border-top: 1px solid #e9ecef;
}

.input-container {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.chat-input {
  flex: 1;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  resize: none;
  max-height: 100px;
  font-family: inherit;
}

.chat-input:focus {
  outline: none;
  border-color: #667eea;
}

.send-btn {
  background: #667eea;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 1.1rem;
}

.send-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.send-btn:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .ai-chat-assistant {
    bottom: 10px;
    right: 10px;
  }

  .chat-window {
    width: calc(100vw - 40px);
    height: 70vh;
    bottom: 70px;
    right: 10px;
  }

  .chat-toggle-btn {
    width: 50px;
    height: 50px;
    font-size: 1.2rem;
  }
}
</style>