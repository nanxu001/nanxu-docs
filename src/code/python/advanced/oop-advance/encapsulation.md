---
title: 封装
icon: fas:shield-halved
order: 2
---

## 1.封装概述

### 1.1 什么是封装

封装是面向对象的三大特征之一，是指隐藏对象的属性和实现细节，仅对外提供公共的访问方式。

**生活中的封装：**
- 电脑：内部硬件复杂，但用户只需按电源键开机
- 手机：内部有主板、CPU、内存等，但用户只能看到屏幕和按键

**代码中的封装：**
- 函数：将一段代码封装起来，提高复用性
- 类：将属性和方法封装在一起

### 1.2 封装的好处和弊端

| 方面 | 说明 |
|:---:|:---:|
| 好处1 | 提高代码的**安全性**（由私有化保证） |
| 好处2 | 提高代码的**复用性**（由函数保证） |
| 弊端 | 代码量增加（私有内容需要提供公共访问方式） |

## 2.私有属性

### 2.1 什么是私有属性

在 Python 中，可以通过在属性名前加**双下划线** `__` 来定义私有属性。

**语法：**
```python
self.__属性名 = 属性值
```

### 2.2 私有属性的特点

- 只能在**类的内部**访问
- 不能在**类的外部**直接访问
- 子类**不能继承**父类的私有属性

::: warning 注意
- 双下划线 `__` 只在前面加，后面不加
- 如果前后都加（如 `__init__`），是 Python 的魔法方法，不是私有属性
:::

### 2.3 私有属性示例

```python title="05.封装之私有属性.py"
class Prentice:
    def __init__(self):
        self.kong_fu = "黑马煎饼果子配方"
        self.__money = 20000  # 私有属性

    def make_cake(self):
        print(f"运用{self.kong_fu}制作煎饼果子")

disciple = Prentice()
print(disciple.kong_fu)      # 输出：黑马煎饼果子配方
# print(disciple.__money)    # 报错：无法访问私有属性
```

::: info 说明
- `kong_fu` 是公有属性，可以在类外部直接访问
- `__money` 是私有属性，不能在类外部直接访问
:::

### 2.4 访问私有属性 - getter/setter 方法

如果需要在类外部访问私有属性，需要提供公共的访问方式（getter/setter 方法）。

```python title="05.封装之私有属性.py"
class Prentice:
    def __init__(self):
        self.kong_fu = "黑马煎饼果子配方"
        self.__money = 20000

    def make_cake(self):
        print(f"运用{self.kong_fu}制作煎饼果子")

    # getter 方法：获取私有属性
    def get_money(self):
        return self.__money

    # setter 方法：设置私有属性
    def set_money(self, money):
        self.__money = money

disciple = Prentice()

# 通过 getter 方法获取私有属性
print(disciple.get_money())    # 输出：20000

# 通过 setter 方法设置私有属性
disciple.set_money(30000)
print(disciple.get_money())    # 输出：30000
```

::: tip 说明
- `get_money()` 是 getter 方法，用于获取私有属性的值
- `set_money()` 是 setter 方法，用于设置私有属性的值
- 通过 getter/setter 方法，可以在外部安全地访问私有属性
:::

## 3.私有方法

### 3.1 什么是私有方法

在 Python中，可以通过在方法名前加**双下划线** `__` 来定义私有方法。

**语法：**
```python
def __方法名(self):
    方法体
```

### 3.2 私有方法的特点

- 只能在**类的内部**调用
- 不能在**类的外部**直接调用
- 子类**不能继承**父类的私有方法

### 3.3 私有方法示例

```python
class Prentice:
    def __init__(self):
        self.__money = 20000

    # 私有方法
    def __check_money(self):
        if self.__money < 0:
            print("余额不足")
            return False
        return True

    # 公有方法调用私有方法
    def spend(self, amount):
        if self.__check_money():
            self.__money -= amount
            print(f"消费{amount}元，剩余{self.__money}元")

disciple = Prentice()
disciple.spend(5000)    # 输出：消费5000元，剩余15000元
# disciple.__check_money()  # 报错：无法调用私有方法
```

## 4.封装总结

| 概念 | 说明 |
|:---:|:---:|
| 封装 | 隐藏对象的属性和实现细节，仅对外提供公共访问方式 |
| 私有属性 | `__属性名`，只能在类内部访问 |
| 私有方法 | `__方法名`，只能在类内部调用 |
| getter 方法 | 获取私有属性的值 |
| setter 方法 | 设置私有属性的值 |
