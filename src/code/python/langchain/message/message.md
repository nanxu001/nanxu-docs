---
title: 消息
icon: fas:comment
order: 1
---

大模型没有记忆，它的输出只和输入模型的内容有关（上下文）。很多大模型 API 服务也没有在服务端维护会话历史，是“无状态”的。因此，**如果应用需要“记住”对话历史，需要在程序中维护消息列表。**

**在 LangChain 中，Message（消息）是模型交互的最基本单元。** 它既代表模型接收到的**输入（Input）**，也代表模型生成的**输出（Output）**。

:::info 说明
每一轮与大模型的对话，都由一条或多条 Message 构成。每个 Message 不仅包含**文字内容**，还携带描述上下文状态的**元信息（metadata）**，用于保持对话的一致性和可追踪性。比如，模型在多轮交互中理解“谁在说话”“说了什么”“这条信息属于哪一轮对话”。
:::

LangChain 在 1.0 中提供了**跨模型统一的 Message 标准**。无论你使用的是 OpenAI、Anthropic、Gemini 还是本地模型，这一标准都能保持一致的行为。好处：

- **兼容性强**：不同模型的消息格式自动对齐。
- **可扩展性高**：方便添加多模态内容或自定义字段。
- **可追踪性好**：为 LangSmith 等调试工具提供一致的上下文数据结构。

![消息列表即模型看到的全部上下文](/assets/image/code/python/langchain/message/message-list-context-diagram.png)

## 1.消息的内部结构

LangChain 的消息（Message）对象包含三种字段：

| 字段 | 说明 | 示例 |
| :---: | :---: | :---: |
| **Role** | 消息所属的角色或类型 | `system`、`user`、`assistant`、`tool` |
| **Content** | 消息内容，可以是字符串，也可以是列表（多模态） | `"你好啊~"` |
| **Metadata** | （可选）元数据，存储额外信息 | 消息 ID、响应时间、token 消耗量、消息标签等 |

## 2.消息的类型

LangChain 定义了很多消息类型，通过 `role` 区分，常用的有四种。

### 2.1 系统消息

也称为系统提示词，用于在对话开始时为模型设定角色、行为准则和上下文背景。它像是给 AI 助手的一份工作说明书，决定了其回答问题的风格、领域和专业范围。

### 2.2 用户消息

也称为用户提示词，在多轮对话中，它表示用户的一次输入。可以包含简单的文本问题，也可以是复杂的多模态内容（如图片、音频、文档等）。

### 2.3 助手消息（AI）

代表模型的回复，包括生成的文本、工具调用、元数据等。JSON 格式下，普通的文本回复只带 `content`，而调用工具时会额外带 `tool_calls`：

```json
{
    "role": "assistant",
    "content": "",
    "tool_calls": [{
        "name": "get_weather",
        "args": {"location": "北京"},
        "id": "call_00_nUD2NC9QRN5Cg1GaoIkBJQ4s"
    }]
}
```

### 2.4 工具调用消息

工具调用结果匹配的消息类型。将此消息返回给模型，让模型基于这个结果继续生成回复。在 Tools 一节详细介绍。

**问题：为什么使用不同的消息类型？**

- **明确角色**：清晰区分系统提示、用户输入和 AI 回复。
- **控制行为**：通过 SystemMessage 精确控制 AI 的行为。
- **对话历史**：构建完整的多轮对话上下文。
- **调试友好**：更容易追踪和调试对话流程。

四种消息的用途小结：

| 角色 | 字典格式 | 对象格式 | 用途 | 示例 |
| :---: | :---: | :---: | :---: | :---: |
| System | `{"role": "system", ...}` | `SystemMessage(...)` | 设定 AI 的行为、角色、规则 | "你是一个专业的数学老师" |
| User | `{"role": "user", ...}` | `HumanMessage(...)` | 用户输入 | "什么是微积分？" |
| Assistant | `{"role": "assistant", ...}` | `AIMessage(...)` | AI 的回复（可带工具调用） | "微积分是研究变化率的数学分支..." |
| Tool | `{"role": "tool", ...}` | `ToolMessage(...)` | 工具执行的结果 | "今天北京天气晴朗，万里无云" |

