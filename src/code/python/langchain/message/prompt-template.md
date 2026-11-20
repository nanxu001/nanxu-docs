---
title: 提示词模板
icon: fas:file-lines
order: 2
---

## 1.为什么推荐提示词模板

在 LangChain 开发中，构造提示词既可以直接使用 Python 字符串拼接（如 `f-string`、`format()` 或 `+`），也可以使用 LangChain 提供的 `PromptTemplate` 或 `ChatPromptTemplate`。

### 1.1 字符串拼接方式

> 本节示例沿用 3.3 节初始化好的 `model`，这里只关注提示词的构造方式。

```python
# 字符串拼接（难以维护，容易出错）
topic = "Python"
difficulty = "初学者"

prompt_str = f"你是一个{difficulty}级别的编程导师。请用简单易懂的语言解释{topic}。"

response = model.invoke(prompt_str)
print(f"AI 回复：{response.content}...\n")
```

**优点 ✅**：

- 简单直接，上手快
- 适合临时 demo
- 无额外学习成本

**缺点 ❌**：

- 可读性差（变量多时混乱）
- 不易维护（修改容易出错）
- 无变量校验（容易漏写或拼错）
- 难以支持复杂场景（多轮对话 / RAG / Few-shot）

### 1.2 提示词模板

```python
from langchain_core.prompts import PromptTemplate

topic = "Python"
difficulty = "初学者"

template = PromptTemplate.from_template("你是一个{difficulty}级别的编程导师。请用简单易懂的语言解释{topic}。")

# 使用模板生成提示词
prompt = template.format(difficulty=difficulty, topic=topic)

response = model.invoke(prompt)
print(f"AI 回复：{response.content}...\n")
```

```python
from langchain_core.prompts import ChatPromptTemplate

prompt_template = ChatPromptTemplate([
    ("system", "你是一个AI开发工程师. 你的名字是 {name}."),
    ("human", "{user_input}")
])

# 调用 invoke()，返回 ChatPromptValue
prompt = prompt_template.invoke({"name":"小谷AI", "user_input":"你能帮我做什么?"})
print(prompt)
```

**优点 ✅**：

- 结构清晰（变量占位）
- 易维护、可复用
- 自动变量校验（更安全）
- 支持复杂场景（对话 / RAG / Agent）
- 可与 LangChain 生态无缝集成
- 便于调试与日志追踪

**缺点 ❌**：

- 有一定学习成本
- 初期写法略复杂
- 对极简单场景略“重”

**开发建议**：

- 小项目 / 临时用 → **字符串拼接**
- 正式开发 / AI 应用 → **提示词模板（必选）**

## 2.提示词机制演进

LangChain 1.0 的架构变革中，核心的演进之一体现在 Prompt 机制上：**一个结构化的、富含元数据的消息列表已经取代单一字符串，成为与模型交互的标准数据格式。**

### 2.1 旧时代：LLM + PromptTemplate（输入与输出均为字符串）

**① 模型接口：** 对应 LangChain 中的 `LLM` 类，主要面向早期的**文本补全模型**。

**② 工作方式：** 模型接受一个**单一的字符串**作为输入，基于此预测并生成后续的文本内容（文本补全）。

**③ Prompt 工具：** 核心工具是 `PromptTemplate`。它的职责是接收一组变量，并通过模板渲染，最终输出一个完整的字符串。

```python
from langchain_core.prompts import PromptTemplate

prompt_template = PromptTemplate.from_template(
    "请给我一个关于{topic}的{type}解释。"
)

# 传入模板中的变量名
prompt = prompt_template.format(type="详细", topic="量子力学")

print(prompt)
```

**④ 局限性：** 当需要用这种方式模拟多轮聊天时，开发者必须在字符串中手动拼接和伪造对话角色，例如：

```
"Human：你好\nAI：你好！有什么我能帮忙的吗？\nHuman：..."
```

这种方式不仅导致 Prompt 的结构混乱、难以维护，也极易让模型混淆对话的边界与上下文，影响生成质量。

### 2.2 新时代：ChatModel + ChatPromptTemplate（输入与输出均为消息列表）

