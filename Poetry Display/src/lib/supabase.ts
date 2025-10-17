import { createClient } from '@supabase/supabase-js'

// 从环境变量获取配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

// 验证环境变量
if (!supabaseUrl) {
  throw new Error('缺少 VITE_SUPABASE_URL 环境变量')
}

if (!supabaseKey) {
  throw new Error('缺少 VITE_SUPABASE_KEY 环境变量')
}

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: import.meta.env.VITE_SUPABASE_DISABLE_EMAIL_CONFIRMATION ? 'implicit' : 'pkce' // 根据环境变量禁用邮件验证
  },
  db: {
    schema: 'public'
  }
})

// 导出类型定义
export type Database = {
  public: {
    Tables: {
      poetries: {
        Row: {
          id: string
          title: string
          content: string
          author: string
          category: string
          tags: string[]
          created_at: string
          updated_at: string
          likes: number
          views: number
          user_id?: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author: string
          category: string
          tags: string[]
          created_at?: string
          updated_at?: string
          likes?: number
          views?: number
          user_id?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author?: string
          category?: string
          tags?: string[]
          created_at?: string
          updated_at?: string
          likes?: number
          views?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          password_hash: string
          avatar_url?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          password_hash: string
          avatar_url?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          avatar_url?: string
          updated_at?: string
        }
      }
    }
  }
}