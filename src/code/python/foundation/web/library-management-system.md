---
title: 案例：图书管理系统
icon: fas:book-open
order: 4
---

## 1. 需求

某社区图书馆需要开发一个简单的图书管理系统。系统需要支持会员登录、图书借阅、图书归还等功能。系统中有两种类型的会员：普通会员和VIP会员，他们的借书权限不同。使用面向对象编程的思想，设计并实现这个图书管理系统。

### 1.1 核心功能

1. 会员登录：会员通过卡号和密码登录系统
2. 借书：会员可以借阅库存中有余量的图书
3. 还书：会员可以归还借阅的图书
4. 查看我的借阅：展示当前会员已经借阅的图书列表
5. 退出系统

### 1.2 借阅规则

1. 普通会员最多可借3本
2. VIP会员最多可借 6+VIP等级 本 （VIP等级，默认为1）

### 1.3 注意事项

1. 登录成功（卡号和密码均正确）后，才可以访问该系统
2. 图书库存不足，或当前会员借书数量达到最大借书数量，不能再借新书

## 2.资料

### 2.1 图书数据

```json title = "books.json"
[
    {
        "编号": "AI001",
        "标题": "LangChain入门与实践",
        "作者": "李智慧",
        "数量": 8
    },
    {
        "编号": "AI002",
        "标题": "LangGraph构建智能Agent",
        "作者": "王浩帆",
        "数量": 5
    },
    {
        "编号": "AI003",
        "标题": "MCP协议从零实战",
        "作者": "张子轩",
        "数量": 6
    },
    {
        "编号": "AI004",
        "标题": "大模型Tool Calling开发指南",
        "作者": "刘明远",
        "数量": 7
    },
    {
        "编号": "AI005",
        "标题": "RAG技术与应用",
        "作者": "赵子涵",
        "数量": 10
    },
    {
        "编号": "AI006",
        "标题": "Prompt Engineering权威指南",
        "作者": "孙一凡",
        "数量": 12
    },
    {
        "编号": "AI007",
        "标题": "向量数据库实战",
        "作者": "陈思琪",
        "数量": 4
    },
    {
        "编号": "AI008",
        "标题": "Transformer架构深度解析",
        "作者": "吴宇轩",
        "数量": 6
    },
    {
        "编号": "AI009",
        "标题": "大模型微调技术详解",
        "作者": "林语晨",
        "数量": 9
    },
    {
        "编号": "AI010",
        "标题": "Agentic Workflow设计模式",
        "作者": "郭子睿",
        "数量": 5
    }
]
```

### 2.2 用户数据

```json title = "members.json"
[
    {
        "卡号": "V001",
        "姓名": "王林",
        "密码": "666888",
        "会员等级": 6
    },
    {
        "卡号": "V002",
        "姓名": "李慕婉",
        "密码": "123456",
        "会员等级": 4
    },
    {
        "卡号": "V003",
        "姓名": "司徒南",
        "密码": "888888",
        "会员等级": 5
    },
    {
        "卡号": "V004",
        "姓名": "周茹",
        "密码": "520131",
        "会员等级": 1
    },
    {
        "卡号": "V005",
        "姓名": "王平",
        "密码": "123789",
        "会员等级": 2
    },
    {
        "卡号": "N001",
        "姓名": "柳眉",
        "密码": "654321"
    },
    {
        "卡号": "N002",
        "姓名": "孙镇伟",
        "密码": "112233"
    },
    {
        "卡号": "N003",
        "姓名": "许立国",
        "密码": "998877"
    },
    {
        "卡号": "N004",
        "姓名": "周武泰",
        "密码": "445566"
    },
    {
        "卡号": "N005",
        "姓名": "拓森",
        "密码": "778899"
    }
]
```

## 3.实体类

### 3.1 图书实体类

根据 `books.json` 的数据结构，图书实体类需要包含以下核心要素：

- **属性**: 编号、标题、作者、总数、可用数量
- **行为**: 借书、还书、查询可用数量。