**① 模型接口：** 对应 LangChain 1.0 的主流接口 `ChatModel`。

**② 工作方式：** 现代聊天模型 API 已原生**支持角色概念**。它们不再接受单一字符串，而是要求输入**一个结构化的消息列表**，为构建复杂、可靠的多轮对话智能体系统奠定了基础。

**③ Prompt 工具：** `ChatPromptTemplate` 因此成为 LangChain 1.0 中最核心的 Prompt 工具。它的职责是接收变量，并输出一个 `List[BaseMessage]`（消息列表），该列表可直接传递给聊天模型。

### 2.3 二者对比

| 特性 | PromptTemplate | ChatPromptTemplate |
| :---: | :---: | :---: |
| 输出格式 | 纯文本字符串 | 消息列表 |
| 角色支持 | ❌ 无 | ✅ system/user/assistant |
| 对话历史 | ❌ 不支持 | ✅ 支持 |
| 适用场景 | 简单提示 | 聊天、对话、多轮交互 |

因此，用于生成消息列表的 `ChatPromptTemplate` 也自然取代了生成字符串的 `PromptTemplate`，成为构建现代 LangChain 应用的首选工具。

## 3.ChatPromptTemplate 的使用

在 LangChain 1.0 中，`ChatPromptTemplate` 是用于生成消息列表的核心组件。

它比普通 `PromptTemplate` 更适合处理多角色、多轮次的对话场景，支持 `System` / `Human` / `AI` 等不同角色的消息模板。下表是角色字符串与消息类型的对应关系：

| 角色字符串 | 含义 | 用途 |
| :---: | :---: | :---: |
| "system" | 系统消息 | 设定 AI 的行为、角色、规则 |
| "user" / "human" | 用户消息 | 用户的输入 / 问题 |
| "assistant" / "ai" | AI 消息 | AI 的回复（用于对话历史） |

### 3.1 两种实例化方式

`ChatPromptTemplate` 可以通过 `from_messages()` 或直接调用类构造方法来实例化，两者都需要传入 `messages` 参数。常见写法是由元组构成的列表，每个元组形如 `(role: str, content: str)`。

#### 3.1.1 （推荐）调用 from_messages()

该方法允许传入一个由元组（Tuple）构成的列表，列表中的每一个元组都代表一条具有特定角色的消息。

```python title = "03.ChatPromptTemplate的使用.ipynb"
from langchain_core.prompts import ChatPromptTemplate

chat_prompt_template = ChatPromptTemplate.from_messages([
    ("system", "你是一个友好的AI助手，你的名字叫{name}"),
    ("human", "你好，最近怎么样？"),
    ("ai", "我很好，谢谢"),
    ("human", "{user_input}")
])

# 调用
result = chat_prompt_template.invoke({"name": "大肥鱼", "user_input": "2 + 2 = ?"})
print(result)
```

运行结果：

```
messages=[
    SystemMessage(content='你是一个友好的AI助手，你的名字叫大肥鱼', additional_kwargs={}, response_metadata={}),
    HumanMessage(content='你好，最近怎么样？', additional_kwargs={}, response_metadata={}),
    AIMessage(content='我很好，谢谢', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]),
    HumanMessage(content='2 + 2 = ?', additional_kwargs={}, response_metadata={})
]
```

#### 3.1.2 使用实例初始化方法

```python title = "03.ChatPromptTemplate的使用.ipynb"
from langchain_core.prompts import ChatPromptTemplate

chat_prompt_template = ChatPromptTemplate([
    ("system", "你是一个友好的AI助手，你的名字叫{name}"),
    ("human", "你好，最近怎么样？"),
    ("ai", "我很好，谢谢"),
    ("human", "{user_input}")
])

# 调用
result = chat_prompt_template.invoke({"name": "大肥鱼", "user_input": "2 + 2 = ?"})
print(result)
```

运行结果与 3.1.1 完全一致，这里不再重复。

:::info 说明
`from_messages()` 的底层也是调用类的 `__init__` 方法，两种写法等价，推荐使用前者（语义更清晰）。
:::

### 3.2 模板调用的 3 种方式

三种调用方式共用同一个模板，因此先定义一次：

