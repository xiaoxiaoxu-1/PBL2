<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore, POETRY_CATEGORIES } from '@/stores/poetry'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const poetryStore = usePoetryStore()
const authStore = useAuthStore()

// 表单数据
const form = reactive({
  title: '',
  content: '',
  author: '',
  category: '',
  tags: [] as string[]
})

// 表单状态
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})
const tagInput = ref('')
const isLoggedIn = ref(false)

// 添加标签
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
    form.tags.push(tag)
    tagInput.value = ''
  }
}

// 删除标签
const removeTag = (index: number) => {
  form.tags.splice(index, 1)
}

// 处理标签输入的回车事件
const handleTagKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  }
}

// 表单验证
const validateForm = () => {
  errors.value = {}
  
  if (!form.title.trim()) {
    errors.value.title = '请输入诗歌标题'
  } else if (form.title.length > 50) {
    errors.value.title = '标题不能超过50个字符'
  }
  
  if (!form.content.trim()) {
    errors.value.content = '请输入诗歌内容'
  } else if (form.content.length > 2000) {
    errors.value.content = '内容不能超过2000个字符'
  }
  
  if (!form.author.trim()) {
    errors.value.author = '请输入作者姓名'
  } else if (form.author.length > 20) {
    errors.value.author = '作者姓名不能超过20个字符'
  }
  
  if (!form.category) {
    errors.value.category = '请选择诗歌分类'
  }
  
  return Object.keys(errors.value).length === 0
}

// 检查登录状态
onMounted(() => {
  isLoggedIn.value = !!authStore.user
  if (!isLoggedIn.value) {
    alert('请先登录后再发布诗歌')
    router.push('/login')
  }
})

