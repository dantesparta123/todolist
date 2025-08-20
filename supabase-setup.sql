-- ========================================
-- TodoList 数据库初始化脚本
-- ========================================
-- 
-- 此脚本包含：
-- 1. 数据库表结构创建
-- 2. 索引优化
-- 3. 行级安全策略配置
-- 4. 触发器设置
-- 5. 故障排除指南
--
-- 执行前请确保：
-- - 已创建Supabase项目
-- - 有足够的权限执行DDL语句
-- ========================================

-- 创建todos表
CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- 启用行级安全策略
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 创建允许所有操作的RLS策略（开发环境推荐）
-- 注意：生产环境建议使用更严格的策略
DROP POLICY IF EXISTS "Allow all operations for todos" ON todos;
CREATE POLICY "Allow all operations for todos" ON todos
  FOR ALL USING (true)
  WITH CHECK (true);

-- 创建更新updated_at的触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_todos_updated_at 
  BEFORE UPDATE ON todos 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 故障排除指南
-- ========================================
--
-- 如果遇到 "new row violates row-level security policy for table 'todos'" 错误：
--
-- 1. 确保已执行上述RLS策略创建语句
-- 2. 如果问题仍然存在，可以尝试以下解决方案：
--
-- 方案A：重新创建策略（推荐）
-- DROP POLICY IF EXISTS "Allow all operations for todos" ON todos;
-- CREATE POLICY "Allow all operations for todos" ON todos
--   FOR ALL USING (true)
--   WITH CHECK (true);
--
-- 方案B：临时禁用RLS（仅用于测试）
-- ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
--
-- 方案C：使用认证策略（生产环境推荐）
-- DROP POLICY IF EXISTS "Allow all operations for todos" ON todos;
-- CREATE POLICY "Users can manage their own todos" ON todos
--   FOR ALL USING (auth.uid() IS NOT NULL)
--   WITH CHECK (auth.uid() IS NOT NULL);
--
-- 验证步骤：
-- 1. 执行上述SQL语句
-- 2. 刷新应用页面
-- 3. 尝试创建新任务
-- 4. 确认任务能够正常保存
--
-- 注意事项：
-- - 方案A适合开发环境
-- - 方案B仅用于快速测试
-- - 方案C适合生产环境（需要用户认证）
-- ========================================