```python title = "07.图书管理系统.py"
class Book:
    def __init__(self, book_id, title, author, total_num):
        # 书籍编号
        self.book_id = book_id
        # 标题
        self.title = title
        # 作者
        self.author = author
        # 总数
        self.total_num = total_num
        # 可用数量
        self.__available_num = total_num

    def borrow_book(self):
        """
        如果可用数量大于0，则将可用数量减1
        :return: 是否成功借阅
        """
        if self.__available_num > 0:
            self.__available_num -= 1
            return True

        return False

    def return_book(self):
        """
        还书
        :return:
        """
        self.__available_num += 1

    def get_available_num(self):
        """
        获取可用数量
        :return: 可用数量
        """
        return self.__available_num
```

### 3.2 会员类

根据 `members.json` 的数据结构及系统功能，会员实体类需要包含以下核心要素：

- **属性**: 卡号、姓名、密码、借阅书籍列表
- **行为**: 借书、还书、查询可用数量。

```python title = "07.图书管理系统.py"
class Member:
    def __init__(self, member_id, name, password):
        # 卡号
        self.member_id = member_id
        # 姓名
        self.name = name
        # 密码
        self.__password = password
        # 借阅书籍列表
        self.__borrowed_books = []

    def borrow_book(self, book: Book):
        """
        借阅书籍
        :param book: 要借阅的书籍
        :return: 是否成功借阅
        """
        if len(self.__borrowed_books) >= self.get_max_books():
            print("借阅失败，您的借阅数量已达最大限制！")
            return False

        if book.borrow_book():
            self.__borrowed_books.append(book)
            print(f"{self.name} 已成功借阅图书 {book.title}")
            return True
        else:
            print(f"借阅失败，图书 {book.title} 已被借完！")
            return False

    def return_book(self, book: Book):
        """
        归还书籍
        :param book: 要归还的图书
        :return:
        """
        if book in self.__borrowed_books:
            self.__borrowed_books.remove(book)
            book.return_book()
            print(f"{self.name} 已成功还回图书 {book.title}")
        else:
            print(f"归还失败，您没有借阅图书 {book.title}！")

    def get_password(self):
        """
        获取密码
        :return: 密码
        """
        return self.__password

    def get_borrowed_books(self):
        """
        获取已借阅书籍
        :return: 已借阅书籍列表
        """
        return self.__borrowed_books

    def get_max_books(self) -> int:
        """
        获取会员最大借阅数量
        :return: 最大借阅数量
        """
        pass
```

### 3.3 普通会员类

普通会员继承自 `Member` 基类，其核心特征是借阅限额固定。我们只需重写 `get_max_books()` 方法即可实现多态。

```python title = "07.图书管理系统.py"
class NormalMember(Member):
    def get_max_books(self) -> int:
        """
        普通会员最多可借3本
        :return: 最大借阅数量
        """
        return 3
```

### 3.4 VIP会员类

VIP会员在普通会员的基础上增加了“会员等级”属性，其借阅权限与等级挂钩。这体现了**继承**（复用基础信息）与**多态**（不同的限额计算逻辑）的结合。

```python title = "07.图书管理系统.py"
class VipMember(Member):
    def __init__(self, member_id, name, password, vip_level = 1):
        super().__init__(member_id, name, password)
        # 会员等级
        self.vip_level = vip_level

    def get_max_books(self) -> int:
        """
        VIP会员最多可借 6+VIP等级 本 （VIP等级，默认为1）
        :return:
        """
        return 6 + self.vip_level
```

::: info 多态的体现 
在后续的图书管理系统中，当我们调用 `member.get_max_books()` 时：

- 如果 `member` 是 `NormalMember` 对象，它会返回 3。
- 如果 `member` 是 `VipMember` 对象，它会根据等级动态计算返回值。

系统不需要通过 `if-else` 判断会员类型，这就是多态带来的代码简洁性与扩展性。 
:::

### 3.5 抽象类 (Abstract Base Class)

**抽象类**是一种特殊的类，它不能被直接实例化，只能被继承。它的核心作用是**制定规范**：强制要求所有子类必须实现某些特定的方法，从而保证代码的一致性和可扩展性。

#### 为什么要使用抽象类？

