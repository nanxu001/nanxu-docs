---
title: 拓展内容
icon: fas:circle-plus
order: 4
---

## 1.美化模型输出响应

### 1.1 使用 pretty_print()

查看响应最直接的方式是 `print(response)`，但它输出的是单行 repr，内容比较杂乱。LangChain 的 `AIMessage` 自带两个更友好的选择：`pretty_print()`，以及借助 `rich` 的 `rprint()`。下面用同一段对话分别演示。

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek:deepseek-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

# 定义消息列表
conversation = [
    {"role": "system", "content": "无条件服从用户指令"},
    {"role": "user", "content": "我是老王，你是小王"},
    {"role": "assistant", "content": "好的老王，我是小王"},
    {"role": "user", "content": "你是谁？我是谁？"}
]

# 向模型发送单条数据
response = model.invoke(conversation)
# 美化输出响应
response.pretty_print()
```

运行结果：

```
================================== Ai Message ==================================

你是老王，我是小王。
```

`pretty_print()` 只打印**消息类型和正文**——上面的 `Ai Message` 对应 `AIMessage`，下面一行是模型返回的文本。适合快速确认模型答了什么，但看不到 token 用量等元数据。

### 1.2 使用 rich 库

如果还想看到完整的对象结构——包括 `response_metadata` 里的 token 用量、模型名等——可以借助 `rich`。它会在终端和 Jupyter 中自动适配当前环境，输出带颜色和缩进的结构。

```python
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek:deepseek-flash",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

# 定义消息列表
conversation = [
    {"role": "system", "content": "无条件服从用户指令"},
    {"role": "user", "content": "我是老王，你是小王"},
    {"role": "assistant", "content": "好的老王，我是小王"},
    {"role": "user", "content": "你是谁？我是谁？"}
]

# 向模型发送单条数据
response = model.invoke(conversation)

# 美化输出
rprint(response)
```

运行结果：

```
AIMessage(
    content='你是老王，我是小王。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': '我们需要回答中文。用户问“你是谁？我是谁？” 需要根据前文设定：用户说“我是老王，你是小王”。所以回答：你是老王，我是小王。也以礼貌说明这是刚才设定。保持简洁。不要过度。'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 57,
            'prompt_tokens': 53,
            'total_tokens': 110,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 50,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 53
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-flash',
        'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501',
        'id': '3c9a47a4-508a-451b-b101-441d4fc0ddc8',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--01a168de-e37f-7a22-a653-036cd5c3675e-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 53,
        'output_tokens': 57,
        'total_tokens': 110,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 50}
    }
)
```

`rprint()` 打印的是**完整的 `AIMessage` 对象**：除了 `content`，还包含 `additional_kwargs`、`response_metadata`（token 用量、模型名、`finish_reason` 等）和 `usage_metadata`（LangChain 统一后的用量格式）。

::: tip 两点补充
- `rich` 不是 LangChain 的一部分，需要单独安装（本教程已包含在 `requirements.txt` 中）
- `rprint` 来自 `from rich import print as rprint`，它替换了内置的 `print`，但**只在这个文件里生效**
:::

**怎么选：**

| 方法 | 输出内容 | 适合场景 |
|---|---|---|
| `print(response.content)` | 纯文本答案 | 只关心结果，要拿去做后续处理 |
| `response.pretty_print()` | 消息类型 + 正文 | 快速确认模型答了什么 |
| `rprint(response)` | 完整对象（含全部元数据） | 调参、排查问题、看 token 消耗 |

## 2.模型配置信息 profile

**LangChain 1.1 及更高版本**可以通过 `profile` 属性查看模型的能力画像。

能力画像（profile）用结构化的方式描述一个模型支持什么：上下文长度、能接受哪些模态的输入、是否支持工具调用和结构化输出等。但它**不是必然存在的**——每个集成包（`langchain-deepseek`、`langchain-openai`、`langchain-openrouter` 等）各自内置一份能力表，按**模型 ID** 查表；表里没有的模型，`profile` 就返回空字典 `{}`。

下面用三个平台对比，正好能看出这个差异。

### 2.1 DeepSeek 官方模型的能力画像

```python title="09.profile-initparams-config.ipynb"
from langchain_deepseek import ChatDeepSeek
from dotenv import load_dotenv

