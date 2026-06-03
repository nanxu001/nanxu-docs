---
title: FastAPI 基础
icon: fas:bolt
order: 5
---

## 1.概述

[FastAPI](https://fastapi.org.cn) 是一个现代、快速、高性能的Web框架，用于基于标准的Python类型提示构建API接口服务。

## 2.使用步骤

### 2.1 安装依赖

```cmd
pip install fastapi
```

### 2.2 导入FastAPI

```python title = "08.FastAPI入门.py"
from fastapi import FastAPI
```

### 2.3 创建FastAPI实例对象

```python title = "08.FastAPI入门.py"
# 创建FastAPI实例
app = FastAPI()
```

### 2.4 创建路径操作函数，定义访问路径

```python title = "08.FastAPI入门.py"
# 定义功能接口
@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/users")
def get_users():
    return [
        {"id": 1, "name": "Alice", "age": 18},
        {"id": 2, "name": "Bob", "age": 20}
    ]
```

### 2.5 运行FastAPI服务

#### 方式一：使用 `fastapi` 命令行工具

这种方式支持热重载（代码修改后自动重启），非常适合开发阶段。

::: warning
如果你的文件名包含点号（如 `08.FastAPI入门.py`），Python 可能会将其误识别为模块路径从而导致启动失败。建议将文件重命名为不含点号的格式，例如 `08_FastAPI入门.py`。
:::

```cmd
fastapi dev ".\08_FastAPI入门.py"
```

#### 方式二：使用 `uvicorn` 命令行运行

这是生产环境或需要精细控制服务器参数时常用的方式。通过 `--reload` 参数同样可以开启热重载。

**语法格式**：`uvicorn <文件名>:<应用变量名> --reload`

```cmd
uvicorn 08_FastAPI入门:app --reload
```

::: info 参数说明
- `08_FastAPI入门`: Python 脚本的文件名（不带 .py 后缀）。
- `app`: 在代码中创建的 FastAPI 实例变量名（即 `app = FastAPI()`）。
- `--reload`: 开启自动重载模式，当代码发生变化时服务器会自动重启。
:::

#### 方式三：在代码中直接启动（推荐）

`uvicorn` 是 Python 中的轻量级 Web 服务器。

```python title = "08.FastAPI入门.py"
# 启动FastAPI服务器
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

### 2.6 测试

服务启动成功后，打开浏览器访问以下地址进行验证：

- 首页接口：http://127.0.0.1:8000/

- 用户接口：http://127.0.0.1:8000/users

你应该能看到对应的 JSON 数据或文本输出。此外，FastAPI 还自动生成了交互式文档，你可以访问 http://127.0.0.1:8000/docs 查看 Swagger UI 界面。