在之前的设计中，`Member` 基类中的 `get_max_books()` 方法只是一个占位符。如果在编写子类（如 `NormalMember`）时忘记重写这个方法，程序在运行时可能会因为调用了一个没有实际逻辑的方法而出错，或者返回不预期的结果。

通过引入抽象类，我们可以将这种“错误”提前到**对象创建阶段**就拦截下来。

#### 实现方案

在 Python 中，实现抽象类需要借助 `abc` 模块（Abstract Base Classes）：
1. 让父类继承 `ABC`。
2. 使用 `@abstractmethod` 装饰器标记那些必须由子类实现的方法。

```python title = "07.图书管理系统.py"
# 导入需要的模块
from abc import ABC, abstractmethod

# 父类继承 ABC 类，标识这是一个抽象类
class Member(ABC):
    def __init__(self, member_id, name, password):
        # 卡号
        self.member_id = member_id
        # 姓名
        self.name = name
        # 密码
        self.__password = password
        # 借阅书籍列表
        self.__borrowed_books = []

    def borrow_book(self, book: Book):
        """
        借阅书籍
        :param book: 要借阅的书籍
        :return: 是否成功借阅
        """
        if len(self.__borrowed_books) >= self.get_max_books():
            print("借阅失败，您的借阅数量已达最大限制！")
            return False

        if book.borrow_book():
            self.__borrowed_books.append(book)
            print(f"{self.name} 已成功借阅图书 {book.title}")
            return True
        else:
            print(f"借阅失败，图书 {book.title} 已被借完！")
            return False

    def return_book(self, book: Book):
        """
        归还书籍
        :param book: 要归还的图书
        :return:
        """
        if book in self.__borrowed_books:
            self.__borrowed_books.remove(book)
            book.return_book()
            print(f"{self.name} 已成功还回图书 {book.title}")
        else:
            print(f"归还失败，您没有借阅图书 {book.title}！")

    def get_password(self):
        """
        获取密码
        :return: 密码
        """
        return self.__password

    def get_borrowed_books(self):
        """
        获取已借阅书籍
        :return: 已借阅书籍列表
        """
        return self.__borrowed_books

    # 使用装饰器标识这是一个抽象方法，要求子类必须实现
    @abstractmethod
    def get_max_books(self) -> int:
        """
        【抽象方法】获取会员最大借阅数量
        子类必须实现此方法，否则无法实例化
        """
        pass

# 尝试定义一个未实现抽象方法的子类
class NormalMember(Member):
    pass

if __name__ == '__main__':
    m = NormalMember(1, "张三", "123456")
```

运行结果:

由于 `NormalMember` 没有实现 `get_max_books`，Python 解释器会直接抛出 `TypeError`，阻止对象的创建。

```
Traceback (most recent call last):
  File "D:\Codes\PycharmProjects\py_project01\第六章\07.图书管理系统.py", line 128, in <module>
    m = NormalMember(1, "张三", "123456")
        ~~~~~~~~~~~~^^^^^^^^^^^^^^^^^^^^^
TypeError: Can't instantiate abstract class NormalMember without an implementation for abstract method 'get_max_books'
```

### 3.6 图书管理系统

#### 3.6.1 初始化

系统启动时，需要从 JSON 文件中读取图书和会员信息，并根据卡号前缀（`N` 或 `V`）自动实例化为对应的会员对象（多态的体现）。

```python title = "07.图书管理系统.py"
class LibrarySystem:
    def __init__(self):
        # 书籍列表
        self.books = {}
        # 会员列表
        self.members = {}
        # 当前登录会员
        self.current_member: Member | None = None

        # 加载数据
        self.load_books_data()
        self.load_members_data()

    def load_books_data(self):
        """
        加载书籍数据
        :return:
        """
        with open("data/books.json", "r", encoding="utf-8") as f:
            books_data = json.load(f)
            for book in books_data:
                self.books[book["编号"]] = Book(
                    book_id=book["编号"],
                    title=book["标题"],
                    author=book["作者"],
                    total_num=book["数量"]
                )

            print("加载书籍数据成功")

    def load_members_data(self):
        """
        加载会员数据
        :return:
        """
        with open("data/members.json", "r", encoding="utf-8") as f:
            members_data = json.load(f)
            for member in members_data:
                if member["卡号"].startswith("N"):
                    self.members[member["卡号"]] = NormalMember(
                        member_id=member["卡号"],
                        name=member["姓名"],
                        password=member["密码"]
                    )
                elif member["卡号"].startswith("V"):
                    self.members[member["卡号"]] = VipMember(
                        member_id=member["卡号"],
                        name=member["姓名"],
                        password=member["密码"],
                        vip_level=member.get("会员等级", 1)
                    )

            print(f"加载会员数据成功")

if __name__ == '__main__':
    ls = LibrarySystem()
    print(ls.books)
    print(ls.members)
```

