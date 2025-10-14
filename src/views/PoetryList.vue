<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { usePoetryStore, POETRY_CATEGORIES } from '@/stores/poetry'
import PoetryCard from '@/components/PoetryCard.vue'
import SearchBar from '@/components/SearchBar.vue'

const poetryStore = usePoetryStore()

// 排序选项
const sortOptions = [
  { value: 'latest', label: '最新发布' },
  { value: 'oldest', label: '最早发布' },
  { value: 'mostLiked', label: '最多点赞' },
  { value: 'mostViewed', label: '最多阅读' }
]

const currentSort = ref('latest')

// 排序后的诗歌列表
const sortedPoetries = computed(() => {
  const poetries = [...poetryStore.filteredPoetries]
  
  switch (currentSort.value) {
    case 'latest':
      return poetries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    case 'oldest':
      return poetries.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    case 'mostLiked':
      return poetries.sort((a, b) => b.likes - a.likes)
    case 'mostViewed':
      return poetries.sort((a, b) => b.views - a.views)
    default:
      return poetries
  }
})

onMounted(() => {
  poetryStore.initSampleData()
})
</script>

<template>
  <div class="poetry-list">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h1 class="page-title">诗歌列表</h1>
        <p class="page-description">
          探索美好的诗歌世界，发现每一份独特的情感表达
        </p>
      </div>

      <!-- 搜索和筛选 -->
      <div class="filters-section">
        <SearchBar />
        
        <div class="filter-controls">
          <!-- 分类筛选 -->
          <div class="filter-group">
            <label class="filter-label">分类：</label>
            <select 
              v-model="poetryStore.selectedCategory" 
              class="filter-select"
            >
              <option value="">全部分类</option>
              <option 
                v-for="category in POETRY_CATEGORIES" 
                :key="category" 
                :value="category"
              >
                {{ category }} ({{ poetryStore.categories.get(category) || 0 }})
              </option>
            </select>
          </div>

          <!-- 排序选择 -->
          <div class="filter-group">
            <label class="filter-label">排序：</label>
            <select v-model="currentSort" class="filter-select">
              <option 
                v-for="option in sortOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>

          <!-- 清除筛选 -->
          <button 
            v-if="poetryStore.searchQuery || poetryStore.selectedCategory"
            @click="poetryStore.clearFilters"
            class="clear-filters-btn"
          >
            清除筛选
          </button>
        </div>
      </div>

      <!-- 结果统计 -->
      <div class="results-info">
        <span class="results-count">
          找到 {{ sortedPoetries.length }} 首诗歌
        </span>
        <span v-if="poetryStore.searchQuery" class="search-query">
          关键词："{{ poetryStore.searchQuery }}"
        </span>
        <span v-if="poetryStore.selectedCategory" class="selected-category">
          分类：{{ poetryStore.selectedCategory }}
        </span>
      </div>

      <!-- 诗歌列表 -->
      <div class="poetry-grid" v-if="sortedPoetries.length > 0">
        <PoetryCard 
          v-for="poetry in sortedPoetries" 
          :key="poetry.id" 
          :poetry="poetry"
          class="fade-in"
        />
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3 class="empty-title">未找到相关诗歌</h3>
        <p class="empty-description">
          <span v-if="poetryStore.searchQuery || poetryStore.selectedCategory">
            尝试调整搜索条件或筛选选项，或者
          </span>
          <RouterLink to="/create" class="create-link">创作一首新诗歌</RouterLink>
        </p>
        <button 
          v-if="poetryStore.searchQuery || poetryStore.selectedCategory"
          @click="poetryStore.clearFilters"
          class="btn btn-outline"
        >
          清除所有筛选
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.poetry-list {
  padding: 2rem 0 4rem;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.page-description {
  font-size: 1.1rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.filters-section {
  background-color: var(--card-background);
  padding: 2rem;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
}

.filter-controls {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background-color: white;
  color: var(--text-color);
  font-size: 0.9rem;
  min-width: 150px;
  transition: var(--transition);
}

.filter-select:focus {
  outline: none;
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.clear-filters-btn {
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.clear-filters-btn:hover {
  background-color: #c0392b;
}

.results-info {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: var(--background-color);
  border-radius: var(--border-radius);
}

.results-count {
  font-weight: 600;
  color: var(--primary-color);
}

.search-query,
.selected-category {
  background-color: var(--secondary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.empty-description {
  font-size: 1rem;
  color: var(--text-light);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.create-link {
  color: var(--secondary-color);
  font-weight: 500;
  text-decoration: underline;
}

.create-link:hover {
  color: var(--accent-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .poetry-list {
    padding: 1rem 0 3rem;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .filters-section {
    padding: 1.5rem;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
  }
  
  .filter-select {
    width: 100%;
    min-width: auto;
  }
  
  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .empty-state {
    padding: 3rem 1rem;
  }
}
</style>