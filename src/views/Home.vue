<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import PoetryCard from '@/components/PoetryCard.vue'

const poetryStore = usePoetryStore()

onMounted(() => {
  poetryStore.initSampleData()
})

// 获取最新的3首诗歌
const latestPoetries = poetryStore.filteredPoetries.slice(0, 3)
</script>

<template>
  <div class="home">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content fade-in">
          <h1 class="hero-title">Poetry Display</h1>
          <h2 class="hero-subtitle">诗歌展示平台</h2>
          <p class="hero-description">
            在这里，文字化作诗意，情感汇成韵律。<br>
            发现美好，分享创作，让诗歌点亮生活的每一个角落。
          </p>
          <div class="hero-actions">
            <RouterLink to="/poetry" class="btn btn-primary">
              浏览诗歌
            </RouterLink>
            <RouterLink to="/create" class="btn btn-outline">
              开始创作
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计信息 -->
    <section class="stats">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item fade-in">
            <div class="stat-number">{{ poetryStore.totalPoetries }}</div>
            <div class="stat-label">诗歌作品</div>
          </div>
          <div class="stat-item fade-in">
            <div class="stat-number">{{ poetryStore.categories.size }}</div>
            <div class="stat-label">诗歌分类</div>
          </div>
          <div class="stat-item fade-in">
            <div class="stat-number">{{ Math.floor(Math.random() * 50) + 20 }}</div>
            <div class="stat-label">活跃作者</div>
          </div>
          <div class="stat-item fade-in">
            <div class="stat-number">{{ Math.floor(Math.random() * 1000) + 500 }}</div>
            <div class="stat-label">累计阅读</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 最新诗歌 -->
    <section class="latest-poetry">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">最新诗歌</h2>
          <RouterLink to="/poetry" class="section-link">
            查看全部 →
          </RouterLink>
        </div>
        <div class="poetry-grid" v-if="latestPoetries.length > 0">
          <PoetryCard 
            v-for="poetry in latestPoetries" 
            :key="poetry.id" 
            :poetry="poetry"
            class="fade-in"
          />
        </div>
        <div v-else class="empty-state">
          <p>暂无诗歌作品，快来创作第一首诗吧！</p>
          <RouterLink to="/create" class="btn btn-primary">
            开始创作
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 功能介绍 -->
    <section class="features">
      <div class="container">
        <h2 class="section-title">平台特色</h2>
        <div class="features-grid">
          <div class="feature-item fade-in">
            <div class="feature-icon">📝</div>
            <h3 class="feature-title">自由创作</h3>
            <p class="feature-description">
              提供简洁优雅的创作界面，支持多种诗歌格式，让创作变得更加轻松愉快。
            </p>
          </div>
          <div class="feature-item fade-in">
            <div class="feature-icon">🎨</div>
            <h3 class="feature-title">精美展示</h3>
            <p class="feature-description">
              采用现代化设计理念，为每首诗歌提供优雅的展示效果，让文字更具魅力。
            </p>
          </div>
          <div class="feature-item fade-in">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">智能搜索</h3>
            <p class="feature-description">
              支持按标题、内容、作者、标签等多维度搜索，快速找到心仪的诗歌作品。
            </p>
          </div>
          <div class="feature-item fade-in">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">响应式设计</h3>
            <p class="feature-description">
              完美适配各种设备屏幕，无论是电脑、平板还是手机，都能获得最佳体验。
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

/* 英雄区域 */
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6rem 0 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
  opacity: 0.85;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: var(--secondary-color);
  color: white;
  border: 2px solid var(--secondary-color);
}

.btn-primary:hover {
  background-color: transparent;
  color: var(--secondary-color);
  border-color: var(--secondary-color);
}

/* 统计信息 */
.stats {
  padding: 4rem 0;
  background-color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  text-align: center;
}

.stat-item {
  padding: 1.5rem;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 1rem;
  color: var(--text-light);
  font-weight: 500;
}

/* 最新诗歌 */
.latest-poetry {
  padding: 4rem 0;
  background-color: var(--background-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
}

.section-link {
  color: var(--secondary-color);
  font-weight: 500;
  transition: var(--transition);
}

.section-link:hover {
  color: var(--accent-color);
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

/* 功能介绍 */
.features {
  padding: 4rem 0;
  background-color: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-item {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
}

.feature-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-light);
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero {
    padding: 4rem 0 3rem;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .stats {
    padding: 3rem 0;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .section-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>