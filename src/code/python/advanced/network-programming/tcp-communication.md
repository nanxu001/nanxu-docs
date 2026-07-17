---
title: TCP通信案例
icon: fas:comments
order: 3
---

## 1.服务器端代码

### 1.1 代码实现

```python title="02.网编案例_一句话_服务器端.py"
"""
服务器端开发流程：
    1.创建服务器端Socket对象
    2.绑定Ip地址和端口号
    3.设置最大监听数
    4.等待客户端申请建立连接
    5.给客户端发送消息
    6.接收客户端的信息并打印
    7.释放资源
"""

import socket

# 1.创建服务器端Socket对象
server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2.绑定Ip地址和端口号
server_socket.bind(("127.0.0.1", 8080))

# 3.设置最大监听数
server_socket.listen(5)

# 4.等待客户端申请建立连接
# accept()返回两个值：新的socket对象和客户端的ip端口
accept_socket, info = server_socket.accept()

# 5.给客户端发送消息
# b"..." 是bytes类型的字面量，只能包含字母、数字、特殊符号，不能包含中文
accept_socket.send(b"Welcome To Socket!")

# 6.接收客户端的信息并打印
# recv(1024)：接收数据，1024是缓冲区大小
# decode("utf-8")：将bytes转为字符串
data = accept_socket.recv(1024).decode("utf-8")
print(f"服务器端收到来自：{info}的数据：{data}")

# 7.释放资源
accept_socket.close()
# 服务器端一般不关闭
# server_socket.close()
```

### 1.2 代码说明

| 步骤 | 方法 | 说明 |
|:---:|:---:|:---:|
| 1 | `socket.socket()` | 创建Socket对象 |
| 2 | `bind((ip, port))` | 绑定IP和端口号 |
| 3 | `listen(n)` | 设置最大监听数 |
| 4 | `accept()` | 等待客户端连接，返回元组 |
| 5 | `send(data)` | 发送数据 |
| 6 | `recv(size)` | 接收数据 |
| 7 | `close()` | 关闭连接 |

### 1.3 accept()详解

```python
accept_socket, info = server_socket.accept()
```

- 返回值是一个**元组**
- 第一个参数：负责和客户端交互的Socket对象
- 第二个参数：客户端的IP和端口信息

::: info 比喻
- `server_socket`：老板，负责等待客户到来
- `accept_socket`：店员，负责和客户交互
- `info`：客户信息（IP、端口）
:::

### 1.4 bind()的IP参数

```python
# 写具体IP：只监听这个IP的连接
server_socket.bind(("192.168.1.100", 8080))

# 写空字符串""：监听本机所有IP的连接
server_socket.bind(("", 8080))
```

::: tip 说明
一台电脑可以有多个IP地址（有线网卡、无线网卡、虚拟网卡等）。写空字符串 `""` 表示监听本机所有IP，客户端无论通过哪个IP连接都能成功。
:::

## 2.客户端代码

### 2.1 代码实现

```python title="03.网编案例_一句话_客户端.py"
"""
客户端开发流程：
    1.创建客户端Socket对象
    2.连接服务器端，指定服务器端Ip地址和端口号
    3.接收服务器端的信息并打印
    4.给服务器端发送消息
    5.释放资源
"""

import socket

# 1.创建客户端Socket对象
client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 2.连接服务器端
client_socket.connect(("127.0.0.1", 8080))

# 3.接收服务器端的信息并打印
print(client_socket.recv(1024).decode("utf-8"))

# 4.给服务器端发送消息
# encode("utf-8")：将字符串转为bytes
client_socket.send("你好".encode("utf-8"))

# 5.释放资源
client_socket.close()
```

### 2.2 收发顺序

::: warning 重要
服务器端和客户端的收发顺序要**相反**：
- 服务器端：先发后收
- 客户端：先收后发
:::

## 3.数据编解码

### 3.1 为什么需要编解码

网络传输时，数据是以**字节流（bytes）**的形式传输的，需要将字符串转为bytes（编码），接收后将bytes转为字符串（解码）。

### 3.2 编解码方法

| 方法 | 说明 | 示例 |
|:---:|:---:|:---:|
| `encode()` | 字符串 → bytes（编码） | `"你好".encode("utf-8")` |
| `decode()` | bytes → 字符串（解码） | `data.decode("utf-8")` |

### 3.3 代码示例

```python title="04.扩展_编解码.py"
# 编码：字符串 → bytes
s1 = "黑马123abCD!@#"
print(s1.encode())              # b'\xe9\xbb\x91\xe9\xa9\xac123abCD!@#'
print(s1.encode("utf-8"))       # b'\xe9\xbb\x91\xe9\xa9\xac123abCD!@#'
print(s1.encode("gbk"))         # b'\xba\xda\xc2\xed123abCD!@#'

print("-" * 32)

# 解码：bytes → 字符串
bys = b'\xe9\xbb\x91\xe9\xa9\xac123abCD!@#'
print(type(bys))  # <class 'bytes'>
s2 = bys.decode()
s3 = bys.decode("utf-8")
s4 = bys.decode("gbk")

print(s2)  # 黑马123abCD!@#
print(s3)  # 黑马123abCD!@#
print(s4)  # 乱码（因为编码和解码使用了不同的码表）
```

### 3.4 bytes字面量

```python
# bytes字面量：b"..."
# 只能包含字母、数字、特殊符号，不能包含中文
b1 = b"Hello"
b2 = b"123"
b3 = b"!@#"
# b4 = b"你好"  # 报错！bytes字面量不能包含中文
```

### 3.5 乱码问题

::: warning 重要
只要出现乱码，原因只会有一个：**编解码不一致**。
- 用UTF-8编码，必须用UTF-8解码
- 用GBK编码，必须用GBK解码
:::

### 3.6 字节数说明

| 内容 | UTF-8 | GBK |
|:---:|:---:|:---:|
| 英文字母、数字、特殊符号 | 1字节 | 1字节 |
| 中文 | 3字节 | 2字节 |

## 4.端口重用

### 4.1 问题描述

服务器端程序退出后，端口**不会立即释放**。如果立即重启服务器端，会提示端口号被占用。

### 4.2 解决方案

```python
# 设置端口重用
# 参数1：当前的套接字对象
# 参数2：选项名（SO_REUSEADDR = 重用地址）
# 参数3：选项值（True = 开启）
server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, True)
```

### 4.3 说明

- 大多数电脑不用设置也能正常重启
- 建议加上这行代码，避免端口被占用的问题

## 5.运行顺序

::: warning 重要
必须**先启动服务器端**，再启动客户端。否则客户端会连接失败。
:::

**运行步骤：**
1. 先运行服务器端代码（程序会阻塞在 `accept()` 等待客户端连接）
2. 再运行客户端代码
3. 客户端发送数据，服务器端接收并回复