// 提交表单
const handleSubmit = async () => {
  if (!isLoggedIn.value) {
    alert('请先登录后再发布诗歌')
    router.push('/login')
    return
  }
  
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newPoetry = await poetryStore.addPoetry({
      title: form.title.trim(),
      content: form.content.trim(),
      author: form.author.trim(),
      category: form.category as any,
      tags: form.tags
    })
    
    if (newPoetry) {
      // 添加成功，跳转到诗歌详情页
      router.push(`/poetry/${newPoetry.id}`)
    } else {
      // 添加失败，显示错误信息
      const errorMessage = poetryStore.error || '创建失败，请检查输入信息'
      alert(errorMessage)
    }
  } catch (error) {
    console.error('创建失败:', error)
    // 显示具体的错误信息
    const errorMessage = error instanceof Error ? error.message : '创建失败，请重试'
    alert(`创建失败: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    title: '',
    content: '',
    author: '',
    category: '',
    tags: []
  })
  errors.value = {}
  tagInput.value = ''
}

// 保存草稿
const saveDraft = () => {
  localStorage.setItem('poetry-draft', JSON.stringify(form))
  alert('草稿已保存')
}

// 加载草稿
const loadDraft = () => {
  const draft = localStorage.getItem('poetry-draft')
  if (draft) {
    try {
      const draftData = JSON.parse(draft)
      Object.assign(form, draftData)
      alert('草稿已加载')
    } catch (error) {
      console.error('加载草稿失败:', error)
    }
  }
}
</script>

<template>
  <div class="create-poetry">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">创作诗歌</h1>
        <p class="page-description">用文字编织情感，用诗歌记录生活的美好瞬间。</p>
        <div v-if="!isLoggedIn" class="login-prompt">
          <p>请先登录后再发布诗歌</p>
          <button @click="router.push('/login')" class="btn btn-primary">立即登录</button>
        </div>
      </div>

      <div v-if="!isLoggedIn" class="login-required">
        <p>您需要登录后才能发布诗歌</p>
      </div>

      <form v-if="isLoggedIn" @submit.prevent="handleSubmit" class="create-form">
        <div class="form-section">
          <div class="form-group">
            <label for="title" class="form-label">
              诗歌标题 <span class="required">*</span>
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="form-input"
              :class="{ error: errors.title }"
              placeholder="为你的诗歌起个美好的标题..."
              maxlength="50"
            />
            <div class="input-info">
              <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
              <span class="char-count">{{ form.title.length }}/50</span>
            </div>
          </div>

          <div class="form-group">
            <label for="author" class="form-label">
              作者姓名 <span class="required">*</span>
            </label>
            <input
              id="author"
              v-model="form.author"
              type="text"
              class="form-input"
              :class="{ error: errors.author }"
              placeholder="请输入作者姓名"
              maxlength="20"
            />
            <div class="input-info">
              <span v-if="errors.author" class="error-message">{{ errors.author }}</span>
              <span class="char-count">{{ form.author.length }}/20</span>
            </div>
          </div>

          <div class="form-group">
            <label for="category" class="form-label">
              诗歌分类 <span class="required">*</span>
            </label>
            <select
              id="category"
              v-model="form.category"
              class="form-select"
              :class="{ error: errors.category }"
            >
              <option value="">请选择分类</option>
              <option 
                v-for="category in POETRY_CATEGORIES" 
                :key="category" 
                :value="category"
              >
                {{ category }}
              </option>
            </select>
            <span v-if="errors.category" class="error-message">{{ errors.category }}</span>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="content" class="form-label">
              诗歌内容 <span class="required">*</span>
            </label>
            <textarea
              id="content"
              v-model="form.content"
              class="form-textarea"
              :class="{ error: errors.content }"
              placeholder="在这里写下你的诗歌...&#10;&#10;可以用回车换行，创作出优美的诗句布局。"
              rows="12"
              maxlength="2000"
            ></textarea>
            <div class="input-info">
              <span v-if="errors.content" class="error-message">{{ errors.content }}</span>
              <span class="char-count">{{ form.content.length }}/2000</span>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label for="tags" class="form-label">
              标签 <span class="optional">(可选，最多5个)</span>
            </label>
            <div class="tag-input-container">
              <input
                id="tags"
                v-model="tagInput"
                type="text"
                class="tag-input"
                placeholder="输入标签后按回车添加"
                maxlength="10"
                @keydown="handleTagKeydown"
              />
              <button 
                type="button" 
                @click="addTag"
                class="add-tag-btn"
                :disabled="!tagInput.trim() || form.tags.length >= 5"
              >
                添加
              </button>
            </div>
            <div class="tags-display" v-if="form.tags.length > 0">
              <span 
                v-for="(tag, index) in form.tags" 
                :key="index" 
                class="tag-item"
              >
                #{{ tag }}
                <button 
                  type="button" 
                  @click="removeTag(index)"
                  class="remove-tag-btn"
                >
                  ×
                </button>
              </span>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <div class="action-group">
            <button type="button" @click="saveDraft" class="btn btn-outline">保存草稿</button>
            <button type="button" @click="loadDraft" class="btn btn-outline">加载草稿</button>
            <button type="button" @click="resetForm" class="btn btn-outline">重置表单</button>
          </div>
          <button 
            type="submit" 
            class="btn btn-primary submit-btn"
            :disabled="isSubmitting"
          >
            {{ isSubmitting ? '发布中...' : '发布诗歌' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.create-poetry { padding: 2rem 0 4rem; min-height: 100vh; }
.page-header { text-align: center; margin-bottom: 3rem; }
.page-title { font-size: 2.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem; }
.page-description { font-size: 1.1rem; color: var(--text-light); max-width: 600px; margin: 0 auto; line-height: 1.6; }
.create-form { max-width: 800px; margin: 0 auto; background-color: var(--card-background); border-radius: var(--border-radius); box-shadow: var(--shadow); padding: 3rem; }
.form-section { margin-bottom: 2rem; }
.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-weight: 600; color: var(--primary-color); margin-bottom: 0.5rem; font-size: 1rem; }
.required { color: var(--accent-color); }
.optional { color: var(--text-light); font-weight: 400; font-size: 0.9rem; }
.form-input, .form-select { width: 100%; padding: 0.75rem 1rem; border: 2px solid var(--border-color); border-radius: var(--border-radius); font-size: 1rem; color: var(--text-color); background-color: white; transition: var(--transition); }
.form-input:focus, .form-select:focus { outline: none; border-color: var(--secondary-color); box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1); }
.form-input.error, .form-select.error { border-color: var(--accent-color); }
.form-textarea { width: 100%; padding: 1rem; border: 2px solid var(--border-color); border-radius: var(--border-radius); font-size: 1rem; color: var(--text-color); background-color: white; font-family: 'Georgia', '宋体', serif; line-height: 1.8; resize: vertical; min-height: 300px; transition: var(--transition); }
.form-textarea:focus { outline: none; border-color: var(--secondary-color); box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1); }
.form-textarea.error { border-color: var(--accent-color); }
.input-info { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.8rem; }
.error-message { color: var(--accent-color); font-weight: 500; }
.char-count { color: var(--text-light); }
.tag-input-container { display: flex; gap: 0.5rem; }
.tag-input { flex: 1; padding: 0.5rem 0.75rem; border: 1px solid var(--border-color); border-radius: var(--border-radius); font-size: 0.9rem; }
.add-tag-btn { padding: 0.5rem 1rem; background-color: var(--secondary-color); color: white; border: none; border-radius: var(--border-radius); cursor: pointer; font-size: 0.9rem; font-weight: 500; transition: var(--transition); }
.add-tag-btn:hover:not(:disabled) { background-color: var(--primary-color); }
.add-tag-btn:disabled { background-color: var(--text-light); cursor: not-allowed; }
.tags-display { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1rem; }
.tag-item { display: flex; align-items: center; gap: 0.5rem; background-color: var(--secondary-color); color: white; padding: 0.5rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
.remove-tag-btn { background: none; border: none; color: white; cursor: pointer; font-size: 1.2rem; line-height: 1; padding: 0; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: var(--transition); }
.remove-tag-btn:hover { background-color: rgba(255, 255, 255, 0.2); }
.form-actions { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.action-group { display: flex; gap: 1rem; flex-wrap: wrap; }
.submit-btn { background-color: var(--secondary-color); }
.submit-btn:disabled { background-color: var(--text-light); cursor: not-allowed; }
.login-prompt {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  text-align: center;
  margin-top: 1rem;
}

.login-prompt p {
  margin-bottom: 1rem;
  color: #856404;
  font-weight: 500;
}

.login-required {
  text-align: center;
  padding: 3rem;
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin-top: 2rem;
}

.login-required p {
  font-size: 1.2rem;
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .create-form { padding: 2rem 1.5rem; }
  .page-title { font-size: 2rem; }
  .form-actions { flex-direction: column; align-items: stretch; }
  .action-group { justify-content: center; }
  .submit-btn { order: 1; margin-bottom: 1rem; }
  .login-prompt { padding: 1rem; }
  .login-required { padding: 2rem 1rem; }
}
</style>