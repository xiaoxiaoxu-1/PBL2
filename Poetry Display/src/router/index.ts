import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import { useAuthStore } from '@/stores/auth'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页 - Poetry Display'
    }
  },
  {
    path: '/poetry',
    name: 'PoetryList',
    component: () => import('@/views/PoetryList.vue'),
    meta: {
      title: '诗歌列表 - Poetry Display'
    }
  },
  {
    path: '/poetry/:id',
    name: 'PoetryDetail',
    component: () => import('@/views/PoetryDetail.vue'),
    meta: {
      title: '诗歌详情 - Poetry Display'
    }
  },
  {
    path: '/create',
    name: 'CreatePoetry',
    component: () => import('@/views/CreatePoetry.vue'),
    meta: {
      title: '创作诗歌 - Poetry Display',
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录/注册 - Poetry Display',
      requiresGuest: true
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: {
      title: '个人资料 - Poetry Display',
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: {
      title: '关于我们 - Poetry Display'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到 - Poetry Display'
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // 初始化用户状态
  if (!authStore.user) {
    await authStore.initUser()
  }

  // 设置页面标题
  if (to.meta?.title) {
    document.title = to.meta.title as string
  }

  // 检查认证要求
  if (to.meta?.requiresAuth && !authStore.user) {
    next('/login')
    return
  }

  if (to.meta?.requiresGuest && authStore.user) {
    next('/')
    return
  }

  next()
})

export default router