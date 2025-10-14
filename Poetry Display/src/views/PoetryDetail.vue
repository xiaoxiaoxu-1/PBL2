<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'

const route = useRoute()
const router = useRouter()
const poetryStore = usePoetryStore()

const poetryId = route.params.id as string
const poetry = computed(() => poetryStore.getPoetryById(poetryId))
const isLiked = ref(false)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 点赞处理
const handleLike = () => {
  if (poetry.value) {
    poetryStore.likePoetry(poetry.value.id)
    isLiked.value = !isLiked.value
  }
}

// 分享功能
const handleShare = () => {
  if (navigator.share && poetry.value) {
    navigator.share({
      title: poetry.value.title,
      text: `来自${poetry.value.author}的诗歌：${poetry.value.title}`,
      url: window.location.href
    })
  } else {
    // 复制链接到剪贴板
    navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  }
}

// 返回列表
const goBack = () => {
  router.back()
}

onMounted(() => {
  poetryStore.initSampleData()
  
  // 增加阅读量
  if (poetry.value) {
    poetryStore.incrementViews(poetry.value.id)
  }
  
  // 如果诗歌不存在，跳转到404页面
  if (!poetry.value) {
    router.push('/404')
  }
})
</script>

<template>
  <div class="poetry-detail" v-if="poetry">
    <div class="container">
      <!-- 返回按钮 -->
      <button @click="goBack" class="back-btn">
        ← 返回
      </button>

      <article class="poetry-article">
        <!-- 诗歌头部信息 -->
        <header class="poetry-header">
          <h1 class="poetry-title">{{ poetry.title }}</h1>
          <div class="poetry-meta">
            <div class="author-info">
              <span class="author-name">{{ poetry.author }}</span>
              <span class="publish-date">发布于 {{ formatDate(poetry.createdAt) }}</span>
            </div>
            <span class="poetry-category">{{ poetry.category }}</span>
          </div>
        </header>

        <!-- 诗歌标签 -->
        <div class="poetry-tags" v-if="poetry.tags.length > 0">
          <span 
            v-for="tag in poetry.tags" 
            :key="tag" 
            class="tag"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 诗歌内容 -->
        <div class="poetry-content">
          <pre class="content-text">{{ poetry.content }}</pre>
        </div>

        <!-- 统计信息 -->
        <div class="poetry-stats">
          <div class="stat-item">
            <span class="stat-icon">👁️</span>
            <span class="stat-label">阅读：</span>
            <span class="stat-value">{{ poetry.views }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">❤️</span>
            <span class="stat-label">点赞：</span>
            <span class="stat-value">{{ poetry.likes }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">📅</span>
            <span class="stat-label">创作：</span>
            <span class="stat-value">{{ formatDate(poetry.createdAt) }}</span>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="poetry-actions">
          <button 
            @click="handleLike"
            class="action-btn like-btn"
            :class="{ liked: isLiked }"
          >
            <span class="btn-icon">{{ isLiked ? '❤️' : '🤍' }}</span>
            <span class="btn-text">{{ isLiked ? '已赞' : '点赞' }}</span>
          </button>
          
          <button @click="handleShare" class="action-btn share-btn">
            <span class="btn-icon">📤</span>
            <span class="btn-text">分享</span>
          </button>
          
          <RouterLink to="/create" class="action-btn create-btn">
            <span class="btn-icon">✍️</span>
            <span class="btn-text">也来创作</span>
          </RouterLink>
        </div>
      </article>

      <!-- 相关推荐 -->
      <section class="related-section">
        <h2 class="section-title">相关推荐</h2>
        <div class="related-grid">
          <RouterLink
            v-for="relatedPoetry in poetryStore.filteredPoetries.filter(p => p.id !== poetry.id).slice(0, 3)"
            :key="relatedPoetry.id"
            :to="`/poetry/${relatedPoetry.id}`"
            class="related-item"
          >
            <h3 class="related-title">{{ relatedPoetry.title }}</h3>
            <p class="related-author">{{ relatedPoetry.author }}</p>
            <span class="related-category">{{ relatedPoetry.category }}</span>
          </RouterLink>
        </div>
      </section>
    </div>
  </div>

  <!-- 加载状态 -->
  <div v-else class="loading-state">
    <div class="container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-detail {
  padding: 2rem 0 4rem;
  min-height: 100vh;
}

.back-btn {
  background: none;
  border: none;
  color: var(--secondary-color);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  margin-bottom: 2rem;
  transition: var(--transition);
}

.back-btn:hover {
  color: var(--accent-color);
}

.poetry-article {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 3rem;
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.poetry-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.poetry-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  line-height: 1.2;
}

.poetry-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.author-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
}

.publish-date {
  font-size: 0.9rem;
  color: var(--text-light);
}

.poetry-category {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.poetry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.tag {
  background-color: var(--background-color);
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.poetry-content {
  margin-bottom: 2rem;
}

.content-text {
  font-family: 'Georgia', '宋体', serif;
  font-size: 1.2rem;
  line-height: 2;
  color: var(--text-color);
  white-space: pre-wrap;
  text-align: center;
  margin: 0;
  padding: 2rem 0;
}

.poetry-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-label {
  color: var(--text-light);
  font-weight: 500;
}

.stat-value {
  color: var(--primary-color);
  font-weight: 600;
}

.poetry-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: var(--card-background);
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.like-btn:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.like-btn.liked {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background-color: rgba(231, 76, 60, 0.1);
}

.share-btn:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.create-btn:hover {
  border-color: var(--secondary-color);
  color: var(--secondary-color);
}

.btn-icon {
  font-size: 1.1rem;
}

.related-section {
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  text-align: center;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.related-item {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: var(--transition);
  display: block;
}

.related-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.related-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.related-author {
  color: var(--text-light);
  margin-bottom: 0.75rem;
}

.related-category {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.loading-state {
  padding: 4rem 0;
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-content {
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--secondary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .poetry-article {
    padding: 2rem 1.5rem;
  }
  
  .poetry-title {
    font-size: 2rem;
  }
  
  .poetry-meta {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .author-info {
    text-align: center;
  }
  
  .content-text {
    font-size: 1.1rem;
    line-height: 1.8;
  }
  
  .poetry-stats {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .poetry-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>