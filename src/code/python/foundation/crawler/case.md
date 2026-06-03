---
title: 实战案例
icon: fas:film
order: 2
---

## 1.CSV 文件操作

### 1.1 什么是 CSV

CSV（Comma Separated Values，逗号分隔值）是一种通用的文本文件格式，多个值之间使用英文逗号分隔，可以存储表格数据，能被 Excel 等表格软件打开。

**CSV 文件特点：**
- 本质是文本文件，第一行为表头，后续行为数据
- 多个值之间使用英文逗号分隔
- 可以用记事本编辑，也可以用 Excel 打开

::: warning 编码问题
- Python 读写文件通常使用 UTF-8 编码
- Windows 系统的 Excel 默认使用 GBK 编码
- 如果 CSV 文件需要用 Excel 打开，建议保存为 GBK 编码（记事本中选择 ANSI）
:::

### 1.2 方式一：原始文件读写

```python title="04.csv入门.py"
# 写入 CSV 文件
with open("csv_data/01.csv", "w", encoding="utf-8") as f:
    f.write("姓名,年龄,性别,爱好\n")
    f.write("张三,18,男,'C++,C'\n")  # 多个值用引号包裹
    f.write("李四,19,女,Python\n")
    f.write("王五,20,男,Java\n")

# 读取 CSV 文件
with open("csv_data/01.csv", "r", encoding="utf-8") as f:
    for line in f:
        print(line.strip())
```

::: info 说明
如果某个字段值中包含逗号，需要使用引号将其包裹，否则会被当作分隔符。
:::

### 1.3 方式二：csv 标准库（推荐）

Python 提供了 `csv` 标准库来操作 CSV 文件，使用字典格式更清晰：

```python title="04.csv入门.py"
import csv

# 写入 CSV 文件
with open("csv_data/02.csv", "w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, ["姓名", "年龄", "性别", "爱好"])
    writer.writeheader()  # 写入表头
    writer.writerow({"姓名": "张三", "年龄": 18, "性别": "男", "爱好": "C++,C"})
    writer.writerow({"姓名": "王五", "年龄": 20, "性别": "男", "爱好": "Java"})
    writer.writerow({"姓名": "李四", "年龄": 19, "性别": "女", "爱好": "Python"})

# 读取 CSV 文件
with open("csv_data/02.csv", "r", encoding="utf-8", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)  # 每行数据是一个字典
```

::: warning 注意
使用 `csv` 模块配合 `open` 函数时，需要设置 `newline=""` 参数，否则写入时会多出空行。
:::

**常用类：**

| 类 | 说明 |
|:---:|:---:|
| `csv.DictWriter` | 字典写入器，写入时传入字典格式数据 |
| `csv.DictReader` | 字典读取器，读取时返回字典格式数据 |

**常用方法：**

| 方法 | 说明 |
|:---:|:---:|
| `writeheader()` | 写入表头 |
| `writerow(dict)` | 写入一行数据 |
| `writerows(list)` | 写入多行数据 |

## 2.案例需求分析

### 2.1 案例需求

开发一个网络机器人程序，获取 TMDB 电影网站中高分电影榜单前 100 名的数据，并保存到 CSV 文件中。

**需要获取的数据字段：**

| 字段 | 说明 |
|:---:|:---:|
| 电影名 | 电影的名称 |
| 年份 | 电影发布的年份 |
| 上映时间 | 电影的上映日期 |
| 类型 | 电影的类型（剧情、犯罪等） |
| 时长 | 电影的时长 |
| 评分 | 电影的评分 |
| 语言 | 电影的语言 |
| 导演 | 电影的导演 |
| 作者 | 电影原著小说的作者 |
| 主演 | 电影的主要演员 |
| Slogan | 电影的宣传语 |
| 简介 | 电影的简介 |

### 2.2 操作步骤

1. **发送请求**：获取高分电影榜单数据
2. **解析数据**：获取电影列表中每部电影的详情 URL
3. **遍历电影列表**：访问每部电影的详情页，获取详细信息
4. **保存数据**：将电影详情保存到 CSV 文件

## 3.核心逻辑实现

### 3.1 导入模块

```python title="05.网络机器人-案例.py"
import csv
import requests
from lxml import html
```

### 3.2 定义常量

```python title="05.网络机器人-案例.py"
BASE_URL = "https://www.themoviedb.org"
URL_1 = "https://www.themoviedb.org/movie/top-rated"
URL_2 = "https://www.themoviedb.org/discover/movie/items"
```

### 3.3 主函数逻辑

```python title="05.网络机器人-案例.py"
if __name__ == '__main__':
    # 第一步：发送请求，获取高分电影榜单数据
    response = requests.get(URL_1, timeout=60)

    # 第二步：解析数据，获取电影列表
    doc = html.fromstring(response.text)
    all_movie_urls = doc.xpath("//*[@id='page_1']//div[@class='w-full mt-2 px-3 pb-3']//a/@href")

    # 第三步：遍历电影列表，获取电影详情
    for url in all_movie_urls:
        if url:
            movie_info_url = BASE_URL + url
            movie_info = get_movie_info(movie_info_url)
            all_movies.append(movie_info)

    # 第四步：保存电影详情到 CSV 文件
    save_all_movies(all_movies)
```

## 4.获取电影详情

### 4.1 get_movie_info 函数实现

