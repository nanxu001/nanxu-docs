---
title: 会话管理实战
icon: fas:comments
order: 5
---

## 1. 界面基本布局

AI 智能伴侣项目基于 Streamlit 构建，页面分为两个部分：

- **侧边栏（左侧）**：伴侣信息定制、会话管理功能
- **核心展示区域（右侧）**：消息展示、输入框

```python title="05.ai_partner_3.py"
import streamlit as st

st.set_page_config(
    page_title="AI智能伴侣",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded"
)

st.title("AI智能伴侣")
```

## 2. 基础版本：消息展示

### 2.1 基础版本代码

最基础的版本，实现简单的消息收发功能：

```python title="03.ai_partner_1.py"
import streamlit as st
from openai import OpenAI

client = OpenAI(api_key="your_api_key", base_url="https://api.deepseek.com")

# 系统提示词
system_prompt = "你是一名非常可爱的AI助理，你的名字叫小甜甜，请你使用温柔可爱的语气回答用户的问题"

# 初始化聊天信息
if "messages" not in st.session_state:
    st.session_state.messages = []

# 展示聊天信息
for message in st.session_state.messages:
    st.chat_message(message["role"]).write(message["content"])

# 输入框
prompt = st.chat_input("请输入信息")

if prompt:
    st.chat_message("user").write(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 调用 AI 大模型
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是一名非常可爱的AI助理，你的名字叫小甜甜，请你使用温柔可爱的语气回答用户的问题"},
            {"role": "user", "content": prompt},  # 只发送当前消息
        ],
        stream=False
    )

    st.chat_message("assistant").write(response.choices[0].message.content)
    st.session_state.messages.append({"role": "assistant", "content": response.choices[0].message.content})
```

### 2.2 存在的问题

**消息覆盖问题**：每次输入新消息后，页面会重新加载，导致之前的消息被覆盖。

**会话记忆问题**：每次只发送当前消息，大模型不知道之前聊过什么。

::: warning 问题分析
- `messages` 参数只包含当前消息，没有历史记录
- 大模型每次都是独立响应，没有记忆能力
:::

## 3. 优化：解决会话记忆问题

### 3.1 改进方案

将历史消息一并发送给大模型：

```python title="04.ai_partner_2.py"
# 改进：发送所有历史消息
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "系统提示词"},
        *st.session_state.messages  # 包含历史消息
    ],
    stream=True
)
```

::: info 说明
- `*st.session_state.messages`：使用解包操作，将历史消息全部发送
- 这样大模型就能"记住"之前的对话内容
:::

## 4. 优化：流式输出

### 4.1 非流式输出 vs 流式输出

| 方式 | 说明 | 用户体验 |
|:---:|:---:|:---:|
| 非流式输出 | 生成完毕后一次性返回 | 需要等待较长时间 |
| 流式输出 | 逐字返回 | 实时显示，体验更好 |

### 4.2 流式输出实现

```python title="04.ai_partner_2.py"
# 调用 AI 大模型（流式输出）
response = client.chat.completions.create(
    model="deepseek-chat",
    messages=[
        {"role": "system", "content": "系统提示词"},
        *st.session_state.messages
    ],
    stream=True  # 启用流式输出
)

# 流式输出的解析方式
response_message = st.empty()
full_response = ""
for chunk in response:
    if chunk.choices[0].delta.content is not None:
        content = chunk.choices[0].delta.content
        full_response += content
    response_message.chat_message("assistant").write(full_response)

st.session_state.messages.append({"role": "assistant", "content": full_response})
```

::: tip 说明
- `stream=True`：启用流式输出
- `st.empty()`：创建空占位符，用于动态更新内容
- `chunk.choices[0].delta.content`：获取流式输出的内容片段
:::

## 5. 优化：侧边栏与系统提示词

### 5.1 侧边栏制作

使用 `st.sidebar` 创建侧边栏，用于伴侣信息定制：

