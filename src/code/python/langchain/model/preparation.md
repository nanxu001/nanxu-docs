---
title: 模型调用的准备工作
icon: fas:screwdriver-wrench
order: 1
---

## 1.大模型的调用

在 LangChain 0.3 时代的文档中，Model I/O 包含三部分：输入提示（Format）、调用模型（Predict）、输出解析（Parse），分别对应 `Prompt Template`、`Model` 和 `Output Parser`。

![Model I/O：输入提示（Format）、调用模型（Predict）、输出解析（Parse）](/assets/image/code/python/langchain/model/preparation/langchain-model-io-flow.png)

关于模型调用模块，如今对话模型已是主要形式。这要从历史说起：

在 GPT-3 时代，大模型以 `补全模型` 为主，只能以类似“成语接龙”的方式对文本进行补全，并且实际运行效果也 `非常不稳定`。此时 LangChain 借助高层封装的 API，能够让模型完成对话、调用外部工具，甚至结构化输出等功能，为开发者提供了极大的便利。

伴随着 GPT-3.5 模型的发布，`对话模型` 正式登上历史的舞台，并逐渐 `成为主流`。而得益于对话模型更强的指令跟随能力，很多 GPT-3 需要借助 LangChain 才能完成的工作，已经成为 GPT-3.5 原生自带的一些功能。

> 因此，本章只涉及对话模型的创建与调用，不再讨论非对话的补全模型。

## 2.模型初始化的分类方式

> 简单说：用**谁**的 API、以**什么方式**、把模型创建在**哪里**。

**角度 1：调用谁家的 API**

- 使用模型提供商的库
- 使用 LangChain 统一方式（推荐）

**角度 2：模型初始化时，几个重要参数（如 `base_url`、`api_key`）的存放位置不同：**

- 使用配置文件（推荐）
- 硬编码：写在代码文件中

**角度 3：调用的模型所在位置**

- 在线部署的大模型
- 本地部署的大模型

:::info 说明
LangChain 作为一个“工具”，本身不提供任何模型，而是依赖第三方集成各种大模型。这里的关键就是：模型到底部署在哪里。
:::

## 3.线上大模型服务平台

有许多提供大模型 API 服务的平台，注册、充值并创建 API-Key 后，即可用 API-Key 与 base_url 调用该平台的模型。

| 平台 | 网址 | 备注 |
| :---: | :---: | :---: |
| OpenRouter | https://openrouter.ai/ | 全球主流,含国外模型 |
| CloseAI | https://platform.closeai-asia.com/ | 亚洲最大,含国外模型 |
| 阿里云百炼 | https://bailian.console.aliyun.com/ | 企业端友好 |
| 硅基流动 | https://www.siliconflow.cn/ | 性价比高，适合个人 |
| 百度千帆 | https://console.bce.baidu.com/qianfan/overview | 主打百度生态 |
| 火山引擎 | https://console.volcengine.com/ark/ | 主打字节多模态生态 |

配置上述任一平台时，都需要三个要素：`模型名`、`api-key`、`base-url`。

## 4.环境准备

### 4.1 为什么用虚拟环境

相较于全局环境（系统环境），各个虚拟环境都有自己独立的一套：Python 解释器、pip 命令、第三方依赖包，不和其它项目产生干扰。

![全局环境与各项目虚拟环境的隔离](/assets/image/code/python/langchain/model/preparation/global-vs-virtual-env.png)

### 4.2 conda / uv / venv 怎么选

虚拟环境的实现工具有好几种，各有适用场景。

**方案 1 使用 conda：适合“Python + 非 Python 依赖”的复杂环境**

conda 不只是 Python 包管理工具，它还可以管理 Python 解释器、Python 包，以及很多非 Python 依赖，比如：**CUDA**、**编译器**、**系统库**、**数据库驱动**、**科学计算底层库**等非 Python 依赖。

因此在数据科学、深度学习、AI 工程、科学计算等场景中，conda 更稳妥、优先推荐。

注意：**conda 环境中可以使用 pip，但建议先用 conda 装底层依赖，再用 pip 补充 Python 包，不要随意反复交替使用。**

