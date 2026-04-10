# Nanxu Docs

A technical documentation site built with VuePress, collecting and organizing commonly used utilities, configuration schemes, and best practices from daily development.

## Project Overview

This project is a personal technical documentation repository that documents various technical solutions and utilities accumulated during Java/Spring Boot development. It primarily covers authentication and authorization, database connection pools, caching, API documentation, HTTP utilities, and more.

## Technology Stack

- **Documentation Framework**: VuePress 2.x  
- **Theme**: VuePress Default Theme  
- **Build Tool**: npm/yarn  
- **Deployment Platform**: Gitee Pages  

## Documentation Content

### Core Features

| Document | Description |
|----------|-------------|
| [Authentication & Authorization](./code/authentication.md) | Complete login authentication solution using JWT + Spring Security, including Token management, password encryption, and login/logout implementation |
| [Druid Configuration](./code/druid.md) | Detailed configuration of Druid database connection pool, including monitoring, slow SQL statistics, and firewall settings |
| [Redis Cache](./code/redis.md) | Redis connection pool configuration and FastJson2 serialization solution |
| [Swagger3 API Documentation](./code/swagger3.md) | Swagger3 OpenAPI documentation configuration and interceptor setup |
| [Global Exception Handling](./code/globalExceptionHandler.md) | Unified exception handling and exception logging solution |
| [Login Logs](./code/loginLog.md) | Asynchronous login logging implementation |
| [Performance Logs](./code/performanceLog.md) | Interface performance logging implemented via AOP aspect |
| [HTTP Utilities](./code/httpUtils.md) | WebClient-based HTTP client utility implementation |
| [IP Utilities](./code/IPUtils.md) | IP address retrieval and processing utilities |
| [Address Utilities](./code/addressUtils.md) | IP address to geographical location conversion utility |
| [Multi-Environment Configuration](./code/profile.md) | Maven + YAML-based multi-environment configuration switching |

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run docs:dev

# Build static site
npm run docs:build
```

## Project Structure

```
├── src/
│   ├── .vuepress/
│   │   ├── components/     # Vue components
│   │   ├── config.ts       # Configuration file
│   │   ├── navbar.ts       # Navigation bar configuration
│   │   ├── sidebar.ts      # Sidebar configuration
│   │   ├── styles/         # Style files
│   │   └── theme.ts        # Theme configuration
│   ├── code/               # Technical documentation directory
│   │   ├── authentication.md
│   │   ├── druid.md
│   │   ├── redis.md
│   │   └── ...
│   └── README.md           # Homepage
├── package.json
└── tsconfig.json
```

## Deployment

The project is configured for deployment to Gitee Pages. The built static files can be accessed via Gitee's Pages service.

## License

MIT License

---

© 2024 Nanxu Docs. All rights reserved.