```python title="05.ai_partner_3.py"
# 初始化会话状态
if "nick_name" not in st.session_state:
    st.session_state.nick_name = "小甜甜"
if "nature" not in st.session_state:
    st.session_state.nature = "活泼开朗的东北姑娘"

# 左侧侧边栏
with st.sidebar:
    st.header("伴侣信息")
    nick_name = st.text_input("昵称", placeholder="请输入昵称", value=st.session_state.nick_name)
    if nick_name:
        st.session_state.nick_name = nick_name
    nature = st.text_area("性格", placeholder="请输入性格", value=st.session_state.nature)
    if nature:
        st.session_state.nature = nature
```

### 5.2 系统提示词组装

将伴侣的名字和性格组装成系统提示词，让大模型按照指定的角色回复：

```python title="05.ai_partner_3.py"
system_prompt = f"""
    你叫 {st.session_state.nick_name}，现在是用户的真实伴侣，请完全代入伴侣角色。
    规则：
        1. 每次只回1条消息
        2. 禁止任何场景或状态描述性文字
        3. 匹配用户的语言
        4. 回复简短，像微信聊天一样
        5. 有需要的话可以用❤️🌸等emoji表情
        6. 用符合伴侣性格的方式对话
        7. 回复的内容, 要充分体现伴侣的性格特征
    伴侣性格：
        - {st.session_state.nature}
    你必须严格遵守上述规则来回复用户。
"""
```

::: info 说明
- 使用 f-string 动态组装系统提示词
- `{st.session_state.nick_name}`：伴侣昵称
- `{st.session_state.nature}`：伴侣性格
:::

## 6. 文件操作与 JSON

### 6.1 文件操作基础

Python 文件操作分为三步：打开、读写、关闭。

**读取文件：**

```python title="06.文件操作入门.py"
# 打开文件
f = open("./resources/望庐山瀑布.txt", "r", encoding="utf-8")

# 读取文件
for readline in f.readlines():
    print(readline.strip())

# 关闭文件
f.close()
```

**写入文件：**

```python title="06.文件操作入门.py"
f = open("./resources/静夜思.txt", "w", encoding="utf-8")

try:
    f.writelines(["静夜思（李白）\n\n", "床前明月光\n", "疑似地上霜\n", "举头望明月\n", "低头思故乡"])
finally:
    f.close()
```

### 6.2 JSON 数据操作

JSON 是常用的数据交换格式，Python 提供了 `json` 模块来处理 JSON 数据。

```python title="07.json模块入门.py"
import json

user = {"name": "南絮", "age": 22, "gender": "男", "hobbies": ["reading", "swimming"]}

# 序列化：Python 对象 → JSON 文件
with open("resources/user.json", "w", encoding="utf-8") as f:
    json.dump(user, f, ensure_ascii=False, indent=2)

# 反序列化：JSON 文件 → Python 对象
with open("resources/user.json", "r", encoding="utf-8") as f:
    user = json.load(f)
    print(user)
```

::: info 说明
- `json.dump()`：将 Python 对象序列化为 JSON 格式并写入文件
- `json.load()`：从 JSON 文件中读取数据并反序列化为 Python 对象
- `ensure_ascii=False`：支持中文等非 ASCII 字符
- `indent=2`：格式化输出，缩进 2 个空格
:::

## 7. 优化：会话管理功能

### 7.1 会话名称生成

使用时间戳作为会话名称：

```python title="08.ai_partner_4.py"
from datetime import datetime

def generate_session_name():
    return datetime.now().strftime("%Y%m%d_%H%M%S")
```

### 7.2 保存会话

将会话数据保存到 JSON 文件中：

```python title="08.ai_partner_4.py"
import json
import os.path

def save_session_info():
    """保存会话信息"""
    if st.session_state.current_session:
        session_data = {
            "nick_name": st.session_state.nick_name,
            "nature": st.session_state.nature,
            "current_session": st.session_state.current_session,
            "messages": st.session_state.messages
        }

        if not os.path.exists("sessions"):
            os.mkdir("sessions")

        with open("sessions/%s.json" % st.session_state.current_session, "w", encoding="utf-8") as f:
            json.dump(session_data, f, ensure_ascii=False, indent=2)
```

### 7.3 加载会话列表

