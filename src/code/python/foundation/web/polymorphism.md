---
title: 多态
icon: fas:shapes
order: 3
---

## 1.概述

多态是指同一个方法，具有不同的形态、行为、表现。

## 2.多态案例演示

**多态（Polymorphism）**的核心思想是：**“一种接口，多种实现”**。即同一个方法调用，由于对象不同，会产生不同的行为。

在下面的例子中，我们定义了一个通用的 `handler_charge` 函数，它接收一个 `Car` 类型的参数。无论传入的是燃油车还是电动车，它都能正确地执行对应的 `charge` 逻辑。

```python title = "05.面向对象高级-多态.py"
class Car:
    def __init__(self, brand, model, color, owner):
        self.brand = brand
        self.model = model
        self.color = color
        self.__owner = owner

    def start(self):
        print(f'{self.brand} {self.model} 正在启动...')

    def run(self):
        print(f'{self.__owner} : {self.brand} {self.model} 正在行驶...')

    def stop(self):
        print(f'{self.brand} {self.model} 停止行驶...')

    def get_owner(self):
        return self.__owner[0:1] + "**"

    def charge(self):
        print(f'{self.brand} {self.model} 正在补充燃料...')

# 子类：燃油车
class FuelCar(Car):
    def charge(self):
        print(f'{self.brand} {self.model} 正在加油...')

# 子类：电动车
class ElectricCar(Car):
    def charge(self):
        print(f'{self.brand} {self.model} 正在充电...')

# 统一的处理函数：参数类型声明为父类 Car
def handler_charge(car: Car):
    """
    多态的体现：不需要关心 car 具体是哪个子类，
    只需要知道它是 Car，就可以调用 charge 方法。
    """
    car.charge()

if __name__ == '__main__':
    # 传入不同的子类对象，执行不同的逻辑
    handler_charge(FuelCar('五菱', 'G37', '黑色', '张三'))
    handler_charge(ElectricCar('小米', 'Su7', '绿色', '李四'))
```

运行结果:

```
五菱 G37 正在加油...
小米 Su7 正在充电...
```

## 3.鸭子类型

**鸭子类型**是 Python 中一种独特的多态实现方式。它的核心理念源自一句谚语：“如果它走起来像鸭子，叫起来也像鸭子，那么它就是一只鸭子。”

在编程语境下，这意味着：
- **不关注类型**：我们不在乎对象具体属于哪个类，也不强制要求它们必须有继承关系。
- **只关注行为**：只要对象拥有我们需要的方法（接口），就可以被调用。

::: info
鸭子类型的优势是不需要存在继承关系，只要对象有相应的方法就能使用。

> "不刮穷鬼的钱你收谁的呀？" -> 不检查类型你调用谁的？
> "谁有钱挣谁的！" -> "谁有方法就调用谁的！"
:::

### 案例

在这个例子中，`Duck`、`Dog` 和 `Pig` 之间没有任何继承关系，但它们都拥有 `swimming()` 方法。函数 `go_swimming` 并不关心传入的对象具体是什么类，只要它会“游泳”，就能被调用。

```python title = "06.面向对象高级-多态(鸭子类型).py"
class Duck:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def swimming(self):
        print(f"{self.age} 岁的 {self.name} 正在游泳")

class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def swimming(self):
        print(f"{self.age} 岁的 {self.name} 正在游泳")

class Pig:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def swimming(self):
        print(f"{self.age} 岁的 {self.name} 正在游泳")

def go_swimming(duck: Duck):
    duck.swimming()

if __name__ == '__main__':
    go_swimming(Dog("小狗", 3))
    go_swimming(Duck("小鸭子", 2))
    go_swimming(Pig("小猪", 1))
```

运行结果:

```
2 岁的 小鸭子 正在游泳
3 岁的 小狗 正在游泳
1 岁的 小猪 正在游泳
```