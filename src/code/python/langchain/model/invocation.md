---
title: 模型的调用
icon: fas:paper-plane
order: 3
---

在 LangChain 中，模型调用（Invocation）是指通过特定方法触发大语言模型生成输出的过程。根据不同的应用场景和需求，LangChain 提供了几种核心的调用方式，主要是 `invoke()`、 `stream()`和 `batch()` 方法，以及它们的异步版本 `ainvoke()`、 `astream()`和 `abatch()`，下面将系统地介绍这些方法。

- `invoke()`：阻塞式，**一次性返回完整结果**问答、批处理任务、无需实时反馈的场景。

- `ainvoke()`：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。

- `stream()`：流式输出，**实时返回每个token**聊天机器人、长文本生成、需要提升用户体验的交互应用。

- `asteam()`：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。

- `batch()`：**批量处理多个输入**高并发场景，需要同时处理大量请求。

- `abatch()`：非阻塞式，提高系统吞吐量高并发Web应用、IO密集型任务。

## 1.invoke()

invoke() 是 LangChain 中**最核心的方法**，它的工作模式是阻塞式的，即程序会等待模型完全生成整个响应后，再一次性将结果返回给用户。

### 1.1 invoke() 说明

简单来说， `invoke` 方法的作用就是：

1. **接收你的输入**（问题、指令、对话历史等）
2. **发送给 LLM 模型**（如 GPT-4、Llama、Claude 等）
3. **返回模型的响应**（文本回复 + 元数据信息）

基本语法：

```python
response = model.invoke(input, config=None)
```

参数详解：

| 参数 | 类型 | 说明 | 必需 | 默认值 |
| :---: | :---: | :---: | :---: | :---: |
| input | str  \| list[dict]  \| list[Message] 等 | 你要发送给模型的内容 | 必需 | 无 |
| config | dict | 高级配置（回调函数、元数据、标签等） | 可选 | None |

### 1.2 输入参数详解

invoke 方法非常灵活，支持三种形式的输入： `文本输入`、 `字典列表`、 `消息对象列表`。

#### 1.2.1文本输入(最简单)

简单的一次性问答，直接传入一个问题或指令。

✅适用场景：快速测试，不需要保留对话历史的简单生成任务。

❌缺点：无法设置系统提示（system prompt），无法传递对话历史。

```python title="04.model-invoke.ipynb"
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

response = model.invoke("翻译如下的汉字：你好世界")

print(response)
```

在 invoke 中直接输入文本，即可自动转化为 user message 并进行对话。

#### 1.2.2 字典列表(推荐，最灵活)

创建字典列表组成消息。一条消息通常包含 `role（角色）` 、 `content（内容）` 等信息。

✅适用场景：可以设置系统提示，表达多轮对话历史，JSON 兼容，易于序列化和网络传输，生产环境推荐。

❌缺点：代码稍微多一点（但更清晰）

格式：

```
messages = [
    {"role": "system", "content": "系统提示"},
    {"role": "user", "content": "用户消息"},
    {"role": "assistant", "content": "AI回复"},  # 可选，用于对话历史
    {"role": "user", "content": "继续提问"}
]
```

角色说明：

| 角色 | 英文 | 作用 | 示例 |
| :---: | :---: | :---: | :---: |
| `system` | System | 设定 AI 的行为、角色、规则 | "你是一个专业的 Python 导师" |
| `user` | Human/User | 用户的输入/问题 | "什么是装饰器？" |
| `assistant` | AI/Assistant | AI 的历史回复（用于对话上下文） | "装饰器是一种设计模式..." |

::: tip
"user" 和 "human" 有时可以互换，但遵循你选择的主要模型提供商（如OpenAI）的惯例使用 "user" 是最稳妥的做法。
:::

举例1：

```python title="04.model-invoke.ipynb"
messages = [
    {"role": "system", "content": "你是一个专业的数学老师"},
    {"role": "user", "content": "帮我解释一下什么是斐波那契数列"}
]

response = model.invoke(messages)
print(response)
```