load_dotenv(override=True)

model = ChatDeepSeek(
    model="deepseek-flash",
    temperature=0.7,
    max_tokens=1000,
    max_retries=6
)

print(model.profile)
```

运行结果：

```
{}
```

说明：`langchain-deepseek` 集成没有内置能力画像，所以返回空字典 `{}`。**这不是报错**，也不代表模型不具备这些能力，只是 LangChain 没有收录。

### 2.2 CloseAI 平台 gpt 模型的能力画像

```python title="09.profile-initparams-config.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv(override=True)

CLOSEAI_API_KEY = os.getenv("CLOSEAI_API_KEY")
CLOSEAI_BASE_URL = os.getenv("CLOSEAI_BASE_URL")

model = init_chat_model(
    model="openai:gpt-5.4-mini",
    api_key=CLOSEAI_API_KEY,
    base_url=CLOSEAI_BASE_URL
)

print(model.profile)
```

运行结果：

```
{}
```

说明：`init_chat_model` 能根据 `openai:` 前缀找到对应的集成，但 `profile` 是按**模型 ID** 查表的——`gpt-5.4-mini` 不在 LangChain 内置的能力表里，所以同样返回 `{}`。

### 2.3 OpenRouter 平台 gpt 模型的能力画像

```python title="09.profile-initparams-config.ipynb"
from langchain_openrouter import ChatOpenRouter
from dotenv import load_dotenv
from rich import print as rprint

load_dotenv(override=True)

model = ChatOpenRouter(
    model="openai/gpt-4o-mini",
    # model="deepseek/deepseek-v3.2",
    temperature=0.7,
    timeout=30,
    max_tokens=1000,
    max_retries=6
)

rprint(model.profile)
```

运行结果：

```
{
    'max_input_tokens': 128000,
    'max_output_tokens': 16384,
    'text_inputs': True,
    'image_inputs': True,
    'audio_inputs': False,
    'video_inputs': False,
    'text_outputs': True,
    'image_outputs': False,
    'audio_outputs': False,
    'video_outputs': False,
    'reasoning_output': False,
    'tool_calling': True,
    'structured_output': True
}
```

各项含义如下：

| 字段 | 含义 |
|---|---|
| `max_input_tokens` / `max_output_tokens` | 上下文窗口上限 / 单次输出上限 |
| `*_inputs` | 支持哪些模态作为输入（文本、图像、音频、视频） |
| `*_outputs` | 支持哪些模态作为输出 |
| `reasoning_output` | 是否会返回推理过程 |
| `tool_calling` | 是否支持工具调用（Function Calling） |
| `structured_output` | 是否支持结构化输出 |

换一个模型 ID，`profile` 的内容也会随之变化——因为它查的是不同模型在能力表中的条目：

```python title="09.profile-initparams-config.ipynb"
from langchain_openrouter import ChatOpenRouter
from dotenv import load_dotenv
from rich import print as rprint

load_dotenv(override=True)

model = ChatOpenRouter(
    # model="openai/gpt-4o-mini",
    model="deepseek/deepseek-v3.2",
    temperature=0.7,
    timeout=30,
    max_tokens=1000,
    max_retries=6
)

