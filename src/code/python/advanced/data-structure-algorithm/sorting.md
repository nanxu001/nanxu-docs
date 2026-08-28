---
title: 排序算法
icon: fas:sort
order: 3
---

## 1.算法的稳定性

**稳定排序算法**：待排序的记录中可能存在**多个关键字相同**的记录，若经过排序后它们的**相对位置保持不变**，则称该排序算法是**稳定**的；否则是**不稳定**的。

常见排序算法的稳定性：

| 类型 | 算法 |
|:---:|:---:|
| 稳定 | 冒泡排序、插入排序、归并排序、基数排序 |
| 不稳定 | 选择排序、快速排序、希尔排序、堆排序 |

## 2.排序算法

**排序**（Sort）：使一串记录按照其中某个或某些关键字的**大小**，**递增或递减**地排列起来的操作。

**排序算法**：如何使记录按照要求排列的方法。

排序算法在很多领域都非常重要：

- 处理大量数据时，一个优秀的算法能**节省大量资源**
- 各领域对数据有不同的限制和规范，要得到符合实际的优秀算法，需要经过大量的**推理和分析**

## 3.冒泡排序

**冒泡排序**（Bubble Sort）：重复地走访要排序的元素列，依次比较**两个相邻元素**，如果顺序错误（如从大到小、首字母从 Z 到 A）就把它们交换过来，直到没有相邻元素需要交换为止。

名字的由来：越小的元素会经由交换慢慢**"浮"到数列顶端**，就像碳酸饮料中二氧化碳的气泡最终上浮到顶端一样，故名"冒泡排序"。


### 3.1 代码实现

以 5 个元素为例，比较的轮数和每轮比较次数如下：

| 第几轮（索引） | 该轮比较的总次数 | 公式 |
|:---:|:---:|:---:|
| 第1轮（0） | 4 次 | 5 - 1 - 0 = 4 |
| 第2轮（1） | 3 次 | 5 - 1 - 1 = 3 |
| 第3轮（2） | 2 次 | 5 - 1 - 2 = 2 |
| 第4轮（3） | 1 次 | 5 - 1 - 3 = 1 |

要点：
1. **比较的总轮数** = 列表长度 - 1
2. **每轮比较的总次数** = 列表长度 - 1 - i
3. **谁和谁比较**：索引 `j` 和 `j + 1` 位置的元素

```python title = "01.冒泡排序.py"
# 定义函数
def bubble_sort(my_list: list):
    # 获取列表的长度
    length = len(my_list)
    # 外循环：控制比较的轮数
    for i in range(length - 1):
        # 内循环：控制比较的总次数
        for j in range(length - 1 - i):
            if my_list[j] > my_list[j + 1]:
                my_list[j], my_list[j + 1] = my_list[j + 1], my_list[j]

    return my_list

if __name__ == '__main__':
    my_list = [5, 3, 6, 7, 2]
    print(bubble_sort(my_list))
```

运行结果:

```
[2, 3, 4, 5, 7]
```

### 3.2 思考

```python title = "01.冒泡排序.py"
# 定义函数
def bubble_sort(my_list: list):
    # 获取列表的长度
    length = len(my_list)

    # 外循环：控制比较的轮数
    for i in range(length - 1):
        # 记录交换的次数
        count = 0

        # 内循环：控制比较的总次数
        for j in range(length - 1 - i):
            if my_list[j] > my_list[j + 1]:
                count += 1
                my_list[j], my_list[j + 1] = my_list[j + 1], my_list[j]

        print(f"第 {i + 1} 轮交换了 {count} 次")

    return my_list

if __name__ == '__main__':
    my_list = [5, 3, 6, 7, 2]
    print(bubble_sort(my_list))
```

运行结果:

```
第 1 轮交换了 2 次
第 2 轮交换了 1 次
第 3 轮交换了 1 次
第 4 轮交换了 1 次
[2, 3, 4, 5, 7]
```

