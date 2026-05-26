---
title: 继承
icon: fas:dna
order: 2
---

## 1.概述

继承描述的是两个类之间的关系，子类继承父类，就可以获取到父类的属性和方法(非私有)。

## 2.语法格式

在 Python 中，继承通过在子类定义时括号内指定父类来实现：

```python
class 子类(父类)
    pass
```

## 3.基础继承示例

下面通过一个汽车类的例子来演示继承的基本用法。`FuelCar`（燃油车）和 `ElectricCar`（电动车）都继承自 `Car`（汽车）父类。

```python title = "02.面向对象高级-继承.py"
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
        self.__control_fuel()

    def stop(self):
        print(f'{self.brand} {self.model} 停止行驶...')

    def __control_fuel(self):
        print(f'{self.brand} {self.model} 正在控制油门...')

    def get_owner(self):
        return self.__owner[0:1] + "**"

class FuelCar(Car):
    pass

class ElectricCar(Car):
    pass

if __name__ == '__main__':
    c1 = FuelCar('Audi', 'RS7', 'white', '张三')
    c1.start()
    c1.run()
    c1.stop()
    print(c1.brand)
    print(c1.get_owner())
    print(c1.model)
    print(c1.color)
```

运行结果:

可以看到，虽然 `FuelCar` 类中没有定义任何代码（只写了 `pass`），但它依然可以使用 `Car` 类中定义的所有公开方法和属性。

```
Audi RS7 正在启动...
张三 : Audi RS7 正在行驶...
Audi RS7 正在控制油门...
Audi RS7 停止行驶...
Audi
张**
RS7
white
```

## 4.重写

重写是指子类继承父类后，如果父类中的方法不满足需求，可以在子类中重新定义父类中已有的方法（方法名相同），从而用子类的实现替换父类的实现。

### 4.1 调用父类中的方法

在重写方法时，如果希望保留父类的部分逻辑，可以通过以下两种方式调用父类的方法：

1. **`super().方法名()`**（推荐）：自动查找并调用父类的方法，代码耦合度低，维护性好。
2. **`父类名.方法名(self)`**：显式指定调用哪个父类的方法，但在多重继承或父类改名时需要手动修改。

### 4.2 案例

在这个例子中，`FuelCar`（燃油车）重写了 `charge()` 方法，因为它不仅需要“补充燃料”的通用逻辑，还需要特有的“加油”动作。

```python title = "03.面向对象高级-继承(重写).py"
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
        self.__control_fuel()

    def stop(self):
        print(f'{self.brand} {self.model} 停止行驶...')

    def __control_fuel(self):
        print(f'{self.brand} {self.model} 正在控制油门...')

    def get_owner(self):
        return self.__owner[0:1] + "**"

    def charge(self):
        print(f'{self.brand} {self.model} 正在补充燃料...')

class FuelCar(Car):
    def charge(self):
        # 方式一：super().方法名()
        # super().charge()

        # 方式二：类名.方法名()
        Car.charge(self)

        print(f'{self.brand} {self.model} 正在加油...')

class ElectricCar(Car):
    def charge(self):
        print(f'{self.brand} {self.model} 正在连接充电桩...')
        print(f'{self.brand} {self.model} 正在充电...')

if __name__ == '__main__':
    c1 = FuelCar('Audi', 'RS7', 'white', '张三')
    c1.charge()

    print("-" * 20)
    
    c2 = ElectricCar('小米', 'Su7 Ultra', 'red', '王腾')
    c2.charge()
```

运行结果:

```
Audi RS7 正在补充燃料...
Audi RS7 正在加油...
--------------------
小米 Su7 Ultra 正在连接充电桩...
小米 Su7 Ultra 正在充电...
```

## 5.多继承

多继承指的是一个子类，同时继承了多个父类的情况（会将多个父类中的非私有的属性和方法都继承下来）。

### 5.1 语法格式

```python
class 子类名(父类名1, 父类名2, 父类名3, ...):
    代码
    ...
```

### 5.2 方法解析顺序 (MRO)
当多个父类中存在同名方法时，Python 会按照 **MRO (Method Resolution Order)** 的顺序进行查找。

查找规则：默认采用 C3 线性化算法。简单来说，它会优先查找第一个父类，如果找不到再查找第二个，依此类推。
查看顺序：可以通过 `类名.mro()` 方法或 `类名.__mro__` 属性来查看具体的查找路径。


### 5.3 案例

```python title = "04.面向对象高级-继承(多继承).py"
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


class HuaweiAiDriving:
    def __init__(self, version="V1.0"):
        self.version = version

    def run(self):
        print(f'使用华为AI智能驾驶系统{self.version}正在行驶...')


class WenJieCar(Car, HuaweiAiDriving):
    def __init__(self, brand, model, color, owner, version="V1.0"):
        # 初始化 Car 部分
        super().__init__(brand, model, color, owner)
        # 初始化 HuaweiAiDriving 部分
        HuaweiAiDriving.__init__(self, version)

# MRO：Method Resolution Order --> 方法解析顺序
if __name__ == '__main__':
    c1 = WenJieCar('问界', 'M7', 'white', '张三', version="V1.1")
    print(c1.__dict__)

    print(WenJieCar.mro())
    print(WenJieCar.__mro__)

    c1.run()
```

运行结果:

```
{'brand': '问界', 'model': 'M7', 'color': 'white', '_Car__owner': '张三', 'version': 'V1.1'}
[<class '__main__.WenJieCar'>, <class '__main__.Car'>, <class '__main__.HuaweiAiDriving'>, <class 'object'>]
(<class '__main__.WenJieCar'>, <class '__main__.Car'>, <class '__main__.HuaweiAiDriving'>, <class 'object'>)
张三 : 问界 M7 正在行驶...
```

::: info 结果分析
从 MRO 顺序可以看出：`WenJieCar` -> `Car` -> `HuaweiAiDriving` -> `object`。 因此，当调用 `c1.run()` 时，Python 会先在 `WenJieCar` 中找，没找到则去 `Car` 中找。由于 `Car` 中有 `run` 方法，所以直接执行了 `Car` 的逻辑，而忽略了 `HuaweiAiDriving` 中的 `run`。
:::

### 5.4 显式调用多个父类方法

如果希望同时执行两个父类中的逻辑，可以在子类中**重写**该方法并显式调用：

```python title = "04.面向对象高级-继承(多继承).py"
def run(self):
    Car.run(self)
    HuaweiAiDriving.run(self)
```

运行结果:

```
张三 : 问界 M7 正在行驶...
使用华为AI智能驾驶系统V1.1正在行驶...
```