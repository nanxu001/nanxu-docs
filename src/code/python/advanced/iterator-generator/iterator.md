---
title: 迭代器
icon: fas:rotate
order: 1
---

## 1.概述

**迭代器**（Iterator）是 Python 中的一种对象，用于在数据集合中逐个访问元素，而不需要暴露数据集合的底层实现。它提供了一种遍历集合元素的标准方式，适用于任何支持迭代的数据结构，如列表、元组等，range() 返回的就是可迭代对象。

迭代器是一个实现了 `__iter__()` 和 `__next__()` 方法的对象，使得可以逐步遍历它的元素。

:::tip 特点
**手动管理**：需要显式地实现 `__iter__()` 和 `__next__()` 方法。

**状态管理**：迭代器需要自己管理迭代的状态，包括当前位置和结束条件。

**内存使用**：内存使用取决于迭代器的实现，通常是惰性计算（即按需生成数据）。
:::

## 2.回顾range()用法

`range(1, 6)` 返回的是一个**可迭代对象**，`for` 循环底层会先调用 `iter()` 获取迭代器，再反复调用 `next()` 取出数据：

```python title = "05.迭代器.py"
for i in range(1, 6):
    print(i)

print("-" * 23)
```

运行结果:

```
1
2
3
4
5
-----------------------
```

## 3.自定义迭代器

模拟 `range(1, 6)`，自定义迭代器实现同等逻辑。

```python title = "05.迭代器.py"
# 1.自定义迭代器类
class MyIterator:
    # 2.通过init魔法方法，初始化属性，指定范围
    def __init__(self, start, end):
        """
        初始化属性
        :param start: 开始值
        :param end: 结束值
        """
        self.current_value = start
        self.end = end

    # 3.重写 __iter__ 魔法方法，返回当前对象（即：迭代器对象）
    def __iter__(self):
        return self

    # 4.重写 __next__ 魔法方法，返回当前值，并更新当前值
    def __next__(self):
        # 4.1 判断当前值范围是否合法
        if self.current_value >= self.end:
            # 抛出异常，迭代结束
            raise StopIteration

        # 4.2 走这里说明当前值合法，返回并更新当前值
        # value = self.current_value
        # self.current_value += 1
        # return value

        # 效果同上，代码更简单
        self.current_value += 1
        return self.current_value - 1

# 5.创建迭代器对象并遍历
# 5.1 for循环
for i in MyIterator(1, 6):
    print(i)

# 5.2 next()函数
my_itr = MyIterator(10, 13)
print(next(my_itr)) # 10
print(next(my_itr)) # 11
print(next(my_itr)) # 12
print(next(my_itr)) # raise StopIteration 抛出异常，迭代结束
```

运行结果:

```
1
2
3
4
5
10
11
12
Traceback (most recent call last):
  File "D:\Codes\PycharmProjects\py_project02\day05\05.迭代器.py", line 68, in <module>
    print(next(my_itr)) # raise StopIteration 抛出异常，迭代结束
          ~~~~^^^^^^^^
  File "D:\Codes\PycharmProjects\py_project02\day05\05.迭代器.py", line 46, in __next__
    raise StopIteration
StopIteration
```