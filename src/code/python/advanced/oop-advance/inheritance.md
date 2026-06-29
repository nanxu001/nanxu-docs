---
title: 继承
icon: fas:dna
order: 1
---

## 1.继承概述

### 1.1 什么是继承

继承是指一个类从另一个类中获取成员（属性和方法），实现代码复用。

**生活中的继承：**
- 子承父业：子女继承父辈的财产
- QQ号：父亲为儿子注册QQ号，等儿子长大后传给他

**专业术语：**

| 角色 | 名称 | 说明 |
|:---:|:---:|:---:|
| 父类 | 基类 | 被继承的类 |
| 子类 | 派生类 | 继承其他类的类 |

### 1.2 单继承和多继承

| 类型 | 说明 | 语言支持 |
|:---:|:---:|:---:|
| 单继承 | 一个子类只能继承一个父类 | Java、Python |
| 多继承 | 一个子类可以继承多个父类 | Python（Java不行） |

::: info 说明
Python 中没有接口的概念，支持多继承；Java 中一个子类只能有一个父类，但可以有多个接口。
:::

## 2.单继承

### 2.1 单继承语法

```python
class 父类:
    pass

class 子类(父类):
    pass
```

### 2.2 继承入门示例

```python title="14.继承入门.py"
class Father:
    def __init__(self):
        self.gender = "男"

    def walk(self):
        print("走")

class Son(Father):
    pass

# 子类继承了父类的属性和方法
s1 = Son()
s1.walk()           # 输出：走
print(s1.gender)    # 输出：男
```

::: info 说明
- `class Son(Father)` 表示 `Son` 继承自 `Father`
- 子类继承了父类的属性（`gender`）和方法（`walk`）
- 子类可以直接使用父类的成员，无需重复定义
:::

### 2.3 单继承案例 - 煎饼果子

一个摊煎饼的老师傅，在煎饼果子界摸爬滚打了多年，研发了一套精湛的技术，要把这个技术传给他的徒弟。

```python title="15.单继承.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法配方"

    def make_cake(self):
        print(f"采用{self.kong_fu} 摊煎饼果子")

class Prentice(Master):
    pass

# 徒弟继承了师傅的技术
p1 = Prentice()
p1.make_cake()  # 输出：采用古法配方 摊煎饼果子
```

::: tip 说明
- 师傅（`Master`）是父类，拥有古法配方和摊煎饼果子的方法
- 徒弟（`Prentice`）是子类，继承了师傅的技术
- 徒弟可以直接使用师傅的配方和方法
:::

## 3.多继承

### 3.1 多继承语法

```python
class 父类1:
    pass

class 父类2:
    pass

class 子类(父类1, 父类2):
    pass
```

### 3.2 多继承案例 - 煎饼果子

小明是一个爱好学习的好孩子，他想学习更多的煎饼果子技术，于是在百度搜索到了黑马程序员，然后来学习了。

```python title="16.多继承.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法配方"

    def make_cake(self):
        print(f"采用{self.kong_fu} 摊煎饼果子")

class School:
    def __init__(self):
        self.kong_fu = "黑马AI煎饼果子配方"

    def make_cake(self):
        print(f"采用{self.kong_fu} 摊煎饼果子")

class Prentice(Master, School):
    pass

# 徒弟同时继承了师傅和学校的技术
p = Prentice()
p.make_cake()  # 输出：采用古法配方 摊煎饼果子
```

::: warning 注意
当多个父类有同名方法时，默认使用**最左边**父类的方法。
:::

### 3.3 MRO 机制

Python 中有 MRO（Method Resolution Order，方法解析顺序）机制，可以查看某个对象在调用函数时的顺序。

**查看 MRO 的方式：**
```python
类名.__mro__
```

**示例：**
```python
print(Prentice.__mro__)
# 输出：(<class 'Prentice'>, <class 'Master'>, <class 'School'>, <class 'object'>)
```

::: info 说明
MRO 机制的查找顺序：
1. 先找自己（子类）
2. 再找第一个父类（左边）
3. 再找第二个父类（右边）
4. 最后找 `object`（所有类的基类）
5. 都找不到就报错
:::

## 4.子类重写父类功能

### 4.1 什么是重写

重写也叫**覆盖**，是指子类出现和父类重名的属性或方法，称之为重写。

**调用原则：** 遵循**就近原则**
- 子类有就用子类的
- 子类没有就去就近的父类找
- 依次查找所有父类，有就用，没有就报错

