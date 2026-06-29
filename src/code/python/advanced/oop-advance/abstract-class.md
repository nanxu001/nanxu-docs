---
title: 抽象类
icon: fas:vector-square
order: 4
---

## 1.抽象类概述

### 1.1 什么是抽象类

在 Python 中，**抽象类 = 接口**，即有抽象方法的类就是抽象类。

**相关概念：**

| 概念 | 说明 |
|:---:|:---:|
| 抽象方法 | 没有方法体的方法（方法体是 `pass`） |
| 抽象类 | 有抽象方法的类 |
| 普通类 | 没有抽象方法的类 |

::: info 说明
Python 中抽象类和接口是同一个概念；Java 中抽象类和接口是不同的。
:::

### 1.2 抽象类的作用

抽象类一般充当**父类**，用于**制定标准**（行业规范、准则），具体的实现交由子类来完成。

**生活中的抽象类：**
- **汽车尾气标准**：国家规定国六标准，各厂商自行实现
- **空调功能标准**：国家规定必须有制冷、制热、左右摆风功能，各品牌自行实现
- **手机功能标准**：国家规定必须具备某些功能，各厂商自行实现

**大白话：** 抽象类只管制定标准，不管具体怎么实现，子类必须实现这些标准。

## 2.抽象类的定义

### 2.1 定义抽象方法

```python
class 抽象类名:
    def 方法名(self):
        pass  # 方法体为空
```

### 2.2 定义抽象类示例

```python
class AC:
    def cool_win(self):
        """制冷"""
        pass

    def hot_wind(self):
        """制热"""
        pass

    def swing_l_r(self):
        """左右摆风"""
        pass
```

::: info 说明
- `AC` 类中有三个方法，方法体都是 `pass`
- 这些方法就是抽象方法
- 有抽象方法的类 `AC` 就是抽象类
:::

## 3.抽象类案例 - 空调案例

### 3.1 案例需求

国家规定空调必须具备以下功能：
- 制冷
- 制热
- 左右摆风

各空调制造商（小米、格力）自行实现这些功能。

### 3.2 代码实现

```python title="08.抽象类解释.py"
class AC:
    def cool_win(self):
        """制冷"""
        pass

    def hot_wind(self):
        """制热"""
        pass

    def swing_l_r(self):
        """左右摆风"""
        pass

class XiaoMi(AC):
    def cool_win(self):
        print("小米空调制冷")

    def hot_wind(self):
        print("小米空调制热")

    def swing_l_r(self):
        print("小米空调左右摆风")

class Gree(AC):
    def cool_win(self):
        print("格力空调制冷")

    def hot_wind(self):
        print("格力空调制热")

    def swing_l_r(self):
        print("格力空调左右摆风")

if __name__ == '__main__':
    xm = XiaoMi()
    xm.cool_win()      # 输出：小米空调制冷
    xm.hot_wind()      # 输出：小米空调制热
    xm.swing_l_r()     # 输出：小米空调左右摆风

    print("-" * 34)

    gree = Gree()
    gree.cool_win()     # 输出：格力空调制冷
    gree.hot_wind()     # 输出：格力空调制热
    gree.swing_l_r()    # 输出：格力空调左右摆风
```

::: tip 说明
- `AC` 是抽象类，定义了标准（制冷、制热、左右摆风）
- `XiaoMi` 和 `Gree` 是子类，实现了具体的功能
- 每个子类的实现方式不同，但都符合标准
:::

## 4.抽象类总结

| 概念 | 说明 |
|:---:|:---:|
| 抽象方法 | 没有方法体的方法（`pass`） |
| 抽象类 | 有抽象方法的类 |
| 作用 | 充当父类，制定标准 |
| 子类 | 必须实现抽象类中的抽象方法 |

**抽象类的好处：**
- 制定统一的标准
- 子类必须实现这些标准
- 不同子类可以有不同的实现方式
