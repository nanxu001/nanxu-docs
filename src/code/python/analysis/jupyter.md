---
title: Jupyter Notebook
icon: fas:flask
order: 1
---

**数据分析**：从一堆看似杂乱的数据中，通过数据清洗、分析、可视化等手段，找出有价值的信息和结论，从而帮我们解决实际的问题（如：用户订单数据的分析、电影榜单数据分析、学校学生成绩分析等）。

## 环境准备

**Jupyter Notebook** 是一个基于Web网页的、交互式的编程笔记本，让你可以把代码、运行结果、图表和笔记全部都放在一个文件里（在数据分析、机器学习、教学和科研等领域的数据实验室）。

### 1.新建 Jupyter Notebook

在资源管理器中右键点击目标文件夹，选择"新建 Jupyter Notebook"。如果是首次使用，PyCharm 会自动下载并配置必要的 Python 依赖包。

![新建Jupyter Notebook](/assets/image/code/python/analysis/jupyter/create.png)

### 2.编写代码

```python title = "01.Jupyter演示.ipynb"
a = 100
b = 200
c = 300
a + b + c
......
```

### 3.运行

如果 PyCharm 的版本是 2026.1 或更高的非 Pro 版本，右上角可能会显示服务器为 `IDE 托管服务器`。此时无法点击右侧三个点的 `在浏览器打开 Notebook` 选项。针对这种情况，有以下两种解决方案：

#### 3.1 激活 Pro 版本后自动安装

1. 通过学生认证（需要学信网账号和教育邮箱，首次认证可能较为繁琐，后续只需教育邮箱即可续费一年）或其他方式(懂得都懂)激活 Pro 版本。

2. 点击右上角的 `IDE 托管服务器`。

![IDE 托管服务器](/assets/image/code/python/analysis/jupyter/config.png)

3. 选择 `配置 Jupyter 服务器`，在弹出的窗口中点击 + 号，选择 `正在运行本地服务器`，系统将自动安装 Jupyter。

![添加正在运行本地服务器](/assets/image/code/python/analysis/jupyter/add-local-server.png)

4. 安装完成后会提示 `没有正在运行的本地服务器`。关闭配置页面，在命令行执行 `jupyter lab` 命令，系统会自动运行并打开浏览器。

![运行 Jupyter](/assets/image/code/python/analysis/jupyter/run-jupyter.png)

5. 回到第 3 步重新添加本地服务器，此时系统会自动识别刚刚运行的 Jupyter 服务器，直接添加即可。

6. 完成上述步骤后，点击右上角的三个点菜单，即可看到 `在浏览器打开 Notebook` 选项。

> 既然已经自动打开浏览器了为什么还要在这里打开呢，我不明白(奉化口音)

![在浏览器打开 Notebook](/assets/image/code/python/analysis/jupyter/open-on-browser.png)

::: warning
控制台中的 Jupyter 服务器关闭后，Notebook 将无法执行代码，此时需要重新启动 Jupyter 服务器。
:::

#### 3.2 手动安装

如果不希望激活 Pro 版本，可以采用手动安装的方式：

1. 在命令行执行以下命令安装 Jupyter：

```bash
pip install jupyter
```

2. 执行以下命令启动 Jupyter Lab：

```bash
jupyter lab
```

3. 如果没有自动打开浏览器，可以在浏览器地址栏输入 `http://localhost:8888/lab` 访问。