rprint(model.profile)
```

运行结果：

```
{
    'max_input_tokens': 163840,
    'max_output_tokens': 65536,
    'text_inputs': True,
    'image_inputs': False,
    'audio_inputs': False,
    'video_inputs': False,
    'text_outputs': True,
    'image_outputs': False,
    'audio_outputs': False,
    'video_outputs': False,
    'reasoning_output': True,
    'tool_calling': True,
    'structured_output': True
}
```

说明：`langchain-openrouter` 为这些模型内置了能力画像，因此能返回完整信息。

值得注意的是：**同一家厂商的模型**，直接走 `langchain-deepseek` 时 `profile` 是 `{}`，经由 OpenRouter 调用时却有完整画像——差别不在于模型来自哪家，而在于**哪个集成包负责查表、表里有没有这个模型 ID**。

::: tip 为什么不用充值
`model.profile` 是本地属性，只查 LangChain 内置的能力表，**不会真的向模型服务发请求**，所以不消耗额度、也不需要充值。

不过实例化 `ChatOpenRouter` 时仍然要提供 API Key，否则会在初始化阶段就校验失败。
:::

## 3.模型初始化参数（完整版）

### 3.1 查看所有初始化参数

官方文档和源码注释没有给出完整的参数列表。

以 ChatDeepSeek 类为例，其参数可以由 `自身定义` 或 `从父类BaseChatModel继承`。直接查看源码也很难拼凑完整列表。这里通过查看ChatDeepSeek的类属性 model_fields 来获得完整参数列表。

### 3.2 查看 ChatDeepSeek 支持的完整参数列表

```python title="09.profile-initparams-config.ipynb"
from langchain_deepseek import ChatDeepSeek

print(ChatDeepSeek.model_fields.keys())
```

运行结果：

```
dict_keys(['name', 'cache', 'verbose', 'callbacks', 'tags', 'metadata', 'custom_get_token_ids', 'rate_limiter', 'disable_streaming', 'output_version', 'profile', 'client', 'async_client', 'root_client', 'root_async_client', 'model_name', 'temperature', 'model_kwargs', 'openai_api_key', 'openai_api_base', 'openai_organization', 'openai_proxy', 'request_timeout', 'stream_usage', 'max_retries', 'presence_penalty', 'frequency_penalty', 'seed', 'logprobs', 'top_logprobs', 'logit_bias', 'streaming', 'n', 'top_p', 'max_tokens', 'reasoning_effort', 'reasoning', 'verbosity', 'tiktoken_model_name', 'default_headers', 'default_query', 'http_client', 'http_async_client', 'stop', 'extra_body', 'include_response_headers', 'disabled_params', 'context_management', 'include', 'service_tier', 'store', 'truncation', 'use_previous_response_id', 'use_responses_api', 'api_key', 'api_base'])
```
### 3.3 模型类的参数构成

以 ChatDeepSeek 为例，完整参数列表由如下几部分构成：

#### 3.3.1 客户端与连接参数(Networking)

这类参数决定了代码“怎么连到服务端”，而不是“让模型怎么生成”。

| 参数名 | 说明 |
| :---: | :---: |
| api_key / openai_api_key | 鉴权密钥，DeepSeek 通常兼容 OpenAI 接口格式 |
| api_base /openai_api_base | 接口地址（如：https://api.deepseek.com ） |
| request_timeout | 网络请求超时时间 |
| max_retries | 请求失败时的重试次数 |
| http_client / http_async_client | 手动传入 httpx.Client  实例（用于更复杂的网络配置） |
| openai_proxy | 代理服务器配置 |
| default_headers / default_query | 每次请求时默认携带的 HTTP Header 或 Query 参数 |

#### 3.3.2 模型推理参数(Model Inference)

这些是直接传递给 DeepSeek 模型 API 的参数，决定了 `生成内容` 的质量和风格。

| 参数名 | 说明 |
| :---: | :---: |
| model_name | 指定具体的模型（如 deepseek-chat 或 deepseek-reasoning） |
| temperature | 采样温度，越高越随机 |
| top_p | 核采样参数 |
| max_tokens | 最大输出 token 数 |
| stop | 停止符列表 |
| streaming | 是否开启流式传输 |
| n | 生成几个候选回复 |
| reasoning | 是否启用推理模式 |
| reasoning_effort | (DeepSeek R1 特色)控制思考链（COT）的深度 |
| presence_penalty / frequency_penalty | 惩罚项(存在惩罚、频率惩罚)，用于减少内容重复 |
| store | 是否存储对话 |
| logit_bias | 调整特定词汇出现的概率 |

#### 3.3.3 LangChain 框架通用参数

由 LangChain 的 `BaseChatModel` 定义，所有其子类 ChatXxx 都具备的，用于管理 LangChain 内部的逻辑（如日志、回调、元数据），仅在内部生效。

| 参数名 | 说明 |
| :---: | :---: |
| name | 给模型实例起个名字，用于在 Trace（如 LangSmith）中区分 |
| verbose | 是否打印详细日志 |
| callbacks | 回调处理器，用于集成 LangSmith 或自定义监控 |
| tags / metadata | 用于标记该实例的标签和元数据 |
| cache | 是否缓存该模型的请求结果 |
| rate_limiter | LangChain 内部的频率限制器 |

#### 3.3.4 高级与特定扩展参数

这类参数通常用于特定场景，或为了保持与 OpenAI 协议的兼容性而存在。

下面几类参数在 [DeepSeek 官方文档](https://api-docs.deepseek.com/zh-cn/) 中有明确说明，按用途归类如下：

- **底层客户端访问**：`client`, `async_client`, `root_client`（这些通常是内部生成的 SDK 实例，不建议在初始化时手动传参）。

- **透传参数**：`model_kwargs`, `extra_body`（如果你想传递 DeepSeek API 支持但 LangChain 还没定义的参数，可以写在这里）。

- **功能开关**：`disable_streaming`, `include_response_headers`（决定是否在输出中包含 Header）。

- **兼容性参数**：`openai_organization`, `service_tier`, `store`（这些多为 OpenAI 遗留参数，DeepSeek 实际使用较少）。

##### 3.3.4.1 model_kwargs

`model_kwargs` 用于**存放那些 OpenAI Compatible API 支持、但 LangChain 没有直接列出的字段**。

上面三组参数（3.3.1～3.3.3）来自 LangChain 对 `ChatDeepSeek` 的声明，其中**不包含 `tools`**——它属于 OpenAI Compatible API 的请求字段，不在初始化参数之列。要传这类字段，就写进 `model_kwargs`。

完整的请求字段可以查阅 [OpenAI Chat Completions 文档](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)。

下面用 `tools` 演示一次。注意实际开发中应使用 `model.bind_tools()` 这类专门的工具调用接口，不会手写这种原始字段：

```python title="09.profile-initparams-config.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint

