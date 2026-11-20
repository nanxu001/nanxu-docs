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

### 3.4 更丰富的初始化参数类型

前面介绍了 `ChatPromptTemplate` 的两种创建方式，无论使用实例初始化方法还是 `from_messages()`，传入的都是**列表**。列表中的元素可以是多种类型，前面主要用了元组，本节逐一演示。

源码中的签名（节选）：

```python
def __init__(self,
             messages: Sequence[BaseMessagePromptTemplate | BaseMessage | BaseChatPromptTemplate | tuple[str | type, str | list[dict] | list[object]] | str | dict[str, Any]],
             *,
             template_format: Literal["f-string", "mustache", "jinja2"] = "f-string",
             **kwargs: Any) -> None:
    ...

@classmethod
def from_messages(cls,
                  messages: Sequence[BaseMessagePromptTemplate | BaseMessage | BaseChatPromptTemplate | tuple[str | type, str | list[dict] | list[object]] | str | dict[str, Any]],
                  template_format: Literal["f-string", "mustache", "jinja2"] = "f-string") -> ChatPromptTemplate:
    ...
```

也就是说，列表元素支持以下六种类型：

| 元素类型 | 写法示例 | 说明 |
| :---: | :---: | :---: |
| `str` | `"你好，我是{name}"` | 默认按 `human` 角色处理（不推荐） |
| `tuple` | `("system", "你是一个助手")` | 最常用，形如 `(role, content)` |
| `dict` | `{"role": "system", "content": "..."}` | 与 JSON 消息格式一致 |
| `BaseMessage` | `SystemMessage(content="...")` | 已实例化的消息，内部**不能再有占位符** |
| `BaseMessagePromptTemplate` | `SystemMessagePromptTemplate.from_template("...")` | 带占位符的单条消息模板 |
| `BaseChatPromptTemplate` | `ChatPromptTemplate.from_messages([...])` | 嵌套一个完整的聊天模板 |

> 下面各小节的代码沿用前文的 `ChatPromptTemplate` 导入，只给核心片段。

#### 3.4.1 str 列表类型

列表元素为字符串时（不推荐），**默认角色都是 `human`**：

