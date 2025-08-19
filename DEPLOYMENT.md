# 部署指南

## 环境变量配置

在项目根目录创建 `.env.local` 文件，并配置以下环境变量：

```env
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase 数据库设置

### 1. 创建 Supabase 项目

1. 访问 [Supabase](https://supabase.com)
2. 点击 "New Project"
3. 填写项目信息并创建

### 2. 获取连接信息

1. 在项目仪表板中，进入 "Settings" > "API"
2. 复制以下信息：
   - Project URL
   - anon/public key

### 3. 创建数据库表

1. 进入 "SQL Editor"
2. 执行 `supabase-setup.sql` 文件中的SQL语句

## 部署平台

### Vercel (推荐)

1. 将代码推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 配置环境变量
6. 点击 "Deploy"

### Netlify

1. 构建项目：`npm run build`
2. 将 `out` 目录部署到 Netlify
3. 配置环境变量

### Railway

1. 连接 GitHub 仓库
2. 配置环境变量
3. 自动部署

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

## 故障排除

### 常见问题

1. **环境变量未配置**
   - 确保 `.env.local` 文件存在且配置正确
   - 重启开发服务器

2. **数据库连接失败**
   - 检查 Supabase URL 和 Key 是否正确
   - 确认数据库表已创建

3. **RLS策略错误**
   - 错误信息：`new row violates row-level security policy for table "todos"`
   - 在Supabase SQL Editor中执行：
   ```sql
   CREATE POLICY "Allow all operations for todos" ON todos
     FOR ALL USING (true)
     WITH CHECK (true);
   ```

4. **构建失败**
   - 检查 TypeScript 类型错误
   - 确保所有依赖已安装

### 获取帮助

如果遇到问题，请：
1. 检查控制台错误信息
2. 查看 Supabase 日志
3. 参考 `QUICK_FIX.md` 文件
4. 提交 Issue 描述问题