# 从.env文件中加载环境变量
load_dotenv(override=True)

model = init_chat_model(
    model="deepseek:deepseek-flash",
    model_kwargs={
        "tools": [
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "Get weather of a location, the user should supply a location first.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The city and state, e.g. San Francisco, CA",
                            }
                        },
                        "required": ["location"],
                    },
                },
            }
        ]
    },
)
# 向模型发送单条数据
response = model.invoke("你好，今天北京的天气如何")
# 打印响应
rprint(response)
```

运行结果：

```
AIMessage(
    content='我来帮您查询一下北京今天的天气。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 'The user asks about Beijing weather today. I should call get_weather with location 
"北京" or "Beijing, China".'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 72,
            'prompt_tokens': 319,
            'total_tokens': 391,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 25,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 128},
            'prompt_cache_hit_tokens': 128,
            'prompt_cache_miss_tokens': 191
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-flash',
        'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501',
        'id': 'be311cec-7db2-4845-bdf3-5bd18d9a8bd2',
        'finish_reason': 'tool_calls',
        'logprobs': None
    },
    id='lc_run--01a16919-aae3-7293-b8bb-7968f67a2268-0',
    tool_calls=[
        {
            'name': 'get_weather',
            'args': {'location': '北京'},
            'id': 'call_00_VG8JrMZp6EMZneCDycAQ6270',
            'type': 'tool_call'
        }
    ],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 319,
        'output_tokens': 72,
        'total_tokens': 391,
        'input_token_details': {'cache_read': 128},
        'output_token_details': {'reasoning': 25}
    }
)
```

::: tip 结果怎么看
关键看两处：`finish_reason` 是 `tool_calls` 而不是 `stop`，`tool_calls` 也不为空——说明模型没有直接回答，而是要求调用 `get_weather`，参数是 `{'location': '北京'}`。

`content` 里那句「我来帮您查询一下……」只是模型的过渡语，真正的动作在 `tool_calls` 里。完整的工具调用流程（绑定工具 → 执行 → 回传结果）会在后续章节展开。
:::

##### 3.3.4.2 extra_body

这里用于**存放模型厂商基于OpenAI API协议扩展的字段**。

查阅 [OpenAI Chat Completions文档](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create)和 [DeepSeek对话补全API文档](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion)可知，`thinking` 是 DeepSeek 扩展的字段，用于控制是否启用思考模式。

```python title="09.profile-initparams-config.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint

