-- 为profiles表添加password_hash字段的迁移脚本
-- 在Supabase SQL编辑器中执行此脚本

-- 检查字段是否已存在，如果不存在则添加
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'password_hash'
    ) THEN
        -- 添加password_hash字段
        ALTER TABLE profiles ADD COLUMN password_hash TEXT;
        
        -- 添加注释说明字段用途
        COMMENT ON COLUMN profiles.password_hash IS '用户密码哈希（用于备份或其他业务需求）';
        
        RAISE NOTICE '成功为profiles表添加password_hash字段';
    ELSE
        RAISE NOTICE 'profiles表已存在password_hash字段，无需添加';
    END IF;
END $$;

-- 可选：为现有数据设置默认值（如果需要）
-- UPDATE profiles SET password_hash = '' WHERE password_hash IS NULL;

-- 验证字段添加成功
SELECT 
    column_name, 
    data_type, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;