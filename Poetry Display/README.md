# Poetry Display - 诗歌展示平台

一个基于 Vue 3 + TypeScript + Vite 构建的现代化诗歌展示和创作平台。

## 🌟 项目特色

- **现代化技术栈**: 使用 Vue 3 Composition API、TypeScript、Vite 等最新技术
- **优雅的设计**: 响应式设计，完美适配各种设备
- **丰富的功能**: 诗歌创作、浏览、搜索、分类等完整功能
- **类型安全**: 完整的 TypeScript 支持，提供更好的开发体验
- **状态管理**: 使用 Pinia 进行轻量级状态管理

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
# 启动开发服务器
npm run dev

# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
# 构建项目
npm run build

# 或
yarn build
```

### 预览生产版本

```bash
# 预览构建结果
npm run preview

# 或
yarn preview
```

## 📁 项目结构

```
Poetry Display/
├── public/                 # 静态资源
├── src/                   # 源代码
│   ├── components/        # 可复用组件
│   │   ├── NavBar.vue    # 导航栏组件
│   │   ├── PoetryCard.vue # 诗歌卡片组件
│   │   └── SearchBar.vue  # 搜索栏组件
│   ├── views/            # 页面组件
│   │   ├── Home.vue      # 首页
│   │   ├── PoetryList.vue # 诗歌列表页
│   │   ├── PoetryDetail.vue # 诗歌详情页
│   │   ├── CreatePoetry.vue # 诗歌创作页
│   │   ├── About.vue     # 关于页面
│   │   └── NotFound.vue  # 404页面
│   ├── stores/           # 状态管理
│   │   └── poetry.ts     # 诗歌相关状态
│   ├── router/           # 路由配置
│   │   └── index.ts      # 路由定义
│   ├── App.vue           # 根组件
│   ├── main.ts           # 应用入口
│   └── style.css         # 全局样式
├── package.json          # 项目配置
├── vite.config.ts        # Vite配置
├── tsconfig.json         # TypeScript配置
└── README.md            # 项目说明
```

## 🎯 主要功能

### 1. 诗歌浏览
- 诗歌列表展示
- 分类筛选
- 关键词搜索
- 排序功能（最新、最热等）

### 2. 诗歌创作
- 富文本编辑器
- 分类选择
- 标签管理
- 草稿保存

### 3. 诗歌详情
- 优雅的诗歌展示
- 点赞和分享功能
- 阅读统计
- 相关推荐

### 4. 用户体验
- 响应式设计
- 暗色模式支持
- 搜索建议
- 加载动画

## 🛠️ 技术栈

- **前端框架**: Vue 3
- **开发语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由管理**: Vue Router 4
- **样式方案**: CSS Variables + Scoped CSS
- **代码规范**: ESLint + Prettier

## 📱 响应式设计

项目采用移动优先的响应式设计策略：

- **桌面端** (>= 1024px): 完整功能展示
- **平板端** (768px - 1023px): 适配中等屏幕
- **移动端** (< 768px): 优化触摸操作

## 🎨 设计系统

### 颜色方案
- 主色调: #2c3e50 (深蓝灰)
- 辅助色: #3498db (蓝色)
- 强调色: #e74c3c (红色)
- 背景色: #f8f9fa (浅灰)

### 字体系统
- 英文字体: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- 中文字体: 系统默认中文字体
- 代码字体: Monaco, Consolas, monospace

## 🔧 开发指南

### 组件开发规范

1. **组件命名**: 使用 PascalCase
2. **文件结构**: 单文件组件 (.vue)
3. **类型定义**: 使用 TypeScript 接口
4. **样式作用域**: 使用 scoped CSS

### 状态管理

使用 Pinia 进行状态管理：

```typescript
// 定义 store
export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poetries = ref<Poetry[]>([])
  
  // 计算属性
  const filteredPoetries = computed(() => {
    // 过滤逻辑
  })
  
  // 方法
  const addPoetry = (poetry: Poetry) => {
    // 添加逻辑
  }
  
  return {
    poetries,
    filteredPoetries,
    addPoetry
  }
})
```

### 路由配置

```typescript
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/poetry/:id',
    name: 'PoetryDetail',
    component: () => import('@/views/PoetryDetail.vue')
  }
]
```

## 🚀 部署

### 静态部署

构建后的文件可以部署到任何静态文件服务器：

```bash
npm run build
# 将 dist 目录部署到服务器
```

### 推荐部署平台

- Vercel
- Netlify
- GitHub Pages
- 阿里云OSS
- 腾讯云COS

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 基础的诗歌展示和创作功能
- 响应式设计支持
- TypeScript 完整支持

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 👥 团队

- **开发者**: Vue.js 开发团队
- **设计**: 现代化UI/UX设计
- **技术栈**: Vue 3 + TypeScript + Vite

## 📞 联系我们

- 邮箱: poetry@display.com
- 微信: PoetryDisplay
- GitHub: [Poetry Display](https://github.com/poetry-display)

---

**Poetry Display** - 让诗歌触动每一颗心灵 ❤️