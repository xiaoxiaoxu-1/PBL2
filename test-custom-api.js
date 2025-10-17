// 自定义API集成测试脚本
const axios = require('axios');
const apiConfig = require('./api-config');

console.log('🧪 开始测试自定义API集成...');

// 测试配置
const testConfig = {
  n8nWebhookUrl: apiConfig.getWebhookUrl(),
  testMessage: '你好，请帮我分析一下李白的诗歌特点',
  timeout: 10000
};

console.log('📋 测试配置:');
console.log('- Webhook URL:', testConfig.n8nWebhookUrl);
console.log('- 测试消息:', testConfig.testMessage);
console.log('- 超时设置:', testConfig.timeout + 'ms');
console.log('');

// 测试函数
async function testIntegration() {
  console.log('1. 测试n8n Webhook连接...');
  
  try {
    const requestData = {
      message: testConfig.testMessage,
      timestamp: new Date().toISOString(),
      sessionId: 'test-' + Date.now(),
      apiEndpoints: apiConfig.endpoints
    };

    console.log('📤 发送请求数据:', JSON.stringify(requestData, null, 2));
    
    const response = await axios.post(testConfig.n8nWebhookUrl, requestData, {
      headers: apiConfig.getHeaders(),
      timeout: testConfig.timeout
    });

    console.log('✅ n8n Webhook连接成功!');
    console.log('📥 响应状态:', response.status);
    console.log('📄 响应数据:', JSON.stringify(response.data, null, 2));
    
    // 分析响应
    analyzeResponse(response.data);
    
  } catch (error) {
    console.error('❌ 测试失败:');
    
    if (error.response) {
      console.log('- 状态码:', error.response.status);
      console.log('- 响应数据:', error.response.data);
    } else if (error.request) {
      console.log('- 网络错误:', error.message);
      console.log('- 请检查n8n服务是否运行');
    } else {
      console.log('- 错误信息:', error.message);
    }
    
    // 提供故障排除建议
    provideTroubleshootingTips(error);
  }
}

// 分析响应数据
function analyzeResponse(data) {
  console.log('\n🔍 响应分析:');
  
  if (data.response) {
    console.log('✅ AI回复内容:', data.response);
  } else {
    console.log('⚠️  未找到AI回复内容');
  }
  
  if (data.endpointsUsed) {
    console.log('✅ 使用的端点:', data.endpointsUsed);
  }
  
  if (data.timestamp) {
    console.log('✅ 时间戳:', data.timestamp);
  }
  
  if (data.sessionId) {
    console.log('✅ 会话ID:', data.sessionId);
  }
}

// 故障排除建议
function provideTroubleshootingTips(error) {
  console.log('\n🔧 故障排除建议:');
  
  if (error.code === 'ECONNREFUSED') {
    console.log('1. 检查n8n服务是否启动:');
    console.log('   - 运行: ./start-n8n.sh (Linux/Mac)');
    console.log('   - 或双击: start-n8n.bat (Windows)');
    console.log('   - 访问: http://localhost:5678 确认服务运行');
  }
  
  if (error.response && error.response.status === 401) {
    console.log('2. 检查API密钥配置:');
    console.log('   - 确认 .env 文件中的 VITE_N8N_API_KEY 已设置');
    console.log('   - 检查n8n中的基本认证配置');
  }
  
  if (error.response && error.response.status === 404) {
    console.log('3. 检查Webhook路径:');
    console.log('   - 确认n8n工作流中的Webhook路径为 /webhook/ai-chat');
    console.log('   - 在工作流设置中检查路径配置');
  }
  
  console.log('\n4. 其他检查项:');
  console.log('   - 确认网络连接正常');
  console.log('   - 检查防火墙设置');
  console.log('   - 查看n8n日志获取详细错误信息');
}

// 运行测试
testIntegration().catch(console.error);

// 添加其他测试用例
async function runAdditionalTests() {
  console.log('\n📋 运行额外测试用例...');
  
  const testCases = [
    '如何创作一首现代诗？',
    '请分析杜甫的诗歌风格',
    '什么是押韵？在诗歌中如何运用？',
    '帮我写一首关于春天的诗'
  ];
  
  for (const testCase of testCases) {
    console.log(`\n测试消息: "${testCase}"`);
    
    try {
      const response = await axios.post(testConfig.n8nWebhookUrl, {
        message: testCase,
        timestamp: new Date().toISOString(),
        sessionId: 'test-case-' + Date.now(),
        apiEndpoints: apiConfig.endpoints
      }, {
        headers: apiConfig.getHeaders(),
        timeout: 5000 // 快速测试
      });
      
      console.log('✅ 测试通过 - 响应长度:', response.data.response?.length || 0);
      
    } catch (error) {
      console.log('❌ 测试失败:', error.message);
    }
    
    // 短暂延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// 可选：运行额外测试
if (process.argv.includes('--full-test')) {
  runAdditionalTests().catch(console.error);
}

console.log('\n💡 使用提示:');
console.log('- 运行完整测试: node test-custom-api.js --full-test');
console.log('- 查看n8n日志: tail -f ~/.n8n/logs/n8n.log');
console.log('- 修改测试配置: 编辑 test-custom-api.js');