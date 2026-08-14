---
title: Property 属性
icon: fas:shield-halved
order: 7
---

## 1.概述

**property** 是 Python 内置的装饰器，负责把一个方法**当作属性**来使用——对外还是 `对象.属性` 的语法，内部实际执行的是方法，可以借此插入校验、计算等逻辑。

这样做有两个好处：

- **封装**：配合私有属性（`__age`），外部无法直接访问内部数据
- **简化调用**：取值、赋值都是 `s.age`，不用写 `s.get_age()` / `s.set_age()`

定义 property 属性有两种方式：

1. 装饰器方式
2. 类属性方式

## 2.装饰器方式

装饰器的用法：

::: tip 装饰器写法
- `@property`：修饰"获取值"的方法
- `@age.setter`：修饰"设置值"的方法（`age` 为取值方法的函数名）
:::

之后就能像普通变量一样，直接通过 `s.age` 取值、赋值：

```python title = "08.property_装饰器方式.py"
# 需求：定义学生类。私有属性 age，通过property实现简化调用
# 1.定义学生类
class Student:
    def __init__(self):
        self.__age = 18

    @property
    def age(self):
        # 这里可加校验、计算等逻辑（二次校验），一般场景不做
        return self.__age

    @age.setter
    def age(self, age):
        self.__age = age

# 2.测试
if __name__ == '__main__':
    # 2.1 创建学生对象
    s = Student()
    # 2.2 设置值
    s.age = 20
    # 2.3 获取值
    print(s.age)
```

运行结果:

```
20
```

::: info 原因说明
1. `s.age = 20` 本质是调用 `age` 的 **setter 方法**，把 20 存入私有属性 `__age`
2. `print(s.age)` 本质是调用 `age` 的 **getter 方法**，返回 `__age`
3. 对外 `s.age` 和普通属性写法完全一致，看不出背后是方法——这就是"简化代码使用"
:::

## 3.类属性方式

先定义普通的 `get_xxx` / `set_xxx` 方法，再用 `property()` 把它们绑定为一个类属性：

::: tip 类属性写法
`类属性名 = property(获取值的函数名, 设置值的函数名)`
:::

```python title = "08.property_类属性方式.py"
# 需求：定义学生类。私有属性 age，通过property实现简化调用
# 1.定义学生类
class Student:
    # 1.1 私有age属性
    def __init__(self):
        self.__age = 18

    # 1.2 公共的访问方式
    def get_age(self):
        return self.__age

    def set_age(self, age):
        self.__age = age

    # 1.3 封装上述的公共方式为 类属性
    # 参数1：获取值的函数名，参数2：设置值的函数名
    age = property(get_age, set_age)


# 2.测试
if __name__ == '__main__':
    s = Student()
    s.age = 20
    print(s.age)
```

运行结果:

```
20
```

::: tip 两种方式等价
`age = property(get_age, set_age)` 等价于装饰器方式里的 `@property` + `@age.setter`。

- 装饰器方式：更直观，新代码推荐使用
- 类属性方式：适合已经有 `get_xxx` / `set_xxx` 方法的旧代码改造
:::