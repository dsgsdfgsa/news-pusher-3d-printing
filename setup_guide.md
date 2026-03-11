# 3D 打印新闻推送系统 - 配置指南

## 📋 前置准备

在开始之前，你需要准备：

1. ✅ GitHub 账号
2. ✅ 163 邮箱账号（tyutsjt@163.com）
3. ✅ 10 分钟时间

---

## 🎯 完整配置步骤（5步搞定）

### 第 1 步：获取 163 邮箱授权码（最重要！）

1. **登录 163 邮箱**
   - 访问：https://mail.163.com/
   - 使用你的账号密码登录

2. **开启 SMTP 服务**
   - 点击顶部"设置"菜单
   - 选择"POP3/SMTP/IMAP"
   - 找到"POP3/SMTP服务"，点击"开启"

3. **生成授权码**
   - 在"POP3/SMTP服务"下方，点击"授权密码"
   - 点击"新增授权密码"
   - **发送短信验证**
   - 获得一个 16 位的授权码（类似：`ABCDEF1234567890`）

4. **保存授权码**
   - ⚠️ **重要：复制并保存这个 16 位授权码**
   - 这不是你的邮箱密码！
   - 这个授权码只会显示一次，一定要保存好！

**示例授权码：`ABCDEFGH12345678`（请使用你自己的）**

---

### 第 2 步：创建 GitHub 仓库

1. **访问 GitHub**
   - 打开：https://github.com/new

2. **填写仓库信息**
   - Repository name: `news-pusher-3d-printing`
   - Description: `每天早上8:30自动推送3D打印热点新闻`
   - 选择 `Public` 或 `Private` 都可以
   - **不要**勾选 "Add a README file"
   - 点击 "Create repository"

3. **复制仓库地址**
   - 复制你的仓库地址，类似：
     ```
     https://github.com/YOUR_USERNAME/news-pusher-3d-printing.git
     ```

---

### 第 3 步：推送代码到 GitHub

**在 PowerShell 或命令行中执行：**

```powershell
# 进入项目目录
cd c:/Users/jiangtao/WorkBuddy/20260310112716

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 3D打印新闻推送系统"

# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/news-pusher-3d-printing.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果遇到错误，可能需要：**

1. **设置 Git 用户信息**
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "tyutsjt@163.com"
   ```

2. **如果提示需要身份验证**
   - 使用 Personal Access Token：
   - 访问：https://github.com/settings/tokens
   - 生成新的 Token，勾选 `repo` 权限
   - 使用 Token 替代密码进行登录

---

### 第 4 步：配置 GitHub Secrets

1. **进入仓库设置**
   - 访问你的仓库页面
   - 点击 "Settings" 标签

2. **进入 Secrets 设置**
   - 在左侧菜单中找到 "Secrets and variables"
   - 点击 "Actions"

3. **添加 Secrets**

   点击 "New repository secret"，依次添加以下 5 个 Secrets：

   | Secret 名称 | 值 | 说明 |
   |-------------|-----|------|
   | SMTP_HOST | smtp.163.com | 邮件服务器地址 |
   | SMTP_PORT | 465 | 端口号 |
   | SMTP_USER | tyutsjt@163.com | 你的邮箱 |
   | SMTP_PASSWORD | `你的16位授权码` | ⚠️ 不是邮箱密码！ |
   | TO_EMAIL | tyutsjt@163.com | 接收邮件的地址 |

   **添加步骤：**
   - Name: 输入 Secret 名称（如：`SMTP_HOST`）
   - Value: 输入对应值（如：`smtp.163.com`）
   - 点击 "Add secret"

4. **确认配置**
   - 添加完 5 个 Secrets 后，应该能看到它们在列表中
   - 点击每个 Secret 右侧的眼睛图标，确认值正确

---

### 第 5 步：启用 GitHub Actions

1. **进入 Actions 页面**
   - 点击仓库顶部的 "Actions" 标签

2. **启用 Workflows**
   - 如果看到提示："I understand my workflows, go ahead and enable them"
   - 点击绿色按钮启用

3. **手动测试运行**
   - 在左侧选择 "3D打印新闻推送" 工作流
   - 点击右侧 "Run workflow" 按钮
   - 再次点击绿色的 "Run workflow" 按钮
   - 等待 1-2 分钟