从 `sessions` 目录中加载所有会话文件列表：

```python title="08.ai_partner_4.py"
def load_sessions():
    """加载所有会话列表"""
    session_list = []
    if os.path.exists("sessions"):
        session_list = [name[:-5] for name in os.listdir("sessions") if name.endswith(".json")]
        session_list.sort(reverse=True)  # 按时间倒序排列
    return session_list
```

### 7.4 加载指定会话

从 JSON 文件中加载指定会话的数据：

```python title="08.ai_partner_4.py"
def load_session(session_name: str):
    """加载指定会话"""
    try:
        if os.path.exists(f"sessions/{session_name}.json"):
            with open(f"sessions/{session_name}.json", "r", encoding="utf-8") as f:
                load_info = json.load(f)
                st.session_state.current_session = load_info.get("current_session")
                st.session_state.nick_name = load_info.get("nick_name")
                st.session_state.nature = load_info.get("nature")
                st.session_state.messages = load_info.get("messages")
    except Exception:
        st.error("加载会话失败")
```

### 7.5 删除会话

删除指定的会话文件：

```python title="08.ai_partner_4.py"
def del_session(session_name: str):
    """删除指定会话"""
    try:
        if os.path.exists(f"sessions/{session_name}.json"):
            os.remove(f"sessions/{session_name}.json")
            if st.session_state.current_session == session_name:
                st.session_state.messages = []
                st.session_state.current_session = generate_session_name()
    except Exception:
        st.error("删除会话失败")
```

### 7.6 侧边栏会话管理界面

在侧边栏中展示会话管理功能：

```python title="08.ai_partner_4.py"
with st.sidebar:
    st.header("AI控制面板")

    # 新建会话按钮
    if st.button("新建会话", icon="🖍", width="stretch"):
        if st.session_state.messages:
            save_session_info()
            st.session_state.messages = []
            st.session_state.current_session = generate_session_name()
            st.success("新建成功", icon="✔")
            st.rerun()

    st.text("历史会话")

    # 展示历史会话列表
    for session_name in load_sessions():
        session_button, del_button = st.columns([4, 1])

        with session_button:
            if st.button(session_name, icon="📑", width="stretch", 
                        key=f"load_{session_name}", 
                        type="primary" if st.session_state.current_session == session_name else "secondary"):
                load_session(session_name)
                st.rerun()

        with del_button:
            if st.button("", icon="❌", width="stretch", key=f"del_{session_name}"):
                del_session(session_name)
                st.rerun()

    st.divider()

    st.header("伴侣信息")
    nick_name = st.text_input("昵称", placeholder="请输入昵称", value=st.session_state.nick_name)
    if nick_name:
        st.session_state.nick_name = nick_name
    nature = st.text_area("性格", placeholder="请输入性格", value=st.session_state.nature)
    if nature:
        st.session_state.nature = nature
```

::: tip 说明
- 会话文件保存在 `sessions/` 目录下，以时间戳命名
- 新建会话时会自动保存当前会话
- 会话列表按时间倒序排列（最新的在上面）
- 当前会话会高亮显示
:::

## 8. 完整代码

