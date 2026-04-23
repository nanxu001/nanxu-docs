---
title: 线程
icon: fas:code-branch
order: 3
---

## 1. 线程概述

### 1.1 概念

线程是**CPU 调度和执行**的基本单位，它依附于进程存在。一个进程可以包含多个线程，这些线程共享进程的内存空间和资源。

### 1.2 作用

线程的主要作用是实现多任务并发执行，提高程序的执行效率和响应速度。通过多线程编程，可以在同一时间内处理多个任务，例如：

- 在图形界面程序中，使用一个线程处理用户交互，另一个线程执行后台任务
- 在网络应用中，使用多个线程同时处理多个客户端请求
- 在数据处理中，使用多线程并行处理大量数据

## 2.线程的创建步骤

1. 导入线程模块

```python
import threading
```

2. 通过线程类实例化线程对象

```python
线程对象 = threading.Thread(group=None, target=None, name=None, args=(), kwargs={}) 
```

::: info 参数说明
- `group` 参数未使用，值始终为None
- `target` 表示调用对象，即子线程要执行的任务（回调函数入口地址）
- `args` 表示以元组的形式向子任务函数传参，元组方式传参一定要和参数的顺序保持一致
- `kwargs` 表示以字典的方式给子任务函数传参，字典方式传参字典中的key要和参数名保持一致
- `name` 为子线程的名称
:::

3. 启动线程执行任务

```python
线程对象.start()
```

## 3.案例

### 3.1 线程创建与启动

使用多线程来模拟一边编写代码，一边听音乐功能实现。

```python title = "15.线程入门案例.py"
import threading
import time

def coding():
    for i in range(1, 11):
        # 模拟耗时操作，更好查看多任务的执行效果
        time.sleep(0.1)
        print(f"正在敲第 {i} 遍代码")

def music():
    for i in range(1, 11):
        time.sleep(0.1)
        print(f"正在敲第 {i} 遍音乐")

if __name__ == '__main__':
    t1 = threading.Thread(target=coding)
    t2 = threading.Thread(target=music)

    t1.start()
    t2.start()
```

### 3.2 带参数的任务

下面通过多线程模拟小明一边编写代码，一边听音乐的场景：

```python title = "16.带参数的多线程.py"
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
    t1 = threading.Thread(target=coding, args=("小明", 10))
    t2 = threading.Thread(target=music, kwargs={"name":"小李", "count": 10})

    t1.start()
    t2.start()
```

## 4.特点

### 4.1 执行的随机性

线程的执行顺序是不确定的，由操作系统的 CPU 调度算法决定。CPU 会根据当前系统负载、优先级等因素动态选择要执行的线程，因此多次运行同一程序，线程的执行顺序可能不同。

```python title = "01.多线程特点_随机性.py"
import threading
import time


def print_info():
    time.sleep(0.2)

    current_thread = threading.current_thread()
    print(current_thread.name)

if __name__ == '__main__':
    for i in range(10):
        t = threading.Thread(target=print_info)
        t.start()
```

运行结果:

从输出可以看到，线程的执行顺序是无序的，且由于并发执行，部分输出可能会交错显示。

```
Thread-2 (print_info)
Thread-1 (print_info)
Thread-4 (print_info)Thread-3 (print_info)

Thread-6 (print_info)
Thread-5 (print_info)Thread-7 (print_info)

Thread-8 (print_info)
Thread-9 (print_info)Thread-10 (print_info)
```

::: warning
由于 `print()` 函数并非原子操作，当某个线程输出了内容但尚未输出换行符时，如果其他线程抢占了 CPU 资源并执行了输出，就会导致多个线程的输出内容交错在一起，甚至出现连续换行的情况。
:::

### 4.2 守护线程


默认情况下，主线程会等待所有子线程执行完毕后才结束。如果希望主线程结束时子线程也立即终止，可以将子线程设置为**守护线程**（Daemon Thread）。

设置守护线程有以下三种方式：

1. **创建时指定**（推荐）：在创建 `Thread` 对象时通过 `daemon` 参数设置
2. **属性设置**：在启动前通过 `t.daemon = True` 设置
3. **方法设置**（已过时）：使用 `t.setDaemon(True)` 方法

```python title = "02.多线程特点_守护线程.py"
import threading
import time


def work():
    for i in range(10):
        time.sleep(0.2)
        print("工作中...")

if __name__ == '__main__':
    # 写法1：创建时直接指定（推荐）
    # t = threading.Thread(target=work, daemon=True)

    # 写法2：使用 setDaemon() 方法（已过时，不推荐）
    # t = threading.Thread(target=work)
    # t.setDaemon(True)

    # 写法3：通过 daemon 属性设置
    t = threading.Thread(target=work)
    t.daemon = True
    
    t.start()

    time.sleep(1)

    print("主线程结束")
```

