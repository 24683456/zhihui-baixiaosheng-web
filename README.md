# 智汇百晓生 · Dify 校园助手前端

基于官方 `langgenius/webapp-conversation` Fork 定制，保留 Next.js 15、React 19 与原有 Dify 会话、流式问答、文件上传和反馈逻辑。

## 本地预览

```bash
npm install
npm run dev -- --port 7100
```

打开 `http://localhost:7100/`。未配置 API Key 时，项目默认进入明确标注的前端演示模式，不会请求 Dify，演示回复也不代表校园政策答复。

## 接入 Dify

复制 `.env.example` 为 `.env.local`，在 Dify 控制台创建 Web App API Key 后填写：

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_ID=你的应用ID
NEXT_PUBLIC_APP_KEY=你的APIKey
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

`.env.local` 已被 Git 忽略，不要提交真实密钥。当前仍沿用上游的客户端 API Key 模式；公开部署前应评估密钥暴露风险，必要时改为服务端代理。

## 双主题界面

顶部调色板按钮可在“经典酒红”和“淡色手帐”之间切换，选择保存在当前浏览器的 `localStorage` 键 `zhihui-baixiaosheng.ui-theme.v1` 中，刷新后仍会保留。两套主题只改变展示层，共用同一套 Dify 对话与定时任务逻辑。

淡色主题包含建筑拼贴首页与档案搜索页：首页支持问题输入、检索/问答切换和快捷标签；档案页支持关键词与分类筛选、条目选择、收藏、键盘导航及 Dify 问答入口。建筑版画来自 Wellcome Collection（CC BY 4.0），局部装饰来自用户提供的参考截图；完整来源、许可和使用范围见 `CREDITS.md`。

## 定时任务原型

顶部“定时任务”支持新建、编辑、启停和删除，配置保存在当前浏览器的 `localStorage` 中，清除浏览器数据会丢失，且不会跨设备同步。

**当前不会自动执行或离线推送，也尚未创建 Dify 定时 Workflow。** 后续接入时实现 `app/components/schedule/types.ts` 中的 `ScheduleRepository`，替换 `ScheduleDialog.tsx` 的默认 `localScheduleRepository` 即可复用界面和表单模型。

主要模块：

- `app/components/schedule/`：定时任务界面、类型和本地存储适配器
- `app/components/demo/demo-service.ts`：明确隔离的本地演示数据
- `app/components/welcome/campus-welcome.tsx`：经典主题校园助手欢迎页
- `app/components/welcome/pastel-welcome.tsx`：淡色主题视图状态入口
- `app/components/welcome/pastel-home.tsx`：建筑拼贴首页与问题输入
- `app/components/welcome/pastel-archive.tsx`：档案搜索、筛选、收藏与问答入口
- `app/components/index.tsx`：原 Dify 主会话逻辑与演示分支
- `config/index.ts`：应用名称、中文语言与演示模式判断

## 检查

```bash
npx tsc --noEmit
npm run build
```

原上游项目已归档为只读；本仓库保留其许可证与来源信息，后续校园前端修改在此 Fork 中继续。
