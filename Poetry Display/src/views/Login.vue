<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isLogin ? '登录' : '注册' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">邮箱</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            placeholder="请输入邮箱"
          />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="form.username"
            type="text"
            required
            placeholder="请输入用户名"
          />
        </div>

        <div class="form-group">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            placeholder="请输入密码"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? '处理中...' : (isLogin ? '登录' : '注册') }}
        </button>
      </form>

      <div class="switch-mode">
        <span>{{ isLogin ? '没有账号？' : '已有账号？' }}</span>
        <button type="button" @click="toggleMode" class="switch-btn">
          {{ isLogin ? '立即注册' : '立即登录' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isLogin = ref(true)
const isLoading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  username: '',
  password: ''
})

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
  form.email = ''
  form.username = ''
  form.password = ''
}

const handleSubmit = async () => {
  isLoading.value = true
  error.value = ''

  try {
    if (isLogin.value) {
      // 登录时使用用户输入的密码（Supabase会自动处理加密）
      await authStore.signIn(form.email, form.password)
    } else {
      // 注册时使用用户输入的密码
      await authStore.signUp(form.email, form.password, form.username)
    }
    
    // 登录/注册成功后跳转到首页
    router.push('/')
  } catch (err) {
    console.error('认证操作失败:', err)
    // 显示具体的错误信息
    error.value = authStore.error || '操作失败，请检查输入信息'
    
    // 如果是"无效的登录凭证"，提供更明确的提示
    if (authStore.error?.includes('Invalid login credentials')) {
      error.value = '邮箱或密码不正确，请检查后重试'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 28px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  margin: 15px 0;
  font-size: 14px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover:not(:disabled) {
  background: #5a6fd8;
}

.submit-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.switch-mode {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.switch-btn {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
}

.switch-btn:hover {
  color: #5a6fd8;
}
</style>