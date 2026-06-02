---
title: 面向对象基础
icon: fas:cube
order: 8
---

## 1.类与对象

### 1.1 什么是类和对象

- **类**：描述一组具有相同属性和方法的模板
- **对象**：基于类创建的实例，一个类可以创建无数个对象

### 1.2 定义类

使用 `class` 关键字定义类，类名采用**大驼峰命名法**（每个单词首字母大写）：

```python title = "18.面向对象基础.py"
class Car:
    pass
```

### 1.3 创建对象

**语法：** `对象名 = 类名()`

```python title = "18.面向对象基础.py"
class Car:
    pass

c1 = Car()
print(c1)  # <__main__.Car object at 0x...>
```

## 2.实例属性

### 2.1 添加属性

通过对象添加属性：

```python title = "18.面向对象基础.py"
class Car:
    pass

c1 = Car()
c1.color = "red"
c1.brand = "BMW"
c1.name = "X5"
c1.price = 500000

print(c1.brand)  # BMW
print(c1.__dict__)  # {'color': 'red', 'brand': 'BMW', 'name': 'X5', 'price': 500000}
```

### 2.2 通过 `__init__` 初始化属性

`__init__` 是初始化方法，在创建对象时自动调用：

```python title = "18.面向对象基础.py"
class Car:
    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

c1 = Car("red", "BMW", "X5", 300000)
print(c1.__dict__)  # {'color': 'red', 'brand': 'BMW', 'name': 'X5', 'price': 300000}
```

::: info 说明
- `self` 代表当前实例对象本身
- `__init__` 方法在创建对象时自动调用，无需手动调用
- 参数类型注解是可选的，如 `color: str`
:::

## 3.实例方法

### 3.1 定义实例方法

方法定义在类的内部，第一个参数必须是 `self`：

```python title = "18.面向对象基础.py"
class Car:
    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

    def running(self):
        print(f"{self.brand} {self.name} 正在高速行驶中")

    def total_cost(self, discount, rate):
        """
        计算总费用
        :param discount: 折扣
        :param rate: 税率
        :return: 总费用
        """
        return self.price * discount + rate * self.price
```

### 3.2 调用实例方法

```python title = "18.面向对象基础.py"
c1 = Car("red", "BMW", "X5", 800000)
c1.running()  # BMW X5 正在高速行驶中

total = c1.total_cost(0.9, 0.1)
print(total)  # 800000.0
```

::: tip 函数与方法的区别
- 定义在类**外部**的称为**函数**
- 定义在类**内部**的称为**方法**
:::

## 4.魔法方法

### 4.1 `__str__` 方法

定义对象的字符串表示，使用 `print()` 输出对象时自动调用：

```python title = "18.面向对象基础.py"
class Car:
    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

    def __str__(self):
        return f"{self.color} {self.brand} {self.name} {self.price}"

c1 = Car("red", "BMW", "X5", 800000)
print(c1)  # red BMW X5 800000
```

### 4.2 `__eq__` 方法

定义两个对象是否相等，使用 `==` 比较时自动调用：

```python title = "18.面向对象基础.py"
class Car:
    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

    def __eq__(self, other):
        return (self.color == other.color and 
                self.brand == other.brand and 
                self.name == other.name and 
                self.price == other.price)

c1 = Car("red", "BMW", "X5", 800000)
c2 = Car("red", "BMW", "X5", 800000)
print(c1 == c2)  # True
```

### 4.3 `__lt__` 方法

定义对象的大小比较，使用 `<` 比较时自动调用：

```python title = "18.面向对象基础.py"
class Car:
    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

    def __lt__(self, other):
        return self.price < other.price

c1 = Car("red", "BMW", "X5", 800000)
c2 = Car("black", "Audi", "Q7", 900000)
print(c1 < c2)  # True
```

## 5.类属性与实例属性

### 5.1 类属性

定义在类中，所有对象共享：