举例2：多轮对话（带历史）

```python title="04.model-invoke.ipynb"
messages = [
    {"role": "system", "content": "你是一个专业的数学老师"},
    {"role": "user", "content": "1 + 2 = ?"},
    {"role": "assistant", "content": "3"},
    {"role": "user", "content": "我刚才问了什么问题？"},
]

response = model.invoke(messages)
print(response)
```

运行结果：
```
你刚才问的是：**“1 + 2 = ?”**
```

举例3：如果不传递历史，AI 会"失忆"

```python title="04.model-invoke.ipynb"
messages1 = [
    {"role": "system", "content": "你是一个非常友好的AI助手"},
    {"role": "user", "content": "你好，我叫小明"},
]
# 第一次对话
response1 = model.invoke(messages1)
# 打印响应
print(f"AI的回复1：{response1.content}")

messages2 = [
    {"role": "user", "content": "我叫什么名字？"}
]
# 第二次对话
response2 = model.invoke(messages2)
# 打印响应
print(f"AI的回复2：{response2.content}")
```

运行结果：

```
AI的回复1：你好小明！很高兴认识你。有什么我可以帮你的吗？
AI的回复2：我不知道你的名字。你还没有告诉我，也无法从当前对话中获取你的个人信息。你可以直接告诉我你叫什么名字。
```

作为对比，传递记忆：

```python title="04.model-invoke.ipynb"
conversation = [
    {"role": "system", "content": "你是一个非常友好的AI助手"},
    {"role": "user", "content": "你好，我叫小明"},
]

# 第一次对话
response1 = model.invoke(conversation)
print(f"AI的回复1：{response1.content}")

# 添加记忆
conversation.append({"role": "assistant", "content": response1.content})
conversation.append({"role": "user", "content": "我叫什么名字？"})

# 第二次对话
response2 = model.invoke(conversation)
print(f"AI的回复2：{response2.content}")
```

运行结果：

```
AI的回复1：你好，小明！很高兴认识你😊 我是你的AI助手，有什么我可以帮你的吗？
AI的回复2：你叫小明呀 😊 有什么想聊的或需要帮忙的吗？
```


#### 1.2.3 消息对象列表

使用内置的消息类（如 SystemMessage, HumanMessage, AIMessage），将消息对象列表输入模型。

✅适用场景：需要类型检查（针对大型项目）、IDE 自动补全的场景

❌缺点：代码较长、不如字典简洁、难以序列化（JSON）

消息类型对照：

| 消息类 | 对应字典格式 | 作用 |
| :---: | :---: | :---: |
| SystemMessage | {"role": "system", ...} | 系统提示 |
| HumanMessage | {"role": "user", ...} | 用户输入 |
| AIMessage | {"role": "assistant", ...} | AI 回复 |

举例1：

```python title="04.model-invoke.ipynb"
from langchain_core.messages import SystemMessage, HumanMessage

messages = [
    SystemMessage(content="你是一个专业的数学老师"),
    HumanMessage(content="帮我解释一下什么是斐波那契数列")
]

response = model.invoke(messages)
print(response)
```

### 1.3 返回值详解

invoke 返回一个 `AIMessage对象`，源码如下：

```python title="chat_models.py"
def invoke(
    self,
    input: LanguageModelInput,
    config: RunnableConfig | None = None,
    *,
    stop: list[str] | None = None,
    **kwargs: Any,
) -> AIMessage:
```

举例：

```python title="04.model-invoke.ipynb"
response = model.invoke([HumanMessage(content="2+ 3 * 2 = ?")])

print(type(response))
```

运行结果：

```
<class 'langchain_core.messages.ai.AIMessage'>
```

```python title="04.model-invoke.ipynb"
print(response)
```

运行结果：

