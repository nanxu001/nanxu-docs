---
title: 正则表达式
icon: fas:asterisk
order: 3
---

## 1.正则表达式入门

### 1.1 什么是正则表达式

正则表达式（Regular Expression，简称 RE）是一种由特定语法规则组成的文本模式，用于描述、匹配、查找和替换字符串中的特定内容。

**作用：**
- 从字符串中提取特定格式的数据
- 验证字符串是否符合指定格式
- 替换字符串中的特定内容

### 1.2 re 模块

Python 提供了 `re` 标准库来支持正则表达式操作：

```python title="06.正则表达式-入门.py"
import re
```

### 1.3 常用函数

**re.match()** - 从字符串开头匹配：

```python title="06.正则表达式-入门.py"
import re

s = "18809090000是我的手机号"

# match - 从字符串的开头开始匹配（匹配第一个匹配项）
result = re.match(r"1[3-9]\d{9}", s)
print(result.group())  # 18809090000
print(result.span())   # (0, 11)
print(result.start())  # 0
print(result.end())    # 11
```

**re.search()** - 搜索第一个匹配项：

```python title="06.正则表达式-入门.py"
s = "我的手机号是18809090000，另一个是18800008888"

# search - 从任意位置开始，搜索第一个匹配项
result = re.search(r"1[3-9]\d{9}", s)
print(result.group())  # 18809090000
```

**re.findall()** - 搜索所有匹配项：

```python title="06.正则表达式-入门.py"
s = "我的手机号是18809090000，另一个是18800008888"

# findall - 从任意位置开始，搜索所有匹配项
result = re.findall(r"1[3-9]\d{9}", s)
print(result)  # ['18809090000', '18800008888']
```

**返回值对比：**

| 函数 | 返回值 | 说明 |
|:---:|:---:|:---:|
| `re.match()` | Match 对象 | 从开头匹配，失败返回 None |
| `re.search()` | Match 对象 | 搜索第一个匹配，失败返回 None |
| `re.findall()` | 列表 | 搜索所有匹配，返回字符串列表 |

::: info 说明
建议在正则表达式前加 `r` 前缀，表示原始字符串，避免转义字符问题。
:::

## 2.正则表达式语法

### 2.1 字符匹配

**普通字符：** 直接匹配自身，如字母、数字、汉字等。

**特殊字符：**

| 字符 | 说明 | 示例 |
|:---:|:---:|:---:|
| `.` | 匹配任意字符（除换行符） | `a.c` 匹配 "abc"、"a1c" |
| `\d` | 匹配数字 `[0-9]` | `\d+` 匹配 "123" |
| `\D` | 匹配非数字 | `\D+` 匹配 "abc" |
| `\w` | 匹配单词字符 `[a-zA-Z0-9_]` | `\w+` 匹配 "hello_123" |
| `\W` | 匹配非单词字符 | `\W` 匹配 "!"、"@" |

```python title="07.正则表达式-语法.py"
import re

s1 = "18809090000是我的手机号，你记住了吗？我的另一个手机号是18800008888"

# . 匹配任意字符
print(re.findall(r"188.", s1))   # ['1880', '1880']

# \d 匹配数字
print(re.findall(r"188\d", s1))  # ['1880', '1880']

# \D 匹配非数字
print(re.findall(r"188\D", s1))  # ['188是']
```

### 2.2 字符类 `[]`

使用方括号定义字符类，匹配其中的任意单个字符：

| 语法 | 说明 | 示例 |
|:---:|:---:|:---:|
| `[abc]` | 匹配 a、b、c 中的任意一个 | `[aeiou]` 匹配元音字母 |
| `[^abc]` | 匹配除 a、b、c 外的任意字符 | `[^0-9]` 匹配非数字 |
| `[a-z]` | 匹配 a 到 z 的范围 | `[a-z]` 匹配小写字母 |

```python title="07.正则表达式-语法.py"
s = "我的手机号是18809090000，另一个是15500008888"

# [138] 匹配 1、3、8 中的任意一个
print(re.findall(r"1[38]\d{9}", s))  # ['18809090000']

# [3-9] 匹配 3 到 9 的范围
print(re.findall(r"1[3-9]\d{9}", s))  # ['18809090000', '15500008888']

# [^38] 匹配除 3、8 外的任意字符
print(re.findall(r"1[^38]\d{8}", s))  # ['15500008888']
```

### 2.3 量词

量词用于指定字符或子表达式出现的次数：

