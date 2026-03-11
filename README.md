# 3D 打印新闻推送系统

每天早上 8:30 自动推送昨日 3D 打印领域热点新闻到邮箱。

## 📋 功能特性

- ✅ 自动抓取 3D 打印相关新闻
- ✅ 智能筛选热点内容
- ✅ 定时推送（每天 8:30）
- ✅ 美观的 HTML 邮件模板
- ✅ 支持多个新闻源
- ✅ 自动去重和分类

## 🚀 快速开始

### 步骤 1：配置 163 邮箱授权码

1. 登录 163 邮箱：https://mail.163.com/
2. 点击"设置" → "POP3/SMTP/IMAP"
3. 开启"POP3/SMTP服务"
4. 点击"授权密码" → "新增授权密码"
5. 复制生成的授权码（16位字符）

**重要：授权码不是邮箱密码！**

### 步骤 2：配置 GitHub Secrets

将以下 Secrets 添加到 GitHub 仓库：

| Secret 名称 | 值 |
|-------------|-----|
| SMTP_HOST | smtp.163.com |
| SMTP_PORT | 465 |
| SMTP_USER | tyutsjt@163.com |
| SMTP_PASSWORD | 你的163邮箱授权码 |
| TO_EMAIL | tyutsjt@163.com |

### 步骤 3：推送到 GitHub

```bash
# 1. 创建 GitHub 仓库
# 访问 https://github.com/new

# 2. 初始化本地仓库
git init
git add .
git commit -m "Initial commit"

# 3. 推送到 GitHub（替换YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/news-pusher-3d-printing.git
git branch -M main
git push -u origin main
```

### 步骤 4：配置 Secrets

1. 进入仓库页面
2. 点击 "Settings" → "Secrets and variables" → "Actions"
3. 点击 "New repository secret"
4. 添加以下 Secrets：

   ```
   SMTP_HOST = smtp.163.com
   SMTP_PORT = 465
   SMTP_USER = tyutsjt@163.com
   SMTP_PASSWORD = 你的16位授权码
   TO_EMAIL = tyutsjt@163.com
   ```

### 步骤 5：启用 GitHub Actions

1. 点击 "Actions" 标签
2. 点击 "I understand my workflows, go ahead and enable them"
3. 等待定时任务自动运行

## ⏰ 定时推送说明

- **推送时间**：每天早上 8:30（北京时间）
- **执行频率**：UTC 时间 0:30（北京时间 8:30）
- **手动触发**：在 Actions 页面点击 "Run workflow"

## 📧 邮件预览

发送的邮件包含：

- 🎨 精美的 HTML 设计
- 📊 新闻统计信息
- 📰 热点新闻列表
- 🏷️ 新闻来源标签
- 📅 发布日期

## 🔧 配置说明

### 修改推送时间

编辑 `.github/workflows/news-pusher.yml` 文件：

```yaml
schedule:
  - cron: '30 0 * * *'  # UTC时间 0:30 = 北京时间 8:30
```

Cron 表达式格式：`分 时 日 月 周`

### 修改邮件接收地址

修改 Secret：`TO_EMAIL`

### 添加更多新闻源

编辑 `news_pusher.py` 文件中的 `NEWS_SOURCES` 字典。

## 📝 测试方法

### 本地测试

```bash
# 安装依赖
pip install -r requirements.txt

# 设置环境变量
export SMTP_HOST="smtp.163.com"
export SMTP_PORT="465"
export SMTP_USER="tyutsjt@163.com"
export SMTP_PASSWORD="你的授权码"
export TO_EMAIL="tyutsjt@163.com"

# 运行脚本
python news_pusher.py
```

### GitHub Actions 测试

1. 进入 Actions 页面
2. 选择 "3D打印新闻推送" 工作流
3. 点击 "Run workflow"
4. 等待执行完成

## ❓ 常见问题

### Q: 邮件发送失败？

A: 检查以下几点：
- 授权码是否正确
- SMTP 服务是否已开启
- 网络连接是否正常
- GitHub Secrets 是否正确配置

### Q: 没有收到邮件？

A: 检查邮箱的垃圾邮件文件夹，可能被误判为垃圾邮件。

### Q: 如何修改推送时间？

A: 编辑 `.github/workflows/news-pusher.yml` 中的 cron 表达式。

### Q: 如何取消推送？

A: 在 GitHub 仓库中删除 `.github/workflows/news-pusher.yml` 文件，或禁用该工作流。

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**技术支持**：AI News Pusher Team
**更新时间**：2026-03-11