```
content='8' additional_kwargs={'refusal': None, 'reasoning_content': 'We need answer simple arithmetic. Need obey order operations. 2 + 3*2 = 2+6=8. Need perhaps concise.'} response_metadata={'token_usage': {'completion_tokens': 32, 'prompt_tokens': 39, 'total_tokens': 71, 'completion_tokens_details': {'accepted_prediction_tokens': None, 'audio_tokens': None, 'reasoning_tokens': 30, 'rejected_prediction_tokens': None}, 'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0}, 'prompt_cache_hit_tokens': 0, 'prompt_cache_miss_tokens': 39}, 'model_provider': 'deepseek', 'model_name': 'deepseek-flash', 'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501', 'id': 'b3bfff10-cd0f-41ae-9d83-f36bdd472f7f', 'finish_reason': 'stop', 'logprobs': None} id='lc_run--01a15970-b935-77a0-8ed0-a380541fb5d8-0' tool_calls=[] invalid_tool_calls=[] usage_metadata={'input_tokens': 39, 'output_tokens': 32, 'total_tokens': 71, 'input_token_details': {'cache_read': 0}, 'output_token_details': {'reasoning': 30}}
```

`print()` 输出的是单行 repr，字段一多就挤成一片，很难阅读。借助 `rich` 的 `rprint()` 可以自动格式化打印（`rich` 已包含在依赖清单中）：

```python title="04.model-invoke.ipynb"
from rich import print as rprint

rprint(response)
```

运行结果：

```
AIMessage(
    content='8',
    additional_kwargs={
        'refusal': None,
        'reasoning_content': 'We need answer simple arithmetic. Need obey order operations. 2 + 3*2 = 2+6=8. Need 
perhaps concise.'
    },
    response_metadata={
        'token_usage': {
            'completion_tokens': 32,
            'prompt_tokens': 39,
            'total_tokens': 71,
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,
                'audio_tokens': None,
                'reasoning_tokens': 30,
                'rejected_prediction_tokens': None
            },
            'prompt_tokens_details': {'audio_tokens': None, 'cached_tokens': 0},
            'prompt_cache_hit_tokens': 0,
            'prompt_cache_miss_tokens': 39
        },
        'model_provider': 'deepseek',
        'model_name': 'deepseek-flash',
        'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501',
        'id': 'b3bfff10-cd0f-41ae-9d83-f36bdd472f7f',
        'finish_reason': 'stop',
        'logprobs': None
    },
    id='lc_run--01a15970-b935-77a0-8ed0-a380541fb5d8-0',
    tool_calls=[],
    invalid_tool_calls=[],
    usage_metadata={
        'input_tokens': 39,
        'output_tokens': 32,
        'total_tokens': 71,
        'input_token_details': {'cache_read': 0},
        'output_token_details': {'reasoning': 30}
    }
)
```

AIMessage 中包含丰富的信息。下面以本次输出为例逐字段说明——其中部分字段与供应商、模型相关，并非每次都会返回：

