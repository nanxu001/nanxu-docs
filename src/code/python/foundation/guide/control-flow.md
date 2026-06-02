---
title: 流程控制语句
icon: fas:code-branch
order: 4
---

## 1.if 条件判断

场景：只有满足指定条件，才会执行对应的代码逻辑。比如 B 站登录时，需要判断账号密码是否正确，根据结果执行不同的操作。

### 1.1 基本格式

```python
if 要判断的条件:
    条件成立时，要执行的操作
```

**示例**：高考分数超过 680 分就去清华。

```python title = "05.if条件判断.py"
score = 700
if score > 680:
    print("欢迎你来清华读书")
    print("也恭喜即将踏入精彩的大学生活")
print("--------------------")
```

运行结果（score = 700，条件成立）：

```
欢迎你来清华读书
也恭喜即将踏入精彩的大学生活
--------------------
```

将 `score` 改为 600，条件不成立，if 代码块内的代码不执行：

```
--------------------
```

::: info 说明
- `if` 是关键字，后面加空格写判断条件，条件结果必须是布尔类型（`True` / `False`）
- 条件后面必须有英文冒号 `:`
- 归属于 `if` 的代码块需要缩进，Python 通过缩进来描述代码的层级关系（归属）
- 缩进建议 **4个空格**，PyCharm 中按 **Tab 键**会自动转为4个空格
:::

**代码块**：if 条件判断及条件成立后的代码，整体称为一个**代码块**，是一个独立的执行单元。同一代码块内的缩进必须一致，多缩进或少缩进一个空格都会报错。

### 1.2 if...else...

如果条件成立执行操作1，否则执行操作2。适用于"不是 A 就是 B"的二选一场景。

```python
if 要判断的条件:
    条件成立时，执行对应的操作1
else:
    条件不成立时，执行的操作2
```

**案例**：B 站登录，正确账号密码为 `18888888888` / `666888`。

```python title = "05.if条件判断.py"
ok_account = "18888888888"
ok_password = "666888"

account = input("请输入B站账号：")
password = input("请输入B站密码：")

if account == ok_account and password == ok_password:
    print("登录成功~")
    print("进入B站首页~")
else:
    print("登录失败!")
    print("用户名或密码错误!")
```

运行结果（账号密码正确）：

```
请输入B站账号：18888888888
请输入B站密码：666888
登录成功~
进入B站首页~
```

运行结果（密码错误）：

```
请输入B站账号：18888888888
请输入B站密码：123456
登录失败!
用户名或密码错误!
```

::: info 说明
`else` 不需要条件判断，当 `if` 条件不成立时自动执行。
:::

### 1.3 if...elif...else

多个条件依次判断，满足任意一个即执行对应操作，不再判断后续条件。适用于"多种情况选一个"的场景。

```python
if 条件1:
    操作1
elif 条件2:
    操作2
else:
    操作3
```

**示例**：判断数字是正数、负数还是零。

```python title = "05.if条件判断.py"
num = int(input("请输入数字："))
if num > 0:
    print(f"{num} 是正数")
elif num < 0:
    print(f"{num} 是负数")
else:
    print(f"{num} 是零")
```

运行结果：

```
请输入数字：-5
-5 是负数
```

::: warning 注意
从上到下依次判断，前面条件成立后，后续条件便不再判断。`elif` 可以写多个，`else` 可有可无，如果有必须放在最后。
:::

### 1.4 综合案例：三角形类型判断

根据输入的三个边长，判断是等边三角形、等腰三角形、普通三角形，还是不能构成三角形。

**需求分析**：
- 构成三角形的条件：任意两边之和大于第三边
- 等边三角形：三个边都相等
- 等腰三角形：两个边相等
- 普通三角形：三个边都不相等

**实现步骤**：
1. 接收输入的三角形三个边的边长
2. 判断是否能构成三角形
3. 如果能构成，再判断三角形类型

```python title = "05.if条件判断.py"
a = int(input("请输入第一条边："))
b = int(input("请输入第二条边："))
c = int(input("请输入第三条边："))

if a + b > c and a + c > b and b + c > a:
    if a == b == c:
        print("等边三角形")
    elif a == b or a == c or b == c:
        print("等腰三角形")
    else:
        print("普通三角形")
else:
    print("不能构成三角形")
```