# 从.env文件中加载环境变量
load_dotenv(override=True)

model = init_chat_model(
    model="deepseek:deepseek-flash",
    extra_body={"thinking": {"type": "enabled"}},
)
# 向模型发送单条数据
response = model.invoke("你好，一句话回答")
# 打印响应
rprint(response)
```

运行结果：

```python
AIMessage(
    content='你好，请告诉我你想让我用一句话回答的问题。',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 
'我们需要回答用户“你好，一句话回答”。需要理解：用户说“你好，一句话回答”可能是在要求用一句话回答。但没给具体问题。需
要友好回应，询问要回答什么，保持一句话。中文。应一句话。比如“你好！请告诉我你想让我用一句话回答的问题。” 
这是一句话吗？用了感叹号和句号，两个句子？可以说“你好，请告诉我你想让我用一句话回答的问题。” 一句话。'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 105,
            'prompt_tokens': 34,
            'total_tokens': 139,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 93,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 34
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-flash',
        'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501',
        'id': 'f3df6c2c-9eae-4464-837a-2b31ba1a5cfb',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--01a16925-e3fd-71f0-8000-5366050e5402-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 34,
        'output_tokens': 105,
        'total_tokens': 139,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 93}
    }
)
```

## 4.模型调用中的 config 参数

调用模型时（`invoke()`、`ainvoke()`、`stream()`、`batch()` 等），除了输入，还可以传入 `config` 参数，它的类型是 `RunnableConfig`：

```python
def invoke(
    self,
    input: LanguageModelInput,
    config: RunnableConfig | None = None,
    *,
    stop: list[str] | None = None,
    **kwargs: Any,
) -> AIMessage
```

`config` 让我们**在调用时动态调整模型行为**，而不必在初始化阶段把所有参数都固定死。它承担两类职责：一是覆盖模型参数（温度、最大输出长度、甚至换模型），二是控制运行层面的事情（命名、标签、回调、并发数、递归深度等）。完整定义见 [RunnableConfig](https://reference.langchain.com/python/langchain-core/runnables/config/RunnableConfig)。

### 4.1 支持的配置项

| 配置项 | 类型 | 描述 |
| :---: | :---: | :--- |
| `run_name` | `str` | 为本次运行设置一个可读名称，便于在 LangSmith 中定位和识别 |
| `tags` | `List[str]` | 为运行打标签，便于分类和过滤 |
| `callbacks` | `List[BaseCallbackHandler]` | 设置回调处理器，在开始、流式输出、结束等阶段触发，可与 LangSmith 等平台集成 |
| `metadata` | `Dict[str, Any]` | 附加任意键值对，记录本次调用的业务上下文，如 `{"user_id": "123", "session_id": "abc"}` |
| `max_concurrency` | `int` | 限制最大并发运行数，避免对 API 或本地资源造成过大压力 |
| `recursion_limit` | `int` | 限制递归调用的最大深度，主要在 Agent 多步工具调用等场景防止无限循环 |
| `configurable` | `Dict[str, Any]` | 动态覆盖可配置参数，如换模型、改温度等 |

::: info 说明
- `run_name`、`tags`、`callbacks` 主要用于 LangSmith，负责追踪、筛选和调试。

- `metadata` 存放业务信息。当整个流程被包装成 Runnable 链时，这些信息可以一路传给后续节点。

- `configurable` 里能覆盖的参数，与 `init_chat_model()` 的初始化参数同名，但两者性质不同：

  - **初始化参数**：模型的默认设置，作用于该实例的绝大多数调用。
  - **运行时 config**：只针对本次调用，优先级更高。
:::

### 4.2 用 configurable 覆盖初始化参数

有一点必须在动手前说清楚：**`configurable` 能覆盖哪些字段，取决于初始化时的 `configurable_fields`**。没有在 `configurable_fields` 中声明过的参数，即使写进 `config["configurable"]` 也不会生效。

下面的例子在初始化时把 `temperature` 设为 `0.2`、`max_tokens` 设为 `500`，再通过 `config` 把二者分别改成 `0.7` 和 `1000`：

```python title="09.profile-initparams-config.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
from rich import print as rprint

