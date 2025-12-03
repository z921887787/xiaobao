# 小宝成长日记静态站

记录女儿成长点滴的静态网站，包含首页、成长日记、照片墙、影音合集和隐私政策等内容版块。项目以纯静态 HTML/CSS 构建，适合托管在 GitHub Pages 或任意静态资源平台。

## 功能特色
- **首页**：展示成长里程碑、热门章节、联系信息。
- **成长瞬间** (`blog/memories.html`)：用文字记录重要事件。
- **照片墙** (`blog/gallery.html`)：图集式呈现精彩瞬间。
- **影像集** (`blog/videos.html`)：嵌入家庭视频，支持桌面与移动端播放。
- **隐私政策** (`blog/privacy.html`)：说明内容授权、儿童信息保护策略。
- **统一设计风格**：温馨配色与统一布局，适合家庭纪念性质的站点。

## 目录结构
```
.
├── blog/                 # 主站点文件
│   ├── index.html        # 首页
│   ├── memories.html     # 成长瞬间
│   ├── gallery.html      # 照片墙
│   ├── videos.html       # 影像集
│   ├── privacy.html      # 隐私政策
│   ├── styles/main.css   # 全局样式
│   └── assets/           # 图片与视频资源（当前为占位素材）
├── .specify/             # 规范与脚本（供内部使用）
├── .codex/               # Codex CLI 配置
└── README.md             # 项目说明（即本文档）
```

## 快速开始
1. 克隆仓库：
   ```bash
   git clone https://github.com/z921887787/xiaobao.git
   cd xiaobao
   ```
2. 本地预览（推荐使用 Node.js ≥ 16）：
   ```bash
   npx serve blog
   ```
   然后访问 `http://localhost:3000` 即可看到页面效果。
3. 替换真实素材：
   - 将家庭照片放入 `blog/assets/images/`，替换同名文件或同步更新 HTML 中的 `src`。
   - 将视频放入 `blog/assets/videos/`，建议使用 H.264 编码的 `.mp4`。
   - 更新文案时谨慎校对，保持语气与隐私要求一致。

## GitHub Pages 部署
1. 打开 GitHub 仓库 **Settings → Pages**。
2. 在 **Build and deployment** 中选择：
   - **Source**：`Deploy from a branch`
   - **Branch**：`main`
   - **Folder**：`/blog`
3. 保存设置后等待 GitHub Pages 构建完成，页面会在数分钟内于 `https://z921887787.github.io/xiaobao/` （或你的 GitHub 用户名对应的域名）上线。
4. 如需自定义域名，可在同一页面配置 `Custom domain` 并按提示添加 DNS 记录。

## 安全与隐私提示
- 本仓库内的图片与视频仅为占位文件，请务必用真实素材替换并妥善保密。
- 若站点上线到公开网络，建议结合 Basic Auth 或对象存储签名 URL 等方式限制访问，防止敏感内容被盗用。

## 致谢
感谢家人对项目的支持，这是为小宝保留回忆的一份特别礼物。如需新增版块或功能，欢迎继续在此基础上扩展，保持代码与文档同步更新。
