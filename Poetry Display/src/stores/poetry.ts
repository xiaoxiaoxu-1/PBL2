import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from './auth'

// 诗歌数据类型定义
export interface Poetry {
  id: string
  title: string
  content: string
  author: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
  likes: number
  views: number
}

// 诗歌分类
export const POETRY_CATEGORIES = [
  '现代诗',
  '古体诗',
  '自由诗',
  '散文诗',
  '儿童诗',
  '爱情诗',
  '励志诗',
  '其他'
] as const

export type PoetryCategory = typeof POETRY_CATEGORIES[number]

// 数据验证函数
const validatePoetryData = (data: Partial<Poetry>): string[] => {
  const errors: string[] = []
  
  if (!data.title || data.title.trim() === '') {
    errors.push('标题不能为空')
  }
  
  if (!data.content || data.content.trim() === '') {
    errors.push('内容不能为空')
  }
  
  if (!data.author || data.author.trim() === '') {
    errors.push('作者不能为空')
  }
  
  if (!data.category || !POETRY_CATEGORIES.includes(data.category as PoetryCategory)) {
    errors.push('请选择有效的分类')
  }
  
  return errors
}

// Supabase数据操作函数
const loadFromSupabase = async (): Promise<Poetry[]> => {
  try {
    const { data, error } = await supabase
      .from('poetries')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // 转换数据格式
    return data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      author: item.author,
      category: item.category,
      tags: item.tags,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      likes: item.likes,
      views: item.views
    }))
  } catch (error) {
    console.error('从Supabase加载数据失败:', error)
    return []
  }
}

const saveToSupabase = async (poetry: Poetry): Promise<Poetry | null> => {
  try {
    const authStore = useAuthStore()
    const user = authStore.user
    
    const { data, error } = await supabase
      .from('poetries')
      .insert({
        title: poetry.title,
        content: poetry.content,
        author: poetry.author,
        category: poetry.category,
        tags: poetry.tags,
        created_at: poetry.createdAt,
        updated_at: poetry.updatedAt,
        likes: poetry.likes,
        views: poetry.views,
        user_id: user?.id || null
      })
      .select()
      .single()

    if (error) throw error
    return data ? {
      id: data.id,
      title: data.title,
      content: data.content,
      author: data.author,
      category: data.category,
      tags: data.tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      likes: data.likes,
      views: data.views
    } : null
  } catch (error) {
    console.error('保存数据到Supabase失败:', error)
    return null
  }
}

const deleteFromSupabase = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('poetries')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('从Supabase删除数据失败:', error)
    return false
  }
}

