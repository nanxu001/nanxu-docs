---
title: 案例：AI 汉字谜盒
icon: fas:box-open
order: 6
---

## 1.Restful

Restful 指的是遵循 REST 架构风格的 API 接口服务，而 REST（REpresentational State Transfer）表述性状态转换，是一种软件架构风格。

### 传统风格 vs RESTful 风格对比

| 特性 | 传统风格 (RPC) | RESTful 风格 |
| :--- | :--- | :--- |
| **URL 设计** | 包含动词，如 `/user/getById` | 仅包含名词（资源），如 `/users/1` |
| **请求方式** | 通常全部使用 GET 或 POST | 根据操作类型使用 GET, POST, PUT, DELETE |
| **参数传递** | 常通过 URL 查询参数传递 ID | ID 通常作为 URL 路径的一部分 |
| **语义化** | 较弱，需看方法名才知道意图 | 强，通过 HTTP 动词即可明确操作意图 |

**具体示例对比：**

| 操作 | 传统风格 URL | RESTful 风格 URL | 请求方式 |
| :---: | :--- | :--- | :---: |
| **查询** | `/user/getById?id=1` | `/users/1` | GET |
| **新增** | `/user/saveUser` | `/users` | POST |
| **修改** | `/user/updateUser` | `/users/1` | PUT |
| **删除** | `/user/deleteUser?id=1` | `/users/1` | DELETE |

::: warning 核心约定
1. **资源复数化**：描述功能模块时通常使用**复数形式**（加 `s`），表示一类资源集合，而非单个对象。例如：`users`、`books`、`items`。
2. **非强制性**：REST 是一种架构风格和设计约定，并非强制性的技术标准。在实际开发中，可以根据业务需求灵活调整，但保持风格统一有助于提高接口的可维护性。
3. **幂等性**：GET、PUT、DELETE 通常被认为是幂等的（多次执行结果相同），而 POST 通常是非幂等的。
:::

## 2.需求

**汉字谜盒**是一款基于人工智能的字谜互动游戏，专为汉字爱好者设计。在这里，你将与AI机器人进行有趣的猜字挑战！AI会随机出一道经典字谜（如"一箭穿心"），你需要根据谜面提示猜出对应的汉字，AI会根据你的回答给出相应的提示，并给出最终的答案。

## 3.FastAPI


