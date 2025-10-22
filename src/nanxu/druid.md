---
title: Druid
icon: database
---
## 1.导入Druid

SpringBoot3使用druid-spring-boot-3-starter，SpringBoot2使用druid-spring-boot-starter

```xml title="pom.xml"
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid-spring-boot-3-starter</artifactId>
    <version>1.2.27</version>
</dependency>
```

## 2.密钥生成

如果要配置加密后的数据库密码，需要先生成密码和密钥，这里只会用到公钥和加密后的密码

1. 找到maven仓库下com/alibaba/druid对应版本的jar

2. 执行java -cp druid-1.2.27.jar com.alibaba.druid.filter.config.ConfigTools 123456

3. 生成后的密钥为

   `privateKey:MIIBUgIBADANBgkqhkiG9w0BAQEFAASCATwwggE4AgEAAkEAgC2lKwqcOVD9n0OMMfnlA1VOLgo4boGsd27lC2JyaOS4F78PY/lQ9W21lZ3/RebgWNbVB0qRI5FXvRyaaXTxwQIDAQABAj91lyFdf8wbpHq/WF1Fe/wLEsnK4LoJOX/a7U8za6/TZUOXogjxW+8GPJTVTnj7X8sBzen0c+cbB5SO+p36/xECIQDQSpddGxt8R1BGOMMVbxH0UCbF4uB5lohmqVmy7MeuywIhAJ2Jh7aj1+R078W1vIbMuKvGKwGzlijZkOoNPARWyqQjAiBNvunMmOejdcLi0yEOCQ08kgZG6q469BMprqCKhpLqDQIgLTyn1t9XiEe37lsQZtj0kobWJKfwD4ziGwNv34MYr2cCIAkswtgBvFpfLk6DpwvmDtVFFmzJc6p0FiZi92lNzzVL`

   `publicKey:MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIAtpSsKnDlQ/Z9DjDH55QNVTi4KOG6BrHdu5QticmjkuBe/D2P5UPVttZWd/0Xm4FjW1QdKkSORV70cmml08cECAwEAAQ==`

   `password:V3oOdcwPpI7zy9n+aBe0tr7pgEFancxlnNpdRU2RSSxsZ4j2QdpbtfdG0qMPWPrJfXcTOStkExKT74TqaJmj2A==`

## 3.配置

```yaml title="application.yml"
spring:
  datasource:
    druid:
      driver-class-name: com.mysql.cj.jdbc.Driver
      url: jdbc:mysql://localhost:3306/nanxu?characterEncoding=utf8&serverTimezone=UTC
      username: root
      password: V3oOdcwPpI7zy9n+aBe0tr7pgEFancxlnNpdRU2RSSxsZ4j2QdpbtfdG0qMPWPrJfXcTOStkExKT74TqaJmj2A==
      # AOP 监控扫描路径
      aop-patterns: com.nanxu.service.*, com.nanxu.controller.*
      connection-properties: config.decrypt=true;config.decrypt.key=MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIAtpSsKnDlQ/Z9DjDH55QNVTi4KOG6BrHdu5QticmjkuBe/D2P5UPVttZWd/0Xm4FjW1QdKkSORV70cmml08cECAwEAAQ==
      # 初始化连接池大小
      initial-size: 5
      # 最小空闲连接数
      min-idle: 5
      # 最大活跃连接数
      max-active: 20
      # 获取连接最大等待时间（毫秒）
      max-wait: 60000
      # 是否在空闲时检测连接
      test-while-idle: true
      # 检测空闲连接的时间间隔（毫秒）
      time-between-eviction-runs-millis: 60000
      # 连接最小生存时间（毫秒）
      min-evictable-idle-time-millis: 300000
      # 连接最大生存时间（毫秒）
      max-evictable-idle-time-millis: 900000
      # 连接有效性验证 SQL
      validation-query: SELECT 1 FROM DUAL
      # 借出连接时测试
      test-on-borrow: true
      # 归还连接时测试
      test-on-return: true
      # 禁用预编译语句池化
      pool-prepared-statements: false
      # 启用 Web 统计过滤器
      web-stat-filter:
        enabled: true
        # Druid 监控后台配置
      stat-view-servlet:
        enabled: true
        # 监控页面访问路径
        url-pattern: /druid/*
        # login-username: admin
        # login-password: 123456
      filter:
        # 配置过滤器
        config:
          enabled: true
        # 统计过滤器
        stat:
          enabled: true
          # 记录慢 SQL
          log-slow-sql: true
          # 慢 SQL 阈值（毫秒）
          slow-sql-millis: 2000
          # 是否合并 SQL
          merge-sql: true
        # 防火墙过滤器
        wall:
          config:
            # 允许多条 SQL 语句执行
            multi-statement-allow: true
```

::: info
1. `type` com.alibaba.druid.pool.DruidDataSource：指定使用 Druid 连接池。
2. `initial-size` 初始化连接池大小，即连接池启动时创建的初始化连接数。
3. `min-idle` 最小连接池数量，连接池中保持的最小空闲连接数。
4. `max-active` 最大连接池数量，连接池中允许的最大活动连接数。
5. `max-wait` 连接时最大等待时间，当连接池中的连接已经用完时，等待从连接池获取连接的最长时间，单位是毫秒。
6. `test-while-idle` 连接空闲时是否执行检查。
7. `time-between-eviction-runs-millis` 配置多久进行一次检测，检测需要关闭的连接，单位是毫秒。
8. `min-evictable-idle-time-millis` 一个连接在连接池中最小生存的时间，单位是毫秒。
9. `max-evictable-idle-time-millis` 一个连接在连接池中最大生存的时间，单位是毫秒。
10. `validation-query` 测试连接是否可用的查询 SQL。
11. `test-on-borrow` 连接从连接池获取时是否测试连接的可用性。
12. `test-on-return` 连接返回连接池时是否测试连接的可用性。
13. `pool-prepared-statements` 是否缓存 PreparedStatement，默认为 false。每次执行SQL需要重新编译。
14. `web-stat-filter` 用于配置 Druid 的 Web 监控功能。在这里，enabled 表示是否开启 Web 监控功能。如果设置为 true，就可以通过浏览器访问 Druid 的监控页面。
15. `stat-view-servlet` 配置 Druid 的监控后台访问路径、登录用户名和密码。

    - `enabled` 表示是否开启监控后台功能。

    - `url-pattern` 指定了监控后台的访问路径，即通过浏览器访问监控页面时的 URL。

    - `login-username` 和 `login-password` 分别指定了监控后台的登录用户名和密码，用于访问监控后台时的身份验证。

16. `filter` 用于配置 Druid 的过滤器，包括统计过滤器和防火墙过滤器。

    - `config`: 用于配置 Druid 连接池的一些额外功能，比如密码解密等。

    - `stat` 配置 Druid 的统计过滤器。enabled 表示是否开启统计功能，log-slow-sql 表示是否开启慢 SQL 记录，slow-sql-millis 指定了执行时间超过多少毫秒的 SQL 语句会被认为是慢 SQL，merge-sql 表示是否开启 SQL 合并功能。

    - `wall` 配置 Druid 的防火墙过滤器。防火墙用于防止 SQL 注入攻击。在这里，config 配置了防火墙的规则，multi-statement-allow 表示是否允许执行多条 SQL 语句。
:::