```python
chat_prompt_template = ChatPromptTemplate.from_messages([
    "你好，我是{name}"  # 会被理解为一条用户消息
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果：

```
ChatPromptValue(messages=[HumanMessage(content='你好，我是小明', additional_kwargs={}, response_metadata={})])
```

#### 3.4.2 tuple 列表类型

列表元素为元组，形如 `(role, content)`，这是最常用的写法：

```python
chat_prompt_template = ChatPromptTemplate.from_messages([
    ("system", "你是一个友好的AI助手"),
    ("human", "你好，我是{name}")
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，我是小明', additional_kwargs={}, response_metadata={})])
```

#### 3.4.3 dict 列表类型

列表元素为字典，键名与 JSON 消息格式一致：

```python
chat_prompt_template = ChatPromptTemplate.from_messages([
    {"role": "system", "content": "你是一个友好的AI助手"},
    {"role": "human", "content": "你好，我是{name}"}
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果与 3.4.2 的元组写法完全一致，区别只在写法：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，我是小明', additional_kwargs={}, response_metadata={})])
```

#### 3.4.4 Message 列表类型

列表元素是**已经实例化的消息对象**：

```python
chat_prompt_template = ChatPromptTemplate.from_messages([
    SystemMessage(content="你是一个友好的AI助手"),
    HumanMessage(content="你好，我是小明")
])

print(chat_prompt_template.invoke({}))
```

运行结果：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，我是小明', additional_kwargs={}, response_metadata={})])
```

:::warning 注意
已实例化的消息对象**不能再包含占位符**，否则变量不会被替换。
:::

```python
chat_prompt_template = ChatPromptTemplate.from_messages([
    SystemMessage(content="你是一个友好的AI助手"),
    HumanMessage(content="你好，我是{name}")
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果（`{name}` 被原样保留，说明已实例化的消息不会再做变量填充）：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，我是{name}', additional_kwargs={}, response_metadata={})])
```

#### 3.4.5 MessagePromptTemplate 列表类型

LangChain 提供了多种 `MessagePromptTemplate`，最常用的是 `SystemMessagePromptTemplate`、`HumanMessagePromptTemplate` 和 `AIMessagePromptTemplate`，分别用于创建系统消息、用户消息和 AI 消息。

以 `HumanMessagePromptTemplate` 为例（它专用于生成用户消息的模板类）：

- **模板化**：支持变量占位符，运行时填充具体值
- **格式化**：将模板与输入变量结合，生成最终的聊天消息
- **输出类型**：生成 `HumanMessage` 对象
- **设计目的**：简化用户输入消息的模板化构造，避免重复定义角色

`SystemMessagePromptTemplate`、`AIMessagePromptTemplate` 用法类似，不再赘述。

```python
from langchain_core.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate

system_mess_template = SystemMessagePromptTemplate.from_template("你是一个友好的AI助手")
human_mess_template = HumanMessagePromptTemplate.from_template("你好，我是{name}")

chat_prompt_template = ChatPromptTemplate.from_messages([
    system_mess_template,
    human_mess_template
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，我是小明', additional_kwargs={}, response_metadata={})])
```

#### 3.4.6 BaseChatPromptTemplate 列表类型

列表元素还可以是一个完整的 `ChatPromptTemplate`，可以理解为**模板里嵌套模板**。它和 3.4.5 的 `MessagePromptTemplate` 都是合法元素，但粒度不同：

| 对比项 | `MessagePromptTemplate`（3.4.5） | `BaseChatPromptTemplate`（3.4.6） |
| :---: | :---: | :---: |
| 本质 | **单条消息**的模板 | **整段对话**（多条消息）的模板 |
| 典型类 | `SystemMessagePromptTemplate`、`HumanMessagePromptTemplate`、`AIMessagePromptTemplate` | `ChatPromptTemplate` |
| 角色 | 由类名固定（System / Human / AI） | 内部每条消息各自指定，可混合 |
| 展开条数 | 恒为 **1 条** | 内部有几条就展开几条 |
| 能否嵌套消息列表 | ❌ 不能 | ✅ 能（模板套模板） |
| 在列表中的效果 | 贡献 1 条消息 | 贡献 N 条消息（会被摊平） |

> **展开规则**：作为元素塞进外层 `from_messages()` 时，内层模板有几条消息，就会在外层展开成几条。

```python
inner_chat_template1 = ChatPromptTemplate.from_messages([("system", "你是一个友好的AI助手")])
inner_chat_template2 = ChatPromptTemplate.from_messages([("human", "你好，我是{name}")])

chat_prompt_template = ChatPromptTemplate.from_messages([
    inner_chat_template1,
    inner_chat_template2
])

print(chat_prompt_template.invoke({"name": "小明"}))
```

运行结果同样与 3.4.2 一致，区别只在于消息模板被拆分到了不同的子模板里。

#### 3.4.7 综合使用

把上面几种元素类型混在一起使用：

```python
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage

# 1. 已实例化的消息（BaseMessage）
system_msg = SystemMessage(content="你是一个AI工程师。")
human_msg = HumanMessage(content="你好！")

# 2. 带占位符的消息模板（BaseMessagePromptTemplate）
system_prompt = SystemMessagePromptTemplate.from_template("你是一个{role}。")
human_prompt = HumanMessagePromptTemplate.from_template("{user_input}")

# 3. 嵌套的聊天模板（BaseChatPromptTemplate）
nested_prompt = ChatPromptTemplate.from_messages([("system", "嵌套提示词")])

chat_prompt_template = ChatPromptTemplate.from_messages([
    system_msg,      # BaseMessage
    human_msg,       # BaseMessage
    system_prompt,   # BaseMessagePromptTemplate
    human_prompt,    # BaseMessagePromptTemplate
    nested_prompt,   # BaseChatPromptTemplate
])

print(chat_prompt_template.invoke({"role": "人工智能专家", "user_input": "介绍一下大模型的应用场景"}))
```

运行结果：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个AI工程师。', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好！', additional_kwargs={}, response_metadata={}), SystemMessage(content='你是一个人工智能专家。', additional_kwargs={}, response_metadata={}), HumanMessage(content='介绍一下大模型的应用场景', additional_kwargs={}, response_metadata={}), SystemMessage(content='嵌套提示词', additional_kwargs={}, response_metadata={})])
```

## 4.高级特性

本节介绍四种进阶用法：用 `partial()` 预填充固定变量、用消息占位符动态插入消息列表、把模板整理成可复用的模板库、以及把多个模板片段组合起来。

### 4.1 部分变量预填充：partial()

预填充某些固定不变的变量，从而创建模板的变体。

**使用场景：**

- 某些变量在所有调用中都相同
- 需要为不同用户 / 场景创建定制模板

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "你是{role}，目标用户是{audience}"),
    ("human", "{task}")
])

result1 = template.invoke({"role": "导游", "audience": "游客", "task": "介绍北京故宫"})
result2 = template.invoke({"role": "导游", "audience": "游客", "task": "介绍北京颐和园"})

print(result1)
print(result2)
```

运行结果：

```
messages=[SystemMessage(content='你是导游，目标用户是游客', additional_kwargs={}, response_metadata={}), HumanMessage(content='介绍北京故宫', additional_kwargs={}, response_metadata={})]
messages=[SystemMessage(content='你是导游，目标用户是游客', additional_kwargs={}, response_metadata={}), HumanMessage(content='介绍北京颐和园', additional_kwargs={}, response_metadata={})]
```

上面两次调用都要重复传 `role` 和 `audience`，用 `partial()` 可以把它一次性预填充。

**举例 1：固定重复的变量**

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
from langchain_core.prompts import ChatPromptTemplate

template = ChatPromptTemplate.from_messages([
    ("system", "你是{role}，目标用户是{audience}"),
    ("human", "{task}")
])

# 部分变量预填充
final_template = template.partial(role="导游", audience="游客")

print(final_template.invoke({"task": "介绍北京故宫"}))
print(final_template.invoke({"task": "介绍北京颐和园"}))
```

输出与上面完全一致，区别只在于每次调用只需传 `task`。

**举例 2：为不同部门创建专用模板**

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
base_template = ChatPromptTemplate.from_messages([
    ("system", "你是{department}的{role}"),
    ("user", "{task}")
])

# IT 部门
it_template = base_template.partial(department="IT 部门", role="技术支持")

# 销售部门
sales_template = base_template.partial(department="销售部门", role="销售顾问")

print(it_template.invoke({"task": "电脑开不了机怎么办"}))
print(sales_template.invoke({"task": "为什么每年年底汽车会促销"}))
```

运行结果：

```
messages=[SystemMessage(content='你是IT 部门的技术支持', additional_kwargs={}, response_metadata={}), HumanMessage(content='电脑开不了机怎么办', additional_kwargs={}, response_metadata={})]
messages=[SystemMessage(content='你是销售部门的销售顾问', additional_kwargs={}, response_metadata={}), HumanMessage(content='为什么每年年底汽车会促销', additional_kwargs={}, response_metadata={})]
```

### 4.2 消息占位符

有些位置要放的不是**一条**消息，而是**一组**消息：比如一段对话历史（human / ai 交替），或者 Agent 的中间步骤（可能夹着 tool 消息）。它们的角色和条数取决于运行时传入的数据，在模板里写不死。消息占位符就是用来占住这个位置，格式化时把传入的消息列表**原样展开**成多条消息。

**使用场景：** 多轮对话系统中存储历史消息、Agent 的中间步骤处理，这个功能都非常有用。

#### 4.2.1 方式1：JSON形式

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
template = ChatPromptTemplate.from_messages([
    ("system", "我是一个AI助手"),
    ("placeholder", "{conversation}")
])

result = template.invoke({
    "conversation": [
        ("human", "你好，请问明天的天气如何？"),
        ("ai", "明天天气晴朗"),
        ("human", "后天的天气怎么样？")
    ]
})

print(result)
```

运行结果：

```
messages=[SystemMessage(content='我是一个AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，请问明天的天气如何？', additional_kwargs={}, response_metadata={}), AIMessage(content='明天天气晴朗', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]), HumanMessage(content='后天的天气怎么样？', additional_kwargs={}, response_metadata={})]
```

#### 4.2.2 方式2：MessagesPlaceholder实例

**举例 1：动态插入消息列表**

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
from langchain_core.prompts import MessagesPlaceholder

template = ChatPromptTemplate.from_messages([
    ("system", "我是一个AI助手"),
    MessagesPlaceholder(variable_name="conversation")
])

result = template.invoke({
    "conversation": [
        ("human", "你好，请问明天的天气如何？"),
        ("ai", "明天天气晴朗"),
        ("human", "后天的天气怎么样？")
    ]
})

print(result)
```

