# 郑大百晓生 · Dify 校园助手前端

基于官方 `langgenius/webapp-conversation` Fork 定制，保留 Next.js 15、React 19 与原有 Dify 会话、流式问答、文件上传和反馈逻辑。

对外名称统一为“郑大百晓生”；内部 `localStorage` 键和 Git 仓库名保持原样，以免影响已有浏览器数据与仓库配置。

## 本地构建与运行（新手教程）

下面从下载代码开始，依次完成开发预览和生产构建。命令可以在 **Windows PowerShell、Windows Terminal 或 Git Bash** 中运行；除特别注明外，都应在仓库根目录执行。

### 1. 准备环境

请先安装：

- [Git](https://git-scm.com/downloads)：下载和更新代码。
- **Node.js 20 或更高版本**：运行 Next.js、React 和 npm。当前版本已在 Node.js `24.14.0`、npm `11.9.0` 上验证。
- 如需真实问答，再准备一个**已发布、可正常对话的 Dify 聊天助手 / Agent / Chatflow**。只看界面时不需要 Dify。

安装后打开一个新的终端，检查环境：

```bash
git --version
node --version
npm --version
```

三个命令都能显示版本号即可。如果提示“不是内部或外部命令”或 `command not found`，请先完成安装，再关闭并重新打开终端。

### 2. 下载代码并进入项目

```bash
git clone --branch feat/campus-dify-ui https://github.com/24683456/zhihui-baixiaosheng-web.git
cd zhihui-baixiaosheng-web
```

如果电脑里已经有这份代码，不需要重复下载，只需进入仓库目录并确认使用目标分支：

```bash
git checkout feat/campus-dify-ui
```

仓库根目录应能直接看到 `package.json`、`.env.example`、`app/` 和 `config/`。不需要再进入名为 `service` 的目录。

### 3. 安装依赖

```bash
npm install
```

依赖会安装到本地 `node_modules/`，该目录已被 Git 忽略，不需要上传。安装过程中保持网络畅通；不要用 `npm audit fix --force` 擅自升级依赖。

### 4. 配置 Dify（只做界面预览时可跳过）

在项目根目录复制环境变量模板。

Windows PowerShell / CMD：

```powershell
copy .env.example .env.local
```

macOS / Linux / Git Bash：

```bash
cp .env.example .env.local
```

然后使用文本编辑器打开 `.env.local`，填写自己的应用信息：

```env
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_ID=你的Dify应用ID
NEXT_PUBLIC_APP_KEY=你的Dify应用API密钥
NEXT_PUBLIC_API_URL=https://api.dify.ai/v1
```

- **App ID**：在 Dify 应用的“访问入口 → 自定义前端”中查看。
- **API Key**：在 Dify 应用的“访问入口 → 后端服务 API → API 密钥”中创建或复制。
- **API 地址**：Dify Cloud 通常为 `https://api.dify.ai/v1`；自部署 Dify 请填写自己的 API 前缀。
- 切换到另一个 Dify 应用时，**App ID 和 API Key 要一起更换**，否则可能混用旧应用的本地会话记录。

未配置 API Key 时，项目会进入明确标注的前端演示模式，不会请求 Dify。`.env.local` 已被 Git 忽略，**不要把真实密钥写进 README、提交到 GitHub或发送到公开聊天中**。

> 当前仍沿用上游的 `NEXT_PUBLIC_APP_KEY` 客户端密钥模式，密钥可能进入浏览器代码。本地调试可以使用；公开部署前应改为由 Next.js 服务端持有密钥，并增加访问控制或限流。

### 5. 启动开发预览

```bash
npm run dev -- --host localhost --port 7100
```

看到 `Ready` 后，在浏览器打开：

```text
http://localhost:7100/
```

首次访问需要编译，等待几秒属于正常现象。请保持终端窗口运行；需要停止服务时，在该窗口按 **Ctrl+C**。

修改 `.env.local` 后，需要重启开发服务：

1. 按 **Ctrl+C** 停止当前服务。
2. 重新执行上面的 `npm run dev` 命令。
3. 刷新浏览器页面。

开发模式下左下角可能出现黑色的 **N** 图标，这是 Next.js 的开发工具入口，正式部署不会显示。

### 6. 构建并运行生产版本

生产构建用于检查正式部署时使用的代码，不会自动发布到公网。

**开发预览和生产构建共用 `.next/` 目录。请先按 Ctrl+C 停止开发服务，再执行构建：**

```bash
npm run build
```

构建成功后，可在 `7101` 端口启动生产预览，以便和常用的开发地址区分开：

```bash
npm run start -- --hostname localhost --port 7101
```

打开：

```text
http://localhost:7101/
```

构建结果保存在 `.next/`，该目录不需要提交。修改代码或环境变量后，应先停止生产预览，再重新执行 `npm run build` 和 `npm run start`。

日常构建只需要 Node.js。`public/trianon/index.html` 已是随仓库提供的自包含手账页面，**不需要安装 Python，也不需要重新生成 Trianon**。

### 7. 检查手机端与两套界面

桌面浏览器可以模拟手机尺寸：按 **F12** 打开开发者工具，再按 **Ctrl+Shift+M** 切换设备工具栏。

建议至少检查：

- 酒红欢迎页、发送问题、接收回答和历史会话抽屉。
- 右下角小本子 / 酒杯按钮能否往返切换两套界面。
- 手账首页的标题卡、三个入口、输入框和发送按钮是否完整。
- 手账“随便聊聊”示例页是否能进入，文字与确认卡是否能正常阅读。
- `393×852`、`360×800` 手机竖屏，以及 `1440×900` 桌面尺寸。

模拟器不能替代真机。正式发布前，仍建议使用真实手机检查软键盘、刘海安全区和触控操作。

### 常见问题

| 现象 | 处理方法 |
| --- | --- |
| `EADDRINUSE` 或端口已被占用 | 停止之前的前端服务，或把 `--port 7100` 改成其他空闲端口。 |
| 页面能打开，但只显示演示回复 | 检查 `.env.local` 是否存在、是否填写 App ID / API Key，以及 `NEXT_PUBLIC_DEMO_MODE` 是否为 `false`，然后重启服务。 |
| 修改环境变量后没有生效 | 开发模式需要重启；生产模式还需要重新构建。仅刷新网页不够。 |
| `Could not find a production build` / `production-start-no-build-id` | 先停止开发服务，再依次运行 `npm run build` 和 `npm run start`。如果构建后又启动过开发模式，需要重新构建。 |
| Dify 返回 `401` / `403` | 核对 API Key 是否属于目标应用、是否仍有效，不要在聊天或截图中泄露密钥。 |
| 切换应用后历史会话异常 | 确认 App ID 与 Key 已一起更换，然后新建对话；不同 Dify 应用的会话不会自动迁移。 |
| 出现证书链或代理证书错误 | 先检查代理和网络证书配置，不要通过关闭 TLS 校验来掩盖问题。开发脚本会在 Node.js 支持时使用系统证书库。 |

## 经典酒红问答与 Trianon 手账展示

右下角的小本子/酒杯按钮在两种展示之间切换，选择保存在当前浏览器的 `localStorage` 键 `zhihui-baixiaosheng.ui-theme.v1`（内部键名保持不变），刷新后仍会保留。

- **经典酒红问答**：完整的 Dify 使用端。应用参数、会话创建、流式回答、历史记录、反馈和定时任务都在这里工作，真实问答只发生在这里。
- **Trianon 手账展示**：仅用于界面与交互演示。使用同源 iframe 加载固定入口 `/trianon/index.html#empty`，不共享酒红端的 Header、Sidebar 或 Chat，不请求 Dify，也不包含真实校园政策数据。桌面和平板以 1440×900 画布居中等比完整展示；手机竖屏使用真实屏宽，完整重排中央卡片、入口、输入区与示例对话，并支持纵向滚动；横屏仍完整缩放并提供“在新标签打开手账展示”的链接。所有校园问答仅作示例，不构成正式政策答复。

手账分支在 Dify 故障提示与加载状态之前渲染。Dify 不可用时仍可通过右下角按钮查看纯展示页；从手账切回经典酒红只恢复原有界面，不会新建会话或清空已有历史。两套展示共用同一份会话状态，但只有酒红端发起真实请求。

Trianon 单文件与许可放在 `public/trianon/`。来源、commit、MIT 许可以及素材和字体许可位置见 `CREDITS.md`。请保留原作者署名、许可文本和 `for 妁妁 only` 签名。

## 定时任务原型

顶部“定时任务”支持新建、编辑、启停和删除，配置保存在当前浏览器的 `localStorage` 中，清除浏览器数据会丢失，且不会跨设备同步。

**当前不会自动执行或离线推送，也尚未创建 Dify 定时 Workflow。** 后续接入时实现 `app/components/schedule/types.ts` 中的 `ScheduleRepository`，替换 `ScheduleDialog.tsx` 的默认 `localScheduleRepository` 即可复用界面和表单模型。

## 主要模块

- `app/components/index.tsx`：酒红端 Dify 主会话逻辑、演示分支与 Trianon 展示分支
- `app/components/trianon-showcase.tsx`：Trianon 同源 iframe、桌面等比缩放与手机竖屏完整布局
- `app/components/theme/ThemeToggle.tsx`：右下角“Trianon 手账展示/经典酒红问答”切换按钮
- `app/components/theme/theme-context.tsx`：展示层主题状态与本地保存
- `app/components/header.tsx`：酒红端顶部栏、定时任务入口
- `app/components/welcome/campus-welcome.tsx`：酒红端校园助手欢迎页
- `app/components/demo/demo-service.ts`：明确隔离的本地演示数据
- `app/components/schedule/`：定时任务界面、类型和本地存储适配器
- `config/index.ts`：应用名称、中文语言与演示模式判断
- `public/trianon/`：Trianon 单文件、原作者许可和素材/字体许可

## 检查与已知限制

提交前至少运行生产构建，并对修改过的 TS / TSX 文件执行 ESLint。例如：

```bash
npm run build
npx eslint app/components/trianon-showcase.tsx
```

提交代码时，Husky 会通过 `lint-staged` 自动检查本次暂存的 TS / JS 文件，不需要另外安装 pnpm。

注意：`next.config.js` 当前配置为构建时跳过 ESLint 和 TypeScript 校验，因此 `npm run build` 成功不代表类型检查全部通过。`npx tsc --noEmit` 目前仍保留 **5 个上游类型错误**，位于：

- `app/components/base/file-uploader-in-attachment/file-item.tsx`
- `app/components/base/file-uploader-in-attachment/hooks.ts`（3 个）
- `app/components/base/markdown.tsx`

这些问题需要单独处理，不要在本地构建时通过升级全部依赖来强行消除。

原上游项目已归档为只读；本仓库保留其许可证与来源信息，后续校园前端修改在此 Fork 中继续。
