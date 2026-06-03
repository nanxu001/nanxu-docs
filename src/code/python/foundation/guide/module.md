---
title: 模块
icon: fas:puzzle-piece
order: 7
---

## 1.模块基础

### 1.1 什么是模块

模块是 Python 程序开发的基本组织单位。每个以 `.py` 结尾的 Python 文件都是一个模块。

**模块的作用**：
- 提高代码的可读性和可维护性
- 便于团队协作开发
- 实现代码复用

**模块中可以包含**：
- 变量
- 函数
- 类
- 任何可执行代码

::: info 说明
在实际项目开发中，不会将所有代码写在一个 Python 文件中，而是根据功能和职责拆分为多个模块。
:::

**Python 内置模块（标准库）**：

| 模块 | 用途 |
|:---:|:---:|
| `math` | 数学运算 |
| `random` | 随机数操作 |
| `os` | 操作系统相关信息 |
| `sys` | 系统参数信息 |
| `datetime` | 日期时间操作 |
| `csv` | CSV 文件操作 |

### 1.2 导入模块

Python 提供了多种导入模块的方式：

**方式一：导入整个模块**

```python
import 模块名
import 模块名1, 模块名2
```

调用方式：`模块名.功能名`

```python title = "module01/01.导入模块.py"
import random

print(random.randint(1, 100))
```

**方式二：导入模块并起别名**

```python
import 模块名 as 别名
```

```python title = "module01/01.导入模块.py"
import random as rd

print(rd.randint(1, 100))
```

**方式三：导入模块中的指定功能**

```python
from 模块名 import 功能名
from 模块名 import 功能名1, 功能名2
```

调用方式：直接使用 `功能名`

```python title = "module01/01.导入模块.py"
from random import randint

print(randint(1, 100))
```

**方式四：导入功能并起别名**

```python
from 模块名 import 功能名 as 别名
```

```python
from random import randint as rint

print(rint(1, 100))
```

**方式五：导入模块中的所有功能**

```python
from 模块名 import *
```

```python title = "module01/01.导入模块.py"
from random import *

print(randint(1, 100))
```

::: warning
使用 `from 模块名 import *` 会导入模块中的所有功能，可能会导致命名冲突，建议谨慎使用。
:::

### 1.3 调用方式

| 导入方式 | 调用方式 |
|:---:|:---:|
| `import 模块名` | `模块名.功能名` |
| `import 模块名 as 别名` | `别名.功能名` |
| `from 模块名 import 功能名` | `功能名` |
| `from 模块名 import 功能名 as 别名` | `别名` |

## 2.自定义模块

### 2.1 创建模块

创建一个 `.py` 文件，定义变量、函数或类即可。

```python title = "module02/my_function.py"
# 常量（全大写命名）
PI = 3.14159
NAME = "Python"

# 函数
def log_separator1():
    print("-" * 30)

def log_separator2():
    print("=" * 30)
```

::: tip 命名规范
- 模块文件名建议使用英文，遵循标识符规范（不建议使用中文）
- 常量命名使用全大写字母，多个单词用下划线分隔
- Python 中没有严格意义的常量，全大写只是命名规范，表示不应修改
:::

### 2.2 导入自定义模块

导入方式与内置模块相同，以文件名作为模块名。

```python title = "module02/main.py"
# 导入整个模块
import my_function

my_function.log_separator1()
print(my_function.PI)

# 导入指定功能
from my_function import log_separator1, PI

log_separator1()
print(PI)
```

## 3.包（package）

### 3.1 什么是包

包是包含 `__init__.py` 文件的目录，用于组织多个模块。包的本质是一个文件夹，用于对模块进行归类处理，便于项目管理和维护。

**目录结构示例**：

```
utils/
├── __init__.py      # 包的标识文件
├── my_fun.py        # 模块1
└── my_var.py        # 模块2
```

::: info `__init__.py` 的作用
1. **标识包**：如果一个文件夹下有 `__init__.py` 文件，说明这是一个包（而不是普通文件夹）
2. **描述包信息**：可以在其中定义包的版本、作者等信息
3. **控制导入行为**：通过 `__all__` 变量指定 `from 包名 import *` 时可导入的模块列表
:::

### 3.2 导入包中的模块

**方式一：导入包中的模块**

```python
import utils.my_fun

utils.my_fun.log_separator1()
```

**方式二：从包中导入模块**

```python
from utils import my_fun

my_fun.log_separator1()
```

**方式三：从包中的模块导入功能**

```python
from utils.my_fun import log_separator1, log_separator3

log_separator1()
log_separator3()
```

**方式四：导入包中的所有模块**

```python
from utils import *
```

::: warning
使用 `from utils import *` 导入包下的所有模块时，需要在 `__init__.py` 文件中添加 `__all__ = []` 来指定可导出的模块列表。
:::

```python title = "__init__.py"
# 指定可导出的模块
__all__ = ["my_fun", "my_var"]
```

### 3.3 导入路径

**相对路径**：从当前文件所在目录开始查找

```python
# 当前文件与包在同一目录下
from utils import my_fun
```

**绝对路径**：从项目根目录开始查找

```python
# 从项目根目录开始查找
from 第二章.utils import my_fun
```

::: tip 说明
- 如果导入的模块与当前文件在同一目录下，使用相对路径
- 如果导入的模块在其他目录下，建议使用绝对路径
:::
