<script setup lang="ts">

const features = [
  {
    icon: '📝',
    title: '自由创作',
    description: '提供简洁优雅的创作界面，支持多种诗歌格式，让创作变得轻松愉快。'
  },
  {
    icon: '🎨',
    title: '精美展示',
    description: '采用现代化设计理念，为每首诗歌提供优雅的展示效果，让文字更具魅力。'
  },
  {
    icon: '🔍',
    title: '智能搜索',
    description: '支持按标题、内容、作者、标签等多维度搜索，快速找到心仪的诗歌作品。'
  },
  {
    icon: '📱',
    title: '响应式设计',
    description: '完美适配各种设备屏幕，无论是电脑、平板还是手机，都能获得最佳体验。'
  }
]

const team = [
  {
    name: 'Vue.js',
    role: '前端框架',
    description: '提供响应式数据绑定和组件化开发能力'
  },
  {
    name: 'TypeScript',
    role: '类型系统',
    description: '提供类型检查，提高代码质量和开发效率'
  },
  {
    name: 'Pinia',
    role: '状态管理',
    description: '轻量级状态管理库，简化数据流管理'
  },
  {
    name: 'Vue Router',
    role: '路由管理',
    description: '实现单页应用的页面导航和路由控制'
  }
]

const stats = [
  { value: '100+', label: '诗歌作品' },
  { value: '8+', label: '诗歌分类' },
  { value: '50+', label: '活跃作者' },
  { value: '1000+', label: '累计阅读' }
]
</script>

<template>
  <div class="about">
    <div class="container">
      <!-- 英雄区域 -->
      <section class="hero">
        <h1 class="hero-title">关于 Poetry Display</h1>
        <p class="hero-subtitle">一个优雅的诗歌展示和创作平台</p>
        <div class="hero-description">
          <p>
            Poetry Display 致力于为诗歌爱好者提供一个美好的创作和分享空间。
            我们相信，每个人心中都有诗意，每一份情感都值得被记录和传承。
          </p>
          <p>
            通过现代化的技术和优雅的设计，我们希望让诗歌离每个人更近，
            让创作变得更加简单，让美好的文字能够触动更多的心灵。
          </p>
        </div>
      </section>

      <!-- 统计数据 -->
      <section class="stats-section">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-card fade-in">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- 平台特色 -->
      <section class="features-section">
        <h2 class="section-title">平台特色</h2>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card fade-in">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </div>
        </div>
      </section>

      <!-- 技术栈 -->
      <section class="tech-section">
        <h2 class="section-title">技术栈</h2>
        <div class="tech-grid">
          <div v-for="tech in team" :key="tech.name" class="tech-card fade-in">
            <h3 class="tech-name">{{ tech.name }}</h3>
            <div class="tech-role">{{ tech.role }}</div>
            <p class="tech-description">{{ tech.description }}</p>
          </div>
        </div>
      </section>

      <!-- 使命愿景 -->
      <section class="mission-section">
        <div class="mission-content">
          <div class="mission-item fade-in">
            <h3 class="mission-title">我们的使命</h3>
            <p class="mission-text">
              让每个人都能轻松地创作、分享和欣赏诗歌，用技术的力量连接诗意的心灵，
              为文学创作提供更好的平台和工具。
            </p>
          </div>
          <div class="mission-item fade-in">
            <h3 class="mission-title">我们的愿景</h3>
            <p class="mission-text">
              成为最受欢迎的诗歌创作和分享平台，让诗歌文化在数字时代焕发新的生机，
              让更多人感受到文字的美好和力量。
            </p>
          </div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="contact-section">
        <h2 class="section-title">联系我们</h2>
        <div class="contact-content">
          <p class="contact-text">
            如果您有任何建议、意见或合作意向，欢迎随时与我们联系。
            我们期待与每一位诗歌爱好者共同创造更美好的诗歌世界。
          </p>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">邮箱：</span>
              <span class="contact-value">poetry@display.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">微信：</span>
              <span class="contact-value">PoetryDisplay</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.about { padding: 2rem 0 4rem; min-height: 100vh; }
.hero { text-align: center; padding: 4rem 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: var(--border-radius); margin-bottom: 4rem; }
.hero-title { font-size: 3rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem; }
.hero-subtitle { font-size: 1.5rem; color: var(--text-light); margin-bottom: 2rem; font-weight: 300; }
.hero-description { max-width: 800px; margin: 0 auto; font-size: 1.1rem; line-height: 1.8; color: var(--text-color); }
.hero-description p { margin-bottom: 1rem; }
.stats-section { margin-bottom: 4rem; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; }
.stat-card { text-align: center; background-color: var(--card-background); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow); transition: var(--transition); }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
.stat-value { font-size: 2.5rem; font-weight: 700; color: var(--secondary-color); margin-bottom: 0.5rem; }
.stat-label { font-size: 1rem; color: var(--text-light); font-weight: 500; }
.features-section, .tech-section { margin-bottom: 4rem; }
.section-title { font-size: 2rem; font-weight: 600; color: var(--primary-color); text-align: center; margin-bottom: 3rem; }
.features-grid, .tech-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.feature-card, .tech-card { background-color: var(--card-background); padding: 2rem; border-radius: var(--border-radius); box-shadow: var(--shadow); text-align: center; transition: var(--transition); }
.feature-card:hover, .tech-card:hover { transform: translateY(-4px); box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); }
.feature-icon { font-size: 3rem; margin-bottom: 1rem; }
.feature-title, .tech-name { font-size: 1.25rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1rem; }
.tech-role { background-color: var(--secondary-color); color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; display: inline-block; margin-bottom: 1rem; }
.feature-description, .tech-description { color: var(--text-light); line-height: 1.6; }
.mission-section { margin-bottom: 4rem; background-color: var(--background-color); padding: 4rem 2rem; border-radius: var(--border-radius); }
.mission-content { max-width: 800px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3rem; }
.mission-title { font-size: 1.5rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1rem; }
.mission-text { color: var(--text-color); line-height: 1.8; font-size: 1.1rem; }
.contact-section { text-align: center; }
.contact-content { max-width: 600px; margin: 0 auto; }
.contact-text { font-size: 1.1rem; color: var(--text-color); line-height: 1.7; margin-bottom: 2rem; }
.contact-info { display: flex; justify-content: center; gap: 3rem; flex-wrap: wrap; }
.contact-item { display: flex; align-items: center; gap: 0.5rem; }
.contact-label { font-weight: 600; color: var(--primary-color); }
.contact-value { color: var(--secondary-color); font-weight: 500; }
@media (max-width: 768px) {
  .hero-title { font-size: 2.5rem; }
  .hero-subtitle { font-size: 1.25rem; }
  .hero-description { font-size: 1rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .features-grid, .tech-grid { grid-template-columns: 1fr; }
  .mission-content { grid-template-columns: 1fr; gap: 2rem; }
  .contact-info { flex-direction: column; gap: 1rem; }
}
</style>