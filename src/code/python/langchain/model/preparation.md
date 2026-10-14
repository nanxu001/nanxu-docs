---
title: 模型调用的准备工作
icon: fas:screwdriver-wrench
order: 1
---

## 1.大模型的调用

在LangChain v0.3版本中，提到了Model I/O，包括输入提示(Format)、调用模型(Predict)、输出解析(Parse)。分别对应着 `Prompt Template`，`Model` 和 `Output Parser`。

关于模型调用模块，如今对话模型已经是主要形式。从历史上解读：

在GPT-3时代，大模型以`补全模型为`主，只能以类似“成语接龙”的方式对文本进行补全，并且实际运行效果也`非常不稳定`。此时LangChain借助一些高层封装的API，能够让模型完成对话、调用外部工具、甚至是结构化输出等功能，为开发者提供了极大的便利。

伴随着GPT-3.5模型的发布，`对话模型`正式登上历史的舞台，并逐渐`成为主流`。而得益于对话模型更强的指令跟随能力，很多GPT-3需要借助LangChain才能完成的工作，已经成为GPT-3.5原生自带的一些功能。

## 2.模型初始化的分类方式

> 简单来说，就是用谁家的API以什么方式创建存放在哪个位置的大模型。

**角度1：调用谁家的API**

- 使用模型提供商的库
- 使用LangChain统一方式（推荐）

**角度2：模型初始化时，几个重要参数(如BASE_URL、API-KEY)的书写位置的不同：**

- 使用配置文件（推荐）
- 硬编码：写在代码文件中

**角度3：调用的模型所在位置**
- 在线部署的大模型
- 本地部署的大模型

:::info 说明
LangChain 作为一个“工具”，不提供任何 LLMs，而是依赖于第三方集成各种大模型。这里就看大模型到底部署在哪里。
:::

## 3 线上大模型服务平台

有许多提供大模型 API 服务的平台，使用时只需要注册、充值并创建 API-Key，之后即可使用 API-Key 与 URL 来调用平台提供的相应的模型的服务。

| 平台 | 网址 | 备注 |
| :---: | :---: | :---: |
| OpenRouter | https://openrouter.ai/ | 全球主流,含国外模型 |
| CloseAI | https://platform.closeai-asia.com/ | 亚洲最大,含国外模型 |
| 阿里云百炼 | https://bailian.console.aliyun.com/ | 企业端友好 |
| 硅基流动 | https://www.siliconflow.cn/ | 性价比高，适合个人 |
| 百度千帆 | https://console.bce.baidu.com/qianfan/overview | 主打百度生态 |
| 火山引擎 | https://console.volcengine.com/ark/ | 主打字节多模态生态 |

## 4. 依赖安装

开发中会涉及到多个库的安装，这里一并声明在 <a href="/assets/file/code/python/langchain/requirements.txt" download><code>requirements.txt</code></a> 文件中。

用法：将 requirements.txt 存放到项目所在的目录下，执行

```cmd
(langchain1.2) PS D:\Codes\PycharmProjects\langchain1.2_tutorial> pip install -r .\requirements.txt
```