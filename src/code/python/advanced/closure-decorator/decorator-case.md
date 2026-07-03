---
title: 装饰器案例
icon: fas:puzzle-piece
order: 3
---

## 1.装饰器案例概述

### 1.1 五种应用场景

装饰器可以装饰不同类型的原函数：

| 场景 | 说明 |
|:---:|:---:|
| 无参无返回值 | 最简单的装饰场景 |
| 有参无返回值 | 原函数需要接收参数 |
| 无参有返回值 | 原函数需要返回结果 |
| 有参有返回值 | 最常见的装饰场景 |
| 可变参数 | 通用装饰器写法 |

### 1.2 核心原则

**装饰器的内部函数格式要和被装饰的原函数保持一致。**

- 原函数是无参无返回的，装饰器的内部函数也必须是无参无返回的
- 原函数是有参有返回的，装饰器的内部函数也必须是有参有返回的
- 原函数是可变参数的，装饰器的内部函数也必须是可变参数的

## 2.无参无返回值的原函数

### 2.1 需求

定义无参无返回值的 `get_sum` 求和函数，在求和结果前添加友好提示"正在努力计算中..."

### 2.2 代码实现

```python title="05.装饰器装饰_无参无返回的原函数.py"
# 1. 定义装饰器
def my_decorator(fn_name):
    def fn_inner():
        print("正在努力计算中...")  # 额外功能
        fn_name()  # 调用原函数
    return fn_inner

# 2. 定义原函数（无参无返回值）
def get_sum():
    a = 10
    b = 20
    sum = a + b
    print(f"求和结果：{sum}")

# 3. 测试
# 传统写法
# get_sum = my_decorator(get_sum)
# get_sum()

# 语法糖
@my_decorator
def get_sum():
    a = 10
    b = 20
    sum = a + b
    print(f"求和结果：{sum}")

get_sum()
```

**执行结果：**

```
正在努力计算中...
求和结果：30
```

### 2.3 格式说明

| 部分 | 格式 |
|:---:|:---:|
| 原函数 | 无参无返回值 |
| 装饰器内部函数 | 无参无返回值 |
| 内部函数 | 与原函数格式保持一致 |

## 3.有参无返回值的原函数

### 3.1 需求

定义有参无返回值的 `get_sum` 求和函数，在求和结果前添加友好提示。

### 3.2 代码实现

```python title="06.装饰器装饰_有参无返回的原函数.py"
# 1. 定义装饰器
def my_decorator(fn_name):
    def fn_inner(a, b):  # 内部函数也要有参数
        print("正在努力计算中...")
        fn_name(a, b)  # 调用原函数并传参
    return fn_inner

# 2. 定义原函数（有参无返回值）
@my_decorator
def get_sum(a, b):
    sum = a + b
    print(f"求和结果：{sum}")

# 3. 测试
get_sum(10, 20)
```

**执行结果：**

```
正在努力计算中...
求和结果：30
```

### 3.3 传参说明

```
调用流程：
1. get_sum(10, 20) → fn_inner(10, 20)
2. fn_inner 中 a=10, b=20
3. fn_name(a, b) → 原函数 get_sum(10, 20)
```

::: warning 注意
内部函数的参数列表要与原函数保持一致，否则调用时会报错。
:::

## 4.无参有返回值的原函数

### 4.1 需求

定义无参有返回值的 `get_sum` 求和函数，在返回结果前添加友好提示。

### 4.2 代码实现

```python title="07.装饰器装饰_无参有返回的原函数.py"
# 1. 定义装饰器
def my_decorator(fn_name):
    def fn_inner():
        print("正在努力计算中...")
        result = fn_name()  # 接收原函数的返回值
        return result  # 返回结果
    return fn_inner

# 2. 定义原函数（无参有返回值）
@my_decorator
def get_sum():
    a = 11
    b = 22
    return a + b

# 3. 测试
sum = get_sum()
print(f"求和结果：{sum}")
```

**执行结果：**

```
正在努力计算中...
求和结果：33
```

### 4.3 返回值说明

```
调用流程：
1. get_sum() → fn_inner()
2. fn_inner 中调用 fn_name() 获取返回值
3. return result 将结果返回给调用者
```

::: info 说明
当原函数有返回值时，内部函数需要：
1. 接收原函数的返回值：`result = fn_name()`
2. 返回结果：`return result`
:::

## 5.有参有返回值的原函数

### 5.1 需求

定义有参有返回值的 `get_sum` 求和函数，在返回结果前添加友好提示。

