---
title: 魔法方法
icon: fas:wand-magic-sparkles
order: 2
---

## 1.魔法方法概述

### 1.1 什么是魔法方法

魔法方法是 Python 内置的特殊方法，在满足特定场景下会**自动调用**，无需开发者手动调用。

**与普通函数的区别：**
- 普通函数：需要手动调用
- 魔法方法：满足条件自动触发

### 1.2 魔法方法的特点

- 以双下划线 `__` 开头和结尾
- 在特定场景下会被自动调用
- 无需开发者手动调用

::: warning 注意
双下划线必须前后都有，如果只有前面有，就变成私有了（后续会讲解）。
:::

### 1.3 常用的魔法方法

| 魔法方法 | 触发时机 |
|:---:|:---:|
| `__init__()` | 创建对象时自动调用 |
| `__str__()` | 用 `print()` 打印对象时自动调用 |
| `__del__()` | 删除对象或程序执行结束时自动调用 |

::: info 说明
魔法方法不止这三个，后续遇到其他魔法方法会继续讲解。
:::

## 2.__init__ 方法

### 2.1 __init__ 是什么

`__init__` 是一个魔法方法，在**创建对象时**会被自动调用，一般用于给对象的属性进行初始化。

**触发时机：** `对象名 = 类名()` 时自动调用

### 2.2 无参版 __init__

```python title="07.魔法方法之init无参版.py"
class Car:
    def __init__(self):
        self.color = "red"
        self.num = 4

c1 = Car()
print(c1.color)  # 输出：red
print(c1.num)    # 输出：4
```

::: info 说明
无参版 `__init__` 在创建对象时自动为属性赋默认值。
:::

### 2.3 有参版 __init__

```python title="08.魔法方法之init有参版.py"
class Car:
    def __init__(self, color, num):
        self.color = color
        self.num = num

c1 = Car("红色", 4)
print(c1.color)  # 输出：红色
print(c1.num)    # 输出：4
```

::: tip 说明
- 有参版 `__init__` 在创建对象时通过参数传入属性值
- 实际开发中更常用有参版
- `self.color = color` 表示将参数 `color` 的值赋给对象的 `color` 属性
:::

## 3.__str__ 方法

### 3.1 __str__ 是什么

`__str__` 是一个魔法方法，在用 `print()` 函数**打印对象时**会被自动调用。

**触发时机：** `print(对象名)` 时自动调用

### 3.2 默认行为

如果不重写 `__str__` 方法，默认打印的是对象的内存地址（无意义）。

### 3.3 重写 __str__

一般会重写 `__str__` 方法，返回对象的属性值信息。

```python title="09.魔法方法之str.py"
class Car:
    def __init__(self, color, num):
        self.color = color
        self.num = num

    def __str__(self):
        return f"颜色：{self.color}, 轮胎数：{self.num}"

c1 = Car("红色", 4)
print(c1)  # 输出：颜色：红色, 轮胎数：4
```

::: info 说明
- `__str__` 方法必须返回一个字符串
- 重写后，`print(对象名)` 会输出返回的字符串，而不是内存地址
:::

## 4.__del__ 方法

### 4.1 __del__ 是什么

`__del__` 是一个魔法方法，在**删除对象**或**程序执行结束**时会被自动调用，一般用于释放对象资源。

**触发时机：**
- 手动删除对象：`del 对象名`
- 程序执行结束时自动调用

### 4.2 示例

```python title="10.魔法方法之del.py"
class Car:
    def __init__(self, brand):
        self.brand = brand

    def __str__(self):
        return f"品牌：{self.brand}"

    def __del__(self):
        print(f"{self} 对象被删除了")

c1 = Car("su7")
print(c1)           # 输出：品牌：su7
print(c1.brand)     # 输出：su7
print("-" * 19)
del c1              # 触发 __del__，输出：品牌：su7 对象被删除了
print("程序结束")
```

::: tip 说明
- `__del__` 方法一般用于做标记，确认对象是否从内存中释放
- 实际开发中 `__del__` 使用频率低于 `__init__` 和 `__str__`
:::

## 5.完整示例

```python
class Car:
    def __init__(self, color, num):
        """
        给车辆属性赋初值
        :param color: 颜色
        :param num: 轮胎数
        """
        self.color = color
        self.num = num

    def __str__(self):
        return f"颜色：{self.color}, 轮胎数：{self.num}"

    def __del__(self):
        print(f"{self} 对象被删除了")

# 创建对象，自动调用 __init__
c1 = Car("红色", 4)

# 打印对象，自动调用 __str__
print(c1)  # 输出：颜色：红色, 轮胎数：4

# 删除对象，自动调用 __del__
del c1     # 输出：颜色：红色, 轮胎数：4 对象被删除了
```