运行结果与 4.2.1 一致：

```
messages=[SystemMessage(content='我是一个AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好，请问明天的天气如何？', additional_kwargs={}, response_metadata={}), AIMessage(content='明天天气晴朗', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]), HumanMessage(content='后天的天气怎么样？', additional_kwargs={}, response_metadata={})]
```

上面的例子传入 3 条消息，加上模板里的系统消息，最终是 4 条；如果传入 5 条，就会生成 6 条。正因为是"整组插入"，它才适合把一段历史对话塞进指定位置。

**举例 2：存储对话历史内容**

```python title = "04.ChatPromptTemplate的高级特性.ipynb"
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

prompt_template = ChatPromptTemplate.from_messages(
    [
        ("system", "你是一个非常友好的AI助手"),
        MessagesPlaceholder(variable_name="history"),
        ("human", "{question}")
    ]
)

print(prompt_template.invoke(
    {
        "history": [
            ("human", "5 + 2 = ?"),
            ("ai", "5 + 2 = 7")
        ],
        "question": "结果再乘以4呢？"
    }
))
```

运行结果：

```
ChatPromptValue(messages=[SystemMessage(content='你是一个非常友好的AI助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='5 + 2 = ?', additional_kwargs={}, response_metadata={}), AIMessage(content='5 + 2 = 7', additional_kwargs={}, response_metadata={}, tool_calls=[], invalid_tool_calls=[]), HumanMessage(content='结果再乘以4呢？', additional_kwargs={}, response_metadata={})])
```