4. **查看执行结果**
   - 点击最新的运行记录
   - 查看执行日志
   - 如果成功，应该看到 "✅ 新闻推送成功完成！"

5. **检查邮箱**
   - 打开 163 邮箱
   - 查收测试邮件
   - 如果在收件箱找不到，检查"垃圾邮件"文件夹

---

## ✅ 配置完成！

恭喜！你已经成功配置了 3D 打印新闻推送系统！

### 📅 定时推送

系统将：
- 每天早上 **8:30** 自动推送
- 推送昨日 3D 打印领域热点新闻
- 发送到你的邮箱：tyutsjt@163.com

### 🔍 查看推送历史

1. 访问 GitHub 仓库的 "Actions" 页面
2. 查看每次执行的历史记录
3. 点击记录查看详细日志

### 📧 邮件内容

每封邮件包含：
- 📊 新闻统计（今日新闻数量、来源数量）
- 📰 热点新闻列表（标题、链接、来源、日期）
- 🎨 精美的 HTML 设计

---

## ❓ 常见问题

### Q1: 邮件发送失败？

**可能原因：**
- ❌ 授权码错误
- ❌ SMTP 服务未开启
- ❌ GitHub Secrets 配置错误

**解决方法：**
1. 重新获取 163 邮箱授权码
2. 检查 SMTP 服务是否已开启
3. 检查 GitHub Secrets 是否正确（区分大小写）
4. 查看 Actions 日志，查看具体错误信息

### Q2: 没有收到邮件？

**解决方法：**
1. 检查邮箱的"垃圾邮件"文件夹
2. 检查邮箱是否开启了过滤规则
3. 手动触发一次 Actions，查看日志确认是否发送成功

### Q3: 如何修改推送时间？

**修改 `.github/workflows/news-pusher.yml` 文件：**

```yaml
schedule:
  - cron: '30 0 * * *'  # 修改这里
```

**Cron 表达式说明：**
- 格式：`分 时 日 月 周`
- `30 0 * * *` = UTC 0:30 = 北京时间 8:30
- `0 9 * * *` = UTC 9:00 = 北京时间 17:00

**其他示例：**
- `0 1 * * *` = UTC 1:00 = 北京时间 9:00
- `30 2 * * *` = UTC 2:30 = 北京时间 10:30

修改后需要：
1. 提交代码到 GitHub
2. 推送到仓库
3. 新的定时规则会在下次执行时生效

### Q4: 如何取消推送？

**方法 1：禁用工作流**
1. 进入仓库 "Settings" → "Actions"
2. 找到 "3D打印新闻推送" 工作流
3. 点击右侧的三个点
4. 选择 "Disable workflow"

**方法 2：删除工作流文件**
1. 删除 `.github/workflows/news-pusher.yml` 文件
2. 提交并推送到 GitHub

### Q5: 如何修改接收邮箱？

修改 GitHub Secret：
1. 进入 "Settings" → "Secrets and variables" → "Actions"
2. 找到 `TO_EMAIL` Secret
3. 点击 "Update"
4. 修改邮箱地址
5. 点击 "Update secret"

### Q6: 如何查看执行日志？

1. 访问仓库的 "Actions" 页面
2. 点击任意一条执行记录
3. 展开查看详细日志
4. 可以看到每一步的执行情况

---

## 🎉 总结

你现在拥有了一个完全自动化、免费的新闻推送系统！

### 核心优势

- ✅ **完全免费**：GitHub Actions 免费使用
- ✅ **无需服务器**：不用购买云服务器
- ✅ **稳定可靠**：GitHub 基础设施
- ✅ **易于维护**：代码在 GitHub 上托管
- ✅ **定时推送**：每天早上 8:30 自动发送

### 下一步

你可以：
1. 📧 收到第一封测试邮件后，查看邮件内容
2. 🔧 根据需要调整推送时间
3. ➕ 添加更多新闻源（修改代码）
4. 📊 查看推送历史和统计

---

## 📞 技术支持

如果遇到问题：

1. **查看 Actions 日志**：在 GitHub 仓库的 Actions 页面
2. **检查配置**：确认 GitHub Secrets 正确
3. **重新测试**：手动触发一次工作流
4. **联系支持**：通过 GitHub Issues 提问

---

**祝你使用愉快！** 🚀

**配置完成时间**：2026-03-11
**推送邮箱**：tyutsjt@163.com
**推送时间**：每天早上 8:30
