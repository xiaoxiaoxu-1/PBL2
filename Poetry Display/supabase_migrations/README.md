# Supabase 数据库迁移说明

## 为profiles表添加password_hash字段

### 迁移目的
为profiles表添加`password_hash`字段，用于存储用户密码哈希（作为备份或其他业务需求）。

### 执行步骤

1. **登录Supabase控制台**
   - 访问 [Supabase Dashboard](https://supabase.com/dashboard)
   - 选择你的项目（muzyfqxxafqqqgaqvhlu）

2. **执行SQL迁移脚本**
   - 在左侧菜单点击 **SQL Editor**
   - 点击 **New Query** 创建新查询
   - 复制 `add_password_to_profiles.sql` 文件中的SQL代码
   - 粘贴到查询编辑器中
   - 点击 **Run** 执行脚本

3. **验证迁移结果**
   - 脚本执行成功后，会显示字段添加成功的通知
   - 可以在 **Table Editor** 中查看profiles表，确认新增了password_hash字段

### 迁移脚本说明

- 脚本会检查字段是否已存在，避免重复添加
- 添加了字段注释说明用途
- 包含验证查询确认字段添加成功

### 注意事项

- 此迁移不会影响现有数据
- password_hash字段可以为空（NULL）
- 在实际生产环境中，建议使用安全的密码哈希算法（如bcrypt）

### 后续操作

迁移完成后，前端代码将能够正确保存和读取password_hash字段。