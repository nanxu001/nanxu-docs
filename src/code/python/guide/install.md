---
title: 安装Python环境
icon: fas:download
order: 1
---

## 1. 在Windows上安装Python
1. 前往[Python官网](https://www.python.org/)。

2. 点击Downloads，选择Windows。

![下载Python](/assets/image/code/python/guide/install/download.png)

3. 根据操作系统选择合适的版本（推荐使用最新稳定版）：
    - 对于现代Windows系统，通常选择64位版本 (如 Windows x86-64 executable installer)
    - 如果使用较旧的系统，请注意检查版本兼容性

::: warning
某些Python版本可能不再支持旧版Windows系统（如Windows 7），请在下载前仔细阅读版本说明。
:::

![选择版本](/assets/image/code/python/guide/install/version.png)

4. 运行下载的 exe 安装包，**强烈建议**：
   - 不要安装到C盘（避免权限问题和系统盘空间占用）
   - 不要在包含中文字符的目录下安装
   - 务必勾选 `Add Python * to PATH` 选项（这是最重要的一步）

5. 如果忘记勾选 `Add Python * to PATH`，可以通过以下方式手动配置环境变量：
   - 打开Python安装目录，点击上方地址栏复制路径
   - 打开控制面板 → 系统和安全 → 系统 → 高级系统设置

    ![高级系统设置](/assets/image/code/python/guide/install/system-info.png)

   - 点击"环境变量"

    ![环境变量](/assets/image/code/python/guide/install/path.png)
    
   - 在"系统变量"区域找到 Path，点击"编辑"

    ![选择Path](/assets/image/code/python/guide/install/choose-path.png)

   - 点击"新建"，粘贴刚才复制的Python安装路径，并将其移到列表顶部以确保优先级

        ![添加环境变量](/assets/image/code/python/guide/install/add-path.png)

   - 点击确定保存所有更改

6. 按 `Win + R` 组合键，输入 `cmd`并回车，打开命令提示符。

![cmd](/assets/image/code/python/guide/install/cmd.png)

7. 在命令提示符中输入 `python` 并按回车，如果显示Python版本信息如下图所示，则说明安装成功：

    ![安装成功](/assets/image/code/python/guide/install/install-success.png)

    如果出现 `'python' is not recognized as an internal or external command, operable program or batch file.` 的错误提示，则说明环境变量配置失败。
    此时请检查环境变量是否正确配置，或尝试重启计算机、重新打开命令提示符窗口后再测试。

## 2.安装PyCharm
1. 前往[PyCharm官网](https://www.jetbrains.com/zh-cn/pycharm/)。

2. 点击下载，选择 Windows 版本并下载。**注意事项：**
   - 下载后请将安装包保存到非C盘的目录
   - 确保安装路径不含中文字符
   - 建议创建专门的软件安装目录，便于管理

3. 双击下载完成的安装包，按照向导提示进行安装即可。