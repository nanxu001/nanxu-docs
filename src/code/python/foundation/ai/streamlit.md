---
title: Streamlit 界面开发
icon: fas:desktop
order: 4
---

## 1. Streamlit 简介

Streamlit 是一个开源的 Python 库，专为数据工程师及机器学习工程师设计，用来快速基于 Python 代码构建交互式的 Web 网站，无需掌握前端技术。

官方网站：https://streamlit.io

## 2. 安装与使用步骤

**步骤一：安装 Streamlit**

```bash
pip install streamlit
```

**步骤二：在 Python 文件中引入模块**

```python
import streamlit as st
```

**步骤三：基于 Streamlit API 构建页面**

```python
# 标题
st.title("AI智能伴侣")

# 段落文字
st.write("这是一段文字内容")

# 图片
st.image("path/to/image.jpg")

# 表格
st.table(data)
```

**步骤四：运行程序**

```bash
streamlit run 文件名.py
```

运行结果:

![运行结果](/assets/image/code/python/foundation/ai/streamlit-run-result.png)

::: info 说明
运行后会自动分配一个端口号，在浏览器中访问即可看到构建的页面。
:::

## 3. 页面配置

使用 `st.set_page_config()` 配置页面属性：

```python
st.set_page_config(
    page_title="页面标题",
    page_icon="图标路径",
    layout="wide",  # 布局方式：centered 或 wide
    initial_sidebar_state="expanded"  # 侧边栏状态
)
```

## 4. 常用组件

### 4.1 文本组件

| 方法 | 说明 |
|:---:|:---:|
| `st.title()` | 大标题 |
| `st.header()` | 一级标题 |
| `st.subheader()` | 二级标题 |
| `st.write()` | 段落文字 |
| `st.code()` | 代码格式 |

```python title="02.streamlit入门.py"
# 大标题
st.title("Streamlit 入门演示")
st.header("Streamlit 一级标题")
st.subheader("Streamlit 二级标题")

# 段落文字
st.write("这是一段文字内容")
```

### 4.2 媒体组件

| 方法 | 说明 |
|:---:|:---:|
| `st.image()` | 图片 |
| `st.audio()` | 音频 |
| `st.video()` | 视频 |

```python title="02.streamlit入门.py"
# 图片
st.image("resources/cat.jpg")

# 音频
st.audio("resources/news.mp3")

# 视频
st.video("resources/news.mp4")
```

### 4.3 数据展示组件

| 方法 | 说明 |
|:---:|:---:|
| `st.table()` | 表格 |
| `st.dataframe()` | 数据框 |

```python title="02.streamlit入门.py"
# 表格
students_data = {
    "姓名": ["王林", "李慕婉", "贝罗"],
    "学号": [1001, 1002, 1003],
    "语文": [90, 80, 70],
    "数学": [80, 70, 60],
    "英语": [70, 60, 50]
}
st.table(students_data)
```

### 4.4 输入组件

| 方法 | 说明 |
|:---:|:---:|
| `st.text_input()` | 文本输入框 |
| `st.radio()` | 单选按钮 |
| `st.selectbox()` | 下拉选择框 |
| `st.checkbox()` | 复选框 |

```python title="02.streamlit入门.py"
# 输入框
name = st.text_input("请输入姓名")
st.write(f"您输入的姓名为：{name}")

# 密码输入框
password = st.text_input("请输入密码", type="password")

# 单选按钮
gender = st.radio("请输入您的性别", ["男", "女", "未知"], 2)
st.write(f"您的性别为：{gender}")
```