如果本轮没有交换，则说明列表已经有序，可以提前结束循环

### 3.3 优化

```python title = "01.冒泡排序.py"
# 定义函数
def bubble_sort(my_list: list):
    # 获取列表的长度
    length = len(my_list)

    # 外循环：控制比较的轮数
    for i in range(length - 1):
        # 记录交换的次数
        count = 0

        # 内循环：控制比较的总次数
        for j in range(length - 1 - i):
            if my_list[j] > my_list[j + 1]:
                count += 1
                my_list[j], my_list[j + 1] = my_list[j + 1], my_list[j]

        print(f"第 {i + 1} 轮交换了 {count} 次")

        if count == 0:
            break

    return my_list

if __name__ == '__main__':
    my_list = [5, 3, 4, 7, 2]
    # my_list = [2, 3, 4, 5, 7]
    print(bubble_sort(my_list))
```

运行结果:

```
第 1 轮交换了 2 次
第 2 轮交换了 1 次
第 3 轮交换了 0 次
[2, 3, 4, 5, 7]
```

第 3 轮交换次数为 0，说明已经有序，`break` 提前结束循环。

### 3.4 扩展

- 外循环的 `-1`：减少比较的**轮数**，提高效率
- 内循环的 `-1`：防止 `j + 1` 时**索引越界**
- 内循环的 `-i`：减少每轮比较的**次数**，提高效率

## 4.选择排序

### 4.1 工作原理

**选择排序**（Selection Sort）：每一轮从**待排序**的元素中选出**最小**（或最大）的一个，放到**已排序序列的末尾**；重复此过程，直到全部元素排序完成。

### 4.2 代码实现

以 5 个元素为例，每轮比较的轮数、次数和比较对象如下：

| 第几轮（索引 i） | 该轮比较的总次数 | 比较对象 |
|:---:|:---:|:---:|
| 第1轮（0） | 4 次 | 索引 0 与 1、2、3、4 |
| 第2轮（1） | 3 次 | 索引 1 与 2、3、4 |
| 第3轮（2） | 2 次 | 索引 2 与 3、4 |
| 第4轮（3） | 1 次 | 索引 3 与 4 |

要点：
1. **比较的总轮数** = 列表长度 - 1
2. **每轮比较的总次数** = 列表长度 - (i + 1)
3. **谁和谁比较**：假设 `min_index = i` 为本轮最小值的索引，用其后的元素依次与 `my_list[min_index]` 比较，遇到更小的就更新 `min_index`；本轮结束后把 `my_list[i]` 与 `my_list[min_index]` 交换

```python title = "02.选择排序.py"
def select_sort(my_list: list):
    # 获取列表长度
    length = len(my_list)

    # 外循环：控制比较的轮数
    for i in range(length - 1):
        # 记录本轮最小值的索引
        min_index = i

        # 内循环：控制每轮比较的次数
        for j in range(i + 1, length):
            if my_list[j] < my_list[min_index]:
                min_index = j

        # 走到这里说明本轮已经找到最小值，判断并交换
        if min_index != i:
            my_list[i], my_list[min_index] = my_list[min_index], my_list[i]

    return my_list

if __name__ == '__main__':
    my_list = [5, 3, 4, 7, 2]
    print(select_sort(my_list))
```

运行结果:

```
[2, 3, 4, 5, 7]
```

## 5.插入排序

**插入排序**（Insertion Sort）：将**未排序**区中的一个元素，插入到**已排序**区中适当的位置，从而得到一个新的、个数加一的有序数据。适用于**少量数据**的排序。

它将数组分成两部分：

- **有序区**：默认第一个元素为有序区
- **无序区**：除第一个元素外，其余元素为无序区

基本思想：每一轮从**无序区**取出一个元素，插入到**有序区**的合适位置，直到无序区为空。

### 代码实现

以 5 个元素为例，每轮的比较次数如下：