```python title="05.网络机器人-案例.py"
def get_movie_info(movie_info_url):
    dict_data: dict[str, str] = {}

    # 发送请求
    movie_response = requests.get(movie_info_url)
    movie_doc = html.fromstring(movie_response.text)

    # 获取电影名称
    movie_name = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/h2/a/text()")
    dict_data["电影名"] = movie_name[0] if movie_name else ""

    # 获取年份
    movie_year = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/h2/span/text()")
    dict_data["年份"] = movie_year[0][1:5] if movie_year else ""

    # 获取上映时间
    movie_release_date = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='release']/text()")
    dict_data["上映时间"] = movie_release_date[0].strip() if movie_release_date else ""

    # 获取类型
    movie_type_list = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='genres']/a/text()")
    movie_type = "和".join(movie_type_list) if movie_type_list else ""
    dict_data["类型"] = movie_type

    # 获取时长
    movie_duration = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='runtime']/text()")
    dict_data["时长"] = movie_duration[0].strip() if movie_duration else ""

    # 获取评分
    movie_percent = movie_doc.xpath("//*[@id='consensus_pill']/div/div[1]/div/div/@data-percent")
    dict_data["评分"] = movie_percent[0] if movie_percent else ""

    # 获取语言
    movie_language = movie_doc.xpath("//*[@id='media_v4']/div/div/div[2]/div/section/div[1]/div/section[1]/p[3]/text()")
    dict_data["语言"] = movie_language[0].strip() if movie_language else ""

    # 获取导演
    movie_director = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[3]/ol/li[1]/p[1]/a/text()")
    dict_data["导演"] = movie_director[0] if movie_director else ""

    # 获取作者
    movie_author = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[3]/ol/li[2]/p[1]/a/text()")
    dict_data["作者"] = movie_author[0] if movie_author else ""

    # 获取主演
    movie_actor = movie_doc.xpath("//*[@id='cast_scroller']/ol/li/p[1]/a/text()")
    if "查看更多" in movie_actor:
        movie_actor.remove("查看更多")
    dict_data["主演"] = "，".join(movie_actor) if movie_actor else ""

    # 获取 Slogan
    movie_slogan = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[3]/h3[1]/text()")
    dict_data["Slogan"] = movie_slogan[0].strip() if movie_slogan else ""

    # 获取简介
    movie_introduction = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[3]/div/p/text()")
    dict_data["简介"] = movie_introduction[0] if movie_introduction else ""

    return dict_data
```

::: info 说明
使用三元表达式 `值[0] if 值 else ""` 可以避免索引越界错误，当 XPath 未匹配到数据时返回空字符串。
:::

## 5.保存电影详情

### 5.1 save_all_movies 函数实现

```python title="05.网络机器人-案例.py"
def save_all_movies(all_movies):
    with open("csv_data/movie_list.csv", "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, ["电影名", "年份", "上映时间", "类型", "时长", "评分", "语言", "导演", "作者", "主演",
                                    "Slogan", "简介"])
        writer.writeheader()
        writer.writerows(all_movies)
```

## 6.获取分页数据

### 6.1 分页原理分析

默认访问高分电影榜单页面只返回前 20 条数据。要获取更多数据，需要通过 POST 请求加载后续页面。

**分页请求分析：**
- 第一页：GET 请求，直接访问 URL
- 第二页及以后：POST 请求，请求路径为 `/discover/movie/items`

### 6.2 循环获取分页数据

```python title="05.网络机器人-案例.py"
for e in range(2, 6):
    params = f"air_date.gte=&air_date.lte=&certification=&certification_country=CN&debug=&first_air_date.gte=&first_air_date.lte=&include_adult=false&include_softcore=false&latest_ceremony.gte=&latest_ceremony.lte=&page={e}&primary_release_date.gte=&primary_release_date.lte=&region=&release_date.gte=&release_date.lte=2026-09-21&show_me=everything&sort_by=vote_average.desc&vote_average.gte=0&vote_average.lte=10&vote_count.gte=300&watch_region=CN&with_genres=&with_keywords=&with_networks=&with_origin_country=&with_original_language=&with_watch_monetization_types=&with_watch_providers=&with_release_type=&with_runtime.gte=0&with_runtime.lte=400"
    response = requests.post(URL_2, data=params, timeout=60)
    doc = html.fromstring(response.text)
    page_urls = doc.xpath(f"//*[@id='page_{e}']//div[@class='w-full mt-2 px-3 pb-3']//a/@href")
    all_movie_urls.extend(page_urls)
```

::: info 说明
- 通过 `page` 参数控制加载第几页的数据
- 使用 `requests.post()` 发送 POST 请求
- 使用 `extend()` 方法将新获取的 URL 添加到列表中
:::

## 7.程序完善

### 7.1 异常数据处理

在抓取数据后，需要检查 CSV 文件中是否有空值（None）。可能的原因：
1. 原始页面本身没有该数据
2. XPath 表达式与页面结构不匹配

**验证方法：** 在浏览器中打开对应电影的详情页，检查是否存在该数据。

### 7.2 页面结构兼容

部分电影详情页的结构可能与其他页面不同，导致 XPath 无法匹配。解决方案是使用 `class` 属性匹配：

```python
# 优化前：按位置匹配（可能因结构不同而失败）
movie_release_date = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[2]/text()")

# 优化后：按 class 属性匹配（更稳定）
movie_release_date = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='release']/text()")
movie_type_list = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='genres']/a/text()")
movie_duration = movie_doc.xpath("//*[@id='original_header']/div[2]/section/div[1]/div/span[@class='runtime']/text()")
```

::: warning 注意
XPath 表达式需要结合当前网站的页面结构来编写。如果网站结构更新，可能需要调整 XPath 表达式。
:::
