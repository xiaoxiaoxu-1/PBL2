// 测试远程n8n Webhook服务
const axios = require('axios');

const n8nUrl = 'https://n8n-hiriavsw.ap-northeast-1.clawcloudrun.com/webhook-test/bb172159-c181-4ac7-b813-f5bd644eb5a0';

async function testN8nConnection() {
  console.log('🧪 测试远程n8n Webhook服务...');
  console.log('📡 目标URL:', n8nUrl);
  console.log('');
  
  const testMessages = [
    '你好，请介绍一下诗歌创作',
    '李白是谁？',
    '如何写一首现代诗？',
    '什么是押韵？'
  ];
  
  for (const message of testMessages) {
    console.log(`📤 发送消息: "${message}"`);
    
    try {
      const response = await axios.post(n8nUrl, {
        message: message,
        timestamp: new Date().toISOString(),
        sessionId: 'test-' + Date.now()
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });
      
      console.log('✅ 连接成功！');
      console.log('📥 响应状态:', response.status);
      console.log('📄 响应数据:', JSON.stringify(response.data, null, 2));
      console.log('');
      
    } catch (error) {
      console.log('❌ 连接失败:');
      
      if (error.response) {
        console.log('- 状态码:', error.response.status);
        console.log('- 错误信息:', error.response.data);
      } else if (error.request) {
        console.log('- 网络错误:', error.message);
        console.log('- 请检查网络连接和URL是否正确');
      } else {
        console.log('- 错误信息:', error.message);
      }
      console.log('');
    }
    
    // 短暂延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testN8nConnection().catch(console.error);