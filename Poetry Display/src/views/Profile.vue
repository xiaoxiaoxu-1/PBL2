<template>
  <div class="profile-container">
    <div class="profile-card">
      <div class="profile-header">
        <h2>个人资料</h2>
        <button @click="handleLogout" class="logout-btn" :disabled="isLoading">
          {{ isLoading ? '退出中...' : '退出登录' }}
        </button>
      </div>

      <div v-if="user" class="profile-info">
        <div class="info-item">
          <label>用户ID:</label>
          <span>{{ user.id }}</span>
        </div>
        <div class="info-item">
          <label>邮箱:</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="info-item">
          <label>注册时间:</label>
          <span>{{ formatDate(user.created_at) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const isLoading = ref(false)

const user = authStore.user

const handleLogout = async () => {
  isLoading.value = true
  try {
    await authStore.signOut()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败:', error)
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}
</script>

<style scoped>
.profile-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

h2 {
  color: #333;
  margin: 0;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.logout-btn:hover:not(:disabled) {
  background: #c0392b;
}

.logout-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.profile-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.info-item label {
  font-weight: 600;
  color: #555;
}

.info-item span {
  color: #333;
}
</style>