**方案 2 使用 uv：适合“纯 Python 项目”的现代包管理**

uv 是一个现代 Python 包管理工具，主要管理 Python 生态依赖，不能像 conda 那样管理 CUDA、系统级数据库驱动、编译器这类通用非 Python 依赖。

如果项目主要是普通 Python 开发，这类项目通常可以**优先考虑 uv**。例如：

- FastAPI 项目
- LangChain 项目
- 脚本工具
- Web 后端
- 普通 AI Agent 应用
- RAG 应用层代码

**方案 3 使用 venv：Python 自带的轻量级虚拟环境工具**

`venv` 是 Python 官方自带的虚拟环境工具，不需要额外安装。

它的特点是简单、轻量：

```cmd
python -m venv .venv
```

**注意**：venv 不负责安装新的 Python 解释器，只能基于当前已经安装好的 Python 解释器创建虚拟环境。同时，venv 也不负责管理 CUDA、系统库等非 Python 依赖。

**三者对比：**

| 工具 | 管理 Python 解释器 | 管理 Python 包 | 管理非 Python 依赖 | 适合场景 |
| :---: | :---: | :---: | :---: | :---: |
| conda | ✅可以 | ✅可以 | ✅可以 | AI、深度学习、科学计算、复杂底层依赖（C/C++、CUDA） |
| uv | ✅可以 | ✅可以 | ❌不可以 | 纯 Python 项目、Web、Agent、RAG 应用层 |
| venv | 不支持原生安装，基于已有解释器 | ✅可以 | ❌不可以 | 简单项目、教学演示、轻量隔离 |

按上表：LangChain 属于**纯 Python 项目**，uv 和 pip 都能装，conda 也能装；只有当同一个环境里还需要 CUDA、编译器这类非 Python 依赖时（比如后续要做本地模型推理），才应该优先用 conda。

### 4.3 安装 Miniconda

conda 有两个发行版：**Anaconda** 体积大、预装大量科学计算包；**Miniconda** 只含 conda 与 Python，用多少装多少。课程使用 Miniconda。