[FastAPI](https://fastapi.org.cn/) 是一个用于构建 API 的现代、快速（高性能）的 Web 框架，使用 Python 3.6+ 并基于标准的 Python 类型提示。

### 核心优势

*   **极速性能**：基于 Starlette 和 Pydantic，性能比肩 NodeJS 和 Go，是目前最快的 Python 框架之一。
*   **高效开发**：代码简洁，功能强大，能减少约 40% 的人为错误。
*   **自动文档**：自动生成符合 OpenAPI 标准的交互式文档（Swagger UI 和 ReDoc），无需手动编写接口文档。
*   **数据校验**：利用 Python 类型提示进行严格的数据校验，确保输入输出数据的准确性。

## 4.基础环境搭建

### 4.1 创建 FastAPI 应用

创建一个基础的 FastAPI 实例，并定义根路径 `/` 返回前端首页 `index.html`。

```python title = "main.py"
from fastapi import FastAPI
from starlette.responses import FileResponse

app = FastAPI(title="汉字谜盒")

@app.get("/")
def root():
    print("访问项目首页")
    return FileResponse("static/index.html")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

此时启动项目并访问 `http://127.0.0.1:8000`，虽然能看到页面内容，但你会发现**页面没有样式**（CSS、JS、图片等资源加载失败）。这是因为 FastAPI 默认不会自动处理静态文件的请求。

### 4.2 挂载静态文件目录

为了解决样式丢失的问题，我们需要使用 `StaticFiles` 将本地的静态资源目录“挂载”到特定的 URL 路径上。

```python title = "main.py"
from fastapi import FastAPI
from starlette.responses import FileResponse
from starlette.staticfiles import StaticFiles

app = FastAPI(title="汉字谜盒")

# 挂载静态文件目录
# /static: 任何以/static开头的路径都会交给这处理
# directory: 本地存放静态文件的文件夹名称
# name: 该挂载点在 FastAPI 内部的标识名（可选）
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return FileResponse("static/index.html")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

::: info 原理说明
- `app.mount`：这个方法会将 `/static` 路径下的所有请求转发给 `StaticFiles` 处理。
- 路径匹配：当浏览器请求 `/static/style.css` 时，FastAPI 会自动去本地的 `static` 文件夹下寻找 `style.css` 文件并返回。
- 目录结构建议：确保你的项目根目录下有一个名为 `static` 的文件夹，并将 `index.html`、`.css`、`.js` 等文件放入其中。
:::

## 5.新建会话

在打开该项目页面时，如果之前没有会话，则要自动创建一个会话，会话标识形式如 2026-04-15_12-00-05。

### 5.1 创建会话存放目录

当项目启动时，需要判断会话存放目录 session 是否存在，如果不存在需要进行创建。

```python title = "main.py"
import os

# 创建会话存放的目录
if not os.path.exists("sessions"):
    os.mkdir("sessions")
```

### 5.2 创建会话

```python title = "main.py"
import json

# 生成会话标识
def generate_session_id():
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")

# 新建会话
@app.post("/api/sessions")
def creat_session():
    print("新建会话")

    # 生成会话标识
    session_id = generate_session_id()

    # 组装会话信息，保存到文件
    session_data = {
        "current_session": session_id,
        "messages": []
    }

    with open(f"sessions/{session_id}.json", "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    return {"code": 200, "message": "创建会话成功", "data": session_id}
```

### 5.3 使用响应模型 (Response Model)

在传统的 API 开发中，手动返回 `dict` 类型的数据容易出现拼写错误（如将 `message` 写成 `msg`），且缺乏类型约束。FastAPI 提供了强大的[响应模型](https://fastapi.org.cn/tutorial/response-model/)机制，通过结合 **Pydantic** 库，我们可以：

1.  **定义数据结构**：使用继承自 `BaseModel` 的类来明确返回值的字段和类型。
2.  **自动校验与转换**：FastAPI 会自动校验返回值是否符合模型定义，并将其转换为标准的 JSON 格式。
3.  **生成文档**：这些模型会自动反映在 Swagger UI 文档中，方便前端开发者查阅。

```python title = "main.py"
from pydantic import BaseModel
from typing import Any

# 数据模型
class ApiResponse(BaseModel):
    code: int           # 状态码
    message: str        # 提示信息
    data: Any = None    # 业务数据，默认为 None

# 新建会话
@app.post("/api/sessions")
def creat_session() -> ApiResponse:
    print("新建会话")

    # 生成会话标识
    session_id = generate_session_id()

    # 组装会话信息，保存到文件
    session_data = {
        "current_session": session_id,
        "messages": []
    }

    with open(f"sessions/{session_id}.json", "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    # return {"code": 200, "message": "创建会话成功", "data": session_id}
    return ApiResponse(code=200, message="创建会话成功", data=session_id)
```

## 6.与 AI 交互

在与AI进行交互时，前端传递给服务端的参数包含两项，分别为 `session_id` 与 `message`，并以 `json` 格式在请求体中传递到服务端。

### 6.1 定义请求参数

为了规范接收到的数据，我们同样使用 Pydantic 的 `BaseModel` 来定义请求参数的结构。FastAPI 会自动解析 JSON 请求体并校验字段类型。

```python title = "main.py"
class ChatRequest(BaseModel):
    session_id: str
    message: str
```

### 6.2 实现交互接口

定义一个 POST 接口 `/api/chat`，接收 `ChatRequest` 对象。在实际业务中，这里会调用大模型 API 并返回结果。

```python title = "main.py"
# 与AI交互
@app.post("/api/chat")
def chat(request: ChatRequest) -> ApiResponse:
    print(f"与AI交互：{request.session_id}:{request.message}")
    return ApiResponse(code=200, message="请求成功", data="AI大模型返回的数据")
```

## 7.实现 AI 对话逻辑

使用 DeepSeek API 作为后端支持，通过维护会话上下文来实现连续的字谜互动。

### 7.1 系统提示词

系统提示词决定了 AI 的行为模式和回复风格。我们要求 AI 扮演一个专业的字谜助手，严格遵守出题和判题规则。

```python title = "main.py"
SYSTEM_PROMPT = """
# 角色定义
你是一个专门玩猜字谜的AI小助手，只进行字谜互动，不闲聊无关内容，全程纯文本交互，不使用表情符号。
 
## 核心能力
- 出字谜、判对错、给提示
- 记忆已用谜题，确保会话内不重复
- 简洁明快回应
 
## 出题规则（严格执行！）
1. 开场先友好打招呼，并随机出一道常见、简单、适合大众并必须符合逻辑推理的字谜，禁止使用生僻、低俗、网络烂梗。
2. 题目格式：“谜面”（打一字）。
3. 每次出题必须完全随机，禁止重复使用相同题目，也可以偶尔穿插使用，下面示例中的谜语。
4. 新出题目时, 不要提示, 用户需要提示时, 或者答错时, 再给予合理的提示。
 
## 判题规则（严格执行！）
1. 用户只回复一个字时，直接视为答案。
2. 答对：立即夸奖并揭晓谜底，格式如“太棒了！就是‘X’字！要不要再来一题？”
3. 答错：告知不对，可给一句简短提示，但不泄露答案。格式如“不对哦，再想想~”
4. 严禁在用户答错后直接公布答案！只有用户说“公布答案”或“不知道”等情况时才公布。
 
## 互动流程
1. 用户答对：夸奖 + 确认正确 + 询问“要不要再来一题？”
2. 用户答错：告知不对 + 简单提示 + 鼓励继续猜
3. 用户说“提示一下”：给出简短线索，不公布答案
4. 用户说“公布答案”或“不知道”：揭晓谜底并解释 + 询问“要不要再来一题？”
5. 用户说“换一题”“再来一题”：立即更换新字谜
 
## 回复风格约束
- 语气轻松有趣，但保持简洁
- 全程只围绕字谜，拒绝回答其他问题
- 回复不超过3句话
- **绝对不要在回复中说“这个出过了，我来个新的”或类似表述** — 直接给出新谜语即可
- 判题错误零容忍，不确定谜底时，先回复“我再想想”而不是乱判
 
## 常见谜语类型及谜底参考示例, 仅仅为参照示例
### 组合类
- 「一加一不是二」= 王
- 「二人不是天」= 夫
- 「十口不是田」= 古
 
### 包含类
- 「一人在内」= 肉
- 「口里有人」= 囚
- 「门里有口」= 问
- 「田里长草」= 苗
- 「心里有你」= 您
- 「山里有山」= 出
- 「王头上有人」= 全
- 「水上有石」= 泵
 
### 半取类
- 「半吃半拿」= 哈
- 「半真半假」= 值
- 「半青半紫」= 素
- 「半朋半友」= 有
- 「半推半就」= 扰
- 「半山半水」= 汕
 
### 象形类
- 「三人又重逢」= 众
- 「一口咬掉牛尾巴」= 告
- 「两座山」= 出
- 「三日又重逢」= 晶
"""
```

### 7.2 初始化 AI 客户端

我们需要安装 `openai` 库来调用兼容 OpenAI 格式的 API（如 DeepSeek）。

```cmd
pip install openai
```

在代码中创建全局客户端实例:

```python title = "main.py"
from openai import OpenAI

# 请替换为你自己的 API Key
client = OpenAI(api_key="sk-******************", base_url="https://api.deepseek.com")
```

### 7.3 实现对话接口

该接口负责加载历史会话、构建消息上下文、调用 AI 模型并保存最新的对话记录。

```python title = "main.py"
@app.post("/api/chat")
def chat(request: ChatRequest) -> ApiResponse:
    print(f"与AI交互：{request.session_id}:{request.message}")

    # 加载json文件中的数据
    with open(f"sessions/{request.session_id}.json", "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 构建AI大模型交互的消息数据
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *session_data["messages"],
        {"role": "user", "content": request.message}
    ]

    # 调用AI大模型
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        stream=False,
        temperature=1.5
    )

    # 获取响应数据
    ai_response = response.choices[0].message.content

    # 更新消息列表中的消息
    messages.append({"role": "assistant", "content": ai_response})

    # 保存会话信息到json文件中
    with open(f"sessions/{request.session_id}.json", "w", encoding="utf-8") as f:
        # 删除系统提示词
        messages.pop(0)

        session_data = {
            "current_session": request.session_id,
            "messages": messages
        }
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)
```

## 8.会话列表

在汉字谜盒项目的左侧侧边栏，要查询并展示出所有的会话信息，将会话名展示在左侧， 并且根据时间倒序排序。

```python title = "main.py"
# 获取会话列表
@app.get("/api/sessions")
def get_sessions() -> ApiResponse:
    session_files = os.listdir("sessions")

    session_ids = [session_file.split(".")[0] for session_file in session_files]
    session_ids.sort(reverse=True)

    return ApiResponse(code=200, message="获取会话列表成功", data=session_ids)
```

## 9.加载指定会话

在点击左侧的会话名称之后，就要查询出该会话对应的会话信息，并在消息展示栏将其展示出来。

```python title = "main.py"
# 加载指定会话
@app.get("/api/sessions/{session_id}")
def get_session(session_id: str) -> ApiResponse:
    with open(f"sessions/{session_id}.json", "r", encoding="utf-8") as f:
        session_data = json.load(f)

    return ApiResponse(code=200, message="获取会话成功", data=session_data)
```

## 10.删除会话

在点击左侧会话名称之后的 X ，就要将当前的会话信息直接删除掉。

```python title = "main.py"
# 删除指定会话
@app.delete("/api/sessions/{session_id}")
def del_session(session_id: str) -> ApiResponse:
    if os.path.exists(f"sessions/{session_id}.json"):
        os.remove(f"sessions/{session_id}.json")

    return ApiResponse(code=200, message="删除会话成功", data=None)
```

## 11.日志记录

为了能够灵活的控制项目中日志的输出，我们可以通过官方提供的logging模块来输出日志，具体做法如下：

```python title = "main.py"
import logging

logging.basicConfig(
     level=logging.INFO,
     # asctime: 日志事件发生的时间，levelname: 日志级别，filename: 输出日志的文件名，lineno: 输出日志的行号，message: 日志信息
     format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
)

@app.get("/")
def root():
    logging.info("访问首页~")
    return FileResponse("static/index.html")
```

::: info
**日志级别**：日志级别就是给日志信息贴上的"重要性标签"，常见的级别有：DEBUG、INFO、WARNING、ERROR、FATAL（日志级别依次升高）。
:::

## 12.异常处理

项目中的功能较多，目前我们并未考虑异常处理，可以借助于 FastAPI 中的统一异常处理方案来处理异常。

```python title = "main.py"
# 异常处理器
@app.exception_handler(Exception)
def handler_exception(request: Request, exc: Exception):
    logging.error(f"处理异常，请求路径{request.url}，捕获到异常：{exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误，请联系管理员", "data": None})
