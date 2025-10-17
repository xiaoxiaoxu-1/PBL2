import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, AuthError } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 初始化用户状态
  const initUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      user.value = session?.user ?? null
    } catch (err) {
      console.error('初始化用户失败:', err)
    }
  }

  // 注册
  const signUp = async (email: string, password: string, username: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('开始注册用户:', { email, username })
      
      // 注册用户，禁用邮件验证并自动确认邮箱
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            email_confirm: false // 禁用邮件验证
          },
          emailRedirectTo: 'http://localhost:3002/' // 重定向到应用
        }
      })

      console.log('注册响应:', { authData, authError })

      if (authError) {
        console.error('注册失败:', authError)
        throw authError
      }

      // 如果注册成功，创建用户资料
      if (authData.user) {
        console.log('用户注册成功，创建用户资料:', authData.user.id)
        
        try {
          // 创建用户资料（直接存储明文密码和邮箱）
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              username,
              email: email, // 存储邮箱
              password: password // 直接存储明文密码
            })

          if (profileError) {
            console.error('创建用户资料失败:', profileError)
            // 如果profile已存在，尝试更新
            if (profileError.code === '23505') { // 唯一约束冲突
              console.log('用户资料已存在，尝试更新...')
              const { error: updateError } = await supabase
                .from('profiles')
                .update({
                  username,
                  email: email,
                  password: password
                })
                .eq('id', authData.user.id)
              
              if (updateError) {
                console.error('更新用户资料失败:', updateError)
                throw new Error(`无法创建或更新用户资料: ${updateError.message}`)
              } else {
                console.log('用户资料更新成功')
              }
            } else {
              throw new Error(`无法创建用户资料: ${profileError.message}`)
            }
          } else {
            console.log('用户资料创建成功')
          }
        } catch (profileErr) {
          console.error('处理用户资料时出错:', profileErr)
          // 即使profile创建失败，我们仍然认为注册成功
          console.warn('用户资料处理失败，但用户注册成功')
        }

        // 注册成功后直接登录
        console.log('尝试自动登录...')
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) {
          console.warn('注册后自动登录失败:', signInError)
          // 检查是否是邮箱未确认错误
          if (signInError.message.includes('Email not confirmed')) {
            console.log('邮箱未确认，尝试强制确认...')
            // 如果是邮箱未确认错误，尝试更新用户状态
            await supabase.auth.updateUser({
              data: { email_confirm: true }
            })
            
            // 再次尝试登录
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password,
            })
            
            if (retryError) {
              console.warn('重试登录失败:', retryError)
            } else {
              console.log('重试登录成功:', retryData.user)
              user.value = retryData.user
            }
          }
          // 即使登录失败，注册仍然成功，用户需要手动登录
        } else {
          console.log('自动登录成功:', signInData.user)
          user.value = signInData.user
        }
      }

      return authData
    } catch (err) {
      console.error('注册过程中发生错误:', err)
      error.value = (err as AuthError).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登录
  const signIn = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      console.log('尝试登录:', { email })
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('登录响应:', { data, authError })

      if (authError) {
        console.error('登录失败:', authError)
        throw authError
      }

      user.value = data.user
      console.log('登录成功:', data.user)
      return data
    } catch (err) {
      console.error('登录过程中发生错误:', err)
      error.value = (err as AuthError).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 登出
  const signOut = async () => {
    isLoading.value = true
    error.value = null

    try {
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError

      user.value = null
    } catch (err) {
      error.value = (err as AuthError).message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 监听认证状态变化
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user ?? null
  })

  return {
    user,
    isLoading,
    error,
    initUser,
    signUp,
    signIn,
    signOut,
  }
})