运行结果：

```
请输入第一条边：3
请输入第二条边：3
请输入第三条边：3
等边三角形
```

::: tip 多行注释
在 Python 中，可以使用三引号 `"""` 进行多行注释：
```python
"""
这是多行注释
可以注释多行内容
"""
```
:::

## 2.match 模式匹配

当多个条件都是**等值匹配**时，用 `if...elif` 会重复写 `变量 == 值`，比较繁琐。Python 3.10 提供了 `match...case` 结构模式匹配来简化这类场景。

### 2.1 基本语法

```python
match 要匹配的变量:
    case 值1:
        操作1
    case 值2:
        操作2
    case _:
        默认操作
```

执行流程：从上到下依次匹配，匹配成功即执行对应操作，不再继续匹配后续 `case`。

```python title = "06.match模式匹配.py"
day = input("请输入星期(1-7)：")
match day:
    case "1":
        print("周一：工作会议日")
    case "2":
        print("周二：学习培训日")
    case "3":
        print("周三：项目开发日")
    case "4":
        print("周四：代码审查日")
    case "5":
        print("周五：总结规划日")
    case "6" | "7":
        print("周末：休息放松")
    case _:
        print("输入有误！")
```

::: info 说明
- `case "6" | "7"`：`|` 表示"或"，匹配多个值中的任意一个
- `case _`：下划线匹配其他所有情况，相当于 `else`，可有可无
- `match...case` 是 Python 3.10 新增语法，早期版本不支持
- `match` 后面的表达式会从上到下依次与 `case` 匹配，匹配成功即执行对应操作，不再继续匹配
:::

### 2.2 案例：简易计算器

`case` 后面可以加 `if 条件`，只有条件成立时才匹配该 `case`。

```python title = "06.match模式匹配.py"
num1 = float(input("请输入第一个数："))
num2 = float(input("请输入第二个数："))
oper = input("请输入运算符（+ - * /）：")

match oper:
    case "+":
        print(f"{num1} + {num2} = {num1 + num2}")
    case "-":
        print(f"{num1} - {num2} = {num1 - num2}")
    case "*":
        print(f"{num1} * {num2} = {num1 * num2}")
    case "/" if num2 != 0:
        print(f"{num1} / {num2} = {num1 / num2}")
    case _:
        print("输入有误！")
```

::: warning 注意
`case "/" if num2 != 0` 表示只有运算符是 `/` **且** `num2` 不为零时才匹配。如果 `num2` 为零，该 `case` 不匹配，会继续往下走到 `case _`。
:::

### 2.3 match 与 if 的选择

| 场景 | 推荐 |
|:---:|:---:|
| 变量匹配固定值（等值比较） | `match...case` |
| 范围比较（`>`、`<`、`>=`） | `if...elif` |
| 复杂逻辑、组合条件 | `if...elif` |

## 3.while 循环

循环就是重复执行某段代码。Python 中有 `while` 和 `for` 两种循环方式。

### 3.1 基本语法

```python
while 条件表达式:
    循环体语句
```

执行流程：先判断条件，为 `True` 则执行循环体，执行完再回来判断条件，直到条件为 `False` 时退出循环。

```python title = "07.while循环.py"
i = 0
while i < 10:
    print("人生苦短，我用Python")
    i += 1
```

::: warning 注意
- 条件表达式的结果必须是布尔类型
- 循环体需要缩进
- 必须规划好循环终止条件，否则会陷入**死循环**（条件一直为 `True`）
- 循环体中必须有改变条件的语句（如 `i += 1`），否则条件永远为 `True`
:::

`while` 后面可以跟 `else`，循环正常结束后执行：

```python title = "07.while循环.py"
i = 0
while i < 10:
    print("人生苦短，我用Python")
    i += 1
else:
    print("循环结束")
```

::: info 说明
`else` 中的代码只有在循环**正常结束**（条件为 `False`）时才会执行。如果循环被 `break` 强制终止，`else` 不会执行。
:::

### 3.2 案例：1-100 偶数累加

```python title = "07.while循环.py"
j = 1
total = 0
while j <= 100:
    if j % 2 == 0:
        total += j
    j += 1
else:
    print(f"1-100之间所有偶数的累加之和：{total}")
```

运行结果：