```python title = "03.ChatPromptTemplate的使用.ipynb"
from langchain_core.prompts import ChatPromptTemplate

chat_prompt_template = ChatPromptTemplate.from_messages([
    ("system", "你是一个友好的AI助手，你的名字叫{name}"),
    ("human", "你好，最近怎么样？"),
    ("ai", "我很好，谢谢"),
    ("human", "{user_input}")
])
```

#### 3.2.1 使用 invoke()：返回 ChatPromptValue

```python title = "03.ChatPromptTemplate的使用.ipynb"
result = chat_prompt_template.invoke({"name": "大肥鱼", "user_input": "2 + 2 = ?"})
print(result)
print(type(result))
```

运行结果：

```
messages=[
    SystemMessage(content='你是一个友好的AI助手，你的名字叫大肥鱼', additional_kwargs={}, response_metadata={}),
    HumanMessage(content='你好，最近怎么样？', additional_kwargs={}, response_metadata={}),
    AIMessage(content='我很好，谢谢', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]),
    HumanMessage(content='2 + 2 = ?', additional_kwargs={}, response_metadata={})
]
<class 'langchain_core.prompt_values.ChatPromptValue'>
```

#### 3.2.2 使用 format()：返回字符串

```python title = "03.ChatPromptTemplate的使用.ipynb"
result = chat_prompt_template.format(name="大肥鱼", user_input="2 + 2 = ?")
print(result)
print(type(result))
```

运行结果：

```
System: 你是一个友好的AI助手，你的名字叫大肥鱼
Human: 你好，最近怎么样？
AI: 我很好，谢谢
Human: 2 + 2 = ?
<class 'str'>
```

#### 3.2.3 使用 format_messages()：返回消息列表

```python title = "03.ChatPromptTemplate的使用.ipynb"
result = chat_prompt_template.format_messages(name="大肥鱼", user_input="2 + 2 = ?")
print(result)
print(type(result))
```

运行结果：

```
[
    SystemMessage(content='你是一个友好的AI助手，你的名字叫大肥鱼', additional_kwargs={}, response_metadata={}),
    HumanMessage(content='你好，最近怎么样？', additional_kwargs={}, response_metadata={}),
    AIMessage(content='我很好，谢谢', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]),
    HumanMessage(content='2 + 2 = ?', additional_kwargs={}, response_metadata={})
]
<class 'list'>
```

### 3.3 结合 LLM 调用

```python title = "03.ChatPromptTemplate的使用.ipynb"
from langchain_core.prompts import ChatPromptTemplate
from langchain.chat_models import init_chat_model
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

# 沿用 3.2 节定义好的 chat_prompt_template
prompt_value = chat_prompt_template.invoke({"name": "大肥鱼", "user_input": "1 + 1 = ？"})
response = model.invoke(prompt_value)
print(response)
```

运行结果：

```
content='1 + 1 = 2 😊'
additional_kwargs={
    'refusal': None,
    'reasoning_content': '我们需要回答中文。用户问1+1=？ 简单答2。保持友好。'
}
response_metadata={
    'token_usage': {
        'completion_tokens': 29,
        'prompt_tokens': 62,
        'total_tokens': 91,
        'completion_tokens_details': {
            'accepted_prediction_tokens': None,
            'audio_tokens': None,
            'reasoning_tokens': 19,
            'rejected_prediction_tokens': None
        },
        'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
        'prompt_cache_hit_tokens': 0,
        'prompt_cache_miss_tokens': 62
    },
    'model_provider': 'deepseek',
    'model_name': 'deepseek-flash',
    'system_fingerprint': 'bc19ba97cbe0164799032221578db6',
    'id': '05bec82e-e084-44ba-a40a-74c25588b983',
    'finish_reason': 'stop',
    'logprobs': None
}
id='lc_run--01a1f42f-a934-76c5-967d-99ca2bb5a1f5-0'
tool_calls=[]
invalid_tool_calls=[]
usage_metadata={
    'input_tokens': 62,
    'output_tokens': 29,
    'total_tokens': 91,
    'input_token_details': {'cache_read': 0},
    'output_token_details': {'reasoning': 19}
}
```