```python title = "18.面向对象基础.py"
class Car:
    # 类属性
    wheel = 4
    rate = 0.1

    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price

c1 = Car("白色", "BYD", "仰望", 180000)
print(Car.wheel)  # 4（通过类名访问）
print(c1.wheel)   # 4（通过对象访问）
```

### 5.2 实例属性

定义在 `__init__` 中，每个对象独有：

```python title = "18.面向对象基础.py"
class Car:
    wheel = 4

    def __init__(self, color: str, brand: str, name: str, price: int):
        self.color = color
        self.brand = brand
        self.name = name
        self.price = price
        self.wheel = 2  # 实例属性会覆盖类属性

c1 = Car("白色", "BYD", "仰望", 180000)
print(c1.wheel)   # 2（实例属性）
print(Car.wheel)  # 4（类属性）
```

::: warning 注意
- 类属性通过**类名**访问
- 实例属性通过**对象**访问
- 实例属性会**覆盖**同名的类属性
:::

## 6.综合案例：教务系统

### 6.1 学生类定义

```python title = "19.面向对象基础案例.py"
class Student:
    def __init__(self, student_id: str, name: str, age: int, score: float):
        self.student_id = student_id
        self.name = name
        self.age = age
        self.score = score

    def __str__(self):
        return f"学号：{self.student_id}，姓名：{self.name}，年龄：{self.age}，成绩：{self.score}"
```

### 6.2 教务系统类

```python title = "19.面向对象基础案例.py"
class StudentManager:
    def __init__(self):
        self.students = []

    def add_student(self, student):
        """添加学生"""
        self.students.append(student)
        print(f"学生 {student.name} 添加成功")

    def remove_student(self, student_id):
        """删除学生"""
        for student in self.students:
            if student.student_id == student_id:
                self.students.remove(student)
                print(f"学生 {student.name} 删除成功")
                return
        print("未找到该学生")

    def find_student(self, student_id):
        """查询学生"""
        for student in self.students:
            if student.student_id == student_id:
                return student
        return None

    def update_score(self, student_id, new_score):
        """修改成绩"""
        student = self.find_student(student_id)
        if student:
            student.score = new_score
            print(f"学生 {student.name} 成绩修改为 {new_score}")
        else:
            print("未找到该学生")

    def show_all(self):
        """显示所有学生"""
        if not self.students:
            print("暂无学生信息")
        else:
            for student in self.students:
                print(student)
```

### 6.3 使用示例

```python title = "19.面向对象基础案例.py"
# 创建教务系统
manager = StudentManager()

# 添加学生
manager.add_student(Student("001", "张三", 20, 85.5))
manager.add_student(Student("002", "李四", 21, 92.0))
manager.add_student(Student("003", "王五", 19, 78.5))

# 显示所有学生
manager.show_all()

# 查询学生
student = manager.find_student("002")
if student:
    print(f"找到学生：{student}")

# 修改成绩
manager.update_score("002", 95.0)

# 删除学生
manager.remove_student("001")

# 再次显示所有学生
manager.show_all()
```

### 6.4 完整代码

