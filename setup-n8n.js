// n8n安装和配置脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始配置n8n集成环境...');

// 检查是否已安装n8n
try {
  execSync('n8n --version', { stdio: 'ignore' });
  console.log('✅ n8n已安装');
} catch (error) {
  console.log('📦 正在安装n8n...');
  try {
    execSync('npm install -g n8n', { stdio: 'inherit' });
    console.log('✅ n8n安装完成');
  } catch (installError) {
    console.log('❌ n8n安装失败，请手动安装: npm install -g n8n');
    process.exit(1);
  }
}

// 创建n8n配置文件
const n8nConfig = {
  "database": {
    "type": "sqlite",
    "database": "./n8n-data/database.sqlite"
  },
  "executions": {
    "process": "main",
    "mode": "regular"
  },
  "generic": {
    "timezone": "Asia/Shanghai"
  },
  "security": {
    "basicAuth": {
      "active": true,
      "user": "admin",
      "password": "password123"
    }
  }
};

const configDir = './n8n-config';
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(
  path.join(configDir, 'config.json'),
  JSON.stringify(n8nConfig, null, 2)
);

console.log('✅ n8n配置文件已创建');

// 创建启动脚本
const startScript = `#!/bin/bash
echo "启动n8n服务..."
n8n start --config=./n8n-config/config.json
`;

fs.writeFileSync('./start-n8n.sh', startScript);
fs.chmodSync('./start-n8n.sh', '755');

const startScriptWin = `@echo off
echo 启动n8n服务...
n8n start --config=.\\n8n-config\\config.json
pause
`;

fs.writeFileSync('./start-n8n.bat', startScriptWin);

console.log('✅ 启动脚本已创建');

// 创建测试客户端
const testClient = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI助手n8n集成测试</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .test-container { max-width: 600px; margin: 0 auto; }
        .input-group { margin: 20px 0; }
        input, textarea { width: 100%; padding: 10px; margin: 5px 0; }
        button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
        .response { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="test-container">
        <h1>AI助手n8n集成测试</h1>
        
        <div class="input-group">
            <label>n8n Webhook URL:</label>
            <input type="text" id="webhookUrl" value="http://localhost:5678/webhook/ai-chat" placeholder="输入n8n webhook URL">
        </div>
        
        <div class="input-group">
            <label>测试消息:</label>
            <textarea id="message" rows="3" placeholder="输入测试消息">你好，请介绍一下诗歌创作</textarea>
        </div>
        
        <button onclick="testWebhook()">测试n8n连接</button>
        
        <div id="response" class="response" style="display: none;">
            <h3>响应结果:</h3>
            <pre id="responseContent"></pre>
        </div>
    </div>

    <script>
        async function testWebhook() {
            const webhookUrl = document.getElementById('webhookUrl').value;
            const message = document.getElementById('message').value;
            
            if (!webhookUrl || !message) {
                alert('请填写Webhook URL和测试消息');
                return;
            }
            
            try {
                const response = await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        message: message,
                        timestamp: new Date().toISOString(),
                        sessionId: 'test-' + Date.now()
                    })
                });
                
                const data = await response.json();
                
                document.getElementById('responseContent').textContent = JSON.stringify(data, null, 2);
                document.getElementById('response').style.display = 'block';
                
            } catch (error) {
                document.getElementById('responseContent').textContent = '错误: ' + error.message;
                document.getElementById('response').style.display = 'block';
            }
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('./test-n8n.html', testClient);

console.log('✅ 测试客户端已创建');

console.log(`
🎉 n8n集成环境配置完成！

下一步操作:
1. 启动n8n服务:
   - Windows: 双击 start-n8n.bat
   - Linux/Mac: ./start-n8n.sh

2. 访问n8n管理界面:
   - 地址: http://localhost:5678
   - 用户名: admin
   - 密码: password123

3. 导入工作流:
   - 在n8n界面导入 n8n-workflow-ai-chat.json

4. 测试集成:
   - 打开 test-n8n.html 文件测试连接

5. 配置前端环境变量:
   - 复制 Poetry Display/.env.example 为 .env
   - 修改为实际的n8n URL和密钥

📚 详细指南请参考 n8n-integration-guide.md
`);