```python
AIMessage(
    # --- 核心内容 ---
    content='8',  # 模型生成的最终文本答案

    additional_kwargs={
        'refusal': None,  # 模型拒绝回答的情况（如触碰安全策略），None 表示正常回答
        'reasoning_content': 'We need answer simple arithmetic. Need obey order operations. 2 + 3*2 = 2+6=8. Need perhaps concise.'  # 推理模型的思考过程（DeepSeek 等推理模型的特有字段）
    },

    # --- 响应元数据（API 返回的详细原始数据） ---
    response_metadata={
        'token_usage': {
            'completion_tokens': 32,    # 生成回答消耗的 Token 数（输出）
            'prompt_tokens': 39,        # 用户输入消耗的 Token 数（输入）
            'total_tokens': 71,         # 本次交互总共消耗的 Token
            'completion_tokens_details': {
                'accepted_prediction_tokens': None,  # 预测性生成的 Token 数
                'audio_tokens': None,                # 音频生成消耗（如有）
                'reasoning_tokens': 30,              # 推理模型思考过程消耗的 Token
                'rejected_prediction_tokens': None   # 被拒绝的预测 Token
            },
            'prompt_tokens_details': {
                'audio_tokens': None,  # 输入中的音频 Token 数
                'cached_tokens': 0     # 命中的缓存 Token 数（能省钱/提速）
            },
            'prompt_cache_hit_tokens': 0,    # 命中缓存的输入 Token 数
            'prompt_cache_miss_tokens': 39,  # 未命中缓存的输入 Token 数

            # --- 延迟性能监控（单位：毫秒 ms，部分供应商返回） ---
            'latency_checkpoint': {
                'engine_tbt_ms': 4,          # 引擎 Token 间的平均间隔时间
                'engine_ttft_ms': 36,        # 引擎生成首个 Token 的时间
                'engine_ttlt_ms': 100,       # 引擎生成最后一个 Token 的时间
                'pre_inference_ms': 86,      # 推理前的预处理耗时（安全审核、Token 化等）
                'service_tbt_ms': 4,         # 服务端 token 与 token 之间的间隔，决定打字机效果是否丝滑
                'service_ttft_ms': 280,      # 服务端接收到请求到输出首字的总时间
                'service_ttlt_ms': 338,      # 服务端完成全部输出的总时间
                'total_duration_ms': 259,    # 本次请求在系统中记录的总持续时长
                'user_visible_ttft_ms': 194  # 用户看到第一个字跳出来的等待时间
            }
        },
        'model_provider': 'deepseek',              # 模型供应商
        'model_name': 'deepseek-flash',            # 使用的具体模型版本
        'system_fingerprint': 'e72d3c7f663d3e1383b00b3884cb4501',  # 系统指纹，用于追踪模型后端的配置变更
        'id': 'b3bfff10-cd0f-41ae-9d83-f36bdd472f7f',  # API 层面的响应 ID
        'service_tier': 'default',                 # 服务层级（如按量付费或订阅，部分供应商返回）
        'finish_reason': 'stop',                   # 停止原因：stop（自然结束）、length（长度受限）
        'logprobs': None                           # 对数概率（通常用于分析词汇选择的可能性）
    },

    # --- LangChain 内部标识 ---
    id='lc_run--01a15970-b935-77a0-8ed0-a380541fb5d8-0',  # LangChain 追踪此条运行的唯一 ID

    # --- 工具调用信息 ---
    tool_calls=[],             # 正常触发的外部工具调用列表
    invalid_tool_calls=[],     # 触发失败或格式错误的工具调用

    # --- 统一消耗元数据（LangChain 标准化后的消耗格式） ---
    usage_metadata={
        'input_tokens': 39,    # 输入 Token 数
        'output_tokens': 32,   # 输出 Token 数
        'total_tokens': 71,    # 总 Token 数
        'input_token_details': {
            'audio': 0,       # 输入中的音频 Token 数
            'cache_read': 0   # 从缓存中读取的输入 Token 数
        },
        'output_token_details': {
            'audio': 0,       # 输出中的音频 Token 数
            'reasoning': 30   # 输出中包含的推理 Token 数
        }
    }
)
```

::: tip 总结

**1. 核心内容与基本信息**

- `content`: 模型生成的文本回答。这是你最关心的核心输出。

- `id`: 本次运行在 LangChain 内部生成的唯一标识符（Run ID）。

- `additional_kwargs`: 包含特定供应商的额外参数。

  - `refusal`: 如果模型拒绝回答（涉及敏感政策），此处会显示拒绝原因。

**2. 消耗统计 (Token Usage)**

这部分决定了你这一行输入操作花了多少钱：

- `prompt_tokens` / `input_tokens`: 输入 Token 数。你发送给模型的问题长度。

- `completion_tokens` / `output_tokens`: 输出 Token 数。模型回答生成的长度。

- `total_tokens`: 总消耗。 两者之和。

- `reasoning_tokens`: 推理 Token 数。 如果是 O1/O3 等推理模型，这里会显示它在“思考”时消耗的 Token。

- `cached_tokens`: 缓存命中的 Token 数。重复提问时，如果命中了模型商的缓存，这部分费用通常更低。

**3. 响应元数据 (Response Metadata)**

这部分是 API 返回的原始详细信息：

- `model_name`: 实际调用的模型具体版本（如`gpt-5.4-mini`）。

