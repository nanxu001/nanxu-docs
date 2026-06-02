---
title: 数据存储容器
icon: fas:boxes
order: 5
---

## 概述

数据容器是可以一次性容纳多份数据的数据类型，每一份数据称为一个**元素**，元素可以是任意类型（字符串、数字、布尔等）。

Python 提供了 5 种数据容器：

| 容器 | 符号 | 有序 | 可重复 | 可修改 |
|:---:|:---:|:---:|:---:|:---:|
| 字符串 str | `' '` / `" "` | ✅ | ✅ | ❌ |
| 列表 list | `[]` | ✅ | ✅ | ✅ |
| 元组 tuple | `()` | ✅ | ✅ | ❌ |
| 集合 set | `{}` | ❌ | ❌ | ✅ |
| 字典 dict | `{key: value}` | ❌ | key 不可重复 | ✅ |

## 1.列表 list

列表是一次性存储多个数据的容器，元素**有序、可重复、可修改**。

### 1.1 定义与索引

**语法：** `列表名 = [元素1, 元素2, 元素3, ...]`

```python title = "09.数据容器-list.py"
s = [54, 15, 75, 108, 23, 78, 75]
print(type(s))   # <class 'list'>
print(s[0])       # 54（正向索引从 0 开始）
print(s[-1])      # 75（反向索引从 -1 开始）
```

::: info 说明
- 正向索引从 `0` 开始，反向索引从 `-1` 开始
- 列表可以存储不同类型的元素
- 元素有序、可重复、可修改（`s[0] = "A"`、`del s[3]`）
:::

### 1.2 切片

切片是从容器中截取一部分元素的操作，列表、字符串、元组都支持。

**语法：** `序列[开始索引:结束索引:步长]`

- 不包含结束索引位置对应的元素
- 开始索引默认 `0`，结束索引默认到末尾，步长默认 `1`

```python title = "09.数据容器-list.py"
s = [54, 15, 75, 108, 23, 78, 75]
print(s[0:5])    # [54, 15, 75, 108, 23]
print(s[::2])    # [54, 75, 23, 75]（步长为2）
print(s[::-1])   # [75, 78, 23, 108, 75, 15, 54]（反转）
```

### 1.3 常用方法

| 方法 | 作用 | 示例 |
|:---:|:---:|:---:|
| `append(x)` | 在尾部追加元素 | `s.append(100)` |
| `insert(i, x)` | 在指定索引前插入 | `s.insert(0, 92)` |
| `remove(x)` | 移除第一个匹配的元素 | `s.remove(75)` |
| `pop(i)` | 移除指定索引的元素，默认最后一个 | `s.pop(2)` / `s.pop()` |
| `sort()` | 排序（元素类型需一致） | `s.sort()` |
| `reverse()` | 反转 | `s.reverse()` |

```python title = "09.数据容器-list.py"
s = [56, 90, 88, 65, 90, 100, 209, 72, 145]

s.append(188)
print(s)    # [56, 90, 88, 65, 90, 100, 209, 72, 145, 188]

s.insert(2, 80)
print(s)    # [56, 90, 80, 88, 65, 90, 100, 209, 72, 145, 188]

s.remove(90)
print(s)    # [56, 80, 88, 65, 90, 100, 209, 72, 145, 188]

s.sort()
print(s)    # [56, 65, 72, 80, 88, 90, 100, 145, 188, 209]
```

::: info 说明
- `min(s)` / `max(s)` / `sum(s)` / `len(s)`：最小值、最大值、求和、元素个数
- `x in s`：判断元素是否存在于列表中，返回布尔值
- `+` 合并两个列表，`*` 解包列表
:::

### 1.4 遍历

使用 `for` 循环遍历列表中的每一个元素：

```python title = "09.数据容器-list.py"
s = [56, 90, 88, 65, 90, 100, 209, 72, 145]

for item in s:
    print(item)
```

运行结果：

```
56
90
88
65
90
100
209
72
145
```

### 1.5 解包

**解包**：将容器中的元素分别赋值给多个变量。

```python title = "09.数据容器-list.py"
# 基础解包
s = [56, 90, 88, 65, 90]
a, b, c, d, e = s
print(a, b, c, d, e)  # 56 90 88 65 90

# 扩展解包：* 收集剩余元素到列表中
first, *other, last = s
print(first)  # 56
print(other)  # [90, 88, 65]
print(last)   # 90
```