### 5.2 代码实现

```python title="08.装饰器装饰_有参有返回的原函数.py"
# 1. 定义装饰器
def my_decorator(fn_name):
    def fn_inner(a, b):  # 有参数
        print("正在努力计算中...")
        result = fn_name(a, b)  # 传参并接收返回值
        return result  # 返回结果
    return fn_inner

# 2. 定义原函数（有参有返回值）
@my_decorator
def get_sum(a, b):
    return a + b

# 3. 测试
sum = get_sum(13, 45)
print(f"求和结果：{sum}")
```

**执行结果：**

```
正在努力计算中...
求和结果：58
```

### 5.3 完整流程图

```
步骤1: @my_decorator 装饰 get_sum
       ┌─────────────────────────────────┐
       │ my_decorator(fn_name)           │
       │   fn_name = get_sum (原函数对象) │
       │   return fn_inner (装饰后的函数) │
       └─────────────────────────────────┘

步骤2: get_sum(13, 45) 调用
       ┌─────────────────────────────────┐
       │ fn_inner(13, 45)                │
       │   a=13, b=45                    │
       │   print("正在努力计算中...")      │
       │   result = fn_name(13, 45)      │
       │   return result                 │
       └─────────────────────────────────┘
```

## 6.可变参数的装饰器

### 6.1 需求

定义一个可以计算多个数据和字典 value 值之和的函数，并给其添加友好提示。

### 6.2 代码实现

```python title="09.装饰器装饰_可变参数.py"
# 1. 定义装饰器
def my_decorator(fn_name):
    def fn_inner(*args, **kwargs):  # 可变参数
        print("正在努力计算中...")
        return fn_name(*args, **kwargs)  # 透传参数
    return fn_inner

# 2. 定义原函数（可变参数）
@my_decorator
def get_sum(*args, **kwargs):
    """
    该函数用于计算数字列表和字典value值之和
    args: 数字列表
    kwargs: 字典（键是字符串，值是数字）
    """
    sum = 0
    for i in args:
        sum += i
    for v in kwargs.values():
        sum += v
    return sum

# 3. 测试
result = get_sum(1, 2, 3, a=4, b=5, c=6)
print(f"求和结果：{result}")
```

**执行结果：**

```
正在努力计算中...
求和结果：21
```

### 6.3 通用装饰器

::: tip 推荐写法
使用 `*args, **kwargs` 作为内部函数的参数，可以装饰任意格式的原函数，这是**通用装饰器**的写法。
:::

```python
# 通用装饰器模板
def my_decorator(fn_name):
    def fn_inner(*args, **kwargs):
        # 额外功能
        return fn_name(*args, **kwargs)
    return fn_inner
```

## 7.多个装饰器装饰一个函数

### 7.1 需求

在发表评论前需要先登录，然后再验证验证码，最后才能发表评论。

### 7.2 代码实现

```python title="10.多个装饰器装饰一个函数.py"
# 1. 定义装饰器 - 校验登录
def check_login(fn_name):
    def fn_inner():
        print("校验登录...")
        fn_name()
    return fn_inner

# 2. 定义装饰器 - 校验验证码
def check_code(fn_name):
    def fn_inner():
        print("校验验证码...")
        fn_name()
    return fn_inner

# 3. 定义原函数
@check_login
@check_code
def comment():
    print("发表评论")

# 4. 测试
comment()
```

**执行结果：**

```
校验登录...
校验验证码...
发表评论
```

### 7.3 装饰顺序说明

| 顺序 | 说明 |
|:---:|:---:|
| 装饰顺序 | 由内向外装饰（先装饰 `check_code`，再装饰 `check_login`） |
| 执行顺序 | 从上往下执行（先执行 `check_login`，再执行 `check_code`） |

::: warning 顺序易错点
**语法糖写法：**
```python
@check_login  # 先执行
@check_code   # 后执行
def comment():
    print("发表评论")
```

**传统写法（由内向外）：**
```python
comment = check_code(comment)  # 先装饰
comment = check_login(comment)  # 后装饰
```
:::

### 7.4 传统写法等价形式

```python
# 语法糖写法
@check_login
@check_code
def comment():
    print("发表评论")

# 等价于传统写法
def comment():
    print("发表评论")
comment = check_code(comment)  # 先装饰内层
comment = check_login(comment)  # 再装饰外层
```

## 8.带参数的装饰器

### 8.1 问题引入

如果装饰器需要接收额外参数（如标记是加法还是减法），直接写两个参数会报错：

