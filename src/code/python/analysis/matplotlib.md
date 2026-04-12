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