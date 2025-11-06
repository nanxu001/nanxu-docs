---
title: SpringBoot多环境配置
icon: fab:fa-envira
---

通过在`pom.xml`中配置 Profile，可以便捷地实现不同运行环境间的切换。

## 1.Maven 配置

在`pom.xml`文件中定义多个环境 Profile。

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

## 2.YAML 配置

在`application.yml`中引用 Maven 定义的环境变量。

```yaml title="application.yml"
spring:
  profiles:
    active: @profileActive@
```

## 3.环境切换操作

完成配置后，在 Maven 中选择对应环境 Profile，刷新 Maven 项目并重新启动服务或执行打包操作，即可实现环境切换。

![选择环境](/assets/image/nanxu/selectEnvironment.png)
::: important
刷新 Maven 项目是环境切换的关键步骤，必须执行。
:::

## 4.参考

[超详细！Spring Boot项目结合Maven Profile实现多环境切换，轻松搞定开发部署难题](https://zhuanlan.zhihu.com/p/27785070891)