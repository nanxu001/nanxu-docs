---
title: 案例实战
icon: fas:laptop-code
order: 3
---

## 1.减肥案例

### 1.1 案例需求

已知小明同学当前体重是 100kg，每跑步一次减少 0.5kg，每大吃大喝一次增加 2kg。

### 1.2 需求分析

| 分析方向 | 内容 | 代码 |
|:---:|:---:|:---:|
| 类名 | 学生 | `class Student` |
| 属性 | 当前体重（名词） | `current_weight` |
| 方法 | 跑步（动词） | `run()` |
| 方法 | 大吃大喝（动词） | `eat()` |

### 1.3 代码实现

```python title="11.减肥案例.py"
class Student:
    def __init__(self, current_weight):
        self.current_weight = current_weight

    def run(self):
        print("跑步")
        self.current_weight -= 0.5

    def eat(self):
        print("吃")
        self.current_weight += 2

    def __str__(self):
        return f"当前体重：{self.current_weight}"
```

### 1.4 测试调用

```python title="11.减肥案例.py"
if __name__ == '__main__':
    xiao_ming = Student(100)
    print(xiao_ming)        # 输出：当前体重：100

    xiao_ming.run()
    print(xiao_ming)        # 输出：当前体重：99.5

    xiao_ming.eat()
    print(xiao_ming)        # 输出：当前体重：101.5
```

::: info 说明
- `__init__`：初始化当前体重属性
- `run()`：跑步，体重减少 0.5kg
- `eat()`：大吃大喝，体重增加 2kg
- `__str__`：打印对象时显示当前体重
:::

## 2.烤地瓜案例

### 2.1 案例需求

烤地瓜需要记录以下信息：
- 被烤的时间
- 生熟状态
- 添加的调料

### 2.2 需求分析

| 分析方向 | 内容 | 代码 |
|:---:|:---:|:---:|
| 类名 | 地瓜 | `class SweetPotato` |
| 属性 | 烘烤时间（名词） | `time` |
| 属性 | 烘烤状态（名词） | `status` |
| 属性 | 调料（名词，多个） | `condiments` |
| 方法 | 烘烤（动词） | `cook(time)` |
| 方法 | 添加调料（动词） | `add_condiments(condiment)` |

**生熟状态判断：**

| 时间范围 | 状态 |
|:---:|:---:|
| 0 ≤ time ≤ 3 | 生的 |
| 3 < time ≤ 7 | 半生不熟 |
| 7 < time ≤ 12 | 熟了 |
| time > 12 | 糊了 |

### 2.3 代码实现

```python title="12.烤地瓜案例.py"
class SweetPotato:
    def __init__(self):
        self.time = 0
        self.status = "生的"
        self.condiments = []

    def cook(self, time):
        if self.time < 0:
            print("无效值")
        else:
            self.time += time

            if 0 <= self.time <= 3:
                self.status = "生的"
            elif 3 < self.time <= 7:
                self.status = "半生不熟"
            elif 7 < self.time <= 12:
                self.status = "熟了"
            else:
                self.status = "糊了"

    def add_condiments(self, condiment):
        self.condiments.append(condiment)

    def __str__(self):
        return f"这个地瓜的状态是：{self.status}，时间是：{self.time}，添加的调料是：{self.condiments}"
```

### 2.4 测试调用

```python title="12.烤地瓜案例.py"
if __name__ == '__main__':
    dg = SweetPotato()

    dg.cook(5)
    dg.add_condiments("盐")

    print(dg)
    # 输出：这个地瓜的状态是：半生不熟，时间是：5，添加的调料是：['盐']
```

::: info 说明
- `__init__`：初始化时间、状态、调料列表
- `cook(time)`：根据烘烤时间更新生熟状态
- `add_condiments(condiment)`：添加调料到列表
- `__str__`：打印对象时显示地瓜的状态信息
:::

## 3.案例总结

通过这两个案例，综合运用了前面学习的知识点：

| 知识点 | 减肥案例 | 烤地瓜案例 |
|:---:|:---:|:---:|
| 定义类 | `class Student` | `class SweetPotato` |
| `__init__` | 初始化体重 | 初始化时间、状态、调料 |
| 属性操作 | 设置和获取体重 | 设置和获取状态 |
| 方法定义 | `run()`、`eat()` | `cook()`、`add_condiments()` |
| `__str__` | 打印体重 | 打印地瓜信息 |