运行结果:

```
加载书籍数据成功
加载会员数据成功
{'AI001': <__main__.Book object at 0x000002BE89026BA0>, 'AI002': <__main__.Book object at 0x000002BE88FAB9D0>, 'AI003': <__main__.Book object at 0x000002BE88FA8F50>, 'AI004': <__main__.Book object at 0x000002BE88E3A2C0>, 'AI005': <__main__.Book object at 0x000002BE8900D350>, 'AI006': <__main__.Book object at 0x000002BE8919EC30>, 'AI007': <__main__.Book object at 0x000002BE89149F20>, 'AI008': <__main__.Book object at 0x000002BE8914A030>, 'AI009': <__main__.Book object at 0x000002BE89156050>, 'AI010': <__main__.Book object at 0x000002BE89155F50>}
{'V001': <__main__.VipMember object at 0x000002BE89026CF0>, 'V002': <__main__.VipMember object at 0x000002BE88FABC50>, 'V003': <__main__.VipMember object at 0x000002BE88FABD90>, 'V004': <__main__.VipMember object at 0x000002BE8900DA70>, 'V005': <__main__.VipMember object at 0x000002BE8900D6E0>, 'N001': <__main__.NormalMember object at 0x000002BE89026E40>, 'N002': <__main__.NormalMember object at 0x000002BE88FABED0>, 'N003': <__main__.NormalMember object at 0x000002BE891B8050>, 'N004': <__main__.NormalMember object at 0x000002BE8900E060>, 'N005': <__main__.NormalMember object at 0x000002BE8900E190>}
```

#### 3.6.2 用户登录

登录功能通过循环验证卡号和密码，成功后将当前会员对象赋值给 `self.current_member`。

```python title = "07.图书管理系统.py"
def login(self):
        while True:
            print("【登录】")
            member_id = input("请输入会员卡号：")
            password = input("请输入会员密码：")

            if member_id not in self.members:
                print("登录失败,会员卡号不存在!")
                continue

            member = self.members[member_id]
            if member.get_password() == password:
                self.current_member = member
                print(f"登录成功， 欢迎您 {member.name}！")
                return True
            else:
                print("登录失败，密码错误！")
                continue
```

#### 3.6.3 主运行流程

```python title = "07.图书管理系统.py"
def run(self):
        if self.login():
            while True:
                print("\n1.借阅图书")
                print("2.归还图书")
                print("3.查看借阅")
                print("4.退出系统")
                choice = input("请选择操作（1-4）：")
                match choice:
                    case "1":
                        self.borrow_book()
                    case "2":
                        self.return_book()
                    case "3":
                        self.show_borrowed_books()
                    case "4":
                        print("退出系统")
                        break
                    case _:
                        print("无效的选项，请重新选择！")
```

#### 3.6.4 业务功能实现

