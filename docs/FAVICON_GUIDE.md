# ClawHub 产品 Favicon 添加规范

本文档规范了为 ClawHub 添加产品图标（favicon）的标准流程和要求。

## 目录

- [图标来源优先级](#图标来源优先级)
- [图标格式要求](#图标格式要求)
- [文件命名规范](#文件命名规范)
- [存储位置](#存储位置)
- [配置步骤](#配置步骤)
- [示例](#示例)

---

## 图标来源优先级

按以下优先级获取产品图标：

### 1. 官方 favicon.ico（最高优先级）

直接从产品官网获取 favicon.ico 文件，这是最权威的图标来源。

**获取方式：**
- 浏览器访问产品官网，在地址栏左侧右键 → "查看网页源代码"
- 搜索 `favicon` 或 `icon`，找到图标链接
- 常见路径：`/favicon.ico`、`/images/favicon.ico`

**示例：**
```
https://example.com/favicon.ico
```

### 2. 官方 Logo 图片

如果 favicon.ico 不可用或质量不佳，使用官方 Logo 图片。

**获取方式：**
- 产品官网首页
- 产品官方 GitHub 仓库
- 官方品牌资源页面

### 3. 第三方图标库

如果官网没有合适的图标，可以从以下第三方来源获取：

- [Watcha](https://watcha.cn) - 产品信息聚合平台
- 各产品的 App Store / Google Play 页面
- 产品的社交媒体账号头像

### 4. Emoji 备选方案（最后手段）

如果以上方式都无法获取，使用 Emoji 作为临时图标。

**格式：**
```json
"icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦞</text></svg>"
```

---

## 图标格式要求

### 支持的格式

| 格式 | 优先级 | 说明 |
|------|--------|------|
| `.ico` | 推荐 | 传统 favicon 格式，兼容性最好 |
| `.png` | 推荐 | 现代 Web 标准，支持透明背景 |
| `.svg` | 支持 | 矢量格式，体积小但兼容性稍差 |

### 推荐尺寸

| 格式 | 推荐尺寸 |
|------|----------|
| `.ico` | 16x16, 32x32, 48x48（多尺寸打包） |
| `.png` | 64x64 或 128x128 |
| `.svg` | viewBox="0 0 100 100" |

### 文件大小限制

- **单个文件最大：100KB**
- **推荐大小：< 20KB**
- 超过限制的图片需要压缩后再使用

### 图片质量要求

- 必须有**透明背景**（除非图标本身有背景）
- 图像清晰，无锯齿
- 色彩准确，与官方品牌一致

---

## 文件命名规范

### 规则

1. **全部小写英文**
2. **与产品 ID 对应**（products.json 中的 id 字段）
3. **使用连字符分隔单词**
4. **禁止使用空格、中文、特殊字符**

### 示例

| 产品 ID | 文件名 | 完整路径 |
|---------|--------|----------|
| `feishu-miaoda` | `feishu.ico` | `images/feishu.ico` |
| `deskclaw` | `deskclaw.ico` | `images/deskclaw.ico` |
| `duclaw` | `baidu.png` | `images/baidu.png` |
| `miclaw` | `miclaw.png` | `images/miclaw.png` |
| `hiclaw` | `hiclaw.png` | `images/hiclaw.png` |

### 特殊情况

- 如果多个产品使用同一公司的图标（如飞书、百度），可以共用图标文件
- 命名应反映图标来源而非产品名称（便于理解图标含义）

---

## 存储位置

所有图标文件统一存储在项目根目录的 `images/` 文件夹中。

```
claw-hub/
├── images/
│   ├── feishu.ico        # 飞书相关产品图标
│   ├── feishu.png        # 飞书相关产品图标（PNG 版本）
│   ├── deskclaw.ico      # DeskClaw 图标
│   ├── baidu.png         # 百度相关产品图标
│   ├── miclaw.png        # MiClaw 图标
│   ├── hiclaw.png        # HiClaw 图标
│   └── workbuddy.png     # WorkBuddy 图标
├── data/
│   └── products.json
└── docs/
    └── FAVICON_GUIDE.md
```

---

## 配置步骤

### 步骤 1：获取图标

根据 [图标来源优先级](#图标来源优先级) 获取合适的图标文件。

**推荐工具：**
- [RealFaviconGenerator](https://realfavicongenerator.net/) - favicon 生成
- [TinyPNG](https://tinypng.com/) - PNG 压缩
- [ConvertICO](https://convertio.co/png-ico/) - 格式转换

### 步骤 2：处理图标

1. 确认图片格式（优先 `.ico`，其次 `.png`）
2. 调整尺寸至推荐大小
3. 压缩文件（如超过 20KB）
4. 确认透明背景

### 步骤 3：命名并放置

1. 按照 [文件命名规范](#文件命名规范) 重命名文件
2. 将文件复制到 `images/` 目录

```bash
# 示例：添加新产品的图标
cp ~/Downloads/newproduct.ico ./images/newproduct.ico
```

### 步骤 4：更新 products.json

在 `data/products.json` 中找到对应产品，更新 `icon` 字段：

```json
{
  "id": "newproduct",
  "name": "NewProduct",
  "icon": "images/newproduct.ico",
  ...
}
```

### 步骤 5：验证

1. 刷新 ClawHub 页面
2. 确认图标正常显示
3. 检查图标清晰度和颜色是否正确

---

## 示例

### 示例 1：使用官方 favicon.ico

```json
{
  "id": "miaoda",
  "name": "飞书妙搭",
  "icon": "images/feishu.ico",
  "description": "飞书云端部署 OpenClaw..."
}
```

### 示例 2：使用 PNG 格式

```json
{
  "id": "duclaw",
  "name": "DuClaw",
  "icon": "images/baidu.png",
  "description": "百度智能云 7x24 小时..."
}
```

### 示例 3：使用远程 URL

如果图标文件较大或需要保持与官方同步，可以直接使用远程 URL：

```json
{
  "id": "openclaw",
  "name": "OpenClaw",
  "icon": "https://openclaw.ai/favicon.ico",
  "description": "原版龙虾..."
}
```

### 示例 4：使用 Emoji SVG

作为最后手段，可以使用 Emoji：

```json
{
  "id": "clawhub",
  "name": "ClawHub",
  "icon": "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🦞</text></svg>",
  "description": "OpenClaw 官方技能市场..."
}
```

---

## 检查清单

添加新产品图标前，请确认：

- [ ] 图标来源可靠（官网 > GitHub > 第三方 > Emoji）
- [ ] 文件格式正确（.ico 或 .png）
- [ ] 文件大小 < 100KB（推荐 < 20KB）
- [ ] 文件命名符合规范（小写英文，与产品 ID 对应）
- [ ] 文件已放置在 `images/` 目录
- [ ] products.json 中的 icon 字段已更新
- [ ] 页面显示正常

---

## 常见问题

### Q: 图标不显示怎么办？

1. 检查文件路径是否正确
2. 确认文件格式受支持
3. 检查文件是否损坏
4. 清除浏览器缓存后重试

### Q: 图标模糊怎么办？

1. 使用更高分辨率的源图片
2. 优先使用 SVG 格式（如果是矢量图）
3. 确保图标尺寸为推荐尺寸

### Q: 可以使用 GIF 或动态图标吗？

不推荐。GIF 文件较大，且动态效果在小尺寸下效果不佳。

### Q: 多个产品可以共用一个图标吗？

可以。如果多个产品属于同一公司或使用相同品牌标识，可以共用图标文件。命名应反映图标来源。

---

*最后更新：2026-03-13*