```

## 13.完整代码

```python title = "main.py"
import json
import os
import logging
from datetime import datetime
from typing import Any

from fastapi import FastAPI, Request
from openai import OpenAI
from pydantic import BaseModel
from starlette.responses import FileResponse, JSONResponse
from starlette.staticfiles import StaticFiles

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s"
)

app = FastAPI(title="汉字谜盒")

# html中请求的资源路径如果是 /static，就会匹配到这里，到StaticFiles中的目录名下寻找，name是fastAPI内部名称，可以随便填写
app.mount("/static", StaticFiles(directory="static"), name="static")

# 系统提示词
SYSTEM_PROMPT = """
# 角色定义
你是一个专门玩猜字谜的AI小助手，只进行字谜互动，不闲聊无关内容，全程纯文本交互，不使用表情符号。
 
## 核心能力
- 出字谜、判对错、给提示
- 记忆已用谜题，确保会话内不重复
- 简洁明快回应
 
## 出题规则（严格执行！）
1. 开场先友好打招呼，并随机出一道常见、简单、适合大众并必须符合逻辑推理的字谜，禁止使用生僻、低俗、网络烂梗。
2. 题目格式：“谜面”（打一字）。
3. 每次出题必须完全随机，禁止重复使用相同题目，也可以偶尔穿插使用，下面示例中的谜语。
4. 新出题目时, 不要提示, 用户需要提示时, 或者答错时, 再给予合理的提示。
 
## 判题规则（严格执行！）
1. 用户只回复一个字时，直接视为答案。
2. 答对：立即夸奖并揭晓谜底，格式如“太棒了！就是‘X’字！要不要再来一题？”
3. 答错：告知不对，可给一句简短提示，但不泄露答案。格式如“不对哦，再想想~”
4. 严禁在用户答错后直接公布答案！只有用户说“公布答案”或“不知道”等情况时才公布。
 
## 互动流程
1. 用户答对：夸奖 + 确认正确 + 询问“要不要再来一题？”
2. 用户答错：告知不对 + 简单提示 + 鼓励继续猜
3. 用户说“提示一下”：给出简短线索，不公布答案
4. 用户说“公布答案”或“不知道”：揭晓谜底并解释 + 询问“要不要再来一题？”
5. 用户说“换一题”“再来一题”：立即更换新字谜
 
## 回复风格约束
- 语气轻松有趣，但保持简洁
- 全程只围绕字谜，拒绝回答其他问题
- 回复不超过3句话
- **绝对不要在回复中说“这个出过了，我来个新的”或类似表述** — 直接给出新谜语即可
- 判题错误零容忍，不确定谜底时，先回复“我再想想”而不是乱判
 
## 常见谜语类型及谜底参考示例, 仅仅为参照示例
### 组合类
- 「一加一不是二」= 王
- 「二人不是天」= 夫
- 「十口不是田」= 古
 
### 包含类
- 「一人在内」= 肉
- 「口里有人」= 囚
- 「门里有口」= 问
- 「田里长草」= 苗
- 「心里有你」= 您
- 「山里有山」= 出
- 「王头上有人」= 全
- 「水上有石」= 泵
 
### 半取类
- 「半吃半拿」= 哈
- 「半真半假」= 值
- 「半青半紫」= 素
- 「半朋半友」= 有
- 「半推半就」= 扰
- 「半山半水」= 汕
 
### 象形类
- 「三人又重逢」= 众
- 「一口咬掉牛尾巴」= 告
- 「两座山」= 出
- 「三日又重逢」= 晶
"""

