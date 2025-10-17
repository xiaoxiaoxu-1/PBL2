# Poetry Display - 诗歌展示平台

## 项目概述

这是一个基于 Vue 3 + TypeScript + Vite 构建的现代化诗歌展示和创作平台。项目集成了用户认证、诗歌创作、浏览、搜索等功能，并使用 Supabase 作为后端数据库服务。此外，项目还包含了一个 AI 聊天助手功能，为用户提供诗歌相关的咨询和创作建议。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **UI/UX**: 响应式设计，支持移动端和桌面端
- **后端服务**: Supabase (数据库 + 认证)
- **代码规范**: ESLint + Prettier
- **部署平台**: Netlify

## 项目结构

```
Poetry Display/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   │   ├── AIChatAssistant.vue  # AI聊天助手组件
│   │   ├── NavBar.vue     # 导航栏组件
│   │   ├── PoetryCard.vue # 诗歌卡片组件
│   │   └── SearchBar.vue  # 搜索栏组件
│   ├── views/            # 页面组件
│   │   ├── Home.vue      # 首页
│   │   ├── PoetryList.vue # 诗歌列表页
│   │   ├── PoetryDetail.vue # 诗歌详情页
│   │   ├── CreatePoetry.vue # 诗歌创作页
│   │   ├── Login.vue     # 登录页面
│   │   ├── About.vue     # 关于页面
│   │   ├── Profile.vue   # 用户资料页面
│   │   └── NotFound.vue  # 404页面
│   ├── stores/           # 状态管理
│   │   ├── auth.ts       # 用户认证状态
│   │   └── poetry.ts     # 诗歌数据状态
│   ├── lib/              # 工具库
│   │   └── supabase.ts   # Supabase客户端配置
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── style.css         # 全局样式
├── supabase_migrations/  # 数据库迁移脚本
├── dist/                 # 构建输出目录
├── package.json          # 项目配置
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
├── netlify.toml          # Netlify部署配置
└── README.md            # 项目说明
```

## 核心功能

### 1. 用户认证系统
- 用户注册和登录（基于 Supabase Auth）
- 简化的注册流程（无需邮件验证）
- 用户状态持久化
- 用户资料管理

### 2. 诗歌管理
- 诗歌创作和发布
- 诗歌浏览和分类
- 关键词搜索功能
- 诗歌点赞和浏览统计
- 诗歌数据导入/导出

### 3. AI 聊天助手
- 悬浮式聊天窗口
- 快速问题按钮
- 实时对话交互
- 诗歌创作建议和咨询

### 4. 响应式设计
- 移动端优化
- 平板端适配
- 桌面端完整功能

## 环境配置

### 必需的环境变量

创建 `.env` 文件（基于 `.env.example`）：

```env
# Supabase配置
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# AI服务配置（可选）
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook/ai-chat
VITE_N8N_API_KEY=your_n8n_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_AI_SERVICE_URL=https://api.example.com/ai/chat
```

## 构建和运行

### 开发环境

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

开发服务器将在 http://localhost:3000 启动。

### 生产构建

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 代码检查和类型检查

```bash
# 代码规范检查
npm run lint

# TypeScript类型检查
npm run type-check
```

## 数据库设置

### Supabase 数据库迁移

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目
3. 进入 **SQL Editor**
4. 执行 `supabase_migrations/add_password_to_profiles.sql` 中的脚本
5. 验证迁移结果

### 数据库表结构

项目使用两个主要表：

1. **poetries** - 存储诗歌数据
   - id, title, content, author, category, tags
   - created_at, updated_at, likes, views, user_id

2. **profiles** - 存储用户资料
   - id, username, email, password_hash
   - avatar_url, created_at, updated_at

## 部署

### Netlify 部署

项目已配置 Netlify 部署：

1. 将代码推送到 Git 仓库
2. 在 Netlify 中连接仓库
3. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 设置环境变量
5. 部署完成

## 开发规范

### 组件开发
- 使用 PascalCase 命名组件
- 单文件组件 (.vue) 结构
- TypeScript 接口定义
- 使用 scoped CSS

### 状态管理
- 使用 Pinia 进行状态管理
- 分离业务逻辑和 UI 状态
- 响应式数据处理

### 代码风格
- 遵循 ESLint 和 Prettier 配置
- 使用 TypeScript 类型注解
- 组件和函数要有清晰的职责分离

## 常见问题

### 1. 用户注册问题
- 检查 Supabase 配置是否正确
- 确认数据库迁移已执行
- 查看控制台错误信息

### 2. AI 聊天助手不工作
- 检查 AI 服务环境变量
- 确认网络连接正常
- 验证 API 密钥有效性

### 3. 部署后路由 404
- 确认 netlify.toml 配置正确
- 检查 SPA 路由重定向规则

## 技术支持

如需技术支持，请参考：
- [Vue 3 官方文档](https://vuejs.org/)
- [Supabase 文档](https://supabase.com/docs)
- [Vite 文档](https://vitejs.dev/)
- [Netlify 文档](https://docs.netlify.com/)

## 项目特色

1. **现代化技术栈**: 使用最新的前端技术，提供优秀的开发体验
2. **类型安全**: 完整的 TypeScript 支持，减少运行时错误
3. **云端集成**: 使用 Supabase 提供后端服务，无需自建服务器
4. **AI 助手**: 集成 AI 聊天功能，提升用户体验
5. **响应式设计**: 适配各种设备，提供一致的用户体验
6. **简化部署**: 支持 Netlify 一键部署，简化发布流程

---

**Poetry Display** - 让诗歌创作和分享变得更加简单和美好 ❤️