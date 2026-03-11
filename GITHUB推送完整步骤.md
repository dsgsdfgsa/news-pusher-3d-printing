# 🚀 GitHub 仓库推送完整步骤

## ⏳ 当前进度

| 步骤 | 状态 |
|------|------|
| Git 仓库初始化 | ✅ 完成 |
| 代码提交 | ✅ 完成 |
| GitHub 仓库创建 | ✅ 完成 |
| 推送代码到 GitHub | ⏳ 需要手动操作 |
| 配置 GitHub Secrets | ⏳ 待完成 |
| 启动定时任务 | ⏳ 待完成 |

---

## 📝 第4步：推送代码到 GitHub（手动操作）

### 方法1：使用 Personal Access Token（推荐）

#### 4.1 创建 GitHub Personal Access Token

1. 访问：https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 配置 Token：
   - **Note**: `News Pusher`
   - **Expiration**: 选择 `90 days` 或更长期限
   - **Scopes**: 勾选 ✅ `repo`（这个最重要）
4. 点击 "Generate token"
5. **复制这串 Token**（类似：`ghp_xxxxxxxxxxxxxxxxxxxx`）
   - ⚠️ **重要**：Token 只显示一次，请立即复制保存！

#### 4.2 推送代码到 GitHub

在 PowerShell 中执行：

```powershell
cd c:/Users/jiangtao/WorkBuddy/20260310112716

git push -u origin main
```

**当提示输入密码时**：
- **Username**: `dsgsdfgsa`
- **Password**: 粘贴你的 **Personal Access Token**（不是 GitHub 密码）

---

### 方法2：使用 GitHub CLI（如果已安装）

```powershell
gh auth login
# 选择 GitHub.com
# 选择 HTTPS
# 选择 Yes（登录）
# 粘贴 Token

git push -u origin main
```

---

## ✅ 推送成功后，继续第5步

推送成功后，访问你的仓库：
https://github.com/dsgsdfgsa/news-pusher-3d-printing

你应该能看到所有文件已经上传成功！

---

## 🔐 第5步：配置 GitHub Secrets（手动操作）

### 5.1 进入仓库设置

1. 访问：https://github.com/dsgsdfgsa/news-pusher-3d-printing/settings/secrets/actions
2. 点击 "New repository secret"

### 5.2 添加 5 个 Secrets

按顺序添加以下 5 个 Secrets：

#### Secret 1: SMTP_HOST
- **Name**: `SMTP_HOST`
- **Value**: `smtp.163.com`
- 点击 "Add secret"

#### Secret 2: SMTP_PORT
- **Name**: `SMTP_PORT`
- **Value**: `465`
- 点击 "Add secret"

#### Secret 3: SMTP_USER
- **Name**: `SMTP_USER`
- **Value**: `tyutsjt@163.com`
- 点击 "Add secret"

#### Secret 4: SMTP_PASSWORD
- **Name**: `SMTP_PASSWORD`
- **Value**: `CDUpqSwb2NgZfYFd`（你的授权码）
- 点击 "Add secret"

#### Secret 5: TO_EMAIL
- **Name**: `TO_EMAIL`
- **Value**: `tyutsjt@163.com`
- 点击 "Add secret"

---

## 🧪 第6步：手动测试运行

### 6.1 进入 Actions 页面

1. 访问：https://github.com/dsgsdfgsa/news-pusher-3d-printing/actions
2. 你应该看到 "3D打印新闻推送" 工作流

### 6.2 手动触发测试

1. 点击 "3D打印新闻推送" 工作流
2. 点击右侧 "Run workflow" 按钮
3. 选择 `main` 分支
4. 点击绿色的 "Run workflow" 按钮

### 6.3 查看执行状态

1. 等待 1-2 分钟
2. 查看执行日志，确认没有错误
3. 检查你的邮箱 `tyutsjt@163.com` 是否收到测试邮件

---

## 📅 定时任务说明

GitHub Actions 会自动在以下时间运行：

- **时间**：每天早上 **8:30**（北京时间）
- **时区**：UTC+8
- **Cron 表达式**：`30 0 * * *`（UTC 时间 00:30 = 北京时间 08:30）

---

## ✅ 完成后你将拥有

- ✅ 每天早上 8:30 自动收到 3D 打印新闻
- ✅ 精选热点资讯，无需自己搜索
- ✅ 完全免费，无需服务器
- ✅ 稳定可靠，GitHub 托管

---

## 📧 测试邮件示例

成功后，你将收到类似这样的邮件：

```
主题：📰 3D打印热点新闻 - 2026年03月10日

📊 今日概览
• 抓取新闻：15 条
• 精选热点：10 条
• 新闻来源：3 个

🔥 热点新闻

1. [行业] Stratasys 发布新型金属 3D 打印解决方案
   来源：3D打印行业网 | 发布时间：2026-03-10

2. [技术] MIT 团队开发出超高速 3D 打印技术
   来源：南极熊3D打印 | 发布时间：2026-03-10

...更多新闻

---
由 3D 打印新闻推送系统自动发送
```

---

## ❓ 常见问题

### Q1: 推送时提示 "Authentication failed"

**解决方法**：
- 确认使用的是 Personal Access Token，不是 GitHub 密码
- Token 确保勾选了 `repo` 权限
- Token 是否已过期

### Q2: Actions 运行失败，显示 SMTP 错误

**检查清单**：
- ✅ 授权码是否正确：`CDUpqSwb2NgZfYFd`
- ✅ SMTP 服务是否已开启（163 邮箱设置）
- ✅ GitHub Secrets 是否正确配置

### Q3: 没有收到邮件

**检查**：
- 查看垃圾邮件文件夹
- 查看 Actions 执行日志
- 确认邮箱过滤规则

---

## 📞 需要帮助？

如果遇到任何问题，请告诉我：

1. 具体是哪个步骤出错了？
2. 错误信息是什么？
3. 你已经完成了哪些步骤？

我会帮你排查和解决问题！
