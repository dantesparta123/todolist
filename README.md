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
- 📤 **数据导入导出**: 支持CSV文件导入导出，方便数据备份和迁移
- 📊 **数据统计看板**: 可视化任务完成率、分布图表和趋势分析
- 🤖 **AI智能生成**: 根据任务标题自动生成任务描述，支持流式输出

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **图表库**: Recharts
- **图标库**: Lucide React
- **日期处理**: date-fns
- **AI服务**: HuggingFace OpenAI API (Qwen2.5-VL-7B-Instruct)
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

### 3. 配置环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# HuggingFace API 配置
HF_TOKEN=your_huggingface_token_here
```

### 4. 配置数据库

#### 使用 Supabase (推荐)

1. 访问 [Supabase](https://supabase.com) 创建新项目
2. 在项目设置中获取以下信息：
   - Project URL
   - Anon/Public Key
3. 在 Supabase SQL Editor 中执行 `supabase-setup.sql` 文件内容

### 5. 获取 HuggingFace API Token

1. 访问 [HuggingFace](https://huggingface.co/settings/tokens) 创建账户
2. 在设置中创建新的 Access Token
3. 将 Token 添加到 `.env.local` 文件中

### 6. 启动开发服务器

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
│   │   ├── api/
│   │   │   └── generate-description/
│   │   │       └── route.ts        # AI描述生成API
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx                # 主页面
│   ├── components/
│   │   ├── AddTodo.tsx             # 添加任务组件
│   │   ├── TodoItem.tsx            # 任务项组件
│   │   ├── EmptyState.tsx          # 空状态组件
│   │   ├── LoadingSpinner.tsx      # 加载状态组件
│   │   ├── FloatingImportExport.tsx # 浮动数据导入导出组件
│   │   └── StatisticsDashboard.tsx # 数据统计看板组件
│   ├── lib/
│   │   ├── supabase.ts             # Supabase客户端配置
│   │   └── todo.ts                 # 任务数据操作函数
│   └── types/
│       └── todo.ts                 # TypeScript类型定义
├── public/                         # 静态资源
├── supabase-setup.sql              # 数据库初始化脚本
├── sample-todos.csv                # 示例数据文件
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

### 数据导入导出
- **浮动按钮**: 右下角蓝色浮动按钮，点击打开导入导出功能
- **导出功能**: 将当前所有任务导出为CSV格式文件
- **导入功能**: 支持拖拽或点击选择CSV/Excel文件批量导入任务
- **模态框界面**: 弹窗式界面，不占用主界面空间
- **拖拽上传**: 直观的拖拽区域，支持文件拖拽上传
- **格式验证**: 自动验证导入文件格式和数据有效性
- **错误提示**: 详细的错误信息和导入结果反馈
- **示例文件**: 提供 `sample-todos.csv` 作为导入格式参考

### 数据统计看板
- **浮动按钮**: 右下角紫色浮动按钮，位于导入导出按钮上方
- **概览统计**: 总任务数、已完成、未完成、完成率等关键指标
- **状态分布**: 饼图和柱状图展示任务完成状态分布
- **本周趋势**: 折线图显示本周每日任务创建和完成情况
- **本月趋势**: 柱状图显示本月每周任务统计
- **实时更新**: 数据实时计算，反映最新任务状态
- **响应式设计**: 适配不同屏幕尺寸，移动端友好

### AI智能生成
- **智能描述**: 根据任务标题自动生成任务描述
- **字数控制**: 可自定义生成描述的字数限制（5-100字）
- **流式输出**: 支持逐字显示生成过程，提供更好的用户体验
- **一键生成**: 点击AI生成按钮即可快速生成描述
- **实时反馈**: 生成过程中显示加载状态
- **AI模型**: 使用Qwen2.5-VL-7B-Instruct模型生成高质量描述
- **中文优化**: 使用中文提示词，生成符合中文习惯的描述
- **提示词驱动**: 通过精心设计的提示词确保生成质量

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
3. 配置环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `HF_TOKEN`
4. 自动部署完成

### 其他平台

项目支持部署到任何支持 Next.js 的平台，如：
- Netlify
- Railway
- DigitalOcean App Platform

## 🔧 技术细节

### AI服务配置
- 使用 HuggingFace OpenAI API 兼容接口
- 模型：Qwen/Qwen2.5-VL-7B-Instruct:hyperbolic
- 支持流式输出，提供更好的用户体验
- 自动文本清理和格式化

### 数据库设计
- 使用 Supabase PostgreSQL
- 表结构：todos (id, title, description, completed, created_at, updated_at)
- 自动时间戳管理
- 实时数据同步

### 前端架构
- Next.js 15 App Router
- TypeScript 类型安全
- Tailwind CSS 响应式设计
- Recharts 数据可视化

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
