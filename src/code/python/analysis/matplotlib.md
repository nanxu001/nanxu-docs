---
title: Matplotlib
icon: fas:chart-pie
order: 3
---

## 1.Matplotlib 介绍

[Matplotlib](https://matplotlib.org) 是一个功能强大的数据可视化开源Python库，也是Python中使用的最多的图形绘图库，可以创建静态、动态、交互式的图表。

## 2.安装

在命令行中执行以下命令安装 Matplotlib：
```bash
pip install matplotlib
```

## 3.入门案例

以下示例演示如何使用 Matplotlib 绘制一个简单的折线图，展示数据随序号变化的趋势。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt

# 准备数据：X轴和Y轴的坐标点
x = list(range(1, 25))  # 生成 1 到 24 的序列
y = list(range(1, 25))  # 生成 1 到 24 的序列

# 绘制折线图
plt.plot(x, y)

# 显示图形
plt.show()
```

运行结果:

![绘制基础折线图](/assets/image/code/python/analysis/matplotlib/basic-line-chart.png)

::: warning
`x` 轴与 `y` 轴的数据长度必须保持一致。如果两者长度不匹配，Matplotlib 会抛出 `ValueError` 异常，导致绘图失败。
:::

## 4.自定义折线图

### 4.1 自定义画布大小

在绘制图形之前，可以使用 `plt.figure()` 方法设置画布的尺寸，从而控制最终生成图片的大小和比例。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt
import random

# 准备数据
x = list(range(1, 25))
# 生成 24 个 10 到 15 之间的随机整数
y = [random.randint(10, 15) for _ in x]

# 设置画布大小：figsize=(宽度, 高度)，单位为英寸
plt.figure(figsize=(10, 5))

# 绘制折线图
plt.plot(x, y)

# 显示图形
plt.show()
```

运行结果:

![自定义画布大小](/assets/image/code/python/analysis/matplotlib/custom-figure-size.png)

::: info 参数说明
- `figsize`：接收一个元组 `(width, height)`，分别代表画布的宽和高（单位：英寸）。
- **注意**：`plt.figure()` 必须在 `plt.plot()` 之前调用，否则它可能会创建一个新的空白画布，导致之前的绘图丢失。
:::

### 4.2 自定义画布标题

使用 `plt.title()` 方法可以为图表添加标题，帮助读者快速理解图表的主题。在显示中文时，需要预先配置字体，否则会出现乱码（方块）。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt
import random

# 【重要】设置中文字体，解决中文显示乱码问题
# Windows 系统通常使用 "SimHei" (黑体)
plt.rcParams["font.sans-serif"] = ["SimHei"]
# 解决负号'-'显示为方块的问题
plt.rcParams["axes.unicode_minus"] = False

# 绘制折线图
x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
y = [random.randint(10, 15) for _ in x]

# 设置画布大小，宽、高
plt.figure(figsize=(10, 5))
# 折线图，如果没有画布会自动创建
plt.plot(x, y)

# 设置折线图的详细信息
plt.title("24小时气温变化趋势", fontsize = 15)

plt.show()
```

运行结果:

![设置图表标题](/assets/image/code/python/analysis/matplotlib/set-chart-title.png)

::: info 参数说明
`label`：标题的文本内容。
`fontsize`：字体大小，可以是整数或字符串（如 `'large'`, `'x-large'`）。
:::

### 4.3 设置坐标轴刻度与标签

通过 `plt.xticks()` 和 `plt.yticks()` 可以自定义坐标轴的刻度位置和标签内容，同时使用 `plt.xlabel()` 和 `plt.ylabel()` 为坐标轴添加描述性文字。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt
import random

# 设置中文字体及负号显示
plt.rcParams["font.sans-serif"] = ["SimHei"]
plt.rcParams["axes.unicode_minus"] = False

# 准备数据：24小时的气温模拟
x = list(range(1, 25))
y = [random.randint(10, 15) for _ in x]

# 设置画布大小
plt.figure(figsize=(10, 5))

# 绘制折线图
plt.plot(x, y)

# 设置标题
plt.title("24小时气温变化趋势", fontsize=15)

# 设置坐标轴标签
plt.xlabel("时间 (小时)")
plt.ylabel("温度 (℃)")

# 自定义 X 轴刻度：显示所有整点
plt.xticks(x)

# 自定义 Y 轴刻度：从 5 到 20，步长为 1
y_ticks = range(5, 21)
plt.yticks(y_ticks)

# 显示图形
plt.show()
```

运行结果:

![自定义坐标轴刻度](/assets/image/code/python/analysis/matplotlib/custom-axis-ticks.png)

::: tip
- 如果刻度太密集导致重叠，可以使用切片来稀疏显示，例如 `plt.xticks(x[::2])` 表示每隔一个点显示一个刻度。
- `xticks` 和 `yticks` 的第一个参数是刻度位置（数值），第二个参数可选，用于指定该位置显示的文本标签(如: 单位)。
:::

### 4.4 设置网格线

在图表中添加网格线（Grid）可以更准确地对齐坐标轴，从而快速读取数据点的大致数值。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt
import random

# 设置中文字体及负号显示
plt.rcParams["font.sans-serif"] = ["SimHei"]
plt.rcParams["axes.unicode_minus"] = False

# 准备数据：24小时的气温模拟
x = list(range(1, 25))
y = [random.randint(10, 15) for _ in x]

# 设置画布大小
plt.figure(figsize=(10, 5))

# 绘制折线图
plt.plot(x, y)

# 设置标题及坐标轴标签
plt.title("24小时气温变化趋势", fontsize=15)
plt.xlabel("时间 (小时)")
plt.ylabel("温度 (℃)")

# 自定义 X 轴刻度：显示所有整点
plt.xticks(x)

# 自定义 Y 轴刻度：从 5 到 20
plt.yticks(range(5, 21))

# linestyle: 线条样式 ('-', '--', '-.', ':')
# alpha: 透明度 (0-1)，值越小越淡
plt.grid(linestyle="--", alpha=0.3)

# 显示图形
plt.show()
```

运行结果:

![自定义坐标轴刻度](/assets/image/code/python/analysis/matplotlib/plot-with-grid.png)

::: tip
- **只显示某轴的网格**：`plt.grid(axis='x')` 或 `plt.grid(axis='y')`。
- **改变颜色**：`plt.grid(color='gray', linestyle=':', linewidth=0.5)`。
- **背景网格**：如果希望网格线在数据下方，确保没有设置特殊的 `zorder`，Matplotlib 默认会将网格置于底层。 
:::

### 4.4 绘制多条折线与图例

在实际分析中，我们经常需要在同一张图表中对比多组数据。只需多次调用 `plt.plot()` 即可实现。为了区分不同的线条，我们需要使用 `label` 参数配合 `plt.legend()` 显示图例。

```python title = "07.Matplotlib入门.ipynb"
import matplotlib.pyplot as plt
import random

# 设置中文字体及负号显示
plt.rcParams["font.sans-serif"] = ["SimHei"]
plt.rcParams["axes.unicode_minus"] = False

# 准备数据：24小时的气温模拟
x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
y_bj = [random.randint(10, 15) for i in x]
y_xa = [random.randint(13, 18) for i in x]

# 设置画布大小
plt.figure(figsize=(10, 5))

# 绘制多条折线，并通过 label 指定图例名称
plt.plot(x, y_bj, label="北京")
plt.plot(x, y_xa, label="西安")

# 设置标题及坐标轴标签
plt.title("24小时气温变化趋势", fontsize=15)
plt.xlabel("时间 (小时)")
plt.ylabel("温度 (℃)")

# 自定义刻度与网格线
plt.xticks(x)
plt.yticks(range(5, 21))
plt.grid(linestyle="--", alpha=0.3)

# 显示图例（loc 用于指定位置，如 'upper left', 'lower right' 等）
plt.legend(loc="upper left")

# 显示图形
plt.show()
```

运行结果:

![多折线对比与图例](/assets/image/code/python/analysis/matplotlib/multi-line-plot-with-legend.png)

::: tip
- **自定义样式**：可以在 `plot()` 中通过 `color`（颜色）、`linestyle`（线型）、`marker`（标记点）来进一步区分不同线条。
- **图例位置**：除了 `"upper left"`，常用的位置还有 `"best"`（自动选择最佳位置）、`"lower right"` 等。
:::

## 5.子图与多图表布局

为了能同时展示多个图表，便于图表之间数据的直观对比和分析，更高效、更专业地组织和呈现复杂的可视化信息，通常会在一个画布上创建多个子图。

### 5.1 创建多子图画布

`plt.subplots(nrows, ncols)` 会返回一个画布对象 (`figure`) 和一个子图对象数组 (`axes`)。可以通过索引（如 `axes[0]`, `axes[1]`）来独立控制每一个子图。

### 5.2 柱状图与饼图

示例演示如何在一张画布上同时绘制**柱状图**和**饼图**，并将结果保存为图片文件。

### 5.2 绘制饼状图并保存图片

```python title = "08.Matplotlib核心图表.ipynb"
import matplotlib.pyplot as plt
from matplotlib.axes import Axes

# 1. 全局配置
plt.rcParams["font.sans-serif"] = ["SimHei"]
plt.rcParams["axes.unicode_minus"] = False

# 2. 创建画布：1行2列，设置尺寸和分辨率
figure, axes = plt.subplots(nrows=1, ncols=2, figsize=(20, 6), dpi=100)

# 子图 1：世界主要国家石油储备（柱状图）
countries = ["中国", "美国", "日本", "印度", "法国", "英国", "俄罗斯", "德国"]
values = [35, 20, 15, 10, 8, 7, 6, 5]

ax1: Axes = axes[0]
ax1.bar(countries, values, width=0.6, color="green")
ax1.set_title("世界主要国家石油储备", fontsize=16)
ax1.set_xlabel("国家")
ax1.set_ylabel("储备量 (亿吨)")
ax1.grid(linestyle="--", alpha=0.3)

# 子图 2：世界人口分布比例（饼状图）
countries2 = ["印度", "中国", "印尼", "美国", "巴基斯坦", "尼日利亚", "巴西", "其他"]
values2 = [14.51, 13.02, 11.01, 9.01, 8.01, 7.01, 6.01, 20]

ax2: Axes = axes[1]
# autopct: 自动显示百分比，%1.1f%% 表示保留一位小数
ax2.pie(values2, labels=countries2, autopct="%1.1f%%")
ax2.set_title("世界人口分布比例", fontsize=16)

# 调整图例位置
ax2.legend(loc="lower center", ncol=5, bbox_to_anchor=(0.5, -0.1))

# 3. 保存图片（必须在 show 之前调用）
# bbox_inches="tight" 可以去除多余的白边
plt.savefig("data/world_stats.png", bbox_inches="tight")

# 4. 显示图形
plt.show()
```

运行结果:

![子图布局与柱状图](/assets/image/code/python/analysis/matplotlib/subplot-combined-layout.png)