```python title = "19.面向对象基础案例.py"
"""
采用面向对象的编程思想，完成教务管理系统的开发。教务管理系统可以管理在校学生的成绩信息，通过控制台菜单与用户交互，具体的功能如下：
    1. 添加学生成绩：根据输入的学生姓名、语文成绩、数学成绩、英语成绩，记录在系统中
        1.1 输入学生姓名、语文成绩、数学成绩、英语成绩
        1.2 检查学生姓名是否已存在, 如果学生不存在, 再添加 (存在则, 不添加)
        1.3 验证成绩范围（0-100分）
        1.4 创建学生对象并添加到系统
    2. 修改学生成绩：根据输入的学生姓名，修改对应的学生成绩
        2.1 输入要修改的学生姓名
        2.2 根据姓名查找该学生, 显示该生当前成绩信息
        2.3 输入新的语文、数学、英语成绩
        2.4 更新学生成绩数据
    3. 删除学生成绩：根据输入的学生姓名，删除对应的学生成绩
    4. 查询指定学生成绩：根据输入的学生姓名，查找对应的学生成绩，并输出
        4.1 输出格式为: "姓名：张三 | 语文：85 | 数学：90 | 英语：88 | 总分：263"
    5. 展示全部学生成绩：展示出系统中所有学生的成绩
"""


# 学生类
class Student:
    def __init__(self, name, chinese_score, math_score, english_score):
        self.name = name
        self.chinese_score = chinese_score
        self.math_score = math_score
        self.english_score = english_score

    def __str__(self):
        return (f"姓名：{self.name} | 语文：{self.chinese_score} | 数学：{self.math_score} | 英语：{self.english_score} | "
                f"总分：{self.chinese_score + self.math_score + self.english_score}")

class EduManagement:
    sys_version = 1.0
    sys_name = "教务管理系统"

    def __init__(self, students=None):
        if students is None:
            students = dict()
        self.students = students

    def add_student(self):
        while True:
            name = input("请输入学生姓名：")
            if name in [names for names in self.students.keys()]:
                print("学生已存在")
                continue
            break

        while True:
            chinese_score = int(input("请输入学生语文成绩："))
            if chinese_score > 100 or chinese_score < 0:
                print("学生成绩超出范围")
                continue
            break

        while True:
            math_score = int(input("请输入学生数学成绩："))
            if math_score > 100 or math_score < 0:
                print("学生成绩超出范围")
                continue
            break

        while True:
            english_score = int(input("请输入学生英语成绩："))
            if english_score > 100 or english_score < 0:
                print("学生成绩超出范围")
                continue
            break

        self.students[name] = Student(name, chinese_score, math_score, english_score)

    def update_student(self):
        while True:
            name = input("请输入学生姓名：")
            student = self.students.get(name)
            if student is None:
                print("学生不存在")
                continue

            print(student)
            break

        while True:
            chinese_score = int(input("请输入学生语文成绩："))
            if chinese_score > 100 or chinese_score < 0:
                print("学生成绩超出范围")
                continue
            break

        while True:
            math_score = int(input("请输入学生数学成绩："))
            if math_score > 100 or math_score < 0:
                print("学生成绩超出范围")
                continue
            break

        while True:
            english_score = int(input("请输入学生英语成绩："))
            if english_score > 100 or english_score < 0:
                print("学生成绩超出范围")
                continue
            break

        self.students[name] = Student(name, chinese_score, math_score, english_score)

    def del_student(self):
        while True:
            name = input("请输入学生姓名：")
            student = self.students.get(name)
            if student is None:
                print("学生不存在")
                continue

            del self.students[name]
            break

    def select_student(self):
        while True:
            name = input("请输入学生姓名：")
            student = self.students.get(name)
            if student is None:
                print("学生不存在")
                continue

            print(student)
            break

    def select_all_student(self):
        for students in self.students.values():
            print(students)

edu_management = EduManagement(dict())

while True:
    print("=============================================")
    print(f"              {EduManagement.sys_name} v{EduManagement.sys_version}")
    print("               1.添加学生成绩")
    print("               2.修改学生成绩")
    print("               3.删除学生成绩")
    print("               4.查询学生成绩")
    print("               5.查询所有学生成绩")
    print("               6.退出")
    print("=============================================")

    oper = input("请选择要进行的操作：")
    match oper:
        case "1":
            edu_management.add_student()
        case "2":
            edu_management.update_student()
        case "3":
            edu_management.del_student()
        case "4":
            edu_management.select_student()
        case "5":
            edu_management.select_all_student()
        case "6":
            print("退出系统")
            break
        case _:
            print("请选择正确的操作！！！")
            continue
```
