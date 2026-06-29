---
title: 多态
icon: fas:shapes
order: 3
---

## 1.多态概述

### 1.1 什么是多态

多态是指同一个函数，接收不同的参数，有不同的效果。

**大白话：** 同一个事物在不同时刻表现出来的不同状态和形态。

**生活中的多态：**
- 水：高温下是气体，常温下是液体，低温下是固体
- 人：上课时是学生，买东西时是消费者，回宿舍时是舍友

**专业版：** 同一个函数，接收不同的参数，有不同的效果。

### 1.2 多态的前提条件

| 条件 | 说明 |
|:---:|:---:|
| 继承 | 子类继承父类 |
| 方法重写 | 子类重写父类的方法 |
| 父类引用指向子类对象 | 父类变量接收子类实例 |

::: info 说明
Python 是弱类型语言，对类型划分没有那么严格，即使不满足这三个条件也能实现多态。
:::

## 2.多态入门示例

### 2.1 示例代码

```python title="06.多态入门.py"
class Animal:
    def speak(self):
        pass

class Cat(Animal):
    def speak(self):
        print("喵喵喵")

class Dog(Animal):
    def speak(self):
        print("汪汪汪")

class Car:
    def speak(self):
        print("滴滴滴")

def make_noise(animal: Animal):
    animal.speak()

if __name__ == '__main__':
    dog = Dog()
    cat = Cat()
    car = Car()

    make_noise(dog)    # 输出：汪汪汪
    make_noise(cat)    # 输出：喵喵喵

    print("-" * 34)

    make_noise(car)    # 输出：滴滴滴
```

::: info 说明
- `Animal` 是父类，`Cat` 和 `Dog` 是子类
- `make_noise` 函数接收 `Animal` 类型的参数
- 传入不同的对象，调用对应的 `speak` 方法，产生不同的效果
- `Car` 没有继承 `Animal`，但由于 Python 是弱类型语言，也能传入
:::

## 3.多态案例 - 战斗机对战平台

### 3.1 案例需求

构建一个对战平台，传入不同的战斗机对象，进行对战。

- 英雄1代战机：战斗力 60
- 英雄2代战机：战斗力 80
- 敌军战机：战斗力 70

### 3.2 代码实现

```python title="07.多态案例.py"
class HeroFighter:
    def power(self):
        return 60

class AdvHeroFighter(HeroFighter):
    def power(self):
        return 80

class EnemyFighter:
    def power(self):
        return 70

def object_play(hero_fighter: HeroFighter, enemy_fighter: EnemyFighter):
    if hero_fighter.power() < enemy_fighter.power():
        print("英雄1代战机失败")
    elif hero_fighter.power() >= enemy_fighter.power():
        print("战胜敌军战机")
    else:
        print("平局")

if __name__ == '__main__':
    h1 = HeroFighter()
    h2 = AdvHeroFighter()
    e = EnemyFighter()

    object_play(h1, e)    # 输出：英雄1代战机失败
    print("-" * 34)
    object_play(h2, e)    # 输出：战胜敌军战机
```

::: tip 说明
- `HeroFighter` 是父类，`AdvHeroFighter` 是子类
- `object_play` 函数是公共的对战平台
- 传入不同的战斗机对象，产生不同的对战结果
- 代码不改变，完成多次战斗
:::

### 3.3 多态的好处

| 好处 | 说明 |
|:---:|:---:|
| 代码复用 | 公共函数可以处理不同类型的对象 |
| 扩展性强 | 新增类型时，无需修改公共函数 |

::: info 说明
多态就像古代的擂台：擂台只管红方和蓝方PK，至于红方是谁、蓝方是谁，擂台不管。
:::

## 4.多态总结

| 概念 | 说明 |
|:---:|:---:|
| 多态 | 同一个函数，接收不同的参数，有不同的效果 |
| 前提条件 | 继承、方法重写、父类引用指向子类对象 |
| Python 特性 | 弱类型语言，不强制要求前提条件 |
| 好处 | 代码复用、扩展性强 |