```
1-100之间所有偶数的累加之和：2550
```

## 4.for 循环

`for` 循环本质是**轮询遍历**机制，对一批数据逐个处理，数据处理完循环就结束。适用于遍历数据集或已知循环次数的场景。

### 4.1 基本语法

```python
for 元素 in 待处理数据集:
    循环体语句
```

遍历字符串中的每个字符：

```python title = "08.for循环.py"
msg = "Hello Python"
for i in msg:
    print(i)
else:
    print("遍历结束")
```

运行结果：

```
H
e
l
l
o

P
y
t
h
o
n
遍历结束
```

::: info 说明
- `for` 从数据集中逐个取出元素，赋值给变量 `i`，数据集遍历完循环自动结束
- `else` 可选，循环正常结束后执行
- 字符串也是数据集，遍历时会逐个取出每个字符
:::

### 4.2 range 语句

`range` 用于生成指定规则的数字序列，配合 `for` 循环使用。

| 用法 | 说明 | 示例 |
|:---:|:---:|:---:|
| `range(end)` | 0 到 end（不含 end） | `range(5)` → `0,1,2,3,4` |
| `range(start, end)` | start 到 end（不含 end） | `range(2,8)` → `2,3,4,5,6,7` |
| `range(start, end, step)` | 步长为 step | `range(0,10,2)` → `0,2,4,6,8` |

```python title = "08.for循环.py"
# 计算 100-500 之间所有 3 的倍数之和
total = 0
for e in range(100, 501):
    if e % 3 == 0:
        total += e
print(f"100-500之间所有3的倍数之和：{total}")
```

### 4.3 for 与 while 的选择

| 场景 | 推荐 |
|:---:|:---:|
| 遍历数据集（字符串、列表等） | `for` |
| 已知循环次数 | `for` + `range` |
| 条件控制循环（次数未知） | `while` |

### 4.4 嵌套循环

在循环体中再写一个循环，外层循环控制行，内层循环控制列。

**案例**：九九乘法表。

```python title = "08.for循环.py"
for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j} * {i} = {i * j}", end="\t")
    print()
```

运行结果：

```
1 * 1 = 1
1 * 2 = 2   2 * 2 = 4
1 * 3 = 3   2 * 3 = 6   3 * 3 = 9
1 * 4 = 4   2 * 4 = 8   3 * 4 = 12  4 * 4 = 16
...
```

::: info 说明
`end="\t"` 表示输出后不换行，而是加一个 Tab 缩进。`print()` 空调用表示换行。
:::

### 4.5 break 与 continue

`break` 和 `continue` 只能用在循环中，用于控制循环的执行流程。

| 关键字 | 作用 |
|:---:|:---|
| `break` | 结束整个循环，跳出循环体 |
| `continue` | 跳过本次循环，直接进入下一次循环 |

**break 示例**：找到第一个能被7整除的数就停止

```python title = "08.for循环.py"
for i in range(1, 100):
    if i % 7 == 0:
        print(f"找到：{i}")
        break
```

运行结果：

```
找到：7
```

**continue 示例**：跳过偶数，只打印奇数

```python title = "08.for循环.py"
for i in range(1, 11):
    if i % 2 == 0:
        continue
    print(i)
```

运行结果：

```
1
3
5
7
9
```

### 4.6 综合案例：猜数字游戏

系统随机生成一个数字，用户反复猜测，猜对为止。

```python title = "08.for循环.py"
import random

answer = random.randint(1, 100)

while True:
    guess = int(input("请猜一个数字（1-100）："))
    if guess > answer:
        print("猜大了！")
    elif guess < answer:
        print("猜小了！")
    else:
        print("恭喜你，猜对了！")
        break
```

运行结果：

```
请猜一个数字（1-100）：50
猜大了！
请猜一个数字（1-100）：25
猜小了！
请猜一个数字（1-100）：37
恭喜你，猜对了！
```

::: warning 注意
`while True` 表示条件永远为 `True`，是死循环，需要在循环体内用 `break` 退出。
:::

::: tip while True 使用场景
当不确定循环次数，只知道循环退出条件时，使用 `while True` + `break`：
- 用户登录：直到登录成功才退出
- 猜数字游戏：直到猜对才退出
- 菜单选择：直到选择退出才结束
:::