### 4.2 重写示例

```python title="01.子类重写父类功能.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class School:
    def __init__(self):
        self.kong_fu = "黑马AI煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class Prentice(School, Master):
    def __init__(self):
        self.kong_fu = "独创煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

p = Prentice()
print(p.kong_fu)    # 输出：独创煎饼果子配方
p.make_cake()       # 输出：调用独创煎饼果子配方制作煎饼果子
```

::: info 说明
- 子类重写了 `__init__` 和 `make_cake` 方法
- 调用时优先使用子类自己的方法，而不是父类的
:::

## 5.子类访问父类成员

当子类重写父类功能后，如果仍想调用父类的方法，有两种方式。

### 5.1 方式1：父类名.方法名(self)

**特点：** 精准访问，想调哪个父类就调哪个父类。

```python title="02.子类重写后访问父类功能_方式1.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class School:
    def __init__(self):
        self.kong_fu = "黑马AI煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class Prentice(School, Master):
    def __init__(self):
        self.kong_fu = "独创煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

    def make_master_cake(self):
        Master.__init__(self)
        Master.make_cake(self)

    def make_school_cake(self):
        School.__init__(self)
        School.make_cake(self)

p = Prentice()
p.make_cake()           # 输出：调用独创煎饼果子配方制作煎饼果子
p.make_master_cake()    # 输出：调用古法煎饼果子配方制作煎饼果子
p.make_school_cake()    # 输出：调用黑马AI煎饼果子配方制作煎饼果子
```

### 5.2 方式2：super().方法名()

**特点：** 只能访问最近的父类，有就用，没有就往后继续查找。

```python title="03.子类重写后访问父类功能_方式2.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class School:
    def __init__(self):
        self.kong_fu = "黑马AI煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class Prentice(School, Master):
    def __init__(self):
        self.kong_fu = "独创煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

    def make_old_cake(self):
        super().__init__()
        super().make_cake()

p = Prentice()
p.make_old_cake()  # 输出：调用黑马AI煎饼果子配方制作煎饼果子
```

::: warning 注意
- `super()` 只能访问最近的父类（MRO 顺序中的第一个父类）
- 多继承时不建议使用 `super()`，建议使用方式1精准访问
:::

### 5.3 两种方式对比

| 方式 | 语法 | 特点 |
|:---:|:---:|:---|
| 方式1 | `父类名.方法名(self)` | 精准访问，想调哪个父类就调哪个 |
| 方式2 | `super().方法名()` | 只能访问最近的父类 |

## 6.多层继承

### 6.1 什么是多层继承

多层继承是指类A继承类B，类B继承类C，形成祖孙三代的继承关系。

**生活中的多层继承：**
- 三代同堂：爷爷→父亲→儿子
- 四世同堂：太爷爷→爷爷→父亲→儿子

### 6.2 多层继承示例

```python title="04.多层继承.py"
class Master:
    def __init__(self):
        self.kong_fu = "古法煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class School:
    def __init__(self):
        self.kong_fu = "黑马AI煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

class Prentice(School, Master):
    def __init__(self):
        self.kong_fu = "独创煎饼果子配方"

    def make_cake(self):
        print(f"调用{self.kong_fu}制作煎饼果子")

    def make_master_cake(self):
        Master.__init__(self)
        Master.make_cake(self)

    def make_school_cake(self):
        School.__init__(self)
        School.make_cake(self)

# 徒孙类继承自徒弟类
class Disciple(Prentice):
    pass

d = Disciple()
d.make_cake()           # 输出：调用独创煎饼果子配方制作煎饼果子
d.make_master_cake()    # 输出：调用古法煎饼果子配方制作煎饼果子
d.make_school_cake()    # 输出：调用黑马AI煎饼果子配方制作煎饼果子
```

::: info 说明
- `Disciple` 继承自 `Prentice`，`Prentice` 继承自 `School` 和 `Master`
- 徒孙类拥有所有父类的成员
:::

## 7.继承总结

| 概念 | 说明 |
|:---:|:---:|
| 单继承 | 一个子类只能继承一个父类 |
| 多继承 | 一个子类可以继承多个父类 |
| MRO | 方法解析顺序，决定调用哪个父类的方法 |
| 重写 | 子类出现和父类重名的属性或方法 |
| 多层继承 | 类A继承类B，类B继承类C |

**类的别称：**
- 父类 = 基类
- 子类 = 派生类 = 扩展类