- `model_provider`: 模型供应商（如 `openai`）。

- `finish_reason`: 生成停止的原因。

  - `stop`: 正常回答结束。

  - `length`: 达到最大 Token 限制被截断。

- `system_fingerprint`: 系统指纹，用于追踪模型后端的配置变更。

**4. 性能与延迟 (Latency Checkpoint)**

这是针对 API 响应速度的深度拆解（单位通常为毫秒 **ms**）：

- `total_duration_ms`: 总耗时。从请求发出到完全收到的总时间（259ms）。

- `user_visible_ttft_ms`: 首字到达时间。用户看到第一个字跳出来等待的时间（194ms），这是体感快慢的关键。

- `engine_ttft_ms`: 引擎层面的首字到达时间（36ms）。

- `engine_ttlt_ms`: 引擎生成最后一个字的时间（100ms）。

- `pre_inference_ms`: 推理前处理耗时。包括安全审核、Token 化等预处理（86ms）。

- `service_tbt_ms`: Time Between Tokens。字与字之间生成的间隔时间，决定了打字机效果是否丝滑。

**5. 工具调用信息**

- `tool_calls`: 结构化工具调用列表。如果模型决定调用某个 Python 函数或搜索工具，参数会在这里。

- `invalid_tool_calls`: 格式错误的工具调用尝试。
:::

举例: 获取所有字段

```python title="04.model-invoke.ipynb"
response = model.invoke("用一句话解释什么是 AI")

# 1. 获取回复内容
print("AI 回复:", response.content)

# 2. 获取响应元数据
metadata = response.response_metadata
print(f"使用的模型: {metadata['model_name']}")
print(f"结束原因: {metadata['finish_reason']}")
print(f"模型提供商：{metadata['model_provider']}\n")

# 3. 获取 Token 使用情况
usage = metadata.get('token_usage', {})
print(f"输入 tokens: {usage.get('prompt_tokens')}")
print(f"输出 tokens: {usage.get('completion_tokens')}")
print(f"总计 tokens: {usage.get('total_tokens')}")

# 4. 获取消息 ID
print(f"消息 ID: {response.id}")
```

运行结果：

```
AI 回复: AI 是让计算机通过数据和算法模拟人类智能，从而进行感知、学习、推理和决策的技术。
使用的模型: deepseek-flash
结束原因: stop
模型提供商：deepseek

输入 tokens: 35
输出 tokens: 96
总计 tokens: 131
消息 ID: lc_run--01a15980-5375-7ee1-9a97-3237255783d2-0
```

## 2.流式调用

### 2.1 invoke 和 stream 的区别

- `invoke()`：同步调用，在模型输出完成后**一次性获取响应**，对于输出文本很长的场景，用户体验不好。

- `stream()`：流式调用，**实时返回响应片段**。调用后，返回一个 `迭代器(iterator)`，可以通过循环来实时处理每一个新生成的chunk内容块。

::: warning 注意
流式输出依赖于模型供应商对于流式输出的支持。
:::

```python title="05.model-stream-batch.ipynb"
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

for chunk in model.stream("帮我解释一下什么是人工智能"):
    print(chunk.text, end="", flush=True)   
```

输出不再是整段返回，而是流式输出。

### 2.2 stream() 方式的优点

- `响应速度更快` — 用户不必等待完整输出

- `交互体验更流畅` — 尤其在长文本或复杂推理场景下

- `可实时展示模型思考过程`

## 3.批量调用

batch() 方法允许你一次性 `发送一组请求`（含多条独立请求），模型会在后台 `并行处理` ，然后返回 `所有结果的列表`。

与逐个顺序调用（invoke）相比，能大幅 `减少网络往返开销` 和 `等待时间` ，显著提升性能、降低成本。

**适用场景：**文档摘要、批量问答、数据预处理、多样本分类等。

### 3.1 一次性接收所有响应

batch() 特点是等待所有请求处理完毕，按原始输入顺序返回结果列表。

