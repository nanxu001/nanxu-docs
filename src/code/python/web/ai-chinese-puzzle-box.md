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

## 3.基础环境搭建

### 3.1 创建 FastAPI 应用

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

### 3.2 挂载静态文件目录

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

## 4.新建会话

在打开该项目页面时，如果之前没有会话，则要自动创建一个会话，会话标识形式如 2026-04-15_12-00-05。

### 4.1 创建会话存放目录

当项目启动时，需要判断会话存放目录 session 是否存在，如果不存在需要进行创建。

```python title = "main.py"
import os

# 创建会话存放的目录
if not os.path.exists("sessions"):
    os.mkdir("sessions")
```

### 4.2 创建会话

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
        "message": []
    }

    with open(f"sessions/{session_id}.json", "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    return {"code": 200, "message": "创建会话成功", "data": session_id}
```

### 4.3 使用响应模型 (Response Model)

在传统的 API 开发中，手动返回 `dict` 类型的数据容易出现拼写错误（如将 `message` 写成 `msg`），且缺乏类型约束。FastAPI 提供了强大的[**响应模型**](https://fastapi.org.cn/tutorial/response-model/)机制，通过结合 **Pydantic** 库，我们可以：

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
        "message": []
    }

    with open(f"sessions/{session_id}.json", "w", encoding="utf-8") as f:
        json.dump(session_data, f, ensure_ascii=False, indent=2)

    # 返回数据
    # return {"code": 200, "message": "创建会话成功", "data": session_id}
    return ApiResponse(code=200, message="创建会话成功", data=session_id)
```
