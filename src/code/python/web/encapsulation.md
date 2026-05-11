---
title: 封装
icon: fas:box
order: 1
---

## 1.概述

封装就是把数据(属性)和操作数据的函数(方法)捆绑在一起，形成一个独立的单元（类），并隐藏内部的实现细节，只对外暴露必要的功能（方法）。

## 2.私有成员与访问控制

在 Python 中，可以通过在属性名或方法名前添加**双下划线 `__`** 来将其定义为**私有成员**。私有成员只能在类的内部被访问，外部无法直接调用。

### 2.1 尝试直接访问私有属性

```python title = "01.面向对象高级-封装.py"
class Car:
    def __init__(self, brand, model, color, owner):
        self.brand = brand
        self.model = model
        self.color = color
        self.__owner = owner

    def start(self):
        print(f'{self.brand} {self.model} 正在启动...')

    def run(self):
        print(f'{self.brand} {self.model} 正在行驶...')

    def stop(self):
        print(f'{self.brand} {self.model} 停止行驶...')

    def __control_fuel(self):
        print(f'{self.brand} {self.model} 正在控制油门...')


if __name__ == '__main__':
    car = Car('Audi', 'A8', '黑色', "Nanxu")
    print(car.brand)
    print(car.model)
    print(car.color)

    # 尝试直接访问私有属性
    print(car.__owner) 

    car.start()
    car.run()
    car.stop()
```

运行结果:

可以看到程序抛出 `AttributeError`，提示对象没有 `__owner` 属性。这是因为 Python 对私有属性进行了名称改写（Name Mangling），防止外部直接访问。

```
Audi
A8
黑色
Traceback (most recent call last):
  File "D:\Codes\PycharmProjects\py_project01\第六章\01.面向对象高级-封装.py", line 32, in <module>
    print(car.__owner)
          ^^^^^^^^^^^
AttributeError: 'Car' object has no attribute '__owner'
```

## 2.2 通过公有方法间接访问

为了在保护数据的同时又能合理使用私有属性，我们通常会提供公开的 getter/setter 方法作为访问接口。

```python title = "01.面向对象高级-封装.py"
class Car:
    def __init__(self, brand, model, color, owner):
        self.brand = brand
        self.model = model
        self.color = color
        self.__owner = owner

    def start(self):
        print(f'{self.brand} {self.model} 正在启动...')

    def run(self):
        # 内部方法可以访问私有属性和私有方法
        print(f'{self.__owner} : {self.brand} {self.model} 正在行驶...')
        self.__control_fuel()

    def stop(self):
        print(f'{self.brand} {self.model} 停止行驶...')

    def __control_fuel(self):
        print(f'{self.brand} {self.model} 正在控制油门...')

    def get_owner(self):
        return self.__owner[0:1] + "**"

if __name__ == '__main__':
   car = Car('Audi', 'A8', '黑色', "Nanxu")
   print(car.brand)
   print(car.model)
   print(car.color)
   car.start()
   car.run()
   car.stop()

   print(car.get_owner())
```

运行结果:

```
Audi
A8
黑色
Audi A8 正在启动...
Nanxu : Audi A8 正在行驶...
Audi A8 正在控制油门...
Audi A8 停止行驶...
车主信息：N**
```

## 3. 注意事项：Python 的“伪”私有

需要特别注意的是，**Python 并没有真正的强制私有机制**。所谓的“私有”主要是通过**名称改写（Name Mangling）**来实现的。

在上面的案例中，虽然外部无法直接通过 `car.__owner` 访问，但 Python 解释器在底层会将双下划线开头的成员名改写为 `_类名__成员名`。因此，你仍然可以通过以下方式强行访问：

*   **访问私有属性**：`car._Car__owner`
*   **访问私有方法**：`car._Car__control_fuel()`

::: warning
尽管技术上可行，但**绝对不要在生产代码中使用这种方式访问私有成员**。
1. **破坏封装**：这直接绕过了类设计者设定的安全边界。
2. **维护风险**：名称改写的规则依赖于类名，如果类名发生变化，所有硬编码的 `_类名__成员名` 都会失效，导致程序崩溃。
3. **约定俗成**：在 Python 社区中，以单下划线 `_` 开头的成员表示“受保护/内部使用”，而以双下划线 `__` 开头的成员表示“强私有”。强行访问违背了 Python 的设计哲学。
:::