---
title: Socket编程入门
icon: fas:plug
order: 2
---

## 1.Socket概念

### 1.1 什么是Socket

网络编程也叫**Socket编程**，通信双方都拥有自己的Socket对象，数据在两个Socket之间通过字节流（TCP协议）或数据包（UDP协议）进行传输。

::: info 比喻
Socket就像手机：
- 你和朋友聊天，看起来是两个人在交互
- 其实是通过两部手机来交互的
- 这个手机就可以理解为Socket对象
:::

### 1.2 Socket的应用场景

- QQ、微信等聊天软件
- 网络传输
- 只要涉及到网络传输，底层一定要用到Socket

## 2.创建Socket对象

### 2.1 导入socket模块

```python
import socket
```

### 2.2 创建Socket对象

```python title="01.创建socket对象.py"
import socket

# 参数1：Address Family，地址簇，IPV4还是IPV6
# 参数2：Socket Type，套接字类型，TCP还是UDP
tcp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
print(tcp_socket)
```

### 2.3 参数说明

| 参数 | 含义 | 可选值 | 说明 |
|:---:|:---:|:---:|:---:|
| 参数1 | Address Family（地址族） | `socket.AF_INET` | IPV4（默认） |
| | | `socket.AF_INET6` | IPV6 |
| 参数2 | Socket Type（套接字类型） | `socket.SOCK_STREAM` | TCP（默认） |
| | | `socket.SOCK_DGRAM` | UDP |

::: warning 注意
模块名不要命名为 `socket.py`，否则会与内置模块冲突，导致找不到包。
:::

## 3.TCP开发流程概述

### 3.1 服务器端流程

```
1. 创建Socket对象
2. 绑定IP和端口号（bind）
3. 设置最大监听数（listen）
4. 等待客户端连接（accept）
5. 收发数据（send/recv）
6. 关闭连接（close）
```

### 3.2 客户端流程

```
1. 创建Socket对象
2. 连接服务器（connect）
3. 收发数据（recv/send）
4. 关闭连接（close）
```

### 3.3 服务器端与客户端对比

| 步骤 | 服务器端 | 客户端 |
|:---:|:---:|:---:|
| 1 | 创建Socket对象 | 创建Socket对象 |
| 2 | bind（绑定IP和端口号） | connect（连接服务器） |
| 3 | listen（设置最大监听数） | - |
| 4 | accept（等待客户端连接） | - |
| 5 | send/recv（收发数据） | recv/send（收发数据） |
| 6 | close（关闭连接） | close（关闭连接） |

::: tip 详细代码
完整的TCP通信代码示例请参考 [TCP通信案例](tcp-communication.md)。
:::

## 4.常见问题

### 4.1 模块命名冲突

不要将Python文件命名为 `socket.py`，否则会与内置的socket模块冲突。

### 4.2 accept()阻塞

`accept()` 方法会阻塞，直到有客户端连接。如果没有客户端连接，服务器端会一直等待。