# 创建与AI大模型交互的客户端对象
client = OpenAI(api_key="sk-***************", base_url="https://api.deepseek.com")

# 创建会话存放的目录
if not os.path.exists("sessions"):
    os.mkdir("sessions")


# 生成会话标识
def generate_session_id():
    return datetime.now().strftime("%Y-%m-%d_%H-%M-%S")


# 数据模型
class ApiResponse(BaseModel):
    code: int
    message: str
    # 任意类型
    data: Any


class ChatRequest(BaseModel):
    session_id: str
    message: str


@app.get("/")
def root():
    logging.info("访问项目首页")
    return FileResponse("static/index.html")


# 新建会话
@app.post("/api/sessions")
def creat_session() -> ApiResponse:
    logging.info("新建会话")

    # 生成会话标识
    session_id = generate_session_id()

    # 组装会话信息，保存到文件
    session_data = {
        "current_session": session_id,
        "messages": []
    }

    with open(f"sessions/{session_id}.json", "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    # return {"code": 200, "message": "创建会话成功", "data": session_id}
    return ApiResponse(code=200, message="创建会话成功", data=session_id)


# 与AI交互
@app.post("/api/chat")
def chat(request: ChatRequest) -> ApiResponse:
    logging.info(f"与AI交互：{request.session_id}:{request.message}")

    # 加载json文件中的数据
    with open(f"sessions/{request.session_id}.json", "r", encoding="utf-8") as f:
        session_data = json.load(f)

    # 构建AI大模型交互的消息数据
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        *session_data["messages"],
        {"role": "user", "content": request.message}
    ]

    # 调用AI大模型
    logging.info(f"----> 请求的会话信息：{messages}")
    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        stream=False,
        temperature=1.5
    )

    # 获取响应数据
    ai_response = response.choices[0].message.content
    logging.info(f"<---- AI大模型响应的数据：{ai_response}")

    # 更新消息列表中的消息
    messages.append({"role": "assistant", "content": ai_response})
    session_data["messages"] = messages
    logging.info(f"更新后的会话信息：{session_data}")

    # 保存会话信息到json文件中
    with open(f"sessions/{request.session_id}.json", "w", encoding="utf-8") as f:
        # 删除系统提示词
        messages.pop(0)


        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    return ApiResponse(code=200, message="请求成功", data=ai_response)


