# Netlify 部署指南

## 部署步骤

### 1. 准备部署文件
确保项目包含以下文件：
- `netlify.toml` - Netlify配置文件
- `package.json` - 项目依赖配置
- `dist/` - 构建输出目录（构建后生成）

### 2. 构建项目
```bash
cd "Poetry Display"
npm install
npm run build
```

### 3. 部署到 Netlify

#### 方法一：通过Git仓库部署（推荐）
1. 将代码推送到GitHub/GitLab
2. 登录 [Netlify](https://netlify.com)
3. 点击 "New site from Git"
4. 选择你的代码仓库
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 点击 "Deploy site"

#### 方法二：通过拖拽部署
1. 运行 `npm run build` 生成dist文件夹
2. 将整个dist文件夹拖拽到Netlify部署区域

### 4. 环境变量配置（如果需要）
如果项目需要环境变量，在Netlify的站点设置中添加：
- 进入 Site settings > Environment variables
- 添加必要的环境变量

### 5. 自定义域名（可选）
- 在 Domain management 中添加自定义域名
- 配置DNS记录指向Netlify

## 部署验证

部署完成后，访问生成的Netlify URL，检查功能是否正常：
- ✅ 首页加载正常
- ✅ 导航功能正常
- ✅ 诗歌展示正常
- ✅ AI聊天助手正常显示和交互
- ✅ 响应式设计正常

## 功能特性

### 已实现功能
1. **基本诗歌展示平台**
   - 诗歌列表浏览
   - 诗歌创作功能
   - 搜索功能
   - 用户认证系统

2. **AI聊天助手**
   - 悬浮式聊天窗口
   - 快速问题按钮
   - 实时对话交互
   - 响应式设计

3. **Netlify优化**
   - SPA路由配置
   - 构建优化配置
   - 环境变量支持

## 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本（需要14+）
   - 运行 `npm install` 重新安装依赖
   - 检查控制台错误信息

2. **路由404错误**
   - 确保netlify.toml中的重定向配置正确
   - 检查SPA路由配置

3. **静态资源加载失败**
   - 检查资源路径是否正确
   - 验证构建输出文件完整性

### 技术支持
如有部署问题，请参考：
- [Netlify官方文档](https://docs.netlify.com/)
- 项目README.md文件
- 控制台错误信息