```python title="05.model-stream-batch.ipynb"
messages = [
    "你好，你是谁？",
    "2 + 3 * 5 = ?",
    "中国首都在哪里？"
]

responses = model.batch(messages)

for response in responses:
    print(response.content)
```

运行结果：

```
你好！我是 **DeepSeek**，一个由深度求索公司创造的 AI 助手。我可以帮你回答问题、分析信息、写作、编程、学习等。有什么需要帮忙的吗？
17
中国首都是北京。
```

### 3.2 按完成顺序接收响应

当输入列表很大或单个模型调用耗时差异显著时， `batch_as_completed()` 允许应用在收到第一个结果后立即返回响应，而不会等待批次内所有任务完成才响应。即 batch_as_completed() 每个请求完成后立即 yield 结果， `结果可能乱序`。

但是，每个返回的响应都被放在一个 `元组` 中，元组的第一个元素是原始输入的 index 索引，可根据索引重新排序。

```python title="05.model-stream-batch.ipynb"
messages = [
    "你好，你是谁？",
    "2 + 3 * 5 = ?",
    "中国首都在哪里？"
]

responses = model.batch_as_completed(messages)

for response in responses:
    print(response[1].content)
```

运行结果：

```
中国首都是北京。
你好！我是 DeepSeek，由深度求索公司开发的 AI 助手。我可以帮你回答问题、写作、翻译、编程、分析资料等。有什么需要帮忙的吗？
17
```

### 3.3 性能对比

`batch()` 不只是「一次传入多个输入」这么简单——它在底层会**并发**地向模型服务发起请求；而用 `for` 循环逐个 `invoke()` 时，每个请求都要等上一个返回之后才开始。下面用同样的 4 条翻译任务，对比两者的耗时差异。

#### 批量调用（高效）

```python title="05.model-stream-batch.ipynb"
# 准备多个输入
inputs = [
    "翻译成英文：春天来了",
    "翻译成英文：夏天很热",
    "翻译成英文：秋天落叶",
    "翻译成英文：冬天下雪"
]

import time

start = time.time()
responses = model.batch(inputs)
batch_time = time.time() - start

print("批量调用结果：")
for i, response in enumerate(responses):
    print(f"{i+1}. {response.content}")
print(f"耗时: {batch_time:.2f}秒\n")
```

运行结果：

```
批量调用结果：
1. Spring is here.
2. Summer is very hot.
3. Autumn leaves falling
4. It snows in winter.
耗时: 2.05秒
```

#### 循环调用（低效，仅用于对比）

```python title="05.model-stream-batch.ipynb"
inputs = [
    "翻译成英文：春天来了",
    "翻译成英文：夏天很热",
    "翻译成英文：秋天落叶",
    "翻译成英文：冬天下雪"
]

start = time.time()
loop_responses = []
for inp in inputs:
    response = model.invoke(inp)
    loop_responses.append(response)
loop_time = time.time() - start

for i, response in enumerate(loop_responses):
    print(f"{i+1}. {response.content}")

print(f"循环调用耗时: {loop_time:.2f}秒")

print(f"批量调用节省: {((loop_time - batch_time) / loop_time * 100):.1f}%")
```

运行结果：

```
1. Spring is here.
2. Summer is very hot.
3. Autumn leaves falling
4. It snows in winter.
循环调用耗时: 4.04秒
批量调用节省: 49.2%
```

同样的 4 条输入，批量调用 2.05 秒、循环调用 4.04 秒，耗时差不多减半。差距来自**并发**：`batch()` 会把多个请求同时发出去，总耗时大致等于「最慢的那一个」；循环则是串行，总耗时是「所有请求之和」。

::: tip
并发数可以显式控制：

`responses = model.batch(inputs, max_concurrency=5)`

注意别设得太高——超过供应商的限流阈值（rate limit）反而会触发重试，把整体速度拖回去。
:::

**怎么选：**

- 多个**相互独立**的输入 → 用 `batch()` 或 `batch_as_completed()`
- 后一个请求依赖前一个的结果 → 只能用循环
- 担心触发限流 → 用 `max_concurrency` 压低并发数