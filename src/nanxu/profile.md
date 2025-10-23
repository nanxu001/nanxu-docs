---
title: Yml
icon: file
---
通过在`pom.xml`中配置Profile，可以便捷地实现不同运行环境间的切换。
## Maven配置
在`pom.xml`文件中定义多个环境Profile。
```xml title="pom.xml"
<profiles>
    <profile>
        <id>dev</id>
        <properties>
            <profileActive>dev</profileActive>
        </properties>
        <activation>
            <activeByDefault>true</activeByDefault>
        </activation>
    </profile>
    <profile>
        <id>prod</id>
        <properties>
            <profileActive>prod</profileActive>
        </properties>
    </profile>
</profiles>
```
## YAML配置
在`application.yml`中引用Maven定义的环境变量。
```yaml title="application.yml"
spring:
  profiles:
    active: @profileActive@
```
## 环境切换操作
完成配置后，在Maven中选择对应环境Profile，刷新Maven项目并重新启动服务或执行打包操作，即可实现环境切换。
![选择环境](/assets/image/nanxu/selectEnvironment.png)
::: important
刷新Maven项目是环境切换的关键步骤，必须执行。
:::