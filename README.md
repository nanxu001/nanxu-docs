# Nanxu Docs

个人技术文档站点，基于 VuePress Theme Hope 构建，记录 Java / Python 开发中的技术方案与学习笔记。

🌐 **在线访问**: [www.nanxu.online](https://www.nanxu.online)

## 技术栈

- **文档框架**: VuePress 2.x + VuePress Theme Hope
- **语言**: TypeScript
- **搜索**: DocSearch
- **图标**: FontAwesome 6
- **构建/部署**: npm / nginx

## 文档内容

### Java

| 文档 | 说明 |
|------|------|
| [多环境配置](./src/code/java/profile.md) | Maven + YAML 多环境配置切换 |
| [Druid 连接池](./src/code/java/druid.md) | Druid 数据库连接池配置，含监控、慢 SQL、防火墙 |
| [Redis 缓存](./src/code/java/redis.md) | Redis 连接池配置及 FastJSON2 序列化方案 |
| [HTTP 工具类](./src/code/java/http-utils.md) | WebClient HTTP 客户端工具类 |
| [IP 工具类](./src/code/java/ip-utils.md) | 用户真实 IP 地址获取 |
| [地址工具类](./src/code/java/address-utils.md) | IP 转地理位置信息 |
| [Swagger3](./src/code/java/swagger3.md) | OpenAPI 接口文档配置 |
| [Spring Security 认证](./src/code/java/authentication.md) | JWT + Spring Security 完整认证授权方案 |
| [登录日志](./src/code/java/login-log.md) | 异步登录日志记录 |
| [性能日志](./src/code/java/performance-log.md) | AOP 切面实现接口性能日志 |
| [全局异常处理](./src/code/java/global-exception-handler.md) | 统一异常处理与异常日志记录 |

### Python

#### 基础教程

| 文档 | 说明 |
|------|------|
| [安装 Python 环境](./src/code/python/foundation/guide/install.md) | Windows 下 Python 安装与环境变量配置 |
| [入门程序](./src/code/python/foundation/guide/start.md) | PyCharm 新建项目、编写并运行第一个程序 |
| [数据存储与运算](./src/code/python/foundation/guide/data-storage.md) | 字面量、变量、数据类型、字符串、输入输出、运算符 |
| [流程控制语句](./src/code/python/foundation/guide/control-flow.md) | if 条件判断、match 模式匹配、while/for 循环 |
| [Jupyter Notebook](./src/code/python/foundation/analysis/jupyter.md) | Jupyter Notebook 环境搭建与使用 |
| [Pandas](./src/code/python/foundation/analysis/pandas.md) | 数据清洗、筛选、聚合等操作 |
| [Matplotlib](./src/code/python/foundation/analysis/matplotlib.md) | 数据可视化绑图基础 |
| [案例：TMDB-TOP300](./src/code/python/foundation/analysis/case.md) | 电影榜单数据完整分析案例 |
| [封装](./src/code/python/foundation/web/encapsulation.md) | 面向对象之封装 |
| [继承](./src/code/python/foundation/web/inheritance.md) | 面向对象之继承 |
| [多态](./src/code/python/foundation/web/polymorphism.md) | 面向对象之多态、鸭子类型 |
| [FastAPI 基础](./src/code/python/foundation/web/fast-api-foundation.md) | FastAPI 入门、路由、参数 |
| [案例：图书管理系统](./src/code/python/foundation/web/library-management-system.md) | 面向对象综合案例 |
| [案例：AI 汉字谜盒](./src/code/python/foundation/web/ai-chinese-puzzle-box.md) | AI 对话功能实战案例 |

#### 进阶教程

| 文档 | 说明 |
|------|------|
| [多任务概述](./src/code/python/advanced/multithreading/multitasking.md) | 多任务基础概念 |
| [进程](./src/code/python/advanced/multithreading/process.md) | 多进程实现 |
| [线程](./src/code/python/advanced/multithreading/thread.md) | 多线程实现 |

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev

# 构建静态站点
npm run docs:build
```

## 项目结构

```
├── src/
│   ├── .vuepress/
│   │   ├── config.ts          # 配置文件
│   │   ├── navbar.ts          # 导航栏配置
│   │   ├── sidebar.ts         # 侧边栏配置
│   │   ├── theme.ts           # 主题配置
│   │   └── client.ts          # 客户端配置
│   ├── code/
│   │   ├── java/              # Java 技术文档
│   │   └── python/            # Python 学习笔记
│   │       ├── foundation/    # 基础教程
│   │       │   ├── guide/     # 入门指南
│   │       │   ├── analysis/  # 数据分析
│   │       │   └── web/       # Web 开发
│   │       └── advanced/      # 进阶教程
│   │           └── multithreading/
│   └── README.md              # 首页
├── package.json
└── tsconfig.json
```

## 许可证

MIT License

---

© 2026 Nanxu. All rights reserved.