### 4.3 可复用模板库

在实际项目中，建议把常用模板整理成模板库，避免在每个脚本里重复写。

#### 4.3.1 方式1：类属性集中管理

`templates.py` 声明如下：

```python title = "templates.py"
from langchain_core.prompts import ChatPromptTemplate

class PromptLibrary:
    """可复用的提示词模板库"""

    TRANSLATOR = ChatPromptTemplate.from_messages([
        ("system", "你是专业翻译，精通{source_lang}和{target_lang}"),
        ("user", "翻译以下文本：\n{text}")
    ])

    CODE_REVIEWER = ChatPromptTemplate.from_messages([
        ("system", "你是{language}代码审查专家，重点关注{focus}"),
        ("user", "审查代码：\n{code}")
    ])

    SUMMARIZER = ChatPromptTemplate.from_messages([
        ("system", "你是内容摘要专家"),
        ("user", "将以下内容总结为{num}个要点：\n{content}")
    ])

    TUTOR = ChatPromptTemplate.from_messages([
        ("system", "你是{subject}导师，学生水平：{level}"),
        ("user", "{question}")
    ])
```

在其他文件中使用：

```python
from templates import PromptLibrary

print(PromptLibrary.TRANSLATOR.format_messages(
    source_lang="英语",
    target_lang="中文",
    text="Hello World"
))
```

运行结果：

```
[SystemMessage(content='你是专业翻译，精通英语和中文', additional_kwargs={}, response_metadata={}), HumanMessage(content='翻译以下文本：\nHello World', additional_kwargs={}, response_metadata={})]
```

#### 4.3.2 方式2：按用途拆分模块

模板多了以后，可以按用途拆成独立模块：

```
templates/
├── __init__.py
├── common.py        # 通用模板
├── translation.py   # 翻译相关
└── coding.py        # 编程相关
```

以 `common.py` 为例：

```python
from langchain_core.prompts import ChatPromptTemplate

FRIENDLY_ASSISTANT = ChatPromptTemplate.from_messages([
    ("system", "你是一个友好的助手"),
    ("user", "{input}")
])
```

### 4.4 模板组合

将多个模板片段组合成复杂的提示词，有两种常见做法。

#### 4.4.1 字符串组合

先拼好字符串，再交给模板：

```python
from langchain_core.prompts import ChatPromptTemplate

# 定义可复用的部分
role_part = "你是一个{domain}专家。"
style_part = "回答风格：{style}。"
constraint_part = "限制：{constraint}。"

# 组合
full_system = role_part + style_part + constraint_part

template = ChatPromptTemplate.from_messages([
    ("system", full_system),
    ("user", "{question}")
])
```

#### 4.4.2 使用 + 运算符

LangChain 1.x 支持直接用 `+` 把两个 `ChatPromptTemplate` 拼起来：

```python
from langchain_core.prompts import ChatPromptTemplate

template1 = ChatPromptTemplate.from_messages([
    ("system", "你是助手")
])

template2 = ChatPromptTemplate.from_messages([
    ("user", "{input}")
])

# 组合
combined = template1 + template2

print(type(combined).__name__, "->", combined.invoke({"input": "你好"}))
```

运行结果：

```
ChatPromptTemplate -> messages=[SystemMessage(content='你是助手', additional_kwargs={}, response_metadata={}), HumanMessage(content='你好', additional_kwargs={}, response_metadata={})]
```
