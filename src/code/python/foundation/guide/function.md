---
title: 函数
icon: fas:terminal
order: 6
---

## 1.函数基础

### 1.1 函数定义与调用

函数是组织好的、可重复使用的、用来实现特定功能的代码片段。

**定义语法：**

```python
def 函数名(参数列表):
    函数体
    return 返回值
```

**调用语法：**

```python
函数名(参数)
```

::: info 说明
- `def` 是定义函数的关键字
- 函数命名规则与标识符一致（数字、字母、下划线，数字不能开头）
- 函数必须**先定义后调用**
- 函数定义时内部代码不会执行，调用时才执行
- 参数列表和返回值是可选的
:::

**示例：**

```python title = "14.函数基础.py"
# 无参数无返回值
def out_line():
    print("---------------")

out_line()  # 调用函数
```

### 1.2 函数参数与返回值

**形参（形式参数）**：定义函数时括号中指定的参数，只能在函数内部使用。

**实参（实际参数）**：调用函数时实际传入的参数。

```python title = "14.函数基础.py"
# 定义函数时 r 是形参
def circle_area(r):
    return 3.14 * r ** 2

# 调用函数时 4 是实参
print(circle_area(4))  # 50.24
```

::: info 说明
- 形参的顺序需要和实参的顺序保持一致
- 多个参数之间使用逗号分隔
:::

**多参数函数：**

```python
def rectangle_area(length, width):
    return length * width

print(rectangle_area(10, 5))  # 50
```

**多返回值（元组）：**

多个返回值之间使用逗号分隔，会自动封装到元组中：

```python title = "14.函数基础.py"
def circle_area_len(r):
    """
    计算圆的面积和周长
    :param r: 半径
    :return: 面积，周长
    """
    return 3.14 * r ** 2, round(3.14 * r * 2, 1)

# 方式1：使用一个变量接收（元组）
result = circle_area_len(10)
print(result)    # (314.0, 62.8)
print(type(result))  # <class 'tuple'>

# 方式2：使用解包分别接收
area, length = circle_area_len(10)
print(area)    # 314.0
print(length)  # 62.8
```

::: warning
- `return` 语句必须出现在函数体最后一行
- `return` 只有返回功能，没有打印功能
- 多个返回值会自动封装到元组中
- 可以使用解包操作分别获取每个返回值
:::

### 1.3 函数说明文档

使用三引号 `"""` 在函数开头编写说明文档：

```python title = "14.函数基础.py"
def circle_area_len(r):
    """
    计算圆的面积和周长
    :param r: 半径
    :return: 面积，周长
    """
    return 3.14 * r ** 2, round(3.14 * r * 2, 1)

# 查看说明文档
print(help(circle_area_len))
```

::: tip 说明文档格式
- 第一行：函数功能描述
- `:param 参数名: 参数说明`
- `:return: 返回值说明`
:::

**`round()` 函数**：对数字进行四舍五入。

```python
round(3.14159, 2)  # 3.14（保留2位小数）
round(3.14159, 1)  # 3.1（保留1位小数）
```

### 1.4 函数嵌套调用

函数内部可以调用其他函数：

```python
def print_line():
    print("-" * 30)

def print_info():
    print("学生信息：")
    print_line()  # 调用其他函数
    print("姓名：张三")
    print_line()

print_info()
```

## 2.函数进阶

### 2.1 变量作用域

**局部变量**：在函数内部定义的变量，只能在函数内部使用。函数执行完毕后自动销毁。

**全局变量**：在函数外部定义的变量，可以在整个程序中使用（包括函数内部）。

```python
# 全局变量
greeting = "Hello"

def say_hello():
    # 局部变量
    name = "Python"
    print(f"{greeting}, {name}!")

say_hello()  # Hello, Python!
# print(name)  # 报错：name 未定义（局部变量无法在函数外部访问）
```

**`global` 关键字**：在函数内部修改全局变量。

```python
count = 0

def increment():
    global count
    count += 1

increment()
print(count)  # 1
```

::: warning
- 形参也是局部变量，只能在函数内部使用
- 函数内部可以访问全局变量，但不能直接修改（需要 `global` 关键字）
:::

### 2.2 传参方式

**位置参数**：按参数顺序传递。

```python
def greet(name, message):
    print(f"{name}, {message}!")

greet("张三", "你好")  # 张三, 你好!
```

**关键字参数**：通过参数名指定值。

```python
greet(message="你好", name="张三")  # 张三, 你好!
```

