<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import type { Poetry } from '@/stores/poetry'
import { usePoetryStore } from '@/stores/poetry'

interface Props {
  poetry: Poetry
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true
})

const poetryStore = usePoetryStore()

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// 截取内容预览
const contentPreview = computed(() => {
  const maxLength = 100
  if (props.poetry.content.length <= maxLength) {
    return props.poetry.content
  }
  return props.poetry.content.substring(0, maxLength) + '...'
})

// 点赞处理
const handleLike = (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  poetryStore.likePoetry(props.poetry.id)
}
</script>

<template>
  <div class="poetry-card">
    <RouterLink :to="`/poetry/${poetry.id}`" class="card-link">
      <!-- 卡片头部 -->
      <div class="card-header">
        <h3 class="poetry-title">{{ poetry.title }}</h3>
        <span class="poetry-category">{{ poetry.category }}</span>
      </div>

      <!-- 诗歌内容预览 -->
      <div class="poetry-content">
        <p class="content-preview">{{ contentPreview }}</p>
      </div>

      <!-- 标签 -->
      <div class="poetry-tags" v-if="poetry.tags.length > 0">
        <span 
          v-for="tag in poetry.tags" 
          :key="tag" 
          class="tag"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 卡片底部 -->
      <div class="card-footer">
        <div class="author-info">
          <span class="author-name">{{ poetry.author }}</span>
          <span class="publish-date">{{ formatDate(poetry.createdAt) }}</span>
        </div>
        
        <div class="poetry-stats" v-if="showActions">
          <button 
            class="stat-item like-btn" 
            @click="handleLike"
            :class="{ liked: false }"
            title="点赞"
          >
            <span class="stat-icon">❤️</span>
            <span class="stat-count">{{ poetry.likes }}</span>
          </button>
          <div class="stat-item" title="阅读量">
            <span class="stat-icon">👁️</span>
            <span class="stat-count">{{ poetry.views }}</span>
          </div>
        </div>
      </div>
    </RouterLink>
  </div>
</template>

<style scoped>
.poetry-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  transition: var(--transition);
  height: 100%;
}

.poetry-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-link {
  display: block;
  padding: 1.5rem;
  color: inherit;
  text-decoration: none;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.poetry-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
  margin: 0;
  line-height: 1.3;
  flex: 1;
}

.poetry-category {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
}

.poetry-content {
  flex: 1;
  margin-bottom: 1rem;
}

.content-preview {
  color: var(--text-color);
  line-height: 1.6;
  white-space: pre-line;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}

.poetry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag {
  background-color: var(--background-color);
  color: var(--text-light);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 500;
  color: var(--primary-color);
  font-size: 0.9rem;
}

.publish-date {
  font-size: 0.8rem;
  color: var(--text-light);
}

.poetry-stats {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: var(--text-light);
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: var(--transition);
}

.like-btn:hover {
  background-color: rgba(231, 76, 60, 0.1);
  color: var(--accent-color);
}

.like-btn.liked {
  color: var(--accent-color);
}

.stat-icon {
  font-size: 0.9rem;
}

.stat-count {
  font-weight: 500;
  min-width: 1rem;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .card-link {
    padding: 1rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .poetry-category {
    align-self: flex-start;
  }
  
  .card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .poetry-stats {
    align-self: flex-end;
  }
}
</style>