| 量词 | 说明 | 示例 |
|:---:|:---:|:---:|
| `*` | 零次或多次 | `ab*` 匹配 "a"、"ab"、"abb" |
| `+` | 一次或多次 | `ab+` 匹配 "ab"、"abb" |
| `?` | 零次或一次 | `ab?` 匹配 "a"、"ab" |
| `{n}` | 恰好 n 次 | `\d{11}` 匹配 11 位数字 |
| `{n,}` | 至少 n 次 | `\d{3,}` 匹配 3 位及以上数字 |
| `{n,m}` | n 到 m 次 | `\d{3,5}` 匹配 3 到 5 位数字 |

```python title="07.正则表达式-语法.py"
s = "18809090000是我的手机号，188开头的，以00结尾的"

# * 匹配任意个
print(re.findall(r"188.*", s))   # ['18809090000是我的手机号，188开头的，以00结尾的']

# + 匹配1个或多个
print(re.findall(r"188.+", s))   # ['18809090000是我的手机号，188开头的，以00结尾的']

# ? 匹配0个或1个
print(re.findall(r"188.?", s))   # ['1880']

# {n} 匹配n个
print(re.findall(r"188\d{8}", s))  # ['18809090000']

# {n,m} 匹配n到m个
print(re.findall(r"188\d{6,10}", s))  # ['18809090000']
```

### 2.4 分组与边界

| 语法 | 说明 | 示例 |
|:---:|:---:|:---:|
| `()` | 分组，捕获匹配内容 | `(ab)+` 匹配 "ab"、"abab" |
| `\|` | 或，匹配左右任意表达式 | `cat\|dog` 匹配 "cat" 或 "dog" |
| `^` | 匹配字符串开头 | `^1` 匹配以 1 开头 |
| `$` | 匹配字符串结尾 | `00$` 匹配以 00 结尾 |

```python title="07.正则表达式-语法.py"
s = "我的手机号是18809090000，邮箱是python666@163.com"

# ^ 匹配开头
print(re.findall(r"^1[3-9]\d{9}", s))  # []

# $ 匹配结尾
print(re.findall(r"1[3-9]\d{9}$", s))  # []

# () 分组捕获
s2 = "现在的时间是2026-04-08 20:57:40"
print(re.findall(r"(\d{4})-(\d{2})-(\d{2})", s2))  # [('2026', '04', '08')]
```

### 2.5 贪婪与非贪婪

默认情况下，量词是**贪婪**的，会尽可能多地匹配。在量词后加 `?` 可变为**非贪婪**模式：

| 模式 | 说明 |
|:---:|:---:|
| `*` | 贪婪：尽可能多匹配 |
| `*?` | 非贪婪：尽可能少匹配 |
| `+` | 贪婪：尽可能多匹配 |
| `+?` | 非贪婪：尽可能少匹配 |

## 3.数据清洗应用

在网络机器人抓取数据后，通常需要对原始数据进行清洗处理。

### 3.1 年份处理

去除年份中的括号：

```python title="08.网络机器人-案例(优化).py"
def get_movie_year(movie_year):
    """获取电影年份，去除括号"""
    movie_year = movie_year[0].strip() if movie_year else ""
    return movie_year.replace("(", "").replace(")", "")
```

### 3.2 上映时间处理

使用正则表达式提取日期部分：

```python title="08.网络机器人-案例(优化).py"
import re

def get_movie_release_date(movie_release_date):
    """获取电影上映时间，提取日期部分"""
    movie_release_date = movie_release_date[0].strip() if movie_release_date else ""
    return re.search(r"\d{4}-\d{2}-\d{2}", movie_release_date).group()
```

### 3.3 时长处理

将小时和分钟格式转换为总分钟数：

```python title="08.网络机器人-案例(优化).py"
import re

def get_movie_duration(movie_duration):
    """获取电影时长，转换为分钟数"""
    movie_duration = movie_duration[0].strip() if movie_duration else ""

    # 提取小时和分钟
    hour = re.search(r"(\d*)h", movie_duration)
    minute = re.search(r"(\d*)m", movie_duration)

    # 转换为整数，不存在则为 0
    hour = int(hour.group(1)) if hour else 0
    minute = int(minute.group(1)) if minute else 0

    # 计算总分钟数
    return 60 * hour + minute
```

::: info 说明
- `re.search(r"(\d*)h", movie_duration)` 匹配 "2h" 中的 "2"
- `group(1)` 获取分组中捕获的内容
- 如果未匹配到，返回 None，使用三元表达式处理
:::