## 3.消息格式

LangChain 支持两种消息格式：**JSON 格式**与**对象格式**。下面用同一组对话演示两种写法。

### 3.1 JSON 格式

#### 3.1.1 系统消息

```json
{"role": "system", "content": "你是个善解人意的助手"}
```

#### 3.1.2 用户消息

```json
{"role": "user", "content": "你好啊~"}
```

#### 3.1.3 助手消息

```json
{"role": "assistant", "content": "我也很高兴认识你"}
```

#### 3.1.4 工具调用消息

```json
{"role": "tool", "content": "<工具输出>", "tool_call_id": "call_00_nUD2NC9QRN5Cg1GaoIkBJQ4s"}
```

### 3.2 对象格式

#### 3.2.1 系统消息

```python
SystemMessage(content="你是个善解人意的助手")
```

#### 3.2.2 用户消息

```python
HumanMessage(content="你好啊~")
```

#### 3.2.3 助手消息

```python
AIMessage("我也很高兴认识你")
```

#### 3.2.4 工具调用消息

```python
ToolMessage(
    content="<工具输出>",
    tool_call_id="call_00_nUD2NC9QRN5Cg1GaoIkBJQ4s"  # 一定要和AI消息中的调用ID匹配
)
```

完整可运行的示例见下一节。

## 4.完整示例

下面两个例子都能直接运行（需要 `.env` 中配置好 DeepSeek 的 key 与 base_url），分别用 JSON 和对象两种格式构造同一条对话，观察模型是否记得上一轮内容。

### 4.1 JSON 格式

```python title = "01.message的使用.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

# json格式的消息
messages = [
    {"role": "system", "content": "你是一个友好的AI助手"},
    {"role": "user", "content": "1 + 2 = ？"},
    {"role": "assistant", "content": "3"},
    {"role": "user", "content": "我刚才问了什么问题"}
]

response = model.invoke(messages)
print(response)
```

### 4.2 对象格式

```python title = "01.message的使用.ipynb"
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

# 对象格式的消息
messages = [
    SystemMessage(content="你是一个友好的AI助手"),
    HumanMessage(content="1 + 2 = ？"),
    AIMessage(content="3"),
    HumanMessage(content="我刚才问了什么问题")
]

response = model.invoke(messages)
print(response)
```

## 5.消息对象字段说明

此处仅说明**常用**字段，完整字段列表查阅**官方手册**或**阅读源码**。

### 5.1 SystemMessage 参数列表

`content`：消息内容，字段名可以省略。

```python
SystemMessage("你是个善解人意的助手")
```

相当于

```python
SystemMessage(content="你是个善解人意的助手")
```

### 5.2 HumanMessage 参数列表

`content`：消息内容，字段名可以省略。

```python
HumanMessage("你好啊~")
```

相当于

```python
HumanMessage(content="你好啊~")
```

`metadata`：元数据字段，可以有很多，自定义

举例：带有元数据字段

```python
HumanMessage(
    content="Hello!",
    name="alice",  # 可选，用户名
    id="msg_123",  # 可选，message的ID
)
```

`name` 和 `id` 都属于元数据字段，用于在消息类型相同时区分不同的发言人。但不是所有模型都支持，是否支持取决于模型供应商，需要查看官方手册。比如：

