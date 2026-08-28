---
title: 二分查找
icon: fas:magnifying-glass-location
order: 4
---

## 1.概述

**二分查找**（Binary Search）又称**折半查找**，是一种效率较高的查找方法。它的前提是**列表必须有序**（升序或降序）。

**原理**：将列表按中值分成三部分——中值前、中值、中值后。每次将要查找的值与中值比较：

- 小于中值 → 在中值**前**查找
- 大于中值 → 在中值**后**查找
- 等于中值 → 直接返回

每轮都能排除掉一半数据，所以时间复杂度为 **O(log n)**。

## 2.递归版

递归版每次把查找范围减半，递归地去左半段或右半段查找：

**原理**（假设列表已升序）：

1. 将要查找的元素与列表**中值**比较，相等就返回 `True`
2. 比中值**小** → 去**左半段**（中值前）查找
3. 比中值**大** → 去**右半段**（中值后）查找
4. 重复以上过程；若列表为空仍未找到，返回 `False`

```python title = "04.二分查找.py"
# 1.定义函数 binary_search_recursion()
def binary_search_recursion(my_list: list, target):
    """
    二分查找递归版
    :param my_list: 待查找的列表
    :param target: 要查找的元素
    :return: True：存在，False：不存在
    """
    # 获取列表长度
    length = len(my_list)

    # 列表为空，说明已经找完，返回 False
    if length == 0:
        return False

    # 排序（二分查找要求列表有序）
    my_list.sort()

    # 获取列表的中值索引
    mid_index = length // 2

    # 比较要查找的元素和中值
    if my_list[mid_index] == target:
        return True
    elif my_list[mid_index] > target:
        # 中值比目标大 → 去左半段（中值前）查找
        return binary_search_recursion(my_list[:mid_index], target)
    elif my_list[mid_index] < target:
        # 中值比目标小 → 去右半段（中值后）查找
        return binary_search_recursion(my_list[mid_index + 1:], target)


# 2.测试
if __name__ == '__main__':
    my_list = [5, 3, 4, 7, 2]
    print(binary_search_recursion(my_list, 2))
```

运行结果:

```
True
```

## 3.非递归版

非递归版用 `while` 循环，配合 `start` / `end` 两个指针收缩查找区间：

```python title = "04.二分查找.py"
def binary_search(my_list: list, target):
    # 定义变量 start、end 分别表示列表的开始和结束索引
    start = 0
    end = len(my_list) - 1

    # 排序（二分查找要求列表有序）
    my_list.sort()

    # 循环查找，只要区间有效就一直找
    while start <= end:
        # 计算中间值的索引
        mid = (start + end) // 2

        # 比较要查找的元素和中值
        if my_list[mid] > target:
            # 中值比目标大 → 去左半段，收缩右边界
            end = mid - 1
        elif my_list[mid] < target:
            # 中值比目标小 → 去右半段，收缩左边界
            start = mid + 1
        else:
            return True

    # 走到这里说明区间已空，还没找到，返回 False
    return False


# 2.测试
if __name__ == '__main__':
    my_list = [5, 3, 4, 7, 2]
    print(binary_search(my_list, 5))
```

运行结果:

```
True
```