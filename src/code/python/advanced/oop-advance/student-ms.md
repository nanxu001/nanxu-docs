---
title: 学生管理系统
icon: fas:users
order: 6
---

## 1.案例需求

### 1.1 需求分析

使用面向对象思想，结合字典、字符串、文件操作，完成学生管理系统 V2.0。

**功能需求：**
- 添加学生信息
- 修改学生信息
- 删除学生信息
- 查询单个学生信息
- 显示所有学生信息
- 保存学生信息到文件
- 从文件加载学生信息

### 1.2 类的设计

使用**名词提取法**分析需求：

| 名词 | 对应类 | 说明 |
|:---:|:---:|:---:|
| 学生 | `Student` | 学生类，存储学生信息 |
| 学生管理系统 | `StudentMS` | 管理类，实现增删改查功能 |

### 1.3 项目文件结构

```
StudentsMS/
├── student.py      # 学生类
├── studentms.py    # 学生管理类
└── main.py         # 程序入口
```

## 2.学生类（Student）

### 2.1 代码实现

```python title="student.py"
class Student:
    def __init__(self, name, age, gender, phone, desc):
        """
        创建学生对象
        :param name: 姓名
        :param age: 年龄
        :param gender: 性别
        :param phone: 手机号
        :param desc: 描述信息
        """
        self.name = name
        self.age = age
        self.gender = gender
        self.phone = phone
        self.desc = desc

    def __str__(self):
        return f"姓名：{self.name}，年龄：{self.age}，性别：{self.gender}，手机号：{self.phone}，描述信息：{self.desc}"
```

::: info 说明
- `__init__`：初始化学生属性（姓名、年龄、性别、手机号、描述）
- `__str__`：打印对象时显示学生信息
:::

## 3.学生管理类（StudentMS）

### 3.1 代码实现

```python title="studentms.py"
import time
from student import Student

class StudentMS:
    def __init__(self):
        self.stu_list = []

    @staticmethod
    def show_menu():
        print("*" * 32)
        print("学生管理系统V2.0")
        print("\t1.添加学生信息")
        print("\t2.修改学生信息")
        print("\t3.删除学生信息")
        print("\t4.查询单个学生信息")
        print("\t5.显示所有学生信息")
        print("\t6.保存信息")
        print("\t0.退出系统")
        print("*" * 32)

    def add_student(self):
        name = input("请输入学生姓名：\n")
        age = int(input("请输入学生年龄：\n"))
        gender = input("请输入学生性别：\n")
        phone = input("请输入学生手机号：\n")
        desc = input("请输入学生描述：\n")
        student = Student(name, age, gender, phone, desc)
        self.stu_list.append(student)
        print("添加成功")

    def del_student(self):
        name = input("请输入要删除的学生姓名：\n")
        for stu in self.stu_list:
            if stu.name == name:
                self.stu_list.remove(stu)
                print("删除成功")
                break
        else:
            print("学生不存在")

    def update_student(self):
        name = input("请输入要修改的学生姓名：\n")
        for stu in self.stu_list:
            if stu.name == name:
                stu.age = int(input("请输入学生年龄：\n"))
                stu.gender = input("请输入学生性别：\n")
                stu.phone = input("请输入学生手机号：\n")
                stu.desc = input("请输入学生描述：\n")
                print("修改成功")
                break
        else:
            print("学生不存在")

    def get_student(self):
        name = input("请输入要查找的学生姓名：\n")
        for stu in self.stu_list:
            if stu.name == name:
                print(stu)
                break
        else:
            print("学生不存在")

    def all_student(self):
        if len(self.stu_list) == 0:
            print("学生信息为空\n")
        else:
            for stu in self.stu_list:
                print(stu)
            print()

    def save_student(self):
        dict_list = [stu.__dict__ for stu in self.stu_list]
        with open("stu_data.txt", "w", encoding="utf-8") as dest_f:
            dest_f.write(str(dict_list))

    def load_student(self):
        try:
            with open("stu_data.txt", "r", encoding="utf-8") as dest_f:
                stu_data = dest_f.read()
                dict_list = eval(stu_data)
                if len(dict_list) == 0:
                    self.stu_list = []
                else:
                    self.stu_list = [Student(**dict_data) for dict_data in dict_list]
        except:
            with open("stu_data.txt", "w", encoding="utf-8"):
                pass

    def start(self):
        self.load_student()
        while True:
            time.sleep(1)
            StudentMS.show_menu()
            input_num = input("请输入要进行的操作：\n")
            match input_num:
                case "1":
                    self.add_student()
                case "2":
                    self.update_student()
                case "3":
                    self.del_student()
                case "4":
                    self.get_student()
                case "5":
                    self.all_student()
                case "6":
                    self.save_student()
                    print("保存成功")
                case "0":
                    input_value = input("是否确认退出系统(Y/N)\n")
                    if input_value.lower() == "y":
                        self.save_student()
                        print("退出系统")
                        break
                case _:
                    print("输入错误\n")
```

::: info 说明
- `show_menu()`：静态方法，显示菜单
- `add_student()`：添加学生
- `del_student()`：删除学生
- `update_student()`：修改学生
- `get_student()`：查询单个学生
- `all_student()`：显示所有学生
- `save_student()`：保存学生信息到文件
- `load_student()`：从文件加载学生信息
- `start()`：启动程序主循环
:::

## 4.程序入口 `main.py`

```python title="main.py"
from studentms import StudentMS

if __name__ == '__main__':
    ms = StudentMS()
    ms.start()
```

## 5.关键技术点

### 5.1 __dict__ 属性

`__dict__` 属性可以将对象的属性转换为字典格式：

```python
student = Student("张三", 18, "男", "13888888888", "描述信息")
print(student.__dict__)
# 输出：{'name': '张三', 'age': 18, 'gender': '男', 'phone': '13888888888', 'desc': '描述信息'}
```

### 5.2 字典解包创建对象

使用 `**` 解包字典，可以直接创建对象：

```python
dict_data = {'name': '张三', 'age': 18, 'gender': '男', 'phone': '13888888888', 'desc': '描述信息'}
student = Student(**dict_data)
```

### 5.3 match...case 语句

Python 3.10+ 支持的模式匹配语法，用于替代多层 `if...elif`：

```python
match input_num:
    case "1":
        self.add_student()
    case "2":
        self.update_student()
    case _:
        print("输入错误")
```
