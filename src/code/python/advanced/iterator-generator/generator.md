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

可以通过 `next()` 从生成器中获取数据，或通过 `for` 循环遍历生成器中的每一个值

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

## 3.yield 关键字

在 `def` 函数内出现 `yield`，这个函数就成了**生成器函数**。调用它不会执行函数体，而是返回一个生成器对象：

```python title = "06.生成器_yield写法.py"
# 普通写法：一次性生成全部数据，用列表存起来再 return
# def my_fun():
#     my_list = []
#     for i in range(1, 11):
#         my_list.append(i)
#     return my_list

# yield 写法：逐个产出，用到一个生成一个
def my_fun():
    for i in range(1, 11):
        yield i

my_g = my_fun()
print(type(my_g))       # <class 'generator'>

print(next(my_g))       # 1
print(next(my_g))       # 2

print("-" * 23)

for i in my_g:          # 从上次暂停处接着取，输出 3~10
    print(i)
```

运行结果:

```
<class 'generator'>
1
2
-----------------------
3
4
5
6
7
8
9
10
```

::: info yield 的工作原理
1. **调用时不执行**：`my_fun()` 只是创建了生成器对象，函数体一行都没跑
2. **`next()` 驱动执行**：每次 `next()` 去执行函数体到 `yield`，产出值后**暂停**，记录当前位置
3. **继续执行**：下次 `next()` 从暂停处接着跑，遇到下一个 `yield` 再产出、再暂停
4. **自动结束**：函数体执行完毕，自动抛出 `StopIteration`（不需要像迭代器手写 `__next__` 那样手动 `raise`）
:::

## 4.案例：按批次生成歌词

实际开发中（如深度学习加载训练数据）经常需要把数据切成一批一批处理。生成器可以**每次只产出当前批次**，避免一次性返回所有批次占用内存。

```python title = "08.example_生成器生成批次歌词.py"
import math


def dataset_loader(batch_size: int):
    """
    自定义的歌词批量生成器
    :param batch_size: 每批次歌词条数
    :return: 生成器
    """
    with open("data/jaychou_lyrics.txt", "r", encoding="utf-8") as f:
        # lines = [line.strip() for line in f.readlines()]
        lines = f.readlines()                            # 先读取所有行（获取总行数）
        total_batch = math.ceil(len(lines) / batch_size)  # 计算批次数

        for idx in range(total_batch):
            # 第1批：lines[0:8]，第2批：lines[8:16]，第3批：lines[16:24] ...
            yield lines[idx * batch_size:(idx + 1) * batch_size]


# 测试
dl = dataset_loader(8)
print(next(dl))   # 第1批（8条歌词）
print(next(dl))   # 第2批（8条歌词）

for batch_data in dl:  # 从第3批开始继续取
    print(batch_data)
```

运行结果:

```
['歌词行1\n', '歌词行2\n', ... , '歌词行8\n']
['歌词行9\n', '歌词行10\n', ... , '歌词行16\n']
['歌词行17\n', '歌词行18\n', ... , '歌词行24\n']
['歌词行25\n', '歌词行26\n', ...]
```

::: info 案例分析
1. **延迟产出**：`dataset_loader(8)` 不执行函数体，只在第一次 `next()` 时才真正读文件、算批次
2. **按需分批**：每次 `yield` 产出一个批次的 8 条歌词——如果歌词有几万行，调用方每次只拿到 8 条，不会撑爆内存
3. **状态保持**：`yield` 暂停后自动记住循环中的 `idx` 位置，下次 `next()` 从下一批继续，不需要像迭代器那样手动维护游标
4. 数据取完后函数体执行完毕，自动抛出 `StopIteration`，`for` 循环正常结束
:::

## 5.生成器和迭代器的区别

生成器本身是迭代器的一种（`isinstance(g, Iterator)` 返回 `True`），区别在于**怎么实现的**，而不是"能不能迭代"：

| 对比维度 | 迭代器（手写类） | 生成器 |
| :---: | :---: | :---: |
| 实现方式 | 类 + 手动实现 `__iter__()`、`__next__()` | `yield` 关键字或推导式 |
| 状态管理 | 手动维护游标（`self.current`） | 自动保存（yield 暂停处就是游标） |
| 结束方式 | 手动 `raise StopIteration` | 函数体执行完毕自动抛出 |
| 代码量 | 多，需定义类和方法 | 少，一个函数即可 |

::: tip 一句话总结
需要**精确控制迭代过程**、自定义复杂逻辑(查进度、重置、跳转) → 手写迭代器；只需要"**按规则一个个产出数据**" → 直接上生成器。
:::