::: tip 变量交换
Python 中可以直接用解包交换变量值：
```python
a, b = b, a
```
:::

### 1.6 合并列表

```python title = "09.数据容器-list.py"
num_list1 = [19, 23, 54, 64, 875, 20, 109, 232, 123, 54]
num_list2 = [55, 80, 72, 35, 60, 123, 54, 29, 91]

# 方式1：+ 合并
num_list = num_list1 + num_list2
print(num_list)

# 方式2：extend() 方法
num_list1.extend(num_list2)
print(num_list1)

# 方式3：* 重复
s = [1, 2, 3]
print(s * 3)  # [1, 2, 3, 1, 2, 3, 1, 2, 3]
```

### 1.7 统计函数

```python title = "09.数据容器-list.py"
s = [56, 90, 88, 65, 90, 100, 209, 72, 145]

print(min(s))    # 56（最小值）
print(max(s))    # 209（最大值）
print(sum(s))    # 925（求和）
print(len(s))    # 9（元素个数）
print(90 in s)   # True（判断元素是否存在）
print(90 not in s)  # False
```

### 1.8 列表推导式

按照一定规则快速生成一个列表。

```python title = "09.数据容器-list.py"
# 格式1：[表达式 for 元素 in 列表]
print([e ** 2 for e in range(1, 21)])

# 格式2：[表达式 for 元素 in 列表 if 条件]
num_list = [19, 23, 54, 64, 87, 20, 109, 232, 123, 43, 26, 55, 72]
print([num ** 2 for num in num_list if num % 2 == 0])
```

运行结果：

```
[1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400]
[2916, 4096, 400, 53824, 676, 5184]
```

## 2.字符串 str

字符串是字符的容器，**不可修改、有序、可迭代**。

### 2.1 索引与切片

```python title = "10.数据容器-str.py"
s = "Hello-Python"
print(s[0])      # H
print(s[-1])     # n
print(s[0:5])    # Hello
print(s[6:])     # Python
print(s[::-1])   # nohtyP-olleH（反转）
```

::: warning 注意
字符串是**不可变**的，无法通过索引修改单个字符（如 `s[0] = "h"` 会报错）。
:::

### 2.2 常用方法

| 方法 | 作用 | 示例 |
|:---:|:---:|:---:|
| `find(x)` | 查找子串第一次出现的索引，找不到返回 -1 | `s.find("-")` → `5` |
| `count(x)` | 统计子串出现次数 | `s.count("o")` → `4` |
| `upper()` / `lower()` | 转大写 / 转小写 | `s.upper()` |
| `split(x)` | 按分隔符切割，返回列表 | `s.split("-")` |
| `strip()` | 去掉两端空白字符 | `s.strip()` |
| `replace(old, new)` | 替换子串 | `s.replace("-", "_")` |
| `startswith(x)` / `endswith(x)` | 判断开头/结尾 | `s.startswith("Hello")` |

```python title = "10.数据容器-str.py"
s = "Hello-Python-Hello-World"

print(s.find("-"))            # 5
print(s.count("o"))           # 4
print(s.upper())              # HELLO-PYTHON-HELLO-WORLD
print(s.split("-"))           # ['Hello', 'Python', 'Hello', 'World']
print(s.replace("-", "_"))    # Hello_Python_Hello_World
print(s.startswith("Hello"))  # True
```

### 2.3 遍历

字符串是可迭代的，可以使用 `for` 循环遍历每一个字符：

```python title = "10.数据容器-str.py"
s = "Hello-Python"

for char in s:
    print(char)
```

运行结果：

```
H
e
l
l
o
-
P
y
t
h
o
n
```

### 2.4 更多方法

| 方法 | 作用 | 示例 |
|:---:|:---:|:---:|
| `join(iterable)` | 用字符串连接可迭代对象 | `"-".join(["a", "b", "c"])` → `"a-b-c"` |
| `encode(encoding)` | 编码为字节串 | `s.encode("utf-8")` |
| `zfill(width)` | 左边补零到指定宽度 | `"42".zfill(5)` → `"00042"` |
| `center(width, fillchar)` | 居中填充 | `"hi".center(10, "-")` → `"----hi----"` |

