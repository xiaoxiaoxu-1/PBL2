<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>

<template>
  <nav class="navbar">
    <div class="container navbar-content">
      <!-- Logo -->
      <div class="navbar-brand">
        <RouterLink to="/" class="brand-link" @click="closeMobileMenu">
          <h1 class="brand-title">Poetry Display</h1>
          <span class="brand-subtitle">诗歌展示平台</span>
        </RouterLink>
      </div>

      <!-- 桌面端导航菜单 -->
      <div class="navbar-menu desktop-menu">
        <RouterLink 
          to="/" 
          class="nav-link"
          :class="{ active: route.name === 'Home' }"
        >
          首页
        </RouterLink>
        <RouterLink 
          to="/poetry" 
          class="nav-link"
          :class="{ active: route.name === 'PoetryList' }"
        >
          诗歌列表
        </RouterLink>
        <RouterLink 
          to="/create" 
          class="nav-link"
          :class="{ active: route.name === 'CreatePoetry' }"
        >
          创作诗歌
        </RouterLink>
        <RouterLink 
          to="/about" 
          class="nav-link"
          :class="{ active: route.name === 'About' }"
        >
          关于我们
        </RouterLink>
      </div>

      <!-- 移动端菜单按钮 -->
      <button 
        class="mobile-menu-toggle" 
        @click="toggleMobileMenu"
        :class="{ active: isMobileMenuOpen }"
        aria-label="切换菜单"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- 移动端导航菜单 -->
      <div class="mobile-menu" :class="{ active: isMobileMenuOpen }" @click="closeMobileMenu">
        <div class="mobile-menu-content" @click.stop>
          <RouterLink 
            to="/" 
            class="mobile-nav-link"
            :class="{ active: route.name === 'Home' }"
            @click="closeMobileMenu"
          >
            首页
          </RouterLink>
          <RouterLink 
            to="/poetry" 
            class="mobile-nav-link"
            :class="{ active: route.name === 'PoetryList' }"
            @click="closeMobileMenu"
          >
            诗歌列表
          </RouterLink>
          <RouterLink 
            to="/create" 
            class="mobile-nav-link"
            :class="{ active: route.name === 'CreatePoetry' }"
            @click="closeMobileMenu"
          >
            创作诗歌
          </RouterLink>
          <RouterLink 
            to="/about" 
            class="mobile-nav-link"
            :class="{ active: route.name === 'About' }"
            @click="closeMobileMenu"
          >
            关于我们
          </RouterLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  height: 80px;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  display: flex;
  flex-direction: column;
  color: var(--primary-color);
  text-decoration: none;
}

.brand-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.75rem;
  color: var(--text-light);
  margin-top: -2px;
}

.desktop-menu {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: var(--transition);
  position: relative;
}

.nav-link:hover {
  color: var(--secondary-color);
  background-color: rgba(52, 152, 219, 0.1);
}

.nav-link.active {
  color: var(--secondary-color);
  background-color: rgba(52, 152, 219, 0.15);
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background-color: var(--secondary-color);
  border-radius: 1px;
}

/* 移动端菜单按钮 */
.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 30px;
  height: 30px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-menu-toggle span {
  width: 100%;
  height: 3px;
  background-color: var(--primary-color);
  border-radius: 2px;
  transition: var(--transition);
  transform-origin: center;
}

.mobile-menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* 移动端菜单 */
.mobile-menu {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: var(--transition);
}

.mobile-menu.active {
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  background: white;
  padding: 2rem 0;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
  box-shadow: var(--shadow);
}

.mobile-nav-link {
  display: block;
  padding: 1rem 2rem;
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
  transition: var(--transition);
}

.mobile-nav-link:hover {
  background-color: var(--background-color);
  color: var(--secondary-color);
}

.mobile-nav-link.active {
  background-color: rgba(52, 152, 219, 0.1);
  color: var(--secondary-color);
  border-left: 4px solid var(--secondary-color);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .desktop-menu {
    display: none;
  }
  
  .mobile-menu-toggle {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .brand-title {
    font-size: 1.25rem;
  }
  
  .brand-subtitle {
    font-size: 0.7rem;
  }
}
</style>