# TodoList 任务管理应用

一个简洁高效的TodoList任务管理Web应用，帮助您更好地管理日常任务，提高工作效率。

## ✨ 功能特性

- 📝 **任务管理**: 创建、编辑、删除待办任务
- ✅ **状态标记**: 一键标记任务完成/未完成状态
- 📊 **进度统计**: 实时显示任务完成进度和统计信息
- 📱 **响应式设计**: 完美适配桌面端和移动端
- ⚡ **实时更新**: 任务状态实时同步
- 🎨 **现代UI**: 简洁美观的用户界面
- 🔄 **错误处理**: 完善的错误处理和重试机制
- 📅 **时间排序**: 任务按创建时间自动排序

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **图标库**: Lucide React
- **日期处理**: date-fns
- **工具库**: clsx

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- npm 或 yarn

### 1. 克隆项目

```bash
git clone <repository-url>
cd todolist
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置数据库

#### 使用 Supabase (推荐)

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在项目设置中获取以下信息：
   - Project URL
   - Anon/Public Key
3. 在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. 在 Supabase SQL Editor 中执行 `supabase-setup.sql` 文件内容

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📁 项目结构

```
todolist/
├── src/
│   ├── app/
│   │   └── page.tsx          # 主页面
│   ├── components/
│   │   ├── AddTodo.tsx       # 添加任务组件
│   │   ├── TodoItem.tsx      # 任务项组件
│   │   ├── EmptyState.tsx    # 空状态组件
│   │   └── LoadingSpinner.tsx # 加载状态组件
│   ├── lib/
│   │   ├── supabase.ts       # Supabase客户端配置
│   │   └── todo.ts           # 任务数据操作函数
│   └── types/
│       └── todo.ts           # TypeScript类型定义
├── supabase-setup.sql        # 数据库初始化脚本
├── package.json
└── README.md
```

## 🎯 核心功能说明

### 任务管理
- **创建任务**: 点击"添加新任务"按钮，填写标题和描述
- **编辑任务**: 点击任务项右侧的编辑图标进行修改
- **删除任务**: 点击任务项右侧的删除图标移除任务
- **标记完成**: 点击任务项左侧的圆形按钮切换完成状态

### 数据同步
- 所有操作都会实时同步到数据库
- 支持离线操作，网络恢复后自动同步
- 完善的错误处理和重试机制

### 用户体验
- 响应式设计，支持各种屏幕尺寸
- 加载状态提示，提升用户体验
- 空状态处理，引导用户开始使用
- 进度条显示任务完成情况

## 🔧 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

## 🌐 部署

### Vercel 部署 (推荐)

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 自动部署完成

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如：
- Netlify
- Railway
- DigitalOcean App Platform

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 支持

如果您在使用过程中遇到问题，请：
1. 查看 [Issues](../../issues) 是否有类似问题
2. 创建新的 Issue 描述您的问题
3. 联系开发者获取帮助

---

**享受高效的任务管理体验！** 🎉