运行结果:

```
工作中...
工作中...
工作中...
工作中...
工作中...
主线程结束
```

可以看到，当主线程执行完毕后，守护线程也随之终止，不再继续输出剩余的 "工作中..."。

::: warning 注意
1. 守护线程必须在 `start()` 之前设置，否则会抛出 `RuntimeError`

2. 守护线程适合用于执行后台任务（如日志记录、心跳检测等），不适合用于需要确保完成的关键任务

3. Python 程序会在所有非守护线程结束后退出，此时守护线程会被强制终止
:::


### 4.3 数据共享

与进程不同，同一进程内的多个线程共享全局变量和内存空间。这意味着一个线程对全局变量的修改，其他线程可以立即看到。

```python title = "03.多线程特点_数据共享.py"
import threading
import time

my_list = []


def write_data():
    for i in range(10):
        my_list.append(i)
    print(f"write_data函数：{my_list}")


def read_data():
    time.sleep(1)
    print(f"read_data函数：{my_list}")


if __name__ == '__main__':
    t1 = threading.Thread(target=write_data)
    t2 = threading.Thread(target=read_data)

    t1.start()
    t2.start()
```

运行结果:

从输出可以看到，`t2` 线程成功读取到了 `t1` 线程写入的数据，证明了线程间的数据是共享的。

```
write_data函数：[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
read_data函数：[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### 4.4 线程安全

虽然线程间数据共享带来了便利，但也引发了**线程安全问题**。当多个线程同时修改同一个全局变量时，可能会导致数据不一致或错误。

#### 示例：多线程累加异常

```python title = "04.多线程共享全局变量出现问题.py"
import threading

global_num = 0

def target_fun1():
    # 声明为全局变量
    global global_num
    for i in range(1000000):
        global_num += 1

    print(f"target_fun1函数结果：{global_num}")

def target_fun2():
    global global_num
    for i in range(1000000):
        global_num += 1

    print(f"target_fun2函数结果：{global_num}")

if __name__ == '__main__':
    t1 = threading.Thread(target=target_fun1)
    t2 = threading.Thread(target=target_fun2)

    t1.start()
    t2.start()
```

运行结果:

```
target_fun1函数结果：1638820
target_fun2函数结果：2000000
```

::: warning
每次运行的结果可能不同，但最终结果通常都会小于期望值 `2000000`。
:::

#### 原因

`global_num += 1` 操作在底层并非原子操作，它包含三个步骤：

1. **读取**：从内存中读取 `global_num` 的当前值。
2. **计算**：将读取的值加 1。
3. **写入**：将新值写回内存。

::: info Python GIL 的影响
在 CPython 解释器中，由于存在**全局解释器锁（GIL）**，同一时刻只有一个线程在执行字节码。线程之间的切换通常发生在执行了一定数量的字节码指令之后。
- 如果线程切换恰好发生在“读取”和“写入”之间，就会发生数据覆盖。
- 不同的 Python 版本、操作系统以及系统负载，都会影响 GIL 释放的频率和线程调度的时序，因此**每次运行的结果都可能不同**。
:::

#### 发生过程

线程 `t1` 读取 global_num 为 0。
在线程 `t1` 完成计算和写入之前，CPU 切换到线程 `t2`。
线程 `t2` 也读取 `global_num` 为 0（因为 `t1` 还没写回）。
线程 `t2` 计算得到 1 并写回内存。
线程 `t1` 恢复执行，计算得到 1 并写回内存，覆盖了 `t2` 的结果。

这样，两次累加操作实际上只使全局变量增加了 1，导致最终结果偏小。这种现象称为竞态条件。

#### 解决方案：线程同步

为了解决线程安全问题，我们需要引入**线程同步**机制。线程同步的核心思想是：保证同一时刻只能有一个线程去操作共享数据（全局变量）。

-  **同步的含义**：协同步调，按预定的先后次序运行。就像现实生活中的“对讲机”，一个人说完后，另一个人才能说，避免了多人同时说话导致的混乱。
-  **实现方式**：在 Python 中，最常用的同步方式是使用**锁（Lock）**。

## 5. 互斥锁

互斥锁（Mutex）是一种用于多线程编程的同步原语。它能确保在同一时刻，只有一个线程可以执行被锁保护的代码块（临界区）。

::: warning 工作原理
互斥锁的状态只有两种：**锁定（Locked）**和**未锁定（Unlocked）**。
1. 当多个线程尝试获取锁时，只有一个线程能成功抢到锁并继续执行。
2. 其他未抢到锁的线程会进入**阻塞（等待）状态**。
3. 当持有锁的线程执行完毕并释放锁后，等待的线程会再次竞争这把锁。
:::

### 5.1 使用流程

使用互斥锁通常包含以下三个步骤：

1. **创建锁对象**

```python
mutex = threading.Lock()
```

2. **上锁（获取锁）** 在执行共享资源操作前调用，如果锁已被占用，当前线程会在此处等待。

```python
mutex.acquire()
```

3. **释放锁** 在操作完成后调用，允许其他等待的线程获取锁。**务必确保锁能被正确释放，否则会导致死锁**。

```python
mutex.release()
```

通过引入互斥锁，可以确保在任意时刻只有一个线程在执行累加操作，从而保证数据的准确性。

```python title = "04.多线程共享全局变量出现问题.py"
import threading

