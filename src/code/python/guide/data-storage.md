---
title: 数据存储与运算
icon: fas:database
order: 3
---

## 1.字面量与变量

### 1.字面量

在程序中，直接书写并表示固定值的常量数据被称为字面量（Literal）。字面量是源代码中直接出现的数值或字符串，不需要通过变量引用。

::: info 举例
如：整数 18、浮点数 8.5、负数 -5、字符串 "Hello World"
:::

#### 类型及书写格式

<style>
.literally-table th,
.literally-table td {
  text-align: center;
}
.literally-table tbody tr {
  background-color: #fff;
}
.literally-table tbody tr:nth-child(1),
.literally-table tbody tr:nth-child(2),
.literally-table tbody tr:nth-child(4),
.literally-table tbody tr:nth-child(6) {
  background-color: #f0f0f0;
}
</style>

<table class="literally-table">
  <thead>
    <tr>
      <th colspan="3" style="text-align:center">字面量类型及书写格式</th>
    </tr>
    <tr>
      <th>字面量类型</th>
      <th>说明</th>
      <th>书写格式</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">数字类型</td>
      <td>整数(int)</td>
      <td><code>10</code>、<code>18</code>、<code>-5</code>、<code>0</code></td>
    </tr>
    <tr>
      <td>浮点数 / 小数(float)</td>
      <td><code>8.5</code>、<code>3.14</code>、<code>1.0</code>、<code>-3.5</code></td>
    </tr>
    <tr>
      <td>布尔(bool)</td>
      <td>表示逻辑真假值</td>
      <td><code>True</code>、<code>False</code></td>
    </tr>
    <tr>
      <td>字符串(str)</td>
      <td>描述文本的一种数据类型</td>
      <td><code>"人生苦短，我用 Python"</code></td>
    </tr>
    <tr>
      <td>空值(NoneType)</td>
      <td>表示空值或无值，仅包含一个值 <code>None</code></td>
      <td><code>None</code></td>
    </tr>
    <tr>
      <td>数据容器</td>
      <td>存储多项数据的容器类型</td>
      <td>列表、元组、集合、字典</td>
    </tr>
  </tbody>
</table>

::: info 说明
布尔类型本质就是数字类型，在涉及到数学运算时，会自动将 True 转为1，False 转为0。
:::

### 2.变量

程序中用来存储单个数据的容器，通常会把经常发生变化的数据存储在变量中。

::: warning
变量是存储数据的容器（内存空间），而非容器中存储的数据本身。
:::

#### 2.1 定义格式

变量名 = 变量的值

 - 变量名：每一个容器(空间)的名字
 - 赋值：表示将等号右侧的值，赋予左侧的变量
 - 变量值：每一个变量都有自己存储的值（数据）

::: tip 说明
Python 是动态类型语言，在程序运行时才进行类型检查，变量的类型可以在程序运行过程中改变（一个变量可以接收不同类型的值）。
:::

#### 2.2 注意事项

1. 一个变量只能存储一个值
2. 变量定义的时候必须赋值才可以使用
3. 一条语句可以定义多个变量，也可以连续赋值（a,b = 1,"Python"）

### 3.标识符

程序员在代码中为变量、函数、类等元素所起的名字。

#### 3.1 命名规则（规定）

1. 只能包含字母（a-z，A-Z）、数字（0-9）、下划线（_）

2. 不能以数字开头

3. 不能使用关键字：True、False、None、and、or、not、if、else、elif、for、while 等

4. 严格区分大小写，比如：age，Age，AGE 是三个变量

#### 3.2 命名规范（变量）

1. 见名知意

2. 多个部分使用下划线连接

3. 英文字母全小写

#### 3.3 PEP8

PEP 是 Python 社区的核心技术文档和标准化机制，而 [PEP8](https://peps.python.org/pep-0008) 是 Python 的代码风格指南。

### 4.案例

1. 现有两个变量，分别为：a = 10，b = 20，现需要将这两个变量值交换，然后输出到控制台。

```python title = "01.字面量与变量.py"
a = 10
b = 20
temp = a
a = b
b = temp
print(a, b)
```

2. 现有三个变量，分别为：a = 100，b = 200，c = 300，现需要将这三个变量值进行交换，将a,b,c的值分别赋值给c,a,b，并将其输出到控制台。

```python title = "01.字面量与变量.py"
a, b, c = 100, 200, 300
temp = c
c = a
a = temp
temp = b
b = a
a = temp
print(c, a, b)
```

## 2.常见数据类型

### 1.常见的基础数据类型

| 标准名称 | 描述 | 说明 |
| :---: | :---: | :---: |
| int | 整数 | 数字类型，存放整数，如: 10 -5 |
| float | 浮点数 | 手工业者类型，存放小数 |
| str | 字符串 | 用引号引起来的都是字符串，如: "Python" |
| bool | 布尔 | 布尔类型，描述真和假，如: True False |
| NoneType | 空值 | 表示空或无值，仅包含一个值 None |

### 2.查看数据的实际类型

1. 通过 type() 语句来得到数据的类型，具体语法为：type(要查看类型的数据)

2. 通过 isinstance() 检查数据是否属于指定的类型，返回的是一个bool值，具体语法为：isinstance(数据, 类型)

::: info 说明
变量本身是没有类型的，type(变量) 输出的类型是 **变量中存储的数据** 的类型。
:::

## 3.字符串