```python title = "07.图书管理系统.py"
def borrow_book(self):
        """
        借阅图书
        :return:
        """
        # 展示出当前图书馆的图书列表
        for book in self.books:
            print(f"编号: {book.book_id}, 标题: {book.title}, 作者: {book.author}, 总数: {book.total_num}, 可用: {book.get_available_num()}")

        # 获取用户输入的图书编号，执行借书操作
        book_id = input("请输入要借阅的图书编号：")
        if book_id not in self.books:
            print("借阅失败，图书编号不存在！")
            return
        self.current_member.borrow_book(self.books[book_id])

def return_book(self):
        """
        归还图书
        :return:
        """
        # 展示出当前借阅的图书列表
        print("【已经借阅的图书列表】")
        for borrowed_book in self.current_member.get_borrowed_books():
            print(f"编号: {borrowed_book.book_id}, 标题: {borrowed_book.title}, 作者: {borrowed_book.author}")

        # 获取用户输入的图书编号，执行还书操作
        book_id = input("请输入要归还的图书编号：")
        if book_id not in self.books:
            print("归还失败，图书编号不存在！")
            return

        self.current_member.return_book(self.books[book_id])

def show_borrowed_books(self):
        """
        查看已经借阅的图书列表
        :return:
        """
        borrowed_books = self.current_member.get_borrowed_books()
        if len(borrowed_books) > 0:
            print("【已经借阅的图书列表】")
            for borrowed_book in borrowed_books:
                print(f"编号: {borrowed_book.book_id}, 标题: {borrowed_book.title}, 作者: {borrowed_book.author}")
        else:
            print("没有已经借阅的图书！")
```

## 4.启动入口

```python title = "07.图书管理系统.py"
if __name__ == '__main__':
    system = LibrarySystem()
    system.run()
```

## 5. 完整代码