### 2.3 默认参数

定义函数时可以为参数设置默认值：

```python
def greet(name, message="你好"):
    print(f"{name}, {message}!")

greet("张三")          # 张三, 你好!
greet("张三", "早上好")  # 张三, 早上好!
```

::: warning
默认参数必须在非默认参数之后：
```python
# 正确
def func(a, b=10):
    pass

# 错误
# def func(a=10, b):
#     pass
```
:::

### 2.4 不定长参数

**`*args`**：接收任意数量的位置参数，存储为元组。

```python
def calc_sum(*args):
    return sum(args)

print(calc_sum(1, 2, 3))      # 6
print(calc_sum(1, 2, 3, 4, 5))  # 15
```

**`**kwargs`**：接收任意数量的关键字参数，存储为字典。

```python
def print_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

print_info(name="张三", age=20, city="北京")
```

**混合使用：**

```python
def func(a, b, *args, **kwargs):
    print(f"a={a}, b={b}")
    print(f"args={args}")
    print(f"kwargs={kwargs}")

func(1, 2, 3, 4, x=5, y=6)
```

### 2.5 参数类型（函数作为参数）

函数可以作为参数传递给另一个函数：

```python
def add(x, y):
    return x + y

def subtract(x, y):
    return x - y

def calc(x, y, oper):
    return oper(x, y)

print(calc(10, 5, add))       # 15
print(calc(10, 5, subtract))  # 5
```

### 2.6 匿名函数（lambda 表达式）

**语法：** `lambda 参数: 表达式`

匿名函数是没有名字的函数，只能包含**一行表达式**，适用于简单的函数逻辑。

```python
# 普通函数
def add(x, y):
    return x + y

# lambda 表达式
add = lambda x, y: x + y
print(add(10, 15))  # 25
```

**使用场景：**

```python
# 排序时指定 key
data_list = ["C++", "C", "python", "Jack", "PHP", "Java"]
data_list.sort(key=lambda item: len(item), reverse=True)
print(data_list)  # ['python', 'Java', 'Jack', 'C++', 'PHP', 'C']
```

### 2.7 递归

函数调用自身称为递归。

**阶乘公式**：`n! = n × (n-1)!`，其中 `1! = 1`

```python
def factorial(num):
    if num == 1:
        return 1
    else:
        return num * factorial(num - 1)

print(factorial(5))  # 120 (5! = 5*4*3*2*1)
```

::: warning
递归必须有明确的终止条件，否则会导致无限递归。
:::

## 3.综合案例

### 3.1 学生成绩处理

```python
def calc_score(*scores):
    """
    计算学生平均分
    :param scores: 成绩列表
    :return: 平均分
    """
    return sum(scores) / len(scores)

def get_grade(avg_score):
    """
    根据平均分获取等级
    :param avg_score: 平均分
    :return: 等级
    """
    if avg_score >= 90:
        return "优秀"
    elif avg_score >= 80:
        return "良好"
    elif avg_score >= 60:
        return "及格"
    else:
        return "不及格"

# 使用
scores = (85, 92, 78, 95, 88)
avg = calc_score(*scores)
grade = get_grade(avg)
print(f"平均分：{avg:.1f}，等级：{grade}")
```

### 3.2 订单价格计算

**需求**：根据传入的商品信息、优惠信息和运费信息，计算订单总金额。

**规则**：
- 优惠券需要商品金额满 5000 后才能使用，且不能超过商品总价
- 积分抵扣需要商品金额满 5000 后才能使用，100 积分抵扣 1 元，且只能整百抵扣

```python
def calc_order_price(*args, coupon=0, score=0, express=0):
    """
    计算订单总金额
    :param args: 商品信息元组 (名称, 单价, 数量)
    :param coupon: 优惠券金额
    :param score: 积分
    :param express: 运费
    :return: 总金额
    """
    # 计算商品总价
    amount = sum([arg[1] * arg[2] for arg in args])

    # 使用优惠券
    if amount >= 5000 and coupon > 0:
        amount -= coupon

    # 使用积分
    if amount >= 5000 and score > 0:
        amount -= score // 100

    # 加运费
    amount += express

    return amount

# 使用
total = calc_order_price(
    ("鼠标", 188, 2),
    ("键盘", 388, 1),
    ("显示器", 2999, 1),
    coupon=100,
    score=4000,
    express=9.9
)
print(f"订单总金额：{total}")  # 3522.9
```
