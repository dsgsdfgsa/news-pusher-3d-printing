# MemOS 多 Agent 协作与长期记忆存储 - 完整部署指南

## 📋 目录

1. [项目概述](#项目概述)
2. [核心功能介绍](#核心功能介绍)
3. [环境准备](#环境准备)
4. [部署方案一：云端部署（推荐）](#部署方案一云端部署推荐)
5. [部署方案二：本地部署](#部署方案二本地部署)
6. [多 Agent 协作配置](#多-agent-协作配置)
7. [长期记忆存储配置](#长期记忆存储配置)
8. [使用示例](#使用示例)
9. [常见问题排查](#常见问题排查)
10. [最佳实践建议](#最佳实践建议)

---

## 项目概述

### 什么是 MemOS？

MemOS（Memory Operating System）是一个专为 LLM 和 Agent 系统设计的**AI 记忆操作系统**，它为 AI 提供了类似人类的长期记忆能力。

### memos-local-openclaw 是什么？

这是 MemOS 的**本地 OpenClaw 插件**，用于：
- 将多个 OpenClaw 实例连接到同一个记忆池
- 实现 Agent 之间的信息共享和协作
- 提供持久化的长期记忆存储

---

## 核心功能介绍

### 1. 多 Agent 协作

**工作原理：**
- 多个独立的 OpenClaw 实例通过相同的 `user_id` 连接到 MemOS
- Agent A 的产出自动存入共享记忆池
- Agent B 调用时直接获取完整背景信息
- 无需人工复制粘贴，实现无缝协作

**应用场景：**
- Agent A 负责创意设计 → Agent B 负责执行
- Agent A 收集信息 → Agent B 分析决策
- Agent A 处理用户需求 → Agent B 生成代码

**示例：**
```
Agent A（创意设计）：
  收集用户需求：用户想养一只小猫
  生成信息：小猫需要猫粮、猫砂、玩具

↓ 自动存入共享记忆池 ↓

Agent B（执行）：
  从记忆池读取：用户有只小猫，需要相关用品
  推荐产品：推荐适合小猫的猫粮品牌
```

### 2. 长期记忆存储

**核心特性：**
- **记忆分层建模**：参数记忆、明文记忆、激活记忆三层结构
- **记忆脑图组织**：将碎片化对话转化为结构化图谱
- **记忆调度管理**：智能调度策略，避免记忆混乱、遗忘或误用
- **混合检索机制**：结合向量检索和图结构检索

**与传统 RAG 的区别：**

| 特性 | 传统 RAG | MemOS |
|------|---------|-------|
| 记忆组织 | 无组织，越存越乱 | 结构化图谱，有层级关系 |
| 生命周期 | 无生命周期，越存越满 | 自动遗忘机制，智能清理 |
| 调度能力 | 无调度，越开越卡 | 智能调度，高效检索 |
| 版本管理 | 版本越来越多，难以维护 | 版本治理，可追溯 |
| 检索方式 | 单一向量检索 | 混合检索（向量+图谱） |

---

## 环境准备

### 前置要求

#### 方案一：云端部署（推荐）
- 云服务器（阿里云轻量应用服务器推荐）
- ≥ 2GB 内存，≥ 2vCPU
- 公网 IP（或通过域名访问）
- OpenClaw API Key（阿里云百炼）

#### 方案二：本地部署
- **操作系统**：Windows 11 或 Windows 10（版本 ≥ 19041）
- **Node.js**：版本 ≥ 22（推荐 v24.13.0+）
- **Git**：用于克隆代码
- **网络环境**：稳定的互联网连接（需要访问 GitHub 和 npm）
- **可选**：WSL2（Windows 子系统，官方推荐）

---

## 部署方案一：云端部署（推荐）

### 为什么选择云端部署？

✅ **优点：**
- 部署简单，一键安装
- 无需配置本地环境
- 随时随地访问
- 性能稳定，适合生产环境
- 内置 OpenClaw 环境

❌ **缺点：**
- 需要购买服务器
- 涉及 API Key 费用（按量计费）

### 详细部署步骤

#### 第一步：购买服务器

1. **访问阿里云轻量应用服务器**
   - 网址：https://www.aliyun.com/minisite/goods?userCode=t6duaoe1
   - 推荐配置：
     - 实例：2vCPU + 2GB（最低配置）
     - 地域：新加坡或美国（根据你的访问速度选择）
     - 购买时长：根据需求选择

2. **选择镜像**
   - 镜像类型：应用镜像
   - 镜像名称：OpenClaw（已默认适配最新版本）

3. **完成购买**
   - 提交订单并支付
   - 等待服务器创建完成（约 2-5 分钟）

#### 第二步：配置 OpenClaw

1. **获取 API Key**
   - 访问阿里云百炼控制台：https://bailian.console.aliyun.com/
   - 进入"密钥管理"
   - 点击"创建 API Key"
   - 复制并保存 API Key（重要：只显示一次）

2. **放通端口**
   - 登录轻量应用服务器控制台
   - 找到已购买的实例
   - 进入"应用详情"
   - 在"OpenClaw 使用步骤"区域，点击"一键放通"
   - 执行命令开放 18789 端口

3. **配置 API Key**
   - 点击"一键配置"
   - 粘贴刚才获取的 API Key
   - 执行命令完成密钥写入

4. **生成访问 Token**
   - 点击"执行命令"
   - 系统会生成一个访问 Token
   - 复制并保存 Token

#### 第三步：访问 OpenClaw

1. **打开 OpenClaw 界面**
   - 点击"打开网站页面"
   - 输入刚才生成的 Token
   - 进入 OpenClaw Web 对话界面

2. **验证安装**
   - 测试对话功能
   - 确认服务正常运行

#### 第四步：安装 MemOS 插件

1. **进入服务器终端**
   - 通过 SSH 连接服务器
   - 或使用阿里云控制台的"远程连接"

2. **克隆 MemOS 仓库**
   ```bash
   git clone https://github.com/MemTensor/MemOS.git
   cd MemOS
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **配置环境变量**
   ```bash
   # 创建配置文件
   cp .env.example .env
   
   # 编辑配置文件
   nano .env
   ```

   配置内容（示例）：
   ```env
   # MemOS 配置
   MEMOS_PORT=3000
   MEMOS_HOST=0.0.0.0
   
   # 数据库配置（使用本地 SQLite）
   DATABASE_TYPE=sqlite
   DATABASE_PATH=./data/memos.db
   
   # OpenClaw 配置
   OPENCLAW_API_URL=http://localhost:18789
   OPENCLAW_API_KEY=your_api_key_here
   
   # 嵌入模型配置（用于向量检索）
   EMBEDDING_MODEL=qwen-embedding
   EMBEDDING_API_KEY=your_embedding_key
   ```

5. **启动 MemOS 服务**
   ```bash
   npm run start
   ```

6. **安装 OpenClaw 插件**
   ```bash
   cd apps/memos-local-openclaw
   npm install
   npm run build
   ```

7. **配置插件**
   ```bash
   # 复制插件配置
   cp config.example.json config.json
   
   # 编辑配置
   nano config.json
   ```

   配置内容（示例）：
   ```json
   {
     "memos_url": "http://localhost:3000",
     "user_id": "your_shared_user_id",
     "auto_sync": true,
     "sync_interval": 60
   }
   ```

---

## 部署方案二：本地部署

### 前置环境安装

#### 1. 安装 Node.js

**Windows 系统：**
1. 访问 Node.js 官网：https://nodejs.org/zh-cn/download
2. 下载 Windows 安装包（64 位，.msi 格式）
3. 运行安装包，保持默认选项
4. **重要**：确保勾选"Add Node.js to PATH"
5. 完成安装后，打开 PowerShell 验证：
   ```powershell
   node -v
   # 输出应类似：v24.13.0
   ```

**macOS 系统：**
```bash
# 使用 Homebrew 安装
brew install node

# 验证安装
node -v && npm -v
```

#### 2. 安装 Git

**Windows 系统：**
1. 访问 Git 官网：https://git-scm.com/downloads
2. 下载 Windows 安装包
3. 运行安装程序，保持默认选项
4. 验证安装：
   ```powershell
   git --version
   ```

**macOS 系统：**
```bash
# 通常已预装，如果未安装：
brew install git
```

#### 3. （可选）安装 WSL2

**为什么推荐 WSL2？**
- OpenClaw 基于 Linux 构建
- 原生 Windows 环境容易出现路径或安全策略报错
- WSL2 提供更好的兼容性和性能

**安装步骤：**

1. **以管理员身份打开 PowerShell**
   ```powershell
   wsl --install
   ```

2. **重启电脑**

3. **完成 Ubuntu 初始化**
   - 从开始菜单打开"Ubuntu"
   - 首次打开时创建用户名和密码

4. **验证 WSL2**
   ```bash
   wsl --version
   ```

### 本地部署步骤

#### 第一步：克隆 MemOS 仓库

**在 WSL2 或 Linux 终端中：**
```bash
# 克隆仓库
git clone https://github.com/MemTensor/MemOS.git

# 进入项目目录
cd MemOS

# 查看项目结构
ls -la
```

#### 第二步：安装依赖

```bash
# 安装项目依赖
npm install

# 这可能需要几分钟，请耐心等待
```

#### 第三步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 使用编辑器打开配置文件
nano .env  # 或使用 vim、vscode 等
```

**配置内容：**
```env
# ===== MemOS 核心配置 =====
MEMOS_PORT=3000
MEMOS_HOST=0.0.0.0

# ===== 数据库配置 =====
# 选项 1：使用 SQLite（推荐用于开发）
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/memos.db

# 选项 2：使用 PostgreSQL（推荐用于生产）
# DATABASE_TYPE=postgresql
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=memos
# DATABASE_USER=postgres
# DATABASE_PASSWORD=your_password

# ===== 嵌入模型配置（用于向量检索）=====
# 使用阿里云百炼
EMBEDDING_MODEL=qwen-embedding
EMBEDDING_API_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding
EMBEDDING_API_KEY=your_dashscope_api_key

# 使用 OpenAI（备选）
# EMBEDDING_MODEL=text-embedding-3-small
# EMBEDDING_API_KEY=your_openai_api_key

# ===== OpenClaw 配置 =====
OPENCLAW_API_URL=http://localhost:18789
OPENCLAW_API_KEY=your_openclaw_api_key

# ===== 记忆管理配置 =====
# 记忆保留周期（天）
MEMORY_RETENTION_DAYS=90

# 记忆激活阈值（相关性分数）
MEMORY_ACTIVATION_THRESHOLD=0.7

# 自动记忆同步间隔（秒）
AUTO_SYNC_INTERVAL=60

# ===== 日志配置 =====
LOG_LEVEL=info
LOG_FILE=./logs/memos.log
```

#### 第四步：安装数据库（如果使用 PostgreSQL）

```bash
# Ubuntu/Debian 系统
sudo apt update
sudo apt install postgresql postgresql-contrib

# 启动 PostgreSQL 服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库
sudo -u postgres psql
```

在 PostgreSQL 提示符中：
```sql
CREATE DATABASE memos;
CREATE USER memos_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE memos TO memos_user;
\q
```

#### 第五步：初始化数据库

```bash
# 运行数据库迁移脚本
npm run db:migrate

# 或使用自定义迁移脚本
node scripts/init-db.js
```

#### 第六步：启动 MemOS 服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm run start

# 或使用 PM2（推荐用于生产）
pm2 start ecosystem.config.js
```

**PM2 配置示例（ecosystem.config.js）：**
```javascript
module.exports = {
  apps: [{
    name: 'memos',
    script: './index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      MEMOS_PORT: 3000
    }
  }]
};
```

#### 第七步：验证 MemOS 服务

```bash
# 检查服务状态
curl http://localhost:3000/health

# 测试 API
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{"text": "测试记忆内容", "user_id": "test_user"}'
```

---

## 多 Agent 协作配置

### 配置原理

**核心机制：**
1. 所有 Agent 使用**相同的 `user_id`** 连接到 MemOS
2. 每个 Agent 独立运行，但共享同一个记忆池
3. Agent A 的对话内容自动存入共享记忆池
4. Agent B 可以检索和访问 Agent A 的记忆

### 配置步骤

#### 步骤 1：创建共享用户 ID

```bash
# 在 MemOS 中创建一个共享用户 ID
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "shared_team", "description": "多Agent协作团队"}'
```

响应示例：
```json
{
  "user_id": "user_abc123xyz",
  "name": "shared_team",
  "created_at": "2026-03-11T10:00:00Z"
}
```

**保存这个 `user_id`，所有 Agent 都要使用它！**

#### 步骤 2：配置 Agent A

创建 Agent A 的配置文件 `agent_a_config.json`：

```json
{
  "agent_name": "创意设计 Agent",
  "memos_config": {
    "url": "http://localhost:3000",
    "user_id": "user_abc123xyz",
    "auto_save": true,
    "save_interval": 30
  },
  "memory_config": {
    "enable_long_term": true,
    "enable_context": true,
    "context_window": 10
  }
}
```

#### 步骤 3：配置 Agent B

创建 Agent B 的配置文件 `agent_b_config.json`：

```json
{
  "agent_name": "执行 Agent",
  "memos_config": {
    "url": "http://localhost:3000",
    "user_id": "user_abc123xyz",
    "auto_load": true,
    "load_on_query": true
  },
  "memory_config": {
    "enable_long_term": true,
    "enable_retrieval": true,
    "retrieval_threshold": 0.7
  }
}
```

**关键点：两个配置文件中的 `user_id` 必须相同！**

#### 步骤 4：启动多个 Agent

**方式 1：使用 PM2 管理多个 Agent**

创建 `agents.config.js`：

```javascript
module.exports = {
  apps: [
    {
      name: 'agent-a',
      script: './agents/agent-a.js',
      instances: 1,
      autorestart: true,
      env: {
        AGENT_NAME: '创意设计 Agent',
        MEMOS_USER_ID: 'user_abc123xyz'
      }
    },
    {
      name: 'agent-b',
      script: './agents/agent-b.js',
      instances: 1,
      autorestart: true,
      env: {
        AGENT_NAME: '执行 Agent',
        MEMOS_USER_ID: 'user_abc123xyz'
      }
    }
  ]
};
```

启动：
```bash
pm2 start agents.config.js
pm2 logs
```

**方式 2：手动启动多个 Agent**

```bash
# 终端 1：启动 Agent A
MEMOS_USER_ID=user_abc123xyz npm run agent:a

# 终端 2：启动 Agent B
MEMOS_USER_ID=user_abc123xyz npm run agent:b
```

### 协作流程示例

#### 场景：产品开发流程

**Agent A（产品经理）收集需求：**
```
用户反馈：希望增加深色模式
上下文：用户反馈收集时间 2026-03-11
用户画像：长期活跃用户，UI/UX 关注度高
```

**自动存入共享记忆池：**
```json
{
  "user_id": "user_abc123xyz",
  "agent_id": "agent-a",
  "type": "requirement",
  "content": "用户希望增加深色模式",
  "metadata": {
    "priority": "high",
    "category": "feature_request",
    "collected_at": "2026-03-11T10:00:00Z"
  }
}
```

**Agent B（开发工程师）读取需求：**
```
从共享记忆池检索：
- 用户需求：增加深色模式
- 用户画像：UI/UX 关注度高
- 优先级：高

生成开发计划：
1. 设计深色模式配色方案
2. 实现主题切换功能
3. 适配所有页面组件
```

**自动存入共享记忆池：**
```json
{
  "user_id": "user_abc123xyz",
  "agent_id": "agent-b",
  "type": "development_plan",
  "content": "深色模式开发计划...",
  "related_memories": ["requirement_123"]
}
```

---

## 长期记忆存储配置

### 记忆分层机制

MemOS 采用三层记忆结构，模拟人类记忆系统：

#### 1. 参数记忆（Parametric Memory）

**特点：**
- 存储在模型的参数中
- 访问速度快，无需额外检索
- 但容量有限，难以持久化

**配置：**
```javascript
const parametricConfig = {
  max_tokens: 4096,
  context_window: 8192
};
```

#### 2. 明文记忆（Explicit Memory）

**特点：**
- 存储在向量数据库中
- 支持语义检索
- 可持久化，容量大

**配置：**
```javascript
const explicitConfig = {
  storage_type: "vector_db",
  embedding_model: "qwen-embedding",
  vector_dimensions: 1536,
  max_memories: 10000
};
```

#### 3. 激活记忆（Active Memory）

**特点：**
- 根据查询动态激活相关记忆
- 通过检索-召回机制
- 只加载最相关的记忆到上下文

**配置：**
```javascript
const activeConfig = {
  retrieval_method: "hybrid",  // 混合检索（向量+图谱）
  top_k: 5,                    // 返回最相关的 5 条记忆
  threshold: 0.7,              # 相关性阈值
  context_limit: 2048          # 上下文限制（tokens）
};
```

### 记忆图谱构建

MemOS 将碎片化对话组织成结构化图谱：

#### 图谱节点类型

```javascript
const nodeTypes = {
  EVENT: "事件节点",        // 记录用户行为和事件
  ENTITY: "实体节点",       // 记录人、物、地点等实体
  CONCEPT: "概念节点",      // 记录抽象概念和知识
  EMOTION: "情感节点",      // 记录用户情感倾向
  SKILL: "技能节点",        // 记录用户掌握的技能
  PREFERENCE: "偏好节点"    // 记录用户偏好
};
```

#### 图谱边类型

```javascript
const edgeTypes = {
  CAUSAL: "因果关系",       // 事件 A 导致事件 B
  TEMPORAL: "时间关系",     // 事件 A 发生在事件 B 之前
  SEMANTIC: "语义关联",     // 两个概念在语义上相关
  ATTRIBUTE: "属性关系",    // 实体 A 具有属性 B
  PREFERENCE: "偏好关系",   // 用户偏好实体 A
  SKILL: "技能关系"         // 用户掌握技能 A
};
```

### 记忆生命周期管理

#### 自动遗忘机制

MemOS 实现智能的记忆遗忘策略：

**遗忘规则：**
```javascript
const forgettingRules = {
  // 规则 1：基于时间的遗忘
  time_based: {
    decay_rate: 0.1,              // 每天衰减 10%
    threshold: 0.3,              // 低于 0.3 时标记为待删除
    priority_memory_days: 365,   // 重要记忆保留 1 年
    normal_memory_days: 90,      // 普通记忆保留 3 个月
    temporary_memory_days: 7     // 临时记忆保留 1 周
  },

  // 规则 2：基于访问频率的遗忘
  frequency_based: {
    access_count_weight: 0.3,    // 访问次数权重
    recent_access_weight: 0.7    // 最近访问权重
  },

  // 规则 3：基于重要性的遗忘
  importance_based: {
    critical: Infinity,           // 关键记忆永不删除
    important: 365,               // 重要记忆保留 1 年
    normal: 90,                   # 普通记忆保留 3 个月
    low_priority: 30              # 低优先级记忆保留 1 个月
  }
};
```

#### 记忆压缩

当记忆数量超过阈值时，自动进行记忆压缩：

```javascript
const compressionConfig = {
  max_memories: 10000,           # 最大记忆数量
  compression_threshold: 0.8,    # 超过 80% 时触发压缩
  compression_ratio: 0.5,        # 压缩到原数量的 50%
  
  # 压缩策略
  strategies: [
    "merge_similar",             # 合并相似记忆
    "summarize",                 # 生成摘要
    "cluster",                   # 聚类压缩
    "deduplicate"                # 去重
  ]
};
```

### 记忆检索优化

#### 混合检索机制

```javascript
const hybridRetrieval = {
  # 向量检索
  vector_search: {
    enabled: true,
    top_k: 10,
    threshold: 0.7,
    embedding_model: "qwen-embedding"
  },

  # 图谱检索
  graph_search: {
    enabled: true,
    max_depth: 3,                # 最大跳数
    node_types: ["EVENT", "ENTITY", "CONCEPT"],
    edge_types: ["SEMANTIC", "CAUSAL"]
  },

  # 关键词检索
  keyword_search: {
    enabled: true,
    match_type: "fuzzy"         # 模糊匹配
  },

  # 融合策略
  fusion: {
    method: "weighted_average",   # 加权平均
    weights: {
      vector: 0.4,
      graph: 0.4,
      keyword: 0.2
    },
    rerank: true                # 重排序
  }
};
```

### 配置示例

完整的长期记忆配置：

```javascript
module.exports = {
  memory: {
    // 记忆存储
    storage: {
      database_type: "postgresql",  # 或 "sqlite"
      connection_string: process.env.DATABASE_URL
    },

    // 记忆分层
    layers: {
      parametric: {
        enabled: true,
        max_tokens: 4096
      },
      explicit: {
        enabled: true,
        vector_db: {
          type: "pgvector",        # PostgreSQL + pgvector
          dimensions: 1536,
          index_type: "ivfflat"
        }
      },
      active: {
        enabled: true,
        context_limit: 2048,
        top_k: 5
      }
    },

    // 记忆生命周期
    lifecycle: {
      retention_days: 90,
      auto_cleanup: true,
      cleanup_interval: 86400,      # 每天
      compression_enabled: true,
      max_memories: 10000
    },

    // 检索配置
    retrieval: {
      method: "hybrid",
      threshold: 0.7,
      top_k: 5,
      enable_context: true,
      enable_rerank: true
    },

    // 图谱配置
    graph: {
      enabled: true,
      auto_build: true,
      max_nodes: 5000,
      max_edges: 15000
    }
  }
};
```

---

## 使用示例

### 示例 1：基础对话记忆

#### 启动 MemOS

```bash
# 启动服务
npm run start

# 服务运行在 http://localhost:3000
```

#### 添加记忆

```javascript
// 使用 JavaScript 客户端
const MemosClient = require('@memtensor/memos-client');

const client = new MemosClient({
  url: 'http://localhost:3000',
  userId: 'user_abc123xyz'
});

// 添加记忆
await client.addMemory({
  text: '用户喜欢吃辣的食物',
  metadata: {
    category: 'preference',
    confidence: 0.9,
    timestamp: new Date().toISOString()
  }
});
```

或使用 cURL：

```bash
curl -X POST http://localhost:3000/api/memories \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_abc123xyz",
    "text": "用户喜欢吃辣的食物",
    "metadata": {
      "category": "preference",
      "confidence": 0.9
    }
  }'
```

#### 检索记忆

```javascript
// 检索相关记忆
const results = await client.searchMemories({
  query: '用户喜欢吃什么？',
  top_k: 5,
  threshold: 0.7
});

console.log(results);
```

### 示例 2：多 Agent 协作

#### Agent A：需求收集

```javascript
// agent-a.js
const MemosClient = require('@memtensor/memos-client');

const client = new MemosClient({
  url: 'http://localhost:3000',
  userId: 'shared_team_user'  // 共享用户 ID
});

// 收集用户需求
const requirement = {
  text: '用户希望增加深色模式功能',
  type: 'requirement',
  priority: 'high',
  metadata: {
    source: 'user_feedback',
    timestamp: new Date().toISOString(),
    user_profile: {
      active_days: 365,
      preferences: ['dark_theme', 'minimalist']
    }
  }
};

// 自动存入共享记忆池
await client.addMemory(requirement);
console.log('需求已存入共享记忆池');
```

#### Agent B：开发执行

```javascript
// agent-b.js
const MemosClient = require('@memtensor/memos-client');

const client = new MemosClient({
  url: 'http://localhost:3000',
  userId: 'shared_team_user'  // 相同的共享用户 ID
});

// 从共享记忆池检索需求
const requirements = await client.searchMemories({
  query: '有什么新的功能需求？',
  type: 'requirement',
  top_k: 5
});

// 根据需求生成开发计划
if (requirements.length > 0) {
  const latestRequirement = requirements[0];

  const devPlan = {
    text: `开发计划：${latestRequirement.text}`,
    type: 'development_plan',
    related_memory_id: latestRequirement.id,
    steps: [
      '设计深色模式配色方案',
      '实现主题切换功能',
      '适配所有页面组件'
    ],
    estimated_days: 7
  };

  // 将开发计划存入共享记忆池
  await client.addMemory(devPlan);
  console.log('开发计划已存入共享记忆池');
}
```

### 示例 3：长期记忆存储

#### 持久化存储配置

```javascript
// 配置 PostgreSQL 数据库
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'memos',
  user: 'memos_user',
  password: 'your_password'
});

// 创建表结构
await pool.query(`
  CREATE TABLE IF NOT EXISTS memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 0,
    last_accessed_at TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_memories_user_id ON memories(user_id);
  CREATE INDEX IF NOT EXISTS idx_memories_embedding ON memories USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);
`);
```

#### 添加长期记忆

```javascript
async function addLongTermMemory(text, metadata = {}) {
  // 生成嵌入向量
  const embedding = await generateEmbedding(text);

  // 存储到数据库
  const result = await pool.query(
    `INSERT INTO memories (user_id, text, embedding, metadata)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    ['user_abc123xyz', text, embedding, metadata]
  );

  return result.rows[0];
}

// 使用示例
await addLongTermMemory(
  '用户是一名前端开发工程师，擅长 React 和 TypeScript',
  {
    type: 'user_profile',
    confidence: 0.95,
    skills: ['React', 'TypeScript', 'CSS']
  }
);
```

#### 检索长期记忆

```javascript
async function searchLongTermMemory(query, topK = 5) {
  // 生成查询嵌入
  const queryEmbedding = await generateEmbedding(query);

  // 向量检索
  const result = await pool.query(
    `SELECT id, text, metadata,
            1 - (embedding <=> $1) as similarity
     FROM memories
     WHERE user_id = $2
     ORDER BY embedding <=> $1
     LIMIT $3`,
    [queryEmbedding, 'user_abc123xyz', topK]
  );

  return result.rows;
}

// 使用示例
const memories = await searchLongTermMemory('用户擅长什么技术？');
console.log(memories);
```

### 示例 4：记忆图谱构建

#### 构建用户画像图谱

```javascript
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://localhost/memos'
});

await client.connect();

// 创建图数据表
await client.query(`
  CREATE TABLE IF NOT EXISTS graph_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    node_type VARCHAR(50) NOT NULL,
    name TEXT NOT NULL,
    properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS graph_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    source_node_id UUID REFERENCES graph_nodes(id),
    target_node_id UUID REFERENCES graph_nodes(id),
    edge_type VARCHAR(50) NOT NULL,
    properties JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// 创建实体节点
async function createEntityNode(userId, name, properties) {
  const result = await client.query(
    `INSERT INTO graph_nodes (user_id, node_type, name, properties)
     VALUES ($1, 'ENTITY', $2, $3)
     RETURNING *`,
    [userId, name, properties]
  );
  return result.rows[0];
}

// 创建概念节点
async function createConceptNode(userId, name, properties) {
  const result = await client.query(
    `INSERT INTO graph_nodes (user_id, node_type, name, properties)
     VALUES ($1, 'CONCEPT', $2, $3)
     RETURNING *`,
    [userId, name, properties]
  );
}

// 创建边
async function createEdge(userId, sourceNodeId, targetNodeId, edgeType, properties) {
  const result = await client.query(
    `INSERT INTO graph_edges (user_id, source_node_id, target_node_id, edge_type, properties)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, sourceNodeId, targetNodeId, edgeType, properties]
  );
  return result.rows[0];
}

// 构建图谱示例
const userNode = await createEntityNode('user_abc123xyz', '张三', {
  role: '前端开发工程师',
  company: 'TechCorp'
});

const reactNode = await createConceptNode('user_abc123xyz', 'React', {
  category: 'programming_language',
  proficiency: 'expert'
});

const typescriptNode = await createConceptNode('user_abc123xyz', 'TypeScript', {
  category: 'programming_language',
  proficiency: 'advanced'
});

// 创建关系边
await createEdge(userNode.id, reactNode.id, 'SKILL', {
  years: 3,
  projects: 15
});

await createEdge(userNode.id, typescriptNode.id, 'SKILL', {
  years: 2,
  projects: 10
});

await createEdge(reactNode.id, typescriptNode.id, 'SEMANTIC', {
  relationship: 'commonly_used_together'
});
```

---

## 常见问题排查

### 问题 1：MemOS 服务无法启动

**症状：**
```bash
$ npm run start
Error: listen EADDRINUSE: address already in use :::3000
```

**原因：** 端口 3000 已被占用

**解决方案：**

方案 A：修改端口
```bash
# 编辑 .env 文件
nano .env

# 修改
MEMOS_PORT=3001
```

方案 B：关闭占用端口的进程
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### 问题 2：数据库连接失败

**症状：**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**原因：** PostgreSQL 服务未启动

**解决方案：**

```bash
# Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl enable postgresql

# macOS (Homebrew)
brew services start postgresql

# 验证服务状态
sudo systemctl status postgresql
```

### 问题 3：嵌入模型 API 调用失败

**症状：**
```
Error: Request failed with status code 401
```

**原因：** API Key 无效或过期

**解决方案：**

1. 检查 API Key 是否正确配置
```bash
# 查看 .env 文件
cat .env | grep API_KEY
```

2. 重新生成 API Key
- 访问阿里云百炼控制台
- 重新创建 API Key
- 更新 .env 文件

3. 测试 API Key
```bash
curl -X POST https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-v3",
    "input": {"texts": ["测试"]}
  }'
```

### 问题 4：多 Agent 无法共享记忆

**症状：** Agent B 无法检索到 Agent A 存储的记忆

**原因：** `user_id` 不一致

**解决方案：**

1. 检查各 Agent 的配置文件
```bash
# Agent A
cat agent_a_config.json | grep user_id

# Agent B
cat agent_b_config.json | grep user_id
```

2. 确保 `user_id` 完全相同

3. 重新配置并重启 Agent
```bash
pm2 restart agent-a
pm2 restart agent-b
```

### 问题 5：记忆检索结果不准确

**症状：** 检索到的记忆与查询不相关

**原因：** 相关性阈值设置过高或嵌入模型质量问题

**解决方案：**

1. 调整检索阈值
```javascript
// 降低阈值
const threshold = 0.5;  // 原来 0.7
```

2. 增加返回数量
```javascript
// 增加 top_k
const top_k = 10;  // 原来 5
```

3. 使用混合检索
```javascript
const retrievalConfig = {
  method: "hybrid",
  vector_search: { top_k: 10 },
  graph_search: { max_depth: 3 },
  keyword_search: { match_type: "fuzzy" }
};
```

### 问题 6：内存占用过高

**症状：** MemOS 服务占用大量内存

**原因：** 未启用记忆压缩或保留太多记忆

**解决方案：**

1. 启用记忆压缩
```javascript
const lifecycleConfig = {
  compression_enabled: true,
  max_memories: 5000,      // 降低最大记忆数量
  compression_threshold: 0.7  // 提前触发压缩
};
```

2. 手动清理旧记忆
```javascript
await client.deleteMemories({
  before: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),  // 90天前
  min_access_count: 1
});
```

3. 使用 SQLite 代替 PostgreSQL（开发环境）
```env
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/memos.db
```

---

## 最佳实践建议

### 1. 用户 ID 管理

**建议：**
- 为每个团队/项目创建独立的 `user_id`
- 使用有意义的命名，如 `team_project_20260311`
- 避免使用随机字符串，便于管理

```javascript
// ✅ 推荐
const userId = 'team_frontend_product_a_2026';

// ❌ 不推荐
const userId = 'user_abc123xyz';
```

### 2. 记忆分类和标签

**建议：**
- 为每条记忆添加明确的类型和标签
- 使用标准化的分类体系
- 便于检索和管理

```javascript
await client.addMemory({
  text: '用户反馈：希望增加深色模式',
  metadata: {
    type: 'user_feedback',           // 类型
    category: 'feature_request',    // 分类
    priority: 'high',                // 优先级
    tags: ['ui', 'theme'],           // 标签
    source: 'in_app_feedback'        // 来源
  }
});
```

### 3. 记忆质量控制

**建议：**
- 只存储有价值的信息
- 避免存储临时性、低质量内容
- 定期清理和验证记忆

```javascript
// 添加记忆前验证质量
function validateMemory(text) {
  // 检查文本长度
  if (text.length < 10) return false;

  // 检查是否包含敏感词
  const sensitiveWords = ['密码', 'token', 'secret'];
  if (sensitiveWords.some(word => text.includes(word))) {
    return false;
  }

  // 检查是否为重复内容
  // ... 去重逻辑

  return true;
}

if (validateMemory(text)) {
  await client.addMemory({ text });
}
```

### 4. 性能优化

**建议：**
- 使用索引加速检索
- 启用缓存机制
- 合理设置上下文限制

```javascript
const optimizationConfig = {
  // 数据库索引
  indexes: [
    'user_id',
    'created_at',
    'type',
    'embedding'  // 向量索引
  ],

  // 缓存配置
  cache: {
    enabled: true,
    ttl: 3600,  // 1小时
    max_size: 1000
  },

  // 上下文限制
  context: {
    max_tokens: 2048,
    max_memories: 5
  }
};
```

### 5. 安全和隐私

**建议：**
- 不要存储敏感信息（密码、密钥、个人隐私）
- 加密存储重要数据
- 定期备份数据库

```javascript
// 加密敏感数据
const crypto = require('crypto');

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// 使用
const encrypted = encrypt('sensitive_data', process.env.ENCRYPTION_KEY);
```

### 6. 监控和日志

**建议：**
- 启用详细日志
- 监控关键指标（API 调用次数、检索速度、内存占用）
- 设置告警规则

```javascript
const loggingConfig = {
  level: 'debug',  // debug, info, warn, error
  format: 'json',  // json, text
  outputs: [
    'console',
    'file'  // 输出到文件
  ],
  metrics: {
    enabled: true,
    interval: 60,  // 每60秒记录一次
    metrics: [
      'api_calls',
      'retrieval_time',
      'memory_count',
      'memory_usage'
    ]
  }
};
```

### 7. 版本控制

**建议：**
- 对配置文件进行版本控制
- 使用 Git 追踪配置变更
- 建立配置回滚机制

```bash
# 初始化 Git 仓库
git init
git add .env.example config.json
git commit -m "Initial configuration"

# 追踪变更
git diff .env

# 回滚配置
git checkout HEAD -- .env
```

### 8. 备份和恢复

**建议：**
- 定期备份数据库
- 测试备份恢复流程
- 保留多个备份版本

```bash
# PostgreSQL 备份
pg_dump -h localhost -U memos_user memos > backup_$(date +%Y%m%d).sql

# 恢复
psql -h localhost -U memos_user memos < backup_20260311.sql
```

---

## 附录

### A. 参考资源

- **MemOS 官方文档**: https://github.com/MemTensor/MemOS
- **OpenClaw 官方文档**: https://docs.openclaw.ai
- **阿里云百炼 API**: https://bailian.console.aliyun.com/
- **PostgreSQL 文档**: https://www.postgresql.org/docs/

### B. 配置文件模板

完整的 `.env` 模板：

```env
# ===== MemOS 核心配置 =====
NODE_ENV=production
MEMOS_PORT=3000
MEMOS_HOST=0.0.0.0

# ===== 数据库配置 =====
# SQLite（开发）
DATABASE_TYPE=sqlite
DATABASE_PATH=./data/memos.db

# PostgreSQL（生产）
# DATABASE_TYPE=postgresql
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=memos
# DATABASE_USER=memos_user
# DATABASE_PASSWORD=your_secure_password

# ===== 嵌入模型配置 =====
EMBEDDING_MODEL=qwen-embedding
EMBEDDING_API_URL=https://dashscope.aliyuncs.com/api/v1/services/embeddings/text-embedding/text-embedding
EMBEDDING_API_KEY=your_dashscope_api_key

# ===== OpenClaw 配置 =====
OPENCLAW_API_URL=http://localhost:18789
OPENCLAW_API_KEY=your_openclaw_api_key

# ===== 记忆管理配置 =====
MEMORY_RETENTION_DAYS=90
MEMORY_ACTIVATION_THRESHOLD=0.7
AUTO_SYNC_INTERVAL=60
MAX_MEMORIES=10000

# ===== 检索配置 =====
RETRIEVAL_METHOD=hybrid
RETRIEVAL_TOP_K=5
RETRIEVAL_THRESHOLD=0.7
ENABLE_RERANK=true

# ===== 图谱配置 =====
GRAPH_ENABLED=true
GRAPH_AUTO_BUILD=true
GRAPH_MAX_NODES=5000
GRAPH_MAX_EDGES=15000

# ===== 日志配置 =====
LOG_LEVEL=info
LOG_FORMAT=json
LOG_FILE=./logs/memos.log

# ===== 性能配置 =====
CACHE_ENABLED=true
CACHE_TTL=3600
CACHE_MAX_SIZE=1000

# ===== 安全配置 =====
ENCRYPTION_KEY=your_encryption_key_32_characters_long
```

### C. 故障排查清单

| 问题 | 检查项 | 解决方案 |
|------|--------|----------|
| 服务无法启动 | 端口是否被占用 | 修改端口或关闭占用进程 |
| 数据库连接失败 | PostgreSQL 是否运行 | 启动 PostgreSQL 服务 |
| API 调用失败 | API Key 是否有效 | 重新生成 API Key |
| 无法共享记忆 | user_id 是否一致 | 检查并统一 user_id |
| 检索不准确 | 阈值是否过高 | 调整检索阈值 |
| 内存占用过高 | 是否启用压缩 | 启用记忆压缩 |
| 性能慢 | 是否有索引 | 创建数据库索引 |

---

## 结语

本指南详细介绍了 MemOS 多 Agent 协作与长期记忆存储的完整部署流程。按照本指南，你可以：

✅ 部署 MemOS 服务（云端或本地）
✅ 配置多 Agent 协作
✅ 实现长期记忆存储
✅ 构建记忆图谱
✅ 优化检索性能

如果在部署过程中遇到问题，请参考[常见问题排查](#常见问题排查)章节，或查阅官方文档获取更多帮助。

**祝你部署顺利！** 🎉