# 1. 加载 .env 中的环境变量
load_dotenv(override=True)

# 2. 初始化模型，并声明哪些参数允许在运行时覆盖
model = init_chat_model(
    model="deepseek:deepseek-flash",
    temperature=0.2,
    max_tokens=500,
    configurable_fields=("model", "model_provider", "temperature", "max_tokens"),
)

# 3. 准备 config
config = {
    "run_name": "joke_generation",      # 在 LangSmith 中这次运行会显示为此名称
    "tags": ["tag1", "tag2"],           # 打标签便于分类查找
    "metadata": {"user_id": "123"},     # 记录业务上下文
    "configurable": {
        "model": "deepseek-flash",      # 覆盖模型
        "model_provider": "deepseek",   # 覆盖模型提供商
        "temperature": 0.7,             # 覆盖温度
        "max_tokens": 1000,             # 覆盖最大输出长度
    },
}

# 4. 调用模型并传入 config
response = model.invoke("1 + 2 = ？", config=config)

rprint(response)
```

本次调用的实际参数是 `temperature=0.7`、`max_tokens=1000`，初始化时的 `0.2` 和 `500` 被覆盖。而 `run_name`、`tags`、`metadata` 不会影响模型输出，它们只随这次运行记录下来，在 LangSmith 中可见。

如果去掉 `configurable_fields=(...)`，上面 `config` 里的 `configurable` 部分会被忽略，调用仍然使用 `0.2` 和 `500`。

`configurable` 更有价值的用法是**按任务切换模型**：简单提问用小模型求快，复杂推理换大模型。只要 `model` 被声明进 `configurable_fields`，同一个实例就能在调用时更换底层模型，无需重新初始化。

```python title="09.profile-initparams-config.ipynb"
model = init_chat_model(
    model="deepseek:deepseek-flash",
    configurable_fields=("model", "model_provider"),
)

# 日常问答：用轻量模型
quick = model.invoke(
    "用一句话解释什么是 Token",
    config={
        "configurable": {"model": "deepseek-flash", "model_provider": "deepseek"}
    },
)
print(quick.content)

# 复杂推理：同一次运行中换成推理模型
deep = model.invoke(
    "证明：三个连续整数之和一定能被 3 整除",
    config={
        "configurable": {"model": "deepseek-v4-pro", "model_provider": "deepseek"}
    },
)
print(deep.content)
```

几点说明：

- 两次调用**共用同一个 `model` 实例**，切换只作用于本次调用
- 下次不传 `config` 时，会回到初始化时的 `deepseek-flash`
- 想跨供应商切换（如 DeepSeek → OpenAI），同样把 `model_provider` 声明进 `configurable_fields` 并覆盖即可，前提是本机装了对应的集成包、配好了对应的 API Key

::: tip 模型 ID 请以官方文档为准
上面的 `deepseek-v4-pro` 仅为示例。各厂商的模型命名和可用型号会持续调整，实际使用时请换成你账号下可用的模型 ID。
:::

### 4.3 用 max_concurrency 控制并发

处理大量输入时，一次性把请求全部发出去容易触达供应商的速率限制。这时可以在 `batch()` 的 `config` 中限制并发数：

```python
inputs = ["你好", "介绍一下你自己", "讲个笑话", "1+1=?", "什么是 LangChain"]

responses = model.batch(
    inputs,
    config={"max_concurrency": 2},   # 同时最多 2 个请求
)
```

`batch()` 会从第一份 config 中读取 `max_concurrency`，用它限制同时在跑的请求数量。数值调小更稳，调大更快，具体取多少要看所用模型的限流阈值。
