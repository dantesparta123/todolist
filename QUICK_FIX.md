# 快速修复指南

## 问题描述
错误信息：`new row violates row-level security policy for table "todos"`

这是因为Supabase的行级安全策略(RLS)阻止了数据操作。

## 解决方案

### 方法1：更新数据库策略（推荐）

在Supabase SQL Editor中执行以下SQL：

```sql
-- 删除现有策略（如果存在）
DROP POLICY IF EXISTS "Allow all operations for todos" ON todos;

-- 创建新的允许所有操作的策略
CREATE POLICY "Allow all operations for todos" ON todos
  FOR ALL USING (true)
  WITH CHECK (true);
```

### 方法2：临时禁用RLS（仅用于测试）

```sql
-- 临时禁用行级安全策略
ALTER TABLE todos DISABLE ROW LEVEL SECURITY;
```

### 方法3：使用认证策略（生产环境推荐）

如果您计划添加用户认证，可以使用：

```sql
-- 为认证用户创建策略
CREATE POLICY "Users can manage their own todos" ON todos
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);
```

## 验证修复

1. 执行上述SQL语句
2. 刷新应用页面
3. 尝试创建新任务
4. 确认任务能够正常保存

## 注意事项

- 方法1适合开发环境
- 方法2仅用于快速测试
- 方法3适合生产环境（需要用户认证）

## 如果问题仍然存在

1. 检查Supabase项目设置
2. 确认API密钥权限
3. 查看Supabase日志
4. 重启开发服务器
