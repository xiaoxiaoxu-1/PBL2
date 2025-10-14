<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePoetryStore } from '@/stores/poetry'

const poetryStore = usePoetryStore()
const localSearchQuery = ref(poetryStore.searchQuery)

// 监听本地搜索查询的变化，实时更新store
watch(localSearchQuery, (newQuery) => {
  poetryStore.setSearchQuery(newQuery)
}, { immediate: true })

// 清除搜索
const clearSearch = () => {
  localSearchQuery.value = ''
}

// 搜索建议（可以根据需要扩展）
const searchSuggestions = [
  '春天', '爱情', '自然', '思念', '希望', '梦想'
]
</script>

<template>
  <div class="search-bar">
    <div class="search-input-container">
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input
          v-model="localSearchQuery"
          type="text"
          class="search-input"
          placeholder="搜索诗歌标题、内容、作者或标签..."
          maxlength="100"
        />
        <button
          v-if="localSearchQuery"
          @click="clearSearch"
          class="clear-search-btn"
          title="清除搜索"
        >
          ✕
        </button>
      </div>
    </div>
    
    <!-- 搜索建议 -->
    <div class="search-suggestions" v-if="!localSearchQuery">
      <span class="suggestions-label">热门搜索：</span>
      <button
        v-for="suggestion in searchSuggestions"
        :key="suggestion"
        @click="localSearchQuery = suggestion"
        class="suggestion-tag"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-input-container {
  position: relative;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: white;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 0.75rem 1rem;
  transition: var(--transition);
}

.search-input-wrapper:focus-within {
  border-color: var(--secondary-color);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  color: var(--text-light);
  margin-right: 0.75rem;
  font-size: 1.1rem;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  color: var(--text-color);
  background-color: transparent;
}

.search-input::placeholder {
  color: var(--text-light);
}

.clear-search-btn {
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  margin-left: 0.5rem;
}

.clear-search-btn:hover {
  background-color: var(--background-color);
  color: var(--accent-color);
}

.search-suggestions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.suggestions-label {
  font-size: 0.9rem;
  color: var(--text-light);
  font-weight: 500;
  white-space: nowrap;
}

.suggestion-tag {
  background-color: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.suggestion-tag:hover {
  background-color: var(--secondary-color);
  color: white;
  border-color: var(--secondary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-input-wrapper {
    padding: 0.6rem 0.8rem;
  }
  
  .search-input {
    font-size: 0.9rem;
  }
  
  .search-input::placeholder {
    font-size: 0.9rem;
  }
  
  .search-suggestions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .suggestions-label {
    font-size: 0.8rem;
  }
  
  .suggestion-tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
}

@media (max-width: 480px) {
  .search-input::placeholder {
    content: "搜索诗歌...";
  }
}
</style>