```python title = "07.图书管理系统.py"
from abc import ABC, abstractmethod
import json


class Book:
    def __init__(self, book_id, title, author, total_num):
        # 书籍编号
        self.book_id = book_id
        # 标题
        self.title = title
        # 作者
        self.author = author
        # 总数
        self.total_num = total_num
        # 可用数量
        self.__available_num = total_num

    def borrow_book(self):
        """
        如果可用数量大于0，则将可用数量减1
        :return: 是否成功借阅
        """
        if self.__available_num > 0:
            self.__available_num -= 1
            return True

        return False

    def return_book(self):
        """
        还书
        :return:
        """
        self.__available_num += 1

    def get_available_num(self):
        """
        获取可用数量
        :return:
        """
        return self.__available_num


# 抽象类是一种只能被继承，不能被直接实例化，作用就是规定子类必须要实现哪些方法，强制子类必须遵守统一的代码规范
# Python中的抽象类，需要继承 abc 模块中的 ABC 类 ---> ABC：Abstract Base Class
class Member(ABC):
    def __init__(self, member_id, name, password):
        # 卡号
        self.member_id = member_id
        # 姓名
        self.name = name
        # 密码
        self.__password = password
        # 借阅书籍列表
        self.__borrowed_books = []

    def borrow_book(self, book: Book):
        """
        借阅书籍
        :param book: 要借阅的书籍
        :return: 是否成功借阅
        """
        if len(self.__borrowed_books) >= self.get_max_books():
            print("借阅失败，您的借阅数量已达最大限制！")
            return False

        if book.borrow_book():
            self.__borrowed_books.append(book)
            print(f"{self.name} 已成功借阅图书 {book.title}")
            return True
        else:
            print(f"借阅失败，图书 {book.title} 已被借完！")
            return False

    def return_book(self, book: Book):
        """
        归还书籍
        :param book: 要归还的图书
        :return:
        """
        if book in self.__borrowed_books:
            self.__borrowed_books.remove(book)
            book.return_book()
            print(f"{self.name} 已成功还回图书 {book.title}")
        else:
            print(f"归还失败，您没有借阅图书 {book.title}！")

    def get_password(self):
        """
        获取密码
        :return: 密码
        """
        return self.__password

    def get_borrowed_books(self):
        """
        获取已借阅书籍
        :return: 已借阅书籍列表
        """
        return self.__borrowed_books

    @abstractmethod
    def get_max_books(self) -> int:
        """
        获取会员最大借阅数量
        :return: 最大借阅数量
        """
        pass


class NormalMember(Member):
    def get_max_books(self) -> int:
        """
        普通会员最多可借3本
        :return: 最大借阅数量
        """
        return 3


class VipMember(Member):
    def __init__(self, member_id, name, password, vip_level=1):
        super().__init__(member_id, name, password)
        # 会员等级
        self.vip_level = vip_level

    def get_max_books(self) -> int:
        """
        VIP会员最多可借 6+VIP等级 本 （VIP等级，默认为1）
        :return:
        """
        return 6 + self.vip_level


class LibrarySystem:
    def __init__(self):
        # 书籍列表
        self.books = {}
        # 会员列表
        self.members = {}
        # 当前登录会员
        self.current_member: Member | None = None

        # 加载数据
        self.load_books_data()
        self.load_members_data()

    def load_books_data(self):
        """
        加载书籍数据
        :return:
        """
        with open("data/books.json", "r", encoding="utf-8") as f:
            books_data = json.load(f)
            for book in books_data:
                self.books[book["编号"]] = Book(
                    book_id=book["编号"],
                    title=book["标题"],
                    author=book["作者"],
                    total_num=book["数量"]
                )

            print("加载书籍数据成功")

    def load_members_data(self):
        """
        加载会员数据
        :return:
        """
        with open("data/members.json", "r", encoding="utf-8") as f:
            members_data = json.load(f)
            for member in members_data:
                if member["卡号"].startswith("N"):
                    self.members[member["卡号"]] = NormalMember(
                        member_id=member["卡号"],
                        name=member["姓名"],
                        password=member["密码"]
                    )
                elif member["卡号"].startswith("V"):
                    self.members[member["卡号"]] = VipMember(
                        member_id=member["卡号"],
                        name=member["姓名"],
                        password=member["密码"],
                        vip_level=member.get("会员等级", 1)
                    )

            print(f"加载会员数据成功")

    def login(self):
        while True:
            print("【登录】")
            member_id = input("请输入会员卡号：")
            password = input("请输入会员密码：")

            if member_id not in self.members:
                print("登录失败,会员卡号不存在!")
                continue

            member = self.members[member_id]
            if member.get_password() == password:
                self.current_member = member
                print(f"登录成功， 欢迎您 {member.name}！")
                return True
            else:
                print("登录失败，密码错误！")
                continue

    def run(self):
        if self.login():
            while True:
                print("\n1.借阅图书")
                print("2.归还图书")
                print("3.查看借阅")
                print("4.退出系统")
                choice = input("请选择操作（1-4）：")
                match choice:
                    case "1":
                        self.borrow_book()
                    case "2":
                        self.return_book()
                    case "3":
                        self.show_borrowed_books()
                    case "4":
                        print("退出系统")
                        break
                    case _:
                        print("无效的选项，请重新选择！")

    def borrow_book(self):
        """
        借阅图书
        :return:
        """
        # 展示出当前图书馆的图书列表
        print("【图书列表】")
        for book in self.books.values():
            print(f"编号: {book.book_id}, 标题: {book.title}, 作者: {book.author}, 总数: {book.total_num}, 可用: {book.get_available_num()}")

        # 获取用户输入的图书编号，执行借书操作
        book_id = input("请输入要借阅的图书编号：")
        if book_id not in self.books:
            print("借阅失败，图书编号不存在！")
            return
        self.current_member.borrow_book(self.books[book_id])

    def return_book(self):
        """
        归还图书
        :return:
        """
        # 展示出当前借阅的图书列表
        print("【已经借阅的图书列表】")
        for borrowed_book in self.current_member.get_borrowed_books():
            print(f"编号: {borrowed_book.book_id}, 标题: {borrowed_book.title}, 作者: {borrowed_book.author}")

        # 获取用户输入的图书编号，执行还书操作
        book_id = input("请输入要归还的图书编号：")
        if book_id not in self.books:
            print("归还失败，图书编号不存在！")
            return

        self.current_member.return_book(self.books[book_id])

    def show_borrowed_books(self):
        """
        查看已经借阅的图书列表
        :return:
        """
        borrowed_books = self.current_member.get_borrowed_books()
        if len(borrowed_books) > 0:
            print("【已经借阅的图书列表】")
            for borrowed_book in borrowed_books:
                print(f"编号: {borrowed_book.book_id}, 标题: {borrowed_book.title}, 作者: {borrowed_book.author}")
        else:
            print("没有已经借阅的图书！")


if __name__ == '__main__':
    ls = LibrarySystem()
    ls.run()
```