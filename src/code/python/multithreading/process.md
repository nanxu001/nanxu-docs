---
title: 进程
icon: fas:microchip
order: 2
---

## 1. 进程概述

### 1.1 什么是进程？

**进程（Process）**是操作系统进行**资源分配和调度**的基本单位，也是 CPU 资源分配的最小单位。

::: tip 通俗理解
一个正在运行的程序就是一个进程。例如：当你同时打开 QQ、微信和浏览器时，操作系统中就分别运行着三个独立的进程。
:::

### 1.2 多进程的作用与工作方式

在 Python 程序中，**多进程**是实现多任务处理的重要手段之一。通过利用多核 CPU 的优势，多进程可以显著提高程序的执行效率，尤其适合**计算密集型**任务。

**基本工作流程：**
1. 程序启动后，操作系统会创建一个**主进程**。
2. 在主进程中，可以根据需求动态创建多个**子进程**。
3. 主进程与子进程之间相互独立，各自拥有独立的内存空间。

## 2.进程的创建步骤

1. 导入进程模块
```python
import multiprocessing
```

2. 通过进程类实例化进程对象 

```python
子进程对象 =  multiprocessing.Process(group=None, target=None, name=None, args=(), kwargs={}) 
```

::: info 参数说明
- `group` 参数未使用，值始终为None
- `target` 表示调用对象，即子进程要执行的任务（回调函数入口地址）
- `args` 表示以元组的形式向子任务函数传参，元组方式传参一定要和参数的顺序保持一致
- `kwargs` 表示以字典的方式给子任务函数传参，字典方式传参字典中的key要和参数名保持一致
- `name` 为子进程的名称
:::

3. 启动进程执行任务

```
进程对象.start()
```

## 3.案例

### 3.1 进程创建与启动

使用多进程来模拟一边编写代码，一边听音乐功能实现。

```python title = "10.演示多进程.py"
import multiprocessing
import time


def coding():
    """模拟编写代码的任务"""
    for i in range(1, 11):
        # 模拟耗时操作，更好查看多任务的执行效果
        time.sleep(0.1)
        print(f"正在敲第 {i} 遍代码")

def music():
    """模拟听音乐的任务"""
    for i in range(1, 11):
        time.sleep(0.1)
        print(f"正在敲第 {i} 遍音乐")

if __name__ == '__main__':
    # 1. 创建子进程：target 指定进程要执行的目标函数
    coding_process = multiprocessing.Process(target=coding)
    music_process = multiprocessing.Process(target=music)

    # 2. 启动进程：进程进入就绪状态，等待操作系统调度分配 CPU 资源
    coding_process.start()
    music_process.start()
```

::: important
- `if __name__ == '__main__':`：在 Windows 系统中，创建多进程必须将启动代码放在此判断下，否则会引发递归创建进程的错误。
- `target` **参数**：指定子进程启动后要执行的函数名（注意不要加括号 ()）。
- `start()` **方法**：调用后，子进程才会真正开始运行。此时主进程和子进程是并发执行的。
:::

### 3.2 带参数的任务

创建进程时可以通过两种方式传递参数：

1. **args 方式**：使用元组传参，参数顺序必须与目标函数的参数顺序保持一致
2. **kwargs 方式**：使用字典传参，字典的键名必须与目标函数的参数名保持一致

下面通过多进程模拟小明一边编写代码，一边听音乐的场景：

```python title = "11.带参数的多进程.py"
import multiprocessing, time

def coding(name, count):
    for i in range(1, count + 1):
        time.sleep(0.1)
        print(f"{name} 正在编写第 {i} 遍代码")


def music(name, count):
    for i in range(1, count + 1):
        time.sleep(0.1)
        print(f"{name} 正在听第 {i} 首音乐")


if __name__ == '__main__':
    # 使用 args 方式传参（元组）
    coding_process = multiprocessing.Process(target=coding, args=("小明", 10))
    
    # 使用 kwargs 方式传参（字典）
    music_process = multiprocessing.Process(target=music, kwargs={"name": "小李", "count": 10})

    coding_process.start()
    music_process.start()
```

## 4. 进程编号

### 4.1 概述

在操作系统中，每个进程都有唯一的进程 ID（PID）。当进程结束时，其 PID 会被释放并可能被其他新进程复用。

### 4.2 作用

获取进程编号的主要用途包括：

1. 查看子进程与父进程的层级关系，便于进程管理
2. 通过 PID 终止指定进程
3. 调试和监控进程状态

### 4.3 获取方法

**获取当前进程的 PID：**

- `os.getpid()`：返回当前进程的 ID
- `multiprocessing.current_process().pid`：返回当前进程对象的 ID

