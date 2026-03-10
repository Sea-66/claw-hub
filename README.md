# 🦞 ClawHub - 龙虾聚合站

[![Deploy to GitHub Pages](https://github.com/yourusername/claw-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/yourusername/claw-hub/actions/workflows/deploy.yml)

ClawHub 是龙虾（OpenClaw）系列 AI Agent 产品的聚合导航站，收录所有 Claw 系列产品，包括开源原版、国产商业版、工具系统等。

![ClawHub Screenshot](docs/screenshot.png)

## ✨ 功能特点

- 🔍 **快速搜索** - 按名称、描述、标签快速查找产品
- 🏷️ **分类筛选** - 开源原版、国产商业、工具/系统
- 🌙 **暗黑模式** - 自动检测系统偏好，支持手动切换
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **纯静态** - 无需后端，GitHub Pages 即可部署
- 🔄 **自动同步** - 支持 ClawHub API 数据自动同步

## 🚀 快速开始

### 本地预览

```bash
# 克隆仓库
git clone https://github.com/yourusername/claw-hub.git
cd claw-hub

# 使用任意静态服务器启动
npx serve .
# 或
python -m http.server 8000
```

然后访问 http://localhost:8000

### 部署到 GitHub Pages

1. Fork 本仓库
2. 进入 Settings > Pages
3. Source 选择 "Deploy from a branch"
4. 选择 `main` 分支，目录选择 `/ (root)`
5. 保存后等待部署完成

## 📁 项目结构

```
claw-hub/
├── index.html              # 主页面
├── css/
│   └── style.css           # 自定义样式
├── js/
│   ├── app.js              # 主逻辑：渲染、筛选、搜索
│   └── api.js              # API 调用模块
├── data/
│   ├── products.json       # Claw 产品列表
│   └── skills.json         # 技能数据（从 ClawHub 同步）
├── tools/
│   └── sync-skills.js      # 数据同步脚本
├── .github/
│   └── workflows/
│       └── sync-skills.yml # 自动同步工作流
└── README.md
```

## 🔧 配置说明

### 添加新产品

编辑 `data/products.json`，在 `products` 数组中添加：

```json
{
  "id": "your-claw",
  "name": "YourClaw",
  "emoji": "🦞",
  "description": "产品描述",
  "stars": "10K+",
  "language": "TypeScript",
  "type": "opensource",
  "tags": ["开源", "TypeScript"],
  "url": "https://github.com/yourclaw",
  "installUrl": "https://github.com/yourclaw#installation"
}
```

字段说明：
- `type`: `opensource` | `commercial` | `tool`
- `stars`: GitHub Stars 数（可选）
- `company`: 公司名称（商业产品必填）
- `status`: 产品状态（可选）

### 同步 ClawHub 技能数据

```bash
# 手动同步
node tools/sync-skills.js

# 或配置环境变量
CLAWHUB_API_URL=https://clawhub.ai/api node tools/sync-skills.js
```

自动同步通过 GitHub Actions 每天执行一次。

## 🎨 自定义样式

项目使用 Tailwind CSS (CDN)，自定义样式在 `css/style.css`。

修改主题色：
```html
<!-- index.html 中的 tailwind.config -->
<script>
tailwind.config = {
    theme: {
        extend: {
            colors: {
                claw: {
                    500: '#ed7712',  // 主色调
                    // ...
                }
            }
        }
    }
}
</script>
```

## 📦 收录产品

### 开源原版
- [OpenClaw](https://github.com/openclaw/openclaw) - 原版龙虾
- [NanoClaw](https://github.com/qwibitai/nanoclaw) - 轻量级版本
- [ZeroClaw](https://github.com/zeroclaw/zeroclaw) - Rust 极致轻量
- [PicoClaw](https://github.com/sipeed/picoclaw) - Go 嵌入式版本
- 更多...

### 国产商业
- QClaw (腾讯)
- LobsterAI (网易有道)
- Miclaw (小米)
- Kimi Claw (月之暗面)
- 更多...

### 工具/系统
- OneClaw - 一键安装包
- ClawOS - 龙虾操作系统
- ClawSec - 安全技能套件
- 更多...

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🔗 相关链接

- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [ClawHub API](https://clawhub.ai/api)
- [Tailwind CSS](https://tailwindcss.com)

---

Made with 🦞 by ClawHub Community