# 获取会话列表
@app.get("/api/sessions")
def get_sessions() -> ApiResponse:
    logging.info("获取会话列表")
    session_files = os.listdir("sessions")

    session_ids = [session_file.split(".")[0] for session_file in session_files]
    session_ids.sort(reverse=True)

    return ApiResponse(code=200, message="获取会话列表成功", data=session_ids)


# 加载指定会话
@app.get("/api/sessions/{session_id}")
def get_session(session_id: str) -> ApiResponse:
    logging.info(f"获取指定会话信息：{session_id}")

    with open(f"sessions/{session_id}.json", "r", encoding="utf-8") as f:
        session_data = json.load(f)

    return ApiResponse(code=200, message="获取会话成功", data=session_data)


# 删除指定会话
@app.delete("/api/sessions/{session_id}")
def del_session(session_id: str) -> ApiResponse:
    logging.info(f"删除指定会话：{session_id}")

    if os.path.exists(f"sessions/{session_id}.json"):
        os.remove(f"sessions/{session_id}.json")

    return ApiResponse(code=200, message="删除会话成功", data=None)

# 异常处理器
@app.exception_handler(Exception)
def handler_exception(request: Request, exc: Exception):
    logging.error(f"处理异常，请求路径{request.url}，捕获到异常：{exc}")
    return JSONResponse(content={"code": 500, "message": "服务器内部错误，请联系管理员", "data": None})

if __name__ == '__main__':
    import uvicorn

    uvicorn.run(app, host="127.0.0.1", port=8000, access_log=False)
```