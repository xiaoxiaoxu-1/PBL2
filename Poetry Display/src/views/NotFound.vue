<script setup lang="ts">
import { RouterLink } from 'vue-router'

const poetryLines = [
  '山重水复疑无路，柳暗花明又一村。',
  '路漫漫其修远兮，吾将上下而求索。',
  '海内存知己，天涯若比邻。',
  '会当凌绝顶，一览众山小。',
  '长风破浪会有时，直挂云帆济沧海。'
]

const randomPoetry = poetryLines[Math.floor(Math.random() * poetryLines.length)]
</script>

<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found-content">
        <div class="error-icon">
          <span class="error-number">4</span>
          <span class="error-zero">📖</span>
          <span class="error-number">4</span>
        </div>

        <h1 class="error-title">页面未找到</h1>
        <p class="error-subtitle">抱歉，你访问的页面不存在</p>

        <div class="poetry-quote">
          <p class="quote-text">{{ randomPoetry }}</p>
          <p class="quote-note">— 愿这句诗能给你些许安慰</p>
        </div>

        <div class="error-actions">
          <RouterLink to="/" class="btn btn-primary">返回首页</RouterLink>
          <RouterLink to="/poetry" class="btn btn-outline">浏览诗歌</RouterLink>
        </div>

        <div class="suggestions">
          <h3 class="suggestions-title">你可能想要：</h3>
          <div class="suggestions-links">
            <RouterLink to="/" class="suggestion-link">🏠 回到首页</RouterLink>
            <RouterLink to="/poetry" class="suggestion-link">📚 浏览诗歌列表</RouterLink>
            <RouterLink to="/create" class="suggestion-link">✍️ 创作新诗歌</RouterLink>
            <RouterLink to="/about" class="suggestion-link">ℹ️ 了解我们</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem 0; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); }
.not-found-content { text-align: center; max-width: 600px; margin: 0 auto; background-color: var(--card-background); padding: 4rem 3rem; border-radius: var(--border-radius); box-shadow: var(--shadow); }
.error-icon { display: flex; justify-content: center; align-items: center; margin-bottom: 2rem; font-size: 4rem; }
.error-number { color: var(--accent-color); font-weight: 700; }
.error-zero { margin: 0 1rem; font-size: 3rem; }
.error-title { font-size: 2rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1rem; }
.error-subtitle { font-size: 1.1rem; color: var(--text-light); margin-bottom: 2rem; }
.poetry-quote { background-color: var(--background-color); padding: 2rem; border-radius: var(--border-radius); margin-bottom: 2rem; border-left: 4px solid var(--secondary-color); }
.quote-text { font-size: 1.2rem; color: var(--text-color); font-style: italic; margin-bottom: 0.5rem; line-height: 1.6; }
.quote-note { font-size: 0.9rem; color: var(--text-light); }
.error-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 3rem; flex-wrap: wrap; }
.suggestions { margin-top: 2rem; }
.suggestions-title { font-size: 1.2rem; font-weight: 600; color: var(--primary-color); margin-bottom: 1rem; }
.suggestions-links { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
.suggestion-link { display: block; padding: 1rem; background-color: var(--card-background); border: 1px solid var(--border-color); border-radius: var(--border-radius); text-decoration: none; color: var(--text-color); transition: var(--transition); }
.suggestion-link:hover { background-color: var(--background-color); border-color: var(--secondary-color); color: var(--secondary-color); transform: translateY(-2px); }
@media (max-width: 768px) {
  .not-found-content { padding: 3rem 2rem; }
  .error-icon { font-size: 3rem; }
  .error-title { font-size: 1.5rem; }
  .error-actions { flex-direction: column; align-items: center; }
  .suggestions-links { grid-template-columns: 1fr; }
}
</style>