**获取父进程的 PPID（Parent Process ID）：**

- `os.getppid()`：返回父进程的 ID

### 4.4 注意事项

在 `__main__` 中创建的子进程，若未特殊指定，其父进程均为 main 进程。而 main 进程的父进程通常是启动它的程序（如 PyCharm、终端等）的 PID。

### 4.5 示例代码

```python title = "12.获取进程的编号.py"
import multiprocessing, time
import os


def coding(name, count):
    for i in range(1, count + 1):
        time.sleep(0.1)
        print(f"{name} 正在编写第 {i} 遍代码")

    print(f"coding_process 进程的 pid：{os.getpid()}，{multiprocessing.current_process().pid}，父进程 id（ppid）为：{os.getppid()}")


def music(name, count):
    for i in range(1, count + 1):
        time.sleep(0.1)
        print(f"{name} 正在听第 {i} 首音乐")

    print(f"music_process 进程的 pid：{os.getpid()}，{multiprocessing.current_process().pid}，父进程 id（ppid）为：{os.getppid()}")


if __name__ == '__main__':
    coding_process = multiprocessing.Process(target=coding, args=("小明", 10))
    music_process = multiprocessing.Process(target=music, kwargs={"name": "小李", "count": 10})

    coding_process.start()
    music_process.start()

    print(f"main 进程的 pid：{os.getpid()}，{multiprocessing.current_process().pid}，父进程 id（ppid）为：{os.getppid()}")
```

## 5.特点

### 5.1 进程间数据隔离

进程之间是相互独立的，每个进程都有自己独立的内存空间。创建子进程时，会将父进程的变量复制一份到子进程中，因此各进程之间的数据互不影响。

```python title = "13.进程特点之数据隔离.py"
import multiprocessing
import time

my_list = []
print("main外资源")

def write_data():
    for i in range(1, 6):
        my_list.append(i)
        print(f"添加数据：{i}")

    print(f"write_data函数：{my_list}")

def read_data():
    time.sleep(3)
    print(f"read_data函数：{my_list}")

if __name__ == '__main__':
    p1 = multiprocessing.Process(target=write_data)
    p2 = multiprocessing.Process(target=read_data)

    p1.start()
    p2.start()
```

运行结果:

从输出可以看到 `main外资源` 被打印了三次（主进程、p1、p2 各一次），且 p2 无法读取到 p1 写入的数据，说明进程间数据是隔离的。

```
main外资源
main外资源
添加数据：1
添加数据：2
添加数据：3
添加数据：4
添加数据：5
write_data函数：[1, 2, 3, 4, 5]
main外资源
read_data函数：[]
```

### 5.2 主进程与子进程的生命周期

默认情况下，主进程会等待所有子进程执行完毕后才结束。如果需要主进程结束时子进程也立即终止，可以采用以下两种方式：

1. **设置守护进程（推荐）**：将子进程设置为守护进程（daemon），主进程结束时会自动终止守护子进程
2. **强制终止子进程**：使用 `terminate()` 方法强制关闭子进程，但可能导致僵尸进程（由操作系统自动回收）

#### 示例 1：默认行为（主进程等待子进程）

```python title = "14.进程特点之主进程等待子进程结束再结束.py"
import multiprocessing
import time


def work():
    for i in range(10):
        print("正在努力工作中")
        time.sleep(0.2)

if __name__ == '__main__':
    # 进程的默认命名规则是：Process-编号，编号从1开始
    p = multiprocessing.Process(target=work, name="Nanxu")
    print(f"p进程的名字：{p.name}")

    p.start()

    time.sleep(1)

    print("main进程结束")
```

运行结果:

可以看到主进程在输出 "main进程结束" 后，仍然等待子进程继续执行完毕才真正退出。

```
p进程的名字：Nanxu
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
main进程结束
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
```

#### 示例 2：强制终止子进程

```python title = "14.进程特点之主进程等待子进程结束再结束.py"
import multiprocessing
import time


def work():
    for i in range(10):
        print("正在努力工作中")
        time.sleep(0.2)

if __name__ == '__main__':
    # 进程的默认命名规则是：Process-编号，编号从1开始
    p = multiprocessing.Process(target=work, name="Nanxu")
    print(f"p进程的名字：{p.name}")

    # 思路1：设置p为守护进程（推荐）
    p.daemon = True
    p.start()

    time.sleep(1)

    # 思路2：强制关闭子进程
    # p.terminate()
    print("main进程结束")
```

运行结果:

可以看到主进程结束后子进程不再继续执行。

```
p进程的名字：Nanxu
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
正在努力工作中
main进程结束
```