- [OpenAI 的 API 手册](https://developers.openai.com/api/reference/resources/chat/subresources/completions/methods/create) 说明 `HumanMessage` 支持 `name` 作为元数据字段，如下图所示；而 DeepSeek 的 API 文档虽然也声明支持 `name`，但实测模型无法识别。

![OpenAI 对话接口中的 name 参数](/assets/image/code/python/langchain/message/openai-chat-user-message-params.png)

#### 5.2.1 举例

此处通过 CloseAI 平台调用 `gpt-5.4-mini` 展示 `name` 的作用。

```python title = "01.message的使用.ipynb"
from langchain_core.messages import SystemMessage,HumanMessage,AIMessage
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv
import os

load_dotenv(override=True)

CLOSEAI_API_KEY = os.getenv("CLOSEAI_API_KEY")
CLOSEAI_BASE_URL = os.getenv("CLOSEAI_BASE_URL")

model = init_chat_model(
    model="gpt-5.4-mini",
    model_provider="openai",
    api_key=CLOSEAI_API_KEY,
    base_url=CLOSEAI_BASE_URL
)

messages = [
    SystemMessage("你是一个信息抽取器。你会收到多条来自不同发言者的 user 消息，每条消息可能带有 name 字段。你的任务是：严格根据每条消息的 name 提取发言者及其观点，并输出 JSON。禁止使用“第一个人/第二个人”这种相对称呼。若某条消息没有 name，则输出 unknown。输出格式：{\"speakers\":[{\"name\":\"...\",\"claim\":\"...\"}]}"),
    HumanMessage(
        content="我认为 1+1=2",
        name="Bob"
    ),
    HumanMessage(
        content="我认为 1+1>2",
        name="Tom"
    ),
    HumanMessage(
        content="请列出谁说了什么，不要判断对错。",
        name="audience"
    )
]

response = model.invoke(messages)
print(response.content)
```

运行结果：

```
{"speakers":[{"name":"Bob","claim":"我认为 1+1=2"},{"name":"Tom","claim":"我认为 1+1>2"}, {"name":"audience","claim":"请列出谁说了什么，不要判断对错。"}]}
```

:::info 说明
模型读取到了 `name` 传递的信息，这在**多人对话场景**中很有用。
:::

改用 DeepSeek 调用时，`name` 没有被正确传递给模型服务：

```python title = "01.message的使用.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL
)

messages = [
    SystemMessage("你是一个信息抽取器。你会收到多条来自不同发言者的 user 消息。每条消息可能带有 name 字段。你的任务是：严格根据每条消息的 name 提取发言者及其观点，并输出 JSON。禁止使用“第一个人/第二个人”这种相对称呼。若某条消息没有 name，则输出 unknown。输出格式：{\"speakers\":[{\"name\":\"...\",\"claim\":\"...\"}]}"),
    HumanMessage(content="我认为 1+1=2", name="Bob"),
    HumanMessage(content="我认为 1+1>2", name="Tom"),
    HumanMessage(content="请列出谁说了什么，不要判断对错。", name="audience")
]

response = model.invoke(messages)
print(response.content)
```

运行结果：

```
{"speakers":[{"name":"unknown","claim":"1+1=2"},{"name":"unknown","claim":"1+1>2"}]}
```

### 5.3 AIMessage 参数列表

`content`：模型输出的原始内容，字段名可以省略。

```python
AIMessage("你好~")
```

相当于

```python
AIMessage(content="你好~")
```

`response_metadata`：AIMessage 特有属性，LLM 的响应中附加元数据，不同模型内容不同，可能包含本次 token 使用量等信息。

`tool_calls`：AIMessage 特有属性，表示工具调用信息。当 LLM 决定调用工具时，AIMessage 中就会包含这个属性；没有工具调用则为空。结构如下：

```python
tool_calls=[
    {
        'name': 'get_weather',  # 应调用的工具名
        'args': {'city': '杭州'},  # 调用工具的参数
        'id': 'call_00_gIXYOD1Q1OkEXmdDBqXR1578',  # 工具调用的唯一标识 ID
        'type': 'tool_call'
    },
    {'name': 'get_news',
     'args': {},
     'id': 'call_01_jD3phD5PEaIZf0mVLhKt0861',
     'type': 'tool_call'
    }
]
```

以上三个字段，在 [模型的调用](../model/invocation.md) 一页的 invoke() 返回值说明中讲过。

#### 5.3.1 举例

举例 1：AIMessage 给出最终答案

```python
AIMessage(content="北京今天晴天，温度 15°C")
```

举例 2：AIMessage 调用工具

```python
AIMessage(
    content="",
    tool_calls=[{
        'name': 'get_weather',
        'args': {'city': '北京'},
        'id': 'call_xxx'
    }]
)
```

举例 3：更丰富的参数

```
AIMessage(
 content='你好呀，好久不见！我是小智，你的助人为乐助手。平时可以帮你解答问题、整理信息、提供建议、陪你聊聊天，也能协助你处理学习、工作和生活中的各种小任务。有什么需要帮忙的，尽管告诉我～',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': '我们需要回答用户中文。用户说你好，好久不见，请介绍下你自己……（后略）'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 122,
            'prompt_tokens': 51,
            'total_tokens': 173,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 69,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 51
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-flash',
        'system_fingerprint': 'bc19ba97cbe016479903222bb1578db6',
        'id': '726225c7-c3d1-465d-9f1a-a763d98834ec',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--01a1e49c-c942-72e2-9fdc-92b75856362c-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 51,
        'output_tokens': 122,
        'total_tokens': 173,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 69}
    }
)
```

若只想看用量，可以单独打印 `usage_metadata`：

```python
rprint(response.usage_metadata)
```

输出：

```
{
    'input_tokens': 51,
    'output_tokens': 122,
    'total_tokens': 173,
    'input_token_details': {'cache_read': 0},
    'output_token_details': {'reasoning': 69}
}
```

返回内容各字段的含义。下面以这次 DeepSeek 调用为例，AIMessage 的顶层字段如下：

| 字段 | 示例值 / 类型 | 说明与作用 |
| :---: | :---: | :---: |
| `content` | `'你好呀！我是小智……'` | 模型生成的主要文本内容，即对话中 AI 的自然语言回复 |
| `additional_kwargs` | `{'refusal': None}` | 附加参数，通常存放拒答原因、补充说明等；此处为 `None` 表示没有拒答 |
| `response_metadata` | `{...}`（字典对象） | 响应元数据，记录模型调用的底层信息，见下表 |
| `id` | `'lc_run--0d38df6a-0aa7-41fd-9b33-a9eca1c6cb80-0'` | LangChain 内部为此消息生成的唯一运行 ID |
| `usage_metadata` | `{...}`（字典对象） | LangChain 层的统一 token 计量信息，与 `response_metadata.token_usage` 相呼应，见下表 |

`response_metadata` 中常用的键：

| 字段 | 示例值 | 说明 |
| :---: | :---: | :---: |
| `token_usage` | `{'completion_tokens': 60, 'prompt_tokens': 25, 'total_tokens': 85, ...}` | token 统计信息：输入 25、输出 60、合计 85 |
| `model_provider` | `'deepseek'` | 模型提供方 |
| `model_name` | `'deepseek-chat'` | 模型的具体名称 |
| `system_fingerprint` | `'fp_ffc7281d48_prod0820_fp8_kvcache'` | 模型版本或运行实例指纹，用于调试和追踪 |
| `id` | `'311d2a0e-7fa2-4543-a8d6-374b201db854'` | 本次响应在模型服务端的唯一标识 |
| `finish_reason` | `'stop'` | 生成结束的原因，`stop` 表示自然结束（无截断或超长） |

`usage_metadata` 中常用的键：

| 字段 | 示例值 | 说明 |
| :---: | :---: | :---: |
| `input_tokens` | `25` | 输入 token 数量 |
| `output_tokens` | `60` | 输出 token 数量 |
| `total_tokens` | `85` | 总 token 数量（输入 + 输出） |
| `input_token_details` | `{'cache_read': 0}` | 输入部分的缓存命中信息，用于优化推理性能统计 |
| `output_token_details` | `{}` | 输出部分的补充统计（此处为空） |

### 5.4 ToolMessage 参数列表（拓展）

`content`：工具返回的内容

`name`：工具名称

`tool_call_id`：工具调用的唯一 ID。ToolMessage 必须紧跟在匹配的 AIMessage 之后，且这里的 id 与前者 `tool_calls` 中的 id 一致。

```python
ToolMessage(
    content="<工具输出>",
    name="get_weather",
    tool_call_id="call_00_nUD2NC9QRN5Cg1GaoIkBJQ4s"  # 一定要和AI消息中的调用ID匹配
)
```

#### 5.4.1 举例

```python title = "01.message的使用.ipynb"
from rich import print as rprint
from langchain_core.messages import ToolMessage
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)

def get_weather(city: str) -> str:
    return "不错哦~"

model = model.bind_tools([get_weather])

# DeepSeek 在 thinking 模式下必须先真实调用一次拿到 reasoning_content（实测手动拼接不可行）
# 模型只负责判断调用哪个工具，具体执行逻辑需要自己写
first = model.invoke([{"role": "user", "content": "北京天气如何"}])
rprint(first)

tool_msg = ToolMessage(
    content="今天北京天气晴朗，万里无云~",
    tool_call_id=first.tool_calls[0]["id"],
)

messages = [
    {"role": "user", "content": "北京天气如何"},
    first,
    tool_msg,
]

response = model.invoke(messages)
print(response.content)
```

## 6.实战

### 6.1 对话历史管理

关键规则：每次调用必须传递完整的对话历史！

也就是说：

```
第 1 轮：
  [system, user] → AI回复 → 保存回复

第 2 轮：
  [system, user, assistant, user] → AI回复 → 保存回复

第 3 轮：
  [system, user, assistant, user, assistant, user] → AI回复
```

:::warning 注意
每次对话都要在原有的消息列表中**添加新消息**，不可重新创建新的列表。
:::

错误举例 1 ❌：

```python
# 第一次
response1 = model.invoke("我叫张三")

# 第二次（没传历史）
response2 = model.invoke("我叫什么？")  # AI 不记得！
```

错误举例 2 ❌：

```python
conversation = [{"role": "user", "content": "问题1"}]
response1 = model.invoke(conversation)

conversation = [{"role": "user", "content": "问题2"}]  # 重新创建！
response2 = model.invoke(conversation)  # 丢失了历史
```

错误举例 3 ❌：

```python
conversation = []
conversation.append({"role": "user", "content": "问题1"})
response1 = model.invoke(conversation)
# 忘记保存 response1.content！

conversation.append({"role": "user", "content": "问题2"})
response2 = model.invoke(conversation)  # AI 不知道之前的回答
```

正确做法 ✅：

```python
conversation = []

# 第一次
conversation.append({"role": "user", "content": "我叫张三"})
response1 = model.invoke(conversation)

# 关键：保存 AI 回复
conversation.append({"role": "assistant", "content": response1.content})

# 第二次（传递完整历史）
conversation.append({"role": "user", "content": "我叫什么？"})
response2 = model.invoke(conversation)  # AI 记得！
```

### 6.2 对话历史优化

问题：对话历史会越来越长，消耗大量 token 和成本。

解决方案：只保留最近 N 轮对话。具体的：

- 总是保留 system 消息（定义角色）
- 只保留最近 N 轮对话，丢弃更早的历史

举例：

定义保留最近对话轮数的函数：

```python title = "01.message的使用.ipynb"
def keep_recent_messages(messages, max_pairs=3) -> list[dict[str, str]]:
    """
    保留最近的 N 轮对话
    """
    # 分离 system 消息和对话消息
    system_message = [m for m in messages if m.get("role") == "system"]
    conversation_message = [m for m in messages if m.get("role") != "system"]

    # 只保留最近的消息
    recent_message = conversation_message[-(max_pairs * 2):]

    # 返回系统消息和最近的消息对
    return system_message + recent_message
```

测试（`model` 沿用第 4 节初始化好的实例）：

```python title = "01.message的使用.ipynb"
# 初始化
long_conversation = [
    {"role": "system", "content": "你是 Python 导师"}
]

# 第 1 轮
long_conversation.append({"role": "user", "content": "什么是列表？用一句解释"})
r1 = model.invoke(long_conversation)
long_conversation.append({"role": "assistant", "content": r1.content})

# 第 2 轮
long_conversation.append({"role": "user", "content": "列表和元组有什么区别？用一句解释"})
r2 = model.invoke(long_conversation)
long_conversation.append({"role": "assistant", "content": r2.content})

# 第 3 轮
long_conversation.append({"role": "user", "content": "什么是字典呢？用一句解释"})
r3 = model.invoke(long_conversation)
long_conversation.append({"role": "assistant", "content": r3.content})

print(f"原始消息数: {len(long_conversation)}")

# 优化：只保留最近 2 轮
optimized = keep_recent_messages(long_conversation, max_pairs=2)

print(f"优化后消息数: {len(optimized)}")
print("保留的内容：system + 最近 2 轮对话")

# 添加新的用户问题
optimized.append({"role": "user", "content": "我第一个问题问的是什么？"})
# 使用优化后的历史
response = model.invoke(optimized)
print(f"\nAI 回复: {response.content}")
```

运行结果：

```
原始消息数: 7
优化后消息数: 5
保留的内容: system + 最近2轮对话

AI 回复: 你第一个问题是：**「列表和元组有什么区别？用一句解释」**

我当时的一句话回答是：列表是可变的（用 `[]`，可增删改元素），元组是不可变的（用 `()`，更省内存，可作字典的键）。
```

### 6.3 多轮对话聊天机器人

基于模型初始化、流式响应以及消息列表的拼接来创建多轮聊天机器人。

```python title = "01.message的使用.ipynb"
from langchain.chat_models import init_chat_model
from langchain_core.messages import BaseMessage, SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv

import os

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

# 初始化模型
model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)

# 基础配置
MAX_PAIRS_HISTORY = 10
EXIT_WORD = "quit"

def keep_recent_messages(messages, max_pairs=3) -> list[BaseMessage]:
    """
    保留最近的 N 轮对话
    """
    # 分离 system 消息和对话消息
    system_message = [m for m in messages if isinstance(m, SystemMessage)]
    conversation_message = [m for m in messages if not isinstance(m, SystemMessage)]

    # 只保留最近的消息
    recent_message = conversation_message[-(max_pairs * 2):]

    # 返回系统消息和最近的消息对
    return system_message + recent_message

# 维护一个消息列表
messages: list[BaseMessage] = [
    SystemMessage("你是大肥鱼，是一位数字员工，也是一名耐心友好的AI助手，可以回答学生的问题")
]

print(f"请输入具体的问题，当输入{EXIT_WORD}的时候结束对话")

# 对话的轮数
i = 1
while True:
    print("\n", "=" * 10, f"第{i}轮对话开始", "=" * 10, "\n")

    user_input = input("请输入：")

    # 判断是否结束当前对话
    if user_input == EXIT_WORD:
        print("会话已结束，欢迎下次再来")
        break

    # 优化历史记忆
    messages = keep_recent_messages(messages, MAX_PAIRS_HISTORY)

    # 拼接用户信息
    messages.append(HumanMessage(user_input))

    print("大肥鱼：", end="", flush=True)

    # 拼接AI回复的信息
    reply_content = ""

    # 流式输出AI响应
    for chunk in model.stream(messages):
        if chunk.text:
            print(chunk.text, end="", flush=True)
            reply_content += chunk.text

    print("\n", "=" * 10, f"第{i}轮对话结束", "=" * 10, "\n")

    i += 1

    # 将模型响应添加到消息列表
    messages.append(AIMessage(reply_content))
```

## 7.拓展：消息属性 content 与 content_blocks

### 7.1 content

消息的 `content` 可以理解为数据内容，它是弱类型的，支持字符串和列表（列表元素通常为字典）。

#### 7.1.1 存储字符串

如果只是纯文本内容，直接传递字符串就好。

```python
from langchain_core.messages import HumanMessage

msg1 = HumanMessage(content="你好啊")
msg2 = HumanMessage("你好啊")

print(msg1)
print(msg2)
```

说明：当 `content` 只有字符串时，可以省略参数名称。

#### 7.1.2 存储字典列表

如果需要发送的不只是文本（如多模态内容），则需要 `content` 的**字典列表**形式。

字典内容遵循模型供应商的 API 规范，以 DeepSeek 的 `deepseek-flash` 为例，官方文档见 [对话补全（Chat Completion）](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion)。

![DeepSeek 多模态消息的 content 格式](/assets/image/code/python/langchain/message/deepseek-multimodal-content-docs.png)

下面用一张本地图片做测试。把这张图放到代码所在目录（例如 `chapter04_message_prompt`），命名为 `image_test.png`：

![测试用的图片](/assets/image/code/python/langchain/message/test-serum-bottle-photo.png)

测试代码：

```python title = "02.content_blocks的使用.ipynb"
from langchain_core.messages import HumanMessage
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os
import base64

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

# 初始化模型
model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)

def encode_image(img_path, img_type='jpeg'):
    """
    把本地图片转成 Base64 编码的 Data URI 字符串（带 data:image 前缀），便于直接嵌入消息
    """
    with open(img_path, "rb") as img_file:
        return f"data:image/{img_type};base64,{base64.b64encode(img_file.read()).decode('utf-8')}"

# 图像路径
img_path = "image_test.png"

# 获取图像的 base64 编码字符串
base64_image = encode_image(img_path, "png")

response = model.invoke(
    [
        HumanMessage(
            content=[
                {'type': 'text', 'text': '这张图里有什么？'},
                {
                    'type': 'image_url',
                    'image_url': {
                        'url': base64_image
                    }
                }
            ]
        )
    ]
)
print(response.content)
```

运行结果：

```
这张图是一张专业的产品摄影图，图中主要是一瓶化妆品：

*   **主体**：一瓶**Hourglass**品牌的粉底液（Vanish Seamless Foundation）。
*   **外观特征**：
    *   透明方形玻璃瓶身。
    *   里面装有浅肤色/米色的液体粉底。
    *   正面有一个金色的方形标签，上面印有品牌名和产品名。
    *   顶部是金色的按压泵头，外面罩着一个透明的方形盖子。
*   **背景与光影**：放置在暖色调（米色/沙色）的背景上。左侧有明显的斜向投影，光线柔和但方向性强，营造出一种高级、极简的质感。
```

### 7.2 content_blocks

在 LangChain 1.x 中，`content_blocks` 是消息对象（BaseMessage）的一项重大升级。它的核心目标是提供一种**跨模型供应商、标准化的多模态数据结构**。

过去，处理图片、音频、甚至是模型生成的“思维链（Reasoning）”内容时，不同供应商（OpenAI, Anthropic, Google 等）的 API 格式各异，导致开发者需要写大量的适配代码。 `content_blocks` 的出现终结了这种混乱。

在 LangChain 1.2 版本中，消息对象的 `content` 属性依然存在（为了向前兼容），但新增了 `content_blocks` 属性，可以把 `content` 解析为标准、类型安全的表示。

- **数据结构**：它是一个 `list[TypedDict]`。
- **统一格式**：每个 block 都有一个 `type` 字段，用于区分内容类型。
- **支持类型**：包括 `text`（文本）、`image`（图片）、`audio`（音频）、`video`（视频）、`tool_call`（工具调用）以及 `reasoning`（推理/思维链）。

支持的字段类型详见 [LangChain 消息文档](https://docs.langchain.com/oss/python/langchain/messages#openai)。

#### 7.2.1 输入格式化

对于复杂的对话（带图片或工具结果），建议使用 `content_blocks` 列表形式构建 `HumanMessage` 或 `AIMessage`。

借助 `content_blocks`，我们可以用一套标准代码，无缝地在不同厂商的模型之间切换。

举例（代码里注释掉的是旧的 `content=[...]` 写法，仍然可用；下面采用的是推荐的 `content_blocks=[...]` 写法）：

```python title = "02.content_blocks的使用.ipynb"
from langchain_core.messages import HumanMessage
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os
import base64

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

# 初始化模型
model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)

def encode_image(img_path, img_type='jpeg'):
    """
    把本地图片转成纯 Base64 字符串（不带 data:image 前缀），配合 mime_type 字段使用
    """
    with open(img_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

# 图像路径
img_path = "image_test.png"

# 获取图像的 base64 编码字符串
base64_image = encode_image(img_path, "png")

response = model.invoke(
    [
        # 此种格式可用
        # HumanMessage(
        #     content=[
        #         {'type': 'text', 'text': '这张图里有什么？'},
        #         {
        #             'type': 'image_url',
        #             'image_url': {
        #                 'url': base64_image
        #             }
        #         }
        #     ]
        # )
        # 推荐的统一写法
        HumanMessage(
            content_blocks=[
                {'type': 'text', 'text': '这张图里有什么？'},
                {
                    'type': 'image',
                    'base64': base64_image,
                    'mime_type': 'image/png',
                }
            ]
        )

    ]
)
print(response.content)
```

> 注意：这里的 `encode_image()` 返回的是**纯 Base64 字符串**（不带 `data:image/...;base64,` 前缀），下面用 `base64` 字段配合 `mime_type` 传递；而 7.1.2 里的版本返回 Data URI，直接塞进 `image_url.url`。

运行结果：

```
这张图里主要是一瓶**液体粉底液（Foundation）**。

具体细节如下：
*   **瓶身**：透明的方形厚底瓶，里面装有接近肤色的浅米色/蜜桃色液体。
*   **瓶盖与泵头**：顶部是金色的按压泵头，外面罩着一个透明的方形亚克力质感盖子。
*   **标签**：瓶身正面有一个金色的矩形标签，上面印有黑色的字体（大致能看出“ESPECIAL”字样）。瓶身靠下半部分印有较小的英文字母，其中可以辨认出“FOUNDATION”字样。
*   **背景与光影**：放置在浅米色/暖沙色的纯色背景上。左侧有强光照射，在右侧和左下方投射出清晰的长阴影，整体呈现出极简的化妆品商业摄影风格，光线温暖柔和。

这看起来像是某韩国美妆品牌的粉底液产品。
```

#### 7.2.2 输出格式化

`content_blocks` 还可用于输出格式化，以 DeepSeek 官网的 `deepseek-flash` 为例，其输出包含思考内容，后者位于 `additional_kwargs` 的 `reasoning_content` 字段下。

不同的模型其输出格式可能不同，仅为提取思考内容，切换模型都可能需要更改代码，非常不方便。

`content_blocks` 提供了**统一的输出格式**，可以把不同格式的响应统一为标准格式。

:::warning 注意
`content_blocks` 是**懒加载**的，即调用时才会解析。
:::

示例代码：

```python title = "02.content_blocks的使用.ipynb"
from langchain.chat_models import init_chat_model
from dotenv import load_dotenv

import os
import base64

load_dotenv(override=True)

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL")

# 初始化模型
model = init_chat_model(
    model="deepseek-flash",
    model_provider="deepseek",
    api_key=DEEPSEEK_API_KEY,
    base_url=DEEPSEEK_BASE_URL,
)

response = model.invoke("你好，一句话回答")
print('=' * 20, '-> response <-', '=' * 20)
print(response)
print('=' * 20, '-> response.content <-', '=' * 20)
print(response.content)
print('=' * 20, '-> response.content_blocks <-', '=' * 20)
print(response.content_blocks)
```

运行结果：

```
==================== -> response <- ====================
content='你好！请问有什么可以帮你？'
additional_kwargs={
    'refusal': None,
    'reasoning_content': '我们需要回答用户。用户说“你好，一句话回答”。需要一句话回答。中文。可以回“你好！请问有什么可以帮你？”一句话。必须一句话。需要简洁。最终只一句话。'
}
response_metadata={
    'token_usage': {
        'completion_tokens': 48,
        'prompt_tokens': 34,
        'total_tokens': 82,
        'completion_tokens_details': {
            'accepted_prediction_tokens': None,
            'audio_tokens': None,
            'reasoning_tokens': 40,
            'rejected_prediction_tokens': None
        },
        'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
        'prompt_cache_hit_tokens': 0,
        'prompt_cache_miss_tokens': 34
    },
    'model_provider': 'deepseek',
    'model_name': 'deepseek-flash',
    'system_fingerprint': 'bc19ba97cbe016479903222bb1578db6',
    'id': 'd57b1ca7-434a-43f9-84a6-0d0280c336ca',
    'finish_reason': 'stop',
    'logprobs': None
}
id='lc_run--01a1f3fb-1d58-7364-96a5-4c4bdd29198a-0'
tool_calls=[]
invalid_tool_calls=[]
usage_metadata={
    'input_tokens': 34,
    'output_tokens': 48,
    'total_tokens': 82,
    'input_token_details': {'cache_read': 0},
    'output_token_details': {'reasoning': 40}
}
==================== -> response.content <- ====================
你好！请问有什么可以帮你？
==================== -> response.content_blocks <- ====================
[
    {'type': 'reasoning', 'reasoning': '我们需要回答用户。用户说“你好，一句话回答”。需要一句话回答。中文。可以回“你好！请问有什么可以帮你？”一句话。必须一句话。需要简洁。最终只一句话。'},
    {'type': 'text', 'text': '你好！请问有什么可以帮你？'}
]
```