| 第几轮（索引 i） | 该轮比较的总次数 | 比较对象 |
|:---:|:---:|:---:|
| 第1轮（1） | 1 次 | 索引 1 与 0 |
| 第2轮（2） | 2 次 | 索引 2 与 1、0 |
| 第3轮（3） | 3 次 | 索引 3 与 2、1、0 |
| 第4轮（4） | 4 次 | 索引 4 与 3、2、1、0 |

要点：
1. **比较的总轮数** = 列表长度 - 1（`range(1, n)`）
2. **每轮比较的总次数** = `range(i, 0, -1)`（从 `i` 向前比较到索引 1）
3. **谁和谁比较**：索引 `j` 和 `j - 1` 位置的元素

```python title = "03.插入排序.py"
def insert_sort(my_list: list):
    # 获取列表长度
    length = len(my_list)

    # 外循环：控制比较的轮数
    for i in range(1, length):
        # 内循环：控制每次比较的总次数
        for j in range(i, 0, -1):
            # 如果 j < j - 1 的元素，就交换
            if my_list[j] < my_list[j - 1]:
                my_list[j], my_list[j - 1] = my_list[j - 1], my_list[j]
            else:
                break

    return my_list


if __name__ == '__main__':
    my_list = [5, 3, 4, 7, 2]
    print(insert_sort(my_list))
```

运行结果:

```
[2, 3, 4, 5, 7]
```

## 6.快速排序

### 6.1 基本思想

**快速排序**（Quick Sort）：通过一趟排序将数据**分割**成独立的两部分，其中一部分的所有数据都比另一部分小；再对这两部分**分别递归**进行快速排序，最终使整个数据有序。

### 6.2 排序流程

1. 设定一个**分界值**（基准），将数据分成左右两部分
2. 把**小于**分界值的数据放到左边，**大于或等于**分界值的数据放到右边
3. 左右两部分各自再取分界值，**递归**排序
4. 重复以上过程，直到每个部分都排好序

### 6.3 代码实现

```python title = "05.快速排序.py"
def quick_sort(my_list, start, end):
    """
    快速排序思路，实现对列表元素排序
    :param my_list: 要操作的列表
    :param start: 操作的数据起始索引
    :param end: 操作的数据结束索引
    :return: 无
    """
    # 核心细节：如果start >= end，说明已经排好序了，递归结束
    if start >= end:
        return

    # 1.定义变量left和right，分别表示：分界值左，右的索引
    left = start
    right = end

    # 2.定义变量mid，表示分界值，假设列表的起始值为分界值
    mid = my_list[start]

    # 3.具体的查找过程，只要left比right小，就一直找
    while left < right:
        # 4.把分界值右边比分界值小的数据，放分界值左边
        # 4.1 循环操作，只要分界值右边的数据比分界值大，right就-1，直至循环结束
        while my_list[right] >= mid and left < right:
            right -= 1

        # 4.2 走到这里，说明 my_list[right] 比分界值小，放左侧
        my_list[left] = my_list[right]

        # 5.把分界值左边比分界值大的数据，放分界值右边
        # 5.1 循环操作，只要分界值左边的数据比分界值小，left就+1，直至循环结束
        while my_list[left] < mid and left < right:
            left += 1

        # 5.2 走到这里，说明 my_list[left] 比分界值大（或等于），放右侧
        my_list[right] = my_list[left]

    # 6.走到这里循环结束，即分界值的位置已经找到，赋值即可
    my_list[left] = mid

    # 7.递归方式处理分界值左侧的数据
    quick_sort(my_list, start, left - 1)

    # 8.递归方式处理分界值右侧的数据
    quick_sort(my_list, right + 1, end)


if __name__ == '__main__':
    my_list = [5, 8, 2, 1, 9, 6, 7, 4, 3]
    quick_sort(my_list, 0, len(my_list) - 1)

    print(my_list)
```

运行结果:

```
[1, 2, 3, 4, 5, 6, 7, 8, 9]
```