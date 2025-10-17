// AI助手与n8n集成部署脚本
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 AI助手与n8n集成部署开始...');
console.log('='.repeat(60));

// 部署状态跟踪
const deploymentStatus = {
  n8n: false,
  frontend: false,
  testing: false,
  documentation: false
};

// 检查Node.js版本
function checkNodeVersion() {
  try {
    const version = process.version;
    console.log(`✅ Node.js版本: ${version}`);
    return true;
  } catch (error) {
    console.log('❌ Node.js检查失败');
    return false;
  }
}

// 部署n8n环境
function deployN8n() {
  console.log('\n📦 步骤1: 部署n8n环境');
  
  try {
    // 运行n8n配置脚本
    console.log('正在配置n8n环境...');
    execSync('node setup-n8n.js', { stdio: 'inherit' });
    
    // 检查n8n安装
    try {
      execSync('n8n --version', { stdio: 'ignore' });
      console.log('✅ n8n安装验证通过');
    } catch {
      console.log('⚠️  n8n未全局安装，尝试本地安装...');
      execSync('npm install -g n8n', { stdio: 'inherit' });
    }
    
    deploymentStatus.n8n = true;
    console.log('✅ n8n环境部署完成');
    
  } catch (error) {
    console.log('❌ n8n部署失败:', error.message);
  }
}

// 配置前端环境
function setupFrontend() {
  console.log('\n🎨 步骤2: 配置前端环境');
  
  try {
    const frontendDir = 'Poetry Display';
    
    // 检查前端目录
    if (!fs.existsSync(frontendDir)) {
      console.log('❌ 前端目录不存在');
      return;
    }
    
    // 安装依赖
    console.log('正在安装前端依赖...');
    execSync(`cd "${frontendDir}" && npm install`, { stdio: 'inherit' });
    
    // 创建环境配置文件
    const envExample = path.join(frontendDir, '.env.example');
    const envFile = path.join(frontendDir, '.env');
    
    if (fs.existsSync(envExample) && !fs.existsSync(envFile)) {
      fs.copyFileSync(envExample, envFile);
      console.log('✅ 环境配置文件已创建');
    }
    
    deploymentStatus.frontend = true;
    console.log('✅ 前端环境配置完成');
    
  } catch (error) {
    console.log('❌ 前端配置失败:', error.message);
  }
}

// 启动服务
function startServices() {
  console.log('\n⚡ 步骤3: 启动服务');
  
  // 启动n8n（后台进程）
  try {
    console.log('启动n8n服务...');
    
    // 创建启动脚本
    const startScript = `
      echo "启动n8n服务..."
      n8n start --config=./n8n-config/config.json
    `;
    
    fs.writeFileSync('start-services.sh', startScript);
    fs.chmodSync('start-services.sh', '755');
    
    console.log('✅ 服务启动脚本已创建');
    console.log('💡 提示: 运行 ./start-services.sh 启动所有服务');
    
  } catch (error) {
    console.log('❌ 服务启动配置失败:', error.message);
  }
}

// 运行测试
function runTests() {
  console.log('\n🧪 步骤4: 运行集成测试');
  
  try {
    console.log('运行基础连接测试...');
    execSync('node test-custom-api.js', { stdio: 'inherit' });
    
    deploymentStatus.testing = true;
    console.log('✅ 基础测试完成');
    
  } catch (error) {
    console.log('❌ 测试运行失败:', error.message);
  }
}

// 生成部署报告
function generateDeploymentReport() {
  console.log('\n📊 部署报告');
  console.log('='.repeat(40));
  
  const totalSteps = Object.keys(deploymentStatus).length;
  const completedSteps = Object.values(deploymentStatus).filter(Boolean).length;
  
  console.log(`完成进度: ${completedSteps}/${totalSteps} 步骤`);
  
  Object.entries(deploymentStatus).forEach(([step, status]) => {
    const icon = status ? '✅' : '❌';
    console.log(`${icon} ${step}: ${status ? '完成' : '未完成'}`);
  });
  
  console.log('\n🎯 下一步操作:');
  
  if (deploymentStatus.n8n) {
    console.log('1. 启动n8n服务: ./start-services.sh');
    console.log('2. 访问n8n管理界面: http://localhost:5678');
    console.log('3. 导入工作流文件: n8n-workflow-ai-chat.json');
  }
  
  if (deploymentStatus.frontend) {
    console.log('4. 配置前端环境变量: 编辑 Poetry Display/.env');
    console.log('5. 启动前端应用: cd "Poetry Display" && npm run dev');
  }
  
  if (deploymentStatus.testing) {
    console.log('6. 运行完整测试: node test-custom-api.js --full-test');
  }
  
  console.log('\n📚 文档参考:');
  console.log('- 集成指南: n8n-integration-guide.md');
  console.log('- API配置: custom-api-integration.md');
  console.log('- 故障排除: README-n8n-integration.md');
}

// 主部署流程
async function main() {
  console.log('🔍 检查系统环境...');
  
  if (!checkNodeVersion()) {
    console.log('❌ 系统环境检查失败，请安装Node.js');
    return;
  }
  
  // 执行部署步骤
  deployN8n();
  setupFrontend();
  startServices();
  runTests();
  
  // 生成报告
  generateDeploymentReport();
  
  console.log('\n🎉 部署流程完成!');
  console.log('💡 提示: 请按照上述"下一步操作"完成剩余配置');
}

// 运行部署
main().catch(console.error);

// 导出函数供其他脚本使用
module.exports = {
  checkNodeVersion,
  deployN8n,
  setupFrontend,
  startServices,
  runTests,
  generateDeploymentReport
};