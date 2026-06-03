---
title: 大模型调用
icon: fas:plug
order: 2
---

## 1.网络基础知识

### 1.1 客户端与服务端

- **客户端**：发送请求的一方（如浏览器、Python 程序）
- **服务端**：接收请求并返回响应的一方

### 1.2 IP 地址

- **作用**：定位网络上的设备
- **格式**：由四段数字组成，每段取值范围 0-255（如 `110.242.69.21`）
- **特殊地址**：`127.0.0.1` 代表本机地址（本地回环地址）

### 1.3 域名

- **作用**：降低 IP 地址的记忆成本
- **示例**：`www.baidu.com`
- **DNS**（域名解析服务器）：记录域名与 IP 地址的映射关系
- **本机域名**：`localhost`

### 1.4 端口

- **作用**：定位设备上的应用程序
- **取值范围**：0-65535
- 每个程序启动后占用一个端口号，同一设备上端口号不重复
- HTTP 协议默认端口：80
- HTTPS 协议默认端口：443

### 1.5 请求与响应

- **请求**：客户端向服务端发送的数据
- **响应**：服务端处理后返回的数据

## 2.HTTP 协议

HTTP（HyperText Transfer Protocol，超文本传输协议）是客户端与服务端通信的协议，规定了客户端与服务器之间进行数据传输的规则。

### 2.1 网络模型（TCP/IP 四层）

| 层级 | 职责 |
|:---:|:---:|
| 应用层 | 直接与用户交互，将业务数据转化为网络可传输的标准格式 |
| 传输层 | 将数据准确送达对应的应用程序（通过端口定位） |
| 网络层 | 基于 IP 地址将数据包路由到对应设备 |
| 网络接口层 | 在物理网络中传输数据包 |

::: info 说明
作为开发人员，只需关注**应用层**，使用 HTTP 协议进行数据传输。
:::

### 2.2 HTTP 协议特点

- 基于文本的协议（请求和响应都是文本格式）
- 底层使用 TCP 协议传输（稳定、安全）

### 2.3 常见请求方法

| 方法 | 说明 |
|:---:|:---:|
| GET | 获取资源 |
| POST | 提交数据 |
| PUT | 更新资源 |
| DELETE | 删除资源 |

### 2.4 常见响应状态码

| 状态码 | 说明 |
|:---:|:---:|
| 200 | 请求成功 |
| 400 | 请求错误 |
| 401 | 未授权 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 3.HTTP 请求数据格式

HTTP 请求数据分为三个部分：**请求行**、**请求头**、**请求体**。

### 3.1 请求行

- 请求方式（GET / POST）
- 请求资源路径
- 协议及版本（如 HTTP/1.1）

### 3.2 请求头

- 格式：`key: value`（键值对）
- 示例：`Content-Type: application/json`（指定请求体格式）

### 3.3 请求体

- 请求参数（POST 请求在此携带数据）
- 请求头和请求体之间有一个空行分隔

### 3.4 GET 与 POST 的区别

| 特性 | GET | POST |
|:---:|:---:|:---:|
| 请求参数位置 | URL 后面（`?key=value`） | 请求体中 |
| 数据大小限制 | 有限制 | 无限制 |
| 使用场景 | 获取数据 | 提交数据、文件上传 |

### 3.5 JSON 格式示例（调用大模型）

```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "user", "content": "你好"}
  ]
}
```

## 4.Apifox 接口测试

Apifox 是一款 API 设计、开发、测试的一体化平台，是项目开发中进行 API 接口测试的利器。

::: info 说明
- 浏览器地址栏只能发送 GET 请求，且数据大小有限制（最多几 K）
- 调用大模型需要使用 POST 请求（提示词可能很大），需要使用 Apifox 等工具
- 类似工具还有：Postman、API Post
:::

**使用步骤：**

1. 下载安装 Apifox（官网：https://apifox.com/）
2. 创建新请求
3. 填写请求方式（POST）、请求 URL（`https://api.deepseek.com/chat/completions`）
4. 设置请求头：`Content-Type: application/json`
5. 设置请求体（JSON 格式）：

```json
{
  "model": "deepseek-chat",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "你是谁"}
  ]
}
```

6. 发送请求并查看响应

## 5.会话记忆方案

### 5.1 问题

大模型本身没有记忆能力，每次请求都是独立的，不知道之前交互的内容。

### 5.2 解决方案：会话历史滚雪球

将之前的对话历史一并发送给大模型，让大模型能够"记住"之前的对话内容。

**示例：**

第一次交互：
```json
{
  "messages": [
    {"role": "user", "content": "12个苹果三个人怎么均分"}
  ]
}
```

大模型响应：`12÷3=4，每个人可以分到四个苹果`

第二次交互（包含历史）：
```json
{
  "messages": [
    {"role": "user", "content": "12个苹果三个人怎么均分"},
    {"role": "assistant", "content": "12÷3=4，每个人可以分到四个苹果"},
    {"role": "user", "content": "那两个人呢"}
  ]
}
```

::: tip 说明
- `role: user`：用户发送的消息
- `role: assistant`：大模型响应的消息
- 每次交互都需要将之前的历史一并发送，这就是"滚雪球"
:::

## 6.代码调用大模型

### 6.1 安装 OpenAI 模块

```bash
pip install openai
```

::: info pip 说明
- pip 是 Python 官方提供的包管理工具，用于查找、下载、安装、卸载第三方模块
- PyPI（Python Package Index）是 Python 第三方软件包仓库：https://pypi.org/
- `pip` 和 `pip3` 都可以使用（电脑只装一个 Python 版本时）
:::

### 6.2 配置环境变量

将 API Key 配置到系统环境变量中：
- 变量名：`DEEPSEEK_API_KEY`
- 变量值：你的 API Key

### 6.3 Python 代码调用 DeepSeek

```python
import os
from openai import OpenAI

# 创建与 AI 大模型交互的客户端对象
client = OpenAI(
    api_key=os.environ["DEEPSEEK_API_KEY"],
    base_url="https://api.deepseek.com"
)

# 发送请求
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "user", "content": "你好，请介绍一下自己"}
    ]
)

# 输出响应
print(response.choices[0].message.content)
```

::: info 说明
- DeepSeek API 兼容 OpenAI API 规范，可以直接使用 OpenAI 模块调用
- `api_key`：从环境变量中读取，避免直接写在代码中泄露
- `base_url`：DeepSeek API 的地址
- `model`：使用的模型名称
- `messages`：对话历史
:::