```python title = "10.数据容器-str.py"
# join 连接
words = ["Hello", "Python", "World"]
print("-".join(words))  # Hello-Python-World

# zfill 补零
print("42".zfill(5))    # 00042

# center 居中
print("hi".center(10, "-"))  # ----hi----
```

## 3.元组 tuple

元组与列表类似，但**不可修改**（只读），适合存储不应被改变的数据。

### 3.1 定义与操作

```python title = "11.数据容器-tuple.py"
t1 = (80, 95, 78, 50, 76, 80, 85, 20)
print(type(t1))      # <class 'tuple'>
print(t1[0])         # 80
print(t1[:5])        # (80, 95, 78, 50, 76)
print(t1.count(80))  # 2
print(t1.index(78))  # 2
```

::: warning 注意
- 定义单元素元组时必须加逗号：`(100,)` 是元组，`(100)` 是整数
- 空元组：`()` 或 `tuple()`
:::

### 3.2 组包与解包

**组包**：将多个值合并到一个容器中。**解包**：将容器中的元素分别赋值给多个变量。

```python title = "11.数据容器-tuple.py"
# 组包
t1 = (5, 7, 9, 10, 2, 23, 12)
t2 = 5, 7, 9, 10, 2, 23, 12  # 省略括号也是元组

# 基础解包
a, b, c, d, e, f, g = t1

# 扩展解包：* 收集剩余元素到列表中
first, second, *other, last = t1
print(first)   # 5
print(other)   # [9, 10, 2, 23]
print(last)    # 12
```

::: tip 变量交换
Python 中可以直接用解包交换变量值：
```python
a, b = b, a
```
:::

### 3.3 类型判断

使用 `isinstance()` 判断变量是否为元组：

```python title = "11.数据容器-tuple.py"
t = (100,)
print(isinstance(t, tuple))  # True
print(type(t))                # <class 'tuple'>
```

### 3.4 实际案例

学生成绩表处理：

```python title = "11.数据容器-tuple.py"
students = (
    ("S001", "王林", 85, 92, 78),
    ("S002", "李慕婉", 92, 88, 95),
    ("S003", "十三", 78, 85, 82),
    ("S004", "曾牛", 88, 79, 91),
    ("S005", "周轶", 95, 96, 89),
)

print("学号\t\t姓名\t\t语文\t\t数学\t\t英语\t\t总分\t\t平均分")
for id, name, chinese, math, english in students:
    total = chinese + math + english
    avg = total / 3
    print(f"{id} \t {name} \t {chinese} \t {math} \t {english} \t {total} \t {avg:.2f}")
```

运行结果：

```
学号		姓名		语文		数学		英语		总分		平均分
S001 	 王林 	 85 	 92 	 78 	 255 	 85.00
S002 	 李慕婉 	 92 	 88 	 95 	 275 	 91.67
S003 	 十三 	 78 	 85 	 82 	 245 	 81.67
S004 	 曾牛 	 88 	 79 	 91 	 258 	 86.00
S005 	 周轶 	 95 	 96 	 89 	 280 	 93.33
```

## 4.集合 set

集合是**无序、不可重复、可修改**的容器，自动去重。

### 4.1 定义

```python
s1 = {"C", "D", "X", "T", "O", "U"}  # 直接定义
s2 = set()                              # 空集合
```

::: warning 注意
`{}` 表示空字典，不是空集合。空集合必须用 `set()`。集合无序，不支持索引访问。
:::

### 4.2 常用操作

| 操作 | 说明 | 示例 |
|:---:|:---:|:---:|
| `add(x)` | 添加元素 | `s1.add("t")` |
| `remove(x)` | 删除指定元素（不存在会报错） | `s1.remove("t")` |
| `pop()` | 随机删除一个元素 | `e = s1.pop()` |
| `clear()` | 清空集合 | `s1.clear()` |
| `s1 & s2` | 交集 | `s1.intersection(s2)` |
| `s1 \| s2` | 并集 | `s1.union(s2)` |
| `s1 - s2` | 差集 | `s1.difference(s2)` |

```python title = "12.数据容器-set.py"
s1 = {1, 2, 3, 4, 5}
s2 = {4, 5, 6, 7, 8}

print(s1 & s2)   # {4, 5}
print(s1 | s2)   # {1, 2, 3, 4, 5, 6, 7, 8}
print(s1 - s2)   # {1, 2, 3}
```

### 4.3 详细操作示例