```python title="08.ai_partner_4.py"
import json
import os.path

import streamlit as st
from openai import OpenAI
from datetime import datetime

st.set_page_config(
    page_title="AI智能伴侣",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={}
)

# 大标题
st.title("AI智能伴侣")

# logo
st.logo("resources/logo.png")

client = OpenAI(api_key="your_api_key", base_url="https://api.deepseek.com")

# 初始化聊天信息
def generate_session_name():
    return datetime.now().strftime("%Y%m%d_%H%M%S")

if "messages" not in st.session_state:
    st.session_state.messages = []
if "nick_name" not in st.session_state:
    st.session_state.nick_name = "小甜甜"
if "nature" not in st.session_state:
    st.session_state.nature = "活泼开朗的东北姑娘"
if "current_session" not in st.session_state:
    st.session_state.current_session = generate_session_name()

# 展示聊天信息
st.text(f"会话名称：{st.session_state.current_session}")
for message in st.session_state.messages:
    st.chat_message(message["role"]).write(message["content"])

# 保存会话信息
def save_session_info():
    if st.session_state.current_session:
        session_data = {
            "nick_name": st.session_state.nick_name,
            "nature": st.session_state.nature,
            "current_session": st.session_state.current_session,
            "messages": st.session_state.messages
        }
        if not os.path.exists("sessions"):
            os.mkdir("sessions")
        with open("sessions/%s.json" % st.session_state.current_session, "w", encoding="utf-8") as f:
            json.dump(session_data, f, ensure_ascii=False, indent=2)

# 加载所有会话列表
def load_sessions():
    session_list = []
    if os.path.exists("sessions"):
        session_list = [name[:-5] for name in os.listdir("sessions") if name.endswith(".json")]
        session_list.sort(reverse=True)
    return session_list

# 加载指定会话
def load_session(session_name: str):
    try:
        if os.path.exists(f"sessions/{session_name}.json"):
            with open(f"sessions/{session_name}.json", "r", encoding="utf-8") as f:
                load_info = json.load(f)
                st.session_state.current_session = load_info.get("current_session")
                st.session_state.nick_name = load_info.get("nick_name")
                st.session_state.nature = load_info.get("nature")
                st.session_state.messages = load_info.get("messages")
    except Exception:
        st.error("加载会话失败")

# 删除指定会话
def del_session(session_name: str):
    try:
        if os.path.exists(f"sessions/{session_name}.json"):
            os.remove(f"sessions/{session_name}.json")
            if st.session_state.current_session == session_name:
                st.session_state.messages = []
                st.session_state.current_session = generate_session_name()
    except Exception:
        st.error("删除会话失败")

# 左侧侧边栏
with st.sidebar:
    st.header("AI控制面板")

    if st.button("新建会话", icon="🖍", width="stretch"):
        if st.session_state.messages:
            save_session_info()
            st.session_state.messages = []
            st.session_state.current_session = generate_session_name()
            st.success("新建成功", icon="✔")
            st.rerun()

    st.text("历史会话")

    for session_name in load_sessions():
        session_button, del_button = st.columns([4, 1])
        with session_button:
            if st.button(session_name, icon="📑", width="stretch", 
                        key=f"load_{session_name}", 
                        type="primary" if st.session_state.current_session == session_name else "secondary"):
                load_session(session_name)
                st.rerun()
        with del_button:
            if st.button("", icon="❌", width="stretch", key=f"del_{session_name}"):
                del_session(session_name)
                st.rerun()

    st.divider()

    st.header("伴侣信息")
    nick_name = st.text_input("昵称", placeholder="请输入昵称", value=st.session_state.nick_name)
    if nick_name:
        st.session_state.nick_name = nick_name
    nature = st.text_area("性格", placeholder="请输入性格", value=st.session_state.nature)
    if nature:
        st.session_state.nature = nature

# 系统提示词
system_prompt = f"""
    你叫 {st.session_state.nick_name}，现在是用户的真实伴侣，请完全代入伴侣角色。
    规则：
        1. 每次只回1条消息
        2. 禁止任何场景或状态描述性文字
        3. 匹配用户的语言
        4. 回复简短，像微信聊天一样
        5. 有需要的话可以用❤️🌸等emoji表情
        6. 用符合伴侣性格的方式对话
        7. 回复的内容, 要充分体现伴侣的性格特征
    伴侣性格：
        - {st.session_state.nature}
    你必须严格遵守上述规则来回复用户。
"""

# 输入框
prompt = st.chat_input("请输入信息")

if prompt:
    st.chat_message("user").write(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # 调用 AI 大模型（流式输出）
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": system_prompt},
            *st.session_state.messages
        ],
        stream=True
    )

    # 流式输出的解析方式
    response_message = st.empty()
    full_response = ""
    for chunk in response:
        if chunk.choices[0].delta.content is not None:
            content = chunk.choices[0].delta.content
            full_response += content
        response_message.chat_message("assistant").write(full_response)

    st.session_state.messages.append({"role": "assistant", "content": full_response})
    save_session_info()
    st.rerun()
```