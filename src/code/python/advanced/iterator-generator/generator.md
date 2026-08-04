---
title: 生成器
icon: fas:wand-magic-sparkles
order: 2
---

## 1.概述

根据**制定的规则**循环生成数据，当条件不成立时则生成数据结束。数据不是一次性全部生成出来，而是使用一个，再生成一个，可以**节约大量的内存**。

::: tip 创建生成器的方式
1. 生成器推导式

2. yield 关键字
:::

## 2.推导式写法

### 2.1 四种推导式

推导式是**从容器中取出数据并按规则处理**的简洁写法。它叫什么推导式，由**最外层的符号**决定，与数据源无关：

| 推导式 | 写法 | 产出 |
| :---: | :---: | :---: |
| 列表推导式 | `[x for x in data]` | list |
| 集合推导式 | `{x for x in data}` | set |
| 字典推导式 | `{k: v for k, v in data}` | dict |
| 生成器推导式 | `(x for x in data)` | generator |

```python title = "06.生成器_推导式写法.py"
data = [1, 2, 3]

[x for x in data]             # [1, 2, 3]
{x for x in data}             # {1, 2, 3}
{x: x * 10 for x in data}     # {1: 10, 2: 20, 3: 30}
(x for x in data)             # <generator object>
```

- 方括号 `[...]` → 列表
- 花括号不带冒号 `{x}` → 集合
- 花括号带冒号 `{k: v}` → 字典
- 圆括号 `(...)` → 生成器

::: tip 元组没有推导式
圆括号写法会被解释器识别为**生成器推导式**，而不是元组推导式，因此元组没有自己的推导式语法。想要得到元组，需要显式转换：`tuple(x for x in range(10))`。
:::

### 2.2 生成1~10之间的整数

用圆括号包住推导式即可创建生成器，此时数据并不会真正生成：

```python title = "06.生成器_推导式写法.py"
my_generator = (i for i in range(1, 11))
print(my_generator)
print(type(my_generator))
```

运行结果:

```
<generator object <genexpr> at 0x0000019A219B5B40>
<class 'generator'>
```

### 2.3 生成1~10之间的偶数

推导式末尾可以加 `if` 条件，对取出的数据进行筛选：

```python title = "06.生成器_推导式写法.py"
my_gt2 = (i for i in range(1, 11) if i % 2 == 0)
print(my_gt2)
```

运行结果:

```
<generator object <genexpr> at 0x0000019A21A5A8E0>
```

### 2.4 从生成器中获取数据

可以通过 `next()` 从生成器中获取数据

```python title = "06.生成器_推导式写法.py"
print(next(my_gt2))
print(next(my_gt2))

print("*" * 23)

for i in my_gt2:
    print(i)
```

运行结果

```
2
4
***********************
6
8
10
```

::: info 原因说明
生成器是**有状态**的：

1. **惰性求值**：数据不是一次性生成全部，而是"使用一个，再生成一个"，每次 `next()` 只生成一个数据
2. **记住位置**：生成器内部有一个"游标"，记录取到了哪里。两次 `next()` 取出 `2`、`4` 后，游标停在 `4` 后面
3. `for` 循环底层也是反复调用 `next()`，所以它从游标位置接着取，输出 `6`、`8`、`10`

当数据全部取完后，生成器就**耗尽**了，此时再调用 `next()` 会抛出 `StopIteration` 异常。
:::

### 2.5 验证生成器可以减少内存占用

分别用列表推导式和生成器推导式生成 1000 万个数据，通过 `sys.getsizeof()` 对比两者的内存占用：

```python title = "06.生成器_推导式写法.py"
import sys

my_list = [i for i in range(10000000)]
my_gt3 = (i for i in range(10000000))

# 查看my_list的内存占用
print(f"my_list的内存占用：{sys.getsizeof(my_list)}") # 89095160
print(f"my_gt3的内存占用：{sys.getsizeof(my_gt3)}") # 192
```

::: info 原因说明
- `my_list`：列表推导式会**一次性生成全部 1000 万个元素**并保存在内存中，所以占用约 89MB
- `my_gt3`：生成器推导式只是记录了**生成规则**，一个数据都没有生成，所以只占固定的 192 字节——**与数据量无关**，无论要生成 1 万个还是 1 亿个数据，生成器本身的内存占用都不变

**代价**：省内存的同时，生成器里的数据只能**按顺序取一次**，不能像列表一样索引（`my_gt3[0]` 会报错）、不能求长度（`len()` 会报错）。所以：**数据量大且只需遍历一次 → 用生成器；数据需要反复访问、随机访问 → 用列表**。
:::