global_num = 0

lock = threading.Lock()

def target_fun1():
    lock.acquire()

    # 声明为全局变量
    global global_num
    for i in range(1000000):
        global_num += 1

    print(f"target_fun1函数结果：{global_num}")

    lock.release()

def target_fun2():
    lock.acquire()

    global global_num
    for i in range(1000000):
        global_num += 1

    print(f"target_fun2函数结果：{global_num}")

    lock.release()

if __name__ == '__main__':
    t1 = threading.Thread(target=target_fun1)
    t2 = threading.Thread(target=target_fun2)

    t1.start()
    t2.start()
```

运行结果:

```
target_fun1函数结果：1000000
target_fun2函数结果：2000000
```

::: info
由于锁的存在，两个线程的执行变成了“串行”。通常是先启动的线程（如 `t1`）先获取锁并完成全部累加，打印出 1000000；随后 `t2` 获取锁，在 1000000 的基础上继续累加，最终打印出 2000000。 
:::

::: tip 最佳实践
在实际开发中，建议使用 `try...finally` 结构来包裹临界区代码。这样可以确保即使在处理共享数据时发生了异常，锁也能被正确释放，避免程序陷入死锁状态。
:::

### 5.2 死锁

一直等待对方释放锁的情景就是死锁。

#### 原因

使用互斥锁的时候需要注意死锁的问题，未在合适的地方释放锁。

#### 结果

会造成应用程序停止响应，无法继续往下执行。

## 6. 进程与线程的对比

### 6.1 核心关系

-  **依附性**：线程不能独立存在，必须依附于进程。没有进程就没有线程。
-  **包含关系**：一个进程至少包含一个线程（即主线程），并可以根据需要创建多个子线程。

### 6.2 详细区别

| 维度 | 进程 (Process) | 线程 (Thread) |
| :---: | :---: | :---: |
| **资源分配** | 操作系统分配资源的基本单位 | CPU 调度和执行的最小单位 |
| **数据共享** | 进程间内存隔离，通信复杂（需 IPC） | 同一进程内线程共享内存，通信高效但需注意同步 |
| **创建开销** | 开销大，需要分配独立的内存空间 | 开销小，共享进程资源，启动速度快 |
| **独立性** | 独立运行，一个进程崩溃通常不影响其他进程 | 依赖进程，一个线程崩溃可能导致整个进程终止 |
| **多核利用** | 可以充分利用多核 CPU 实现真正的并行 | 受 GIL 限制，在 CPython 中无法实现真正的并行计算 |

### 6.3 优缺点总结

#### 进程的优缺点
-  **优点**：
    -  **稳定性高**：进程间相互隔离，一个进程崩溃不会影响其他进程。
    -  **真正的并行**：可以利用多核 CPU 的优势，适合计算密集型任务。
-  **缺点**：
    -  **资源消耗大**：创建和销毁进程的开销较大，占用更多内存。
    -  **通信复杂**：进程间通信（IPC）比线程间通信更繁琐。

#### 线程的优缺点
-  **优点**：
    -  **轻量级**：创建和切换速度快，资源占用少。
    -  **通信便捷**：共享全局变量，数据交换简单。
-  **缺点**：
    -  **稳定性差**：线程间缺乏隔离，一个线程的异常可能导致整个程序崩溃。
    -  **同步复杂**：需要处理竞态条件，使用锁机制会增加代码复杂度并可能影响性能。
    -  **GIL 限制**：在 Python 中，由于全局解释器锁的存在，多线程无法充分利用多核 CPU 进行并行计算，更适合 I/O 密集型任务。