// 诗歌状态管理
export const usePoetryStore = defineStore('poetry', () => {
  // 状态
  const poetries = ref<Poetry[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedCategory = ref<PoetryCategory | ''>('')

  // 计算属性
  const filteredPoetries = computed(() => {
    let filtered = poetries.value

    // 按搜索关键词过滤
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(poetry =>
        poetry.title.toLowerCase().includes(query) ||
        poetry.content.toLowerCase().includes(query) ||
        poetry.author.toLowerCase().includes(query) ||
        poetry.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // 按分类过滤
    if (selectedCategory.value) {
      filtered = filtered.filter(poetry => poetry.category === selectedCategory.value)
    }

    return filtered
  })

  const totalPoetries = computed(() => poetries.value.length)
  const categories = computed(() => {
    const categoryCount = new Map<string, number>()
    poetries.value.forEach(poetry => {
      const count = categoryCount.get(poetry.category) || 0
      categoryCount.set(poetry.category, count + 1)
    })
    return categoryCount
  })

  // 方法
  // 移除自定义ID生成，使用Supabase自动生成的UUID

  const addPoetry = async (poetryData: Omit<Poetry, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'views'>) => {
    try {
      // 检查用户是否登录
      const authStore = useAuthStore()
      if (!authStore.user) {
        error.value = '请先登录后再发布诗歌'
        return null
      }

      // 数据验证
      const validationErrors = validatePoetryData(poetryData)
      if (validationErrors.length > 0) {
        error.value = validationErrors.join('; ')
        return null
      }

      const newPoetry: Omit<Poetry, 'id'> = {
        ...poetryData,
        title: poetryData.title.trim(),
        content: poetryData.content.trim(),
        author: poetryData.author.trim(),
        tags: poetryData.tags.filter(tag => tag.trim() !== ''),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        likes: 0,
        views: 0
      }
      
      // 保存到Supabase
      const savedPoetry = await saveToSupabase(newPoetry as Poetry)
      if (savedPoetry) {
        poetries.value.unshift(savedPoetry)
        error.value = null
        return savedPoetry
      } else {
        error.value = '保存到数据库失败'
        return null
      }
    } catch (err) {
      error.value = '添加诗歌失败: ' + (err instanceof Error ? err.message : '未知错误')
      return null
    }
  }

  const updatePoetry = async (id: string, updates: Partial<Poetry>) => {
    try {
      const index = poetries.value.findIndex(p => p.id === id)
      if (index === -1) {
        error.value = '未找到指定的诗歌'
        return null
      }

      // 如果更新包含需要验证的字段，进行验证
      if (updates.title || updates.content || updates.author || updates.category) {
        const dataToValidate = { ...poetries.value[index], ...updates }
        const validationErrors = validatePoetryData(dataToValidate)
        if (validationErrors.length > 0) {
          error.value = validationErrors.join('; ')
          return null
        }
      }

      // 清理数据
      const cleanUpdates = { ...updates }
      if (cleanUpdates.title) cleanUpdates.title = cleanUpdates.title.trim()
      if (cleanUpdates.content) cleanUpdates.content = cleanUpdates.content.trim()
      if (cleanUpdates.author) cleanUpdates.author = cleanUpdates.author.trim()
      if (cleanUpdates.tags) cleanUpdates.tags = cleanUpdates.tags.filter(tag => tag.trim() !== '')

      // 直接更新到Supabase
      const { data, error: updateError } = await supabase
        .from('poetries')
        .update({
          ...cleanUpdates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError
      
      if (data) {
        const savedPoetry = {
          id: data.id,
          title: data.title,
          content: data.content,
          author: data.author,
          category: data.category,
          tags: data.tags,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          likes: data.likes,
          views: data.views
        }
        poetries.value[index] = savedPoetry
        error.value = null
        return savedPoetry
      } else {
        error.value = '更新数据库失败'
        return null
      }
    } catch (err) {
      error.value = '更新诗歌失败: ' + (err instanceof Error ? err.message : '未知错误')
      return null
    }
  }

  const deletePoetry = async (id: string) => {
    try {
      const index = poetries.value.findIndex(p => p.id === id)
      if (index === -1) {
        error.value = '未找到指定的诗歌'
        return false
      }

      // 从Supabase删除
      const success = await deleteFromSupabase(id)
      if (success) {
        poetries.value.splice(index, 1)
        error.value = null
        return true
      } else {
        error.value = '从数据库删除失败'
        return false
      }
    } catch (err) {
      error.value = '删除诗歌失败: ' + (err instanceof Error ? err.message : '未知错误')
      return false
    }
  }

  const getPoetryById = (id: string) => {
    return poetries.value.find(p => p.id === id)
  }

  const likePoetry = (id: string) => {
    const poetry = getPoetryById(id)
    if (poetry) {
      poetry.likes++
      return poetry.likes
    }
    return 0
  }

  const incrementViews = (id: string) => {
    const poetry = getPoetryById(id)
    if (poetry) {
      poetry.views++
      return poetry.views
    }
    return 0
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const setSelectedCategory = (category: PoetryCategory | '') => {
    selectedCategory.value = category
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedCategory.value = ''
  }

  // 从Supabase加载数据
  const loadData = async () => {
    try {
      loading.value = true
      const savedData = await loadFromSupabase()
      poetries.value = savedData
      error.value = null
    } catch (err) {
      error.value = '加载数据失败: ' + (err instanceof Error ? err.message : '未知错误')
    } finally {
      loading.value = false
    }
  }

  // 清除所有数据（仅清除本地缓存，不删除数据库数据）
  const clearAllData = () => {
    poetries.value = []
    error.value = null
  }

  // 导出数据
  const exportData = () => {
    try {
      const dataStr = JSON.stringify(poetries.value, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `poetry-data-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      error.value = '导出数据失败: ' + (err instanceof Error ? err.message : '未知错误')
    }
  }

  // 导入数据
  const importData = (jsonData: string) => {
    try {
      const parsedData = JSON.parse(jsonData) as Poetry[]
      
      // 验证数据格式
      if (!Array.isArray(parsedData)) {
        throw new Error('数据格式不正确，应为数组格式')
      }

      // 验证每个诗歌对象
      for (const poetry of parsedData) {
        const validationErrors = validatePoetryData(poetry)
        if (validationErrors.length > 0) {
          throw new Error(`数据验证失败: ${validationErrors.join('; ')}`)
        }
      }

      poetries.value = parsedData
      error.value = null
      return true
    } catch (err) {
      error.value = '导入数据失败: ' + (err instanceof Error ? err.message : '未知错误')
      return false
    }
  }

  // 初始化示例数据
  const initSampleData = () => {
    if (poetries.value.length === 0) {
      const samplePoetries: Omit<Poetry, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          title: '春天的诗',
          content: '春风轻抚大地，\n万物苏醒，\n花儿绽放笑颜，\n鸟儿歌唱希望。\n\n阳光洒向人间，\n温暖如你的拥抱，\n让我们在这美好的季节里，\n种下梦想的种子。',
          author: '诗人甲',
          category: '现代诗',
          tags: ['春天', '希望', '自然'],
          likes: 15,
          views: 128
        },
        {
          title: '月夜思',
          content: '明月照高楼，\n思君不见君。\n千里共婵娟，\n何时能相聚？',
          author: '诗人乙',
          category: '古体诗',
          tags: ['月亮', '思念', '古风'],
          likes: 23,
          views: 89
        },
        {
          title: '自由的风',
          content: '我想成为风\n没有束缚\n没有边界\n\n穿越山川河流\n拥抱每一片云朵\n在天空中自由舞蹈\n\n风啊风\n带我去远方\n去寻找\n心中的那片海',
          author: '诗人丙',
          category: '自由诗',
          tags: ['自由', '梦想', '大自然'],
          likes: 31,
          views: 156
        }
      ]

      samplePoetries.forEach(poetry => addPoetry(poetry))
    }
  }

  // 初始化数据加载
  loadData()

  return {
    // 状态
    poetries,
    loading,
    error,
    searchQuery,
    selectedCategory,
    // 计算属性
    filteredPoetries,
    totalPoetries,
    categories,
    // 方法
    addPoetry,
    updatePoetry,
    deletePoetry,
    getPoetryById,
    likePoetry,
    incrementViews,
    setSearchQuery,
    setSelectedCategory,
    clearFilters,
    loadData,
    initSampleData,
    clearAllData,
    exportData,
    importData
  }
})