```python
# 错误写法 - 报错
def my_decorator(fn_name, flag):  # 装饰器只能有一个参数
    def inner(a, b):
        if flag == "+":
            print("正在努力加法中...")
        elif flag == "-":
            print("正在努力减法中...")
        return fn_name(a, b)
    return inner
```

::: warning 重要规则
**装饰器的参数有且只能有一个**（即被装饰的函数名），不能接收多个参数。
:::

### 8.2 @ 后面的区别

| 写法 | @ 后面是什么 | 真正的装饰器 |
|:---:|:---:|:---:|
| `@logging` | 装饰器本身 | `logging` |
| `@logging('+')` | 函数调用 | `logging('+')` 的返回值 `decorator` |

**解释：**
- **不带参数**：`@logging` 中 `logging` 本身就是装饰器，Python 直接拿它去装饰
- **带参数**：`@logging('+')` 中 `logging('+')` 是函数调用，Python 先执行它，算出来的结果（即 `decorator`）才是真正的装饰器，然后再拿去装饰

### 8.3 解决方案：外层包裹函数

在装饰器外边再包裹一层函数，让该函数接收参数，返回**装饰器**。

```python title="11.一个装饰器装饰多个函数.py"
# 1. 定义带参数的装饰器
def logging(flag):
    def decorator(fn_name):
        def inner(a, b):
            if flag == "+":
                print("----正在努力加法中----")
            elif flag == "-":
                print("----正在努力减法中----")
            result = fn_name(a, b)
            return result
        return inner
    return decorator

# 2. 定义原函数
@logging('+')
def add(a, b):
    return a + b

@logging('-')
def subtract(a, b):
    return a - b

# 3. 测试
result = add(1, 3)
print(f"加法结果：{result}")

result = subtract(10, 5)
print(f"减法结果：{result}")
```

**执行结果：**

```
----正在努力加法中----
加法结果：4
----正在努力减法中----
减法结果：5
```

### 8.4 三层结构说明

```
logging('+')          → 最外层：接收参数 flag='+'
    └── decorator(fn_name)  → 中间层：接收被装饰的函数
        └── inner(a, b)     → 最内层：执行装饰逻辑
```

**调用流程：**

1. `logging('+')` 执行，返回 `decorator` 函数
2. `decorator(add)` 执行，返回 `inner` 函数
3. `add(1, 3)` 实际调用 `inner(1, 3)`

### 8.5 优化版：两层结构

利用函数的 `__name__` 属性获取函数名，可以减少一层嵌套。

```python title="12.一个装饰器装饰多个函数_优化版.py"
# 1. 定义装饰器（两层结构）
def my_decorator(fn_name):
    def inner(a, b):
        # 利用 __name__ 属性获取函数名
        if fn_name.__name__ == "add":
            print("----正在努力加法中----")
        elif fn_name.__name__ == "subtract":
            print("----正在努力减法中----")
        result = fn_name(a, b)
        return result
    return inner

# 2. 定义原函数
@my_decorator
def add(a, b):
    return a + b

@my_decorator
def subtract(a, b):
    return a - b

# 3. 测试
result = add(1, 3)
print(f"加法结果：{result}")
```

### 8.6 两种方案对比

| 方案 | 层数 | 特点 |
|:---:|:---:|:---:|
| 外层包裹函数 | 3层 | 语法标准，需要额外参数 |
| 利用 `__name__` 属性 | 2层 | 更简洁，推荐使用 |

::: tip 推荐
实际开发中推荐使用两层结构（优化版），更简洁易懂。但三层结构也需要能看懂，因为别人可能会这样写。
:::

## 9.装饰器案例总结

### 9.1 核心原则

**装饰器的内部函数格式要和被装饰的原函数保持一致。**

### 9.2 五种场景对比

| 场景 | 内部函数参数 | 内部函数返回值 |
|:---:|:---:|:---:|
| 无参无返回值 | 无 | 无 |
| 有参无返回值 | 与原函数一致 | 无 |
| 无参有返回值 | 无 | `return fn_name()` |
| 有参有返回值 | 与原函数一致 | `return fn_name(a, b)` |
| 可变参数 | `*args, **kwargs` | `return fn_name(*args, **kwargs)` |

### 9.3 多个装饰器

- **装饰顺序**：由内向外
- **执行顺序**：从上往下（语法糖）

### 9.4 带参数的装饰器

- 装饰器只能有一个参数（被装饰的函数名）
- 需要额外参数时，在外边包裹一层函数
- 推荐使用 `__name__` 属性简化代码