```python title = "12.数据容器-set.py"
s1 = {100, 200, 300, 400, 500, 600, 700, 800}
print(s1)

# 添加元素
s1.add(1200)
print(s1)

# 删除指定元素
s1.remove(200)
print(s1)

# 随机删除一个元素
pop = s1.pop()
print(pop)
print(s1)

# 清空集合
s1.clear()
print(s1)
```

### 4.4 集合运算

```python title = "12.数据容器-set.py"
s2 = {"A", "B", "C", "D", "E", "X", "Y"}
s3 = {"C", "E", "Y", "Z"}

# 差集（s2 有但 s3 没有的）
print(s2.difference(s3))    # {'A', 'B', 'D', 'X'}
print(s3.difference(s2))    # {'Z'}

# 并集（合并去重）
print(s2.union(s3))         # {'A', 'B', 'C', 'D', 'E', 'X', 'Y', 'Z'}
print(s2 | s3)              # 同上

# 交集（共同元素）
print(s2.intersection(s3))  # {'C', 'E', 'Y'}
print(s2 & s3)              # 同上
```

## 5.字典 dict

字典使用**键值对**（key: value）存储数据，通过键快速查找对应的值。

### 5.1 定义

```python title = "13.数据容器-dict.py"
d = {"王林": 670, "韩立": 556, "李慕婉": 582}
print(type(d))      # <class 'dict'>
print(d["王林"])     # 670
```

::: info 说明
- key 不能重复，重复定义时后面的覆盖前面的
- key 必须是不可变类型（字符串、数字、元组），value 可以是任意类型
- 字典没有索引，只能通过 key 获取 value
:::

### 5.2 常用操作

| 类型 | 操作 | 说明 |
|:---:|:---:|:---:|
| 添加 | `d[key] = value` | key 不存在时新增 |
| 修改 | `d[key] = value` | key 存在时修改 |
| 删除 | `del d[key]` / `d.pop(key)` | 删除键值对 |
| 查询 | `d[key]` / `d.get(key)` | 获取值（`get` 不存在返回 `None`） |
| 遍历 | `d.keys()` / `d.values()` / `d.items()` | 获取所有键/值/键值对 |

```python title = "13.数据容器-dict.py"
d = {"王林": 670, "韩立": 556}

d["紫灵"] = 435      # 添加
d["王林"] = 680      # 修改
del d["韩立"]        # 删除

for key, value in d.items():
    print(f"{key}: {value}")
```

运行结果：

```
王林: 680
紫灵: 435
```

### 5.3 遍历方式

```python title = "13.数据容器-dict.py"
dict1 = {"王林": 670, "李慕婉": 608, "徐立国": 580, "韩立": 688}

# 遍历所有 key
for k in dict1.keys():
    print(f"{k}: {dict1[k]}")

# 遍历所有 value
for v in dict1.values():
    print(v)

# 遍历所有键值对
for k, v in dict1.items():
    print(f"{k} : {v}")
```

### 5.4 更多操作

```python title = "13.数据容器-dict.py"
dict1 = {"王林": 670, "李慕婉": 608, "徐立国": 580, "韩立": 688}

# 添加/修改
dict1["南絮"] = 700      # 添加
dict1["南絮"] = 620      # 修改

# 获取值
print(dict1["南絮"])      # 620
print(dict1.get("南絮"))  # 620
print(dict1.get("不存在"))  # None

# 删除
score = dict1.pop("徐立国")  # 删除并返回值
print(score)                  # 580

del dict1["韩立"]             # 删除键值对

print(dict1)  # {'王林': 670, '李慕婉': 608, '南絮': 620}
```

## 6.综合对比

| 特性 | 字符串 | 列表 | 元组 | 集合 | 字典 |
|:---:|:---:|:---:|:---:|:---:|:---:|
| 有序 | ✅ | ✅ | ✅ | ❌ | ❌（3.7+ 插入有序） |
| 可重复 | ✅ | ✅ | ✅ | ❌ | key 不可重复 |
| 可修改 | ❌ | ✅ | ❌ | ✅ | ✅ |
| 索引访问 | ✅ | ✅ | ✅ | ❌ | ❌（按键访问） |
| 切片 | ✅ | ✅ | ✅ | ❌ | ❌ |
| 使用场景 | 文本处理 | 有序可重复数据 | 固定数据记录 | 去重 | 键值对存储 |
