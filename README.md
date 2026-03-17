

# Nanxu Docs

技术文档站点，基于 VuePress 构建，收集整理日常开发中常用的工具类、配置方案和最佳实践。

## 项目简介

本项目是一个个人技术文档仓库，记录了 Java/Spring Boot 开发过程中积累的各种技术解决方案和工具类。主要包括认证授权、数据库连接池、缓存、接口文档、HTTP 工具等方面的内容。

## 技术栈

- **文档框架**: VuePress 2.x
- **主题**: VuePress 默认主题
- **构建工具**: npm/yarn
- **部署平台**: Gitee Pages

## 文档内容

### 核心功能

| 文档 | 说明 |
|------|------|
| [认证授权](./code/authentication.md) | JWT + Spring Security 完整登录认证方案，包含 Token 管理、密码加密、登录/退出登录实现 |
| [Druid 配置](./code/druid.md) | Druid 数据库连接池配置详解，包括监控、慢 SQL 统计、防火墙等 |
| [Redis 缓存](./code/redis.md) | Redis 连接池配置及 FastJson2 序列化方案 |
| [Swagger3 接口文档](./code/swagger3.md) | Swagger3 OpenAPI 接口文档配置与拦截器配置 |
| [全局异常处理](./code/globalExceptionHandler.md) | 统一异常处理与异常日志记录方案 |
| [登录日志](./code/loginLog.md) | 异步登录日志记录实现 |
| [性能日志](./code/performanceLog.md) | AOP 切面实现接口性能日志记录 |
| [HTTP 工具](./code/httpUtils.md) | WebClient HTTP 客户端工具类实现 |
| [IP 工具类](./code/IPUtils.md) | IP 地址获取与处理工具 |
| [地址工具类](./code/addressUtils.md) | IP 地址转地理位置信息工具 |
| [多环境配置](./code/profile.md) | Maven + YAML 多环境配置切换 |

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
│   │   ├── components/     # Vue 组件
│   │   ├── config.ts       # 配置文件
│   │   ├── navbar.ts       # 导航栏配置
│   │   ├── sidebar.ts      # 侧边栏配置
│   │   ├── styles/         # 样式文件
│   │   └── theme.ts        # 主题配置
│   ├── code/               # 技术文档目录
│   │   ├── authentication.md
│   │   ├── druid.md
│   │   ├── redis.md
│   │   └── ...
│   └── README.md           # 首页
├── package.json
└── tsconfig.json
```

## 部署

项目配置为部署到 Gitee Pages，构建后的静态文件可通过 Gitee 仓库的 Pages 服务访问。

## 许可证

MIT License

---

© 2024 Nanxu Docs. All rights reserved.