下载地址：[https://docs.conda.io/projects/miniconda/en/latest/](https://docs.conda.io/projects/miniconda/en/latest/)

安装过程中有几个选项需要留意：

| 选项 | 建议 | 原因 |
| :---: | :---: | :---: |
| Install for | Just Me 或 All Users，见下方说明 | 决定后续能否直接往 `envs` 目录里写环境 |
| 安装路径 | 不带空格和中文，例如 `D:\dev\miniconda3` | 路径含空格时个别工具链会解析出错 |
| Add Miniconda3 to my PATH | **不勾** | 避免与系统里已有的 Python 打架 |
| Register Miniconda3 as my default Python | 可不勾 | 勾了会把系统默认 Python 指向 conda |

:::tip Just Me 与 All Users 的区别
`Just Me` 装到当前用户目录（如 `C:\Users\<用户名>\miniconda3`），你对它完全可写，`conda create` 会直接在它的 `envs` 下建环境。

`All Users` 装到公共目录（如 `C:\ProgramData\miniconda3`，或你指定的 `D:\dev\miniconda3`），**普通用户对该目录只有读权限**。此时 `conda create` 会因为写不进去，退而把环境建到你的用户目录 —— 这就是“环境莫名其妙跑到 C 盘”的根源，处理办法见 4.4.3。
:::

装完之后命令行里还敲不出 `conda`（因为没勾 Add to PATH），两种做法：

**做法 1（推荐）：初始化 shell**

```cmd
:: 让 cmd 认识 conda，执行后重开命令行窗口
"<安装目录>\Scripts\conda.exe" init cmd.exe

:: 让 PowerShell 认识 conda
"<安装目录>\Scripts\conda.exe" init powershell
```

**做法 2：用安装器自带的 Anaconda Prompt**

开始菜单里搜 `Anaconda Prompt (miniconda3)`，这个窗口里 `conda` 开箱即用。

验证：

```cmd
conda --version
conda env list
```

### 4.4 环境与包缓存放在哪

#### 4.4.1 默认位置：为什么环境会建到 C 盘

conda 涉及两个目录，分工不同：

| 目录 | 存什么 | 是否共享 | 能否删 |
| :---: | :---: | :---: | :---: |
| `envs_dirs` | 环境本体：Python 解释器、`Lib\site-packages`、`Scripts` | 每个环境独立一份 | 删环境才消失 |
| `pkgs_dirs` | 包缓存：下载的安装包和解压后的内容 | **所有环境共享** | 可随时 `conda clean` 清掉，不影响已建环境 |

建环境时，conda 会按 `envs_dirs` 的**顺序**找“第一个可写”的目录。默认顺序通常是：

```
<安装目录>\envs
C:\Users\<用户名>\.conda\envs
C:\Users\<用户名>\AppData\Local\conda\conda\envs
```

所以按 `All Users` 方式安装、又用普通用户执行 `conda create` 时，第一项不可写，环境就落到了第二项 —— `conda env list` 里会显示成 `C:\Users\<用户名>\.conda\envs\langchain1.2`，C 盘空间跟着被吃掉。

查看当前配置：

```cmd
conda config --show envs_dirs pkgs_dirs
```

#### 4.4.2 改到 D 盘：envs_dirs 与 pkgs_dirs

在用户目录下新建或修改 `.condarc`（即 `C:\Users\<用户名>\.condarc`）：

```yaml
channels:
  - https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main/
  - defaults
envs_dirs:
  - D:\dev\miniconda3\envs
  - C:\Users\Nanxu\.conda\envs
pkgs_dirs:
  - D:\dev\miniconda3\pkgs
  - C:\Users\Nanxu\.conda\pkgs
```

要点：

- **顺序即优先级**，写在最前面的先被选用；保留用户目录作为备份，删掉也没关系。
- **`envs_dirs` 与 `pkgs_dirs` 必须放在同一块盘**：conda 装包时用**硬链接**把缓存里的文件链进环境，同盘只占一份空间；跨盘没法硬链接，只能真复制，空间直接翻倍。
- 也可以单次指定路径：`conda create -p D:\dev\conda-envs\demo python=3.13.12`，之后激活要用完整路径。
- 改完**重开命令行窗口**才生效。

#### 4.4.3 all-users 安装的权限问题

按 4.4.1 的分析，`All Users` 安装后想让环境落在安装目录里，得先解决写权限。

**做法 1（推荐）：改 `.condarc` 指到别处**

直接在 `D:\` 下另建一个目录给 conda 用，把 `envs_dirs` / `pkgs_dirs` 指过去，完全不动系统权限。

**做法 2：用管理员身份给目录授权**

```cmd
:: 在管理员命令行里执行，Nanxu 换成你的用户名
icacls "D:\dev\miniconda3\envs" /grant "Nanxu:(OI)(CI)M"
```

:::warning 只授权还不够
授权只解决了“能不能写”，但 conda 仍然按 `envs_dirs` 的顺序挑第一个可写的目录 —— 而用户目录 `C:\Users\<用户名>\.conda\envs` 一直可写且排在前面。所以**必须同时把 D 盘的目录提到 `envs_dirs` 第一位**，否则环境照样建到 C 盘。
:::

另外，`pkgs` 目录如果要放在安装目录下，父目录 `<安装目录>` 本身通常也不可写，需要单独建好并授权：

```cmd
mkdir "D:\dev\miniconda3\pkgs"
icacls "D:\dev\miniconda3\pkgs" /grant "Nanxu:(OI)(CI)M"
```

#### 4.4.4 验证与清理

| 命令 | 作用 |
| :---: | :---: |
| `conda info` | 看 base 位置、当前环境、`envs_dirs` 等全部信息 |
| `conda config --show envs_dirs pkgs_dirs` | 只看目录配置及其顺序 |
| `conda env list` | 列出所有环境及所在路径 |
| `conda clean --all` | 清理包缓存（已建环境不受影响） |

改完环境变量或目录配置后，**已经打开的终端不会自动更新**，要重开窗口；PyCharm、VS Code 这类 IDE 有时还要重启，因为它们的环境变量是启动时的快照。

### 4.5 创建、切换与删除环境

LangChain 1.2 要求 Python 3.10 及以上，课程统一使用 `Python 3.13.12`。

```cmd
# 创建一个名为 langchain1.2 的环境，指定 Python 版本是 3.13.12
conda create --name langchain1.2 python=3.13.12

# 查看 Anaconda 安装好的 python 环境
conda env list

# 初始化虚拟环境（执行完此指令，重新启动命令行窗口）
conda init

# 在命令行窗口切换到该环境
conda activate langchain1.2

# 验证 python 版本
python --version
```

退出与删除：

```cmd
# 退出当前环境
conda deactivate

# 删除一个已有的环境（连同其下所有包）
conda remove --name langchain1.2 --all
```

> 激活成功后，命令行提示符前会出现 `(langchain1.2)`，表示当前处于该环境。想关掉这个前缀，可执行 `conda config --set changeps1 false`。

## 5.安装依赖

### 5.1 用 conda 安装

```cmd
# 安装指定版本，比如 1.2.12
conda install langchain==1.2.12

# 或者安装最新版（默认仓库）
conda install langchain

# 指定频道（如 conda-forge）
conda install -c conda-forge langchain==1.2.12

# 更新包
conda update langchain

# 卸载包
conda uninstall langchain

# 查看已安装包
conda list
```

:::info 说明
conda 包通常来自 defaults 或 conda-forge。

- `-c`：是 `--channel` 的缩写，用于指定包的安装来源渠道。
- `conda-forge`：该源比官方默认渠道更新更快、包更全。
:::

### 5.2 用 pip 安装

```cmd
# 安装指定版本
pip install langchain==1.2.12

# 安装最新版（不推荐）
pip install langchain

# 使用国内镜像加速（-i 指定镜像源）
pip install langchain==1.2.12 -i https://pypi.tuna.tsinghua.edu.cn/simple

# 从旧版本升级到新版本
pip install --upgrade langchain

# 卸载包
pip uninstall langchain

# 查看已安装包
pip list
```

:::info conda 与 pip 的分工
conda 依赖检查严格，能管环境、Python 包和非 Python 依赖；pip 相对宽松，只管 Python 包。

**建议：同一个环境里，先用 conda 装底层依赖，再用 pip 补充纯 Python 包，不要反复交替使用。**
:::

pip 默认从官方源 `pypi.org` 下载，国内速度不稳定，建议配一次镜像（写进用户配置，对所有环境生效）：

```cmd
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn
```

配置文件位于 `C:\Users\<用户名>\AppData\Roaming\pip\pip.ini`。注意 **conda 的 `.condarc` 只管 `conda install`，对 pip 完全无效**，两者要分别配置。临时想用官方源，命令里加 `-i https://pypi.org/simple` 即可。

### 5.3 用 requirements.txt 一次装齐

开发中会涉及多个库的安装，这里统一声明在 <a href="/assets/file/code/python/langchain/requirements.txt" download><code>requirements.txt</code></a> 中。LangChain 版本迭代较快，不同版本之间可能存在兼容问题，因此课程通过 `requirements.txt` **固定主要依赖版本**。

用法：将 `requirements.txt` 放到项目目录下，在已激活的 `langchain1.2` 环境中执行：

```cmd
pip install -r .\requirements.txt
```

后续部分章节会单独列出该章涉及的核心库，便于理解，**无需重复安装**——它们都已包含在 `requirements.txt` 中。

## 6.验证安装

装完后做一次快速自检，确认解释器、依赖都到位：

```python
import sys
import langchain
import langchain_core
from langchain_deepseek import ChatDeepSeek

print(sys.executable)          # 应指向 <安装目录>\envs\langchain1.2\python.exe
print(langchain.__version__)   # 1.2.12
print(langchain_core.__version__)
print(ChatDeepSeek)            # 能看到这个类，说明 langchain-deepseek 装好了
```

期望输出（版本号以你实际安装为准）：

```
D:\dev\miniconda3\envs\langchain1.2\python.exe
1.2.12
1.2.18
<class 'langchain_deepseek.chat_models.ChatDeepSeek'>
```
