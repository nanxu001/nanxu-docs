---
title: Redis
icon: fas:fa-server
---

## 1.引入 Redis 依赖

在项目中添加以下依赖以启用 Redis 功能。

```xml title="pom.xml"
<!-- Spring Boot Redis Starter 依赖，提供 Redis 相关功能支持 -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>

<!-- Alibaba FastJSON2 依赖，用于高性能的 JSON 序列化和反序列化 -->
<dependency>
    <groupId>com.alibaba.fastjson2</groupId>
    <artifactId>fastjson2</artifactId>
    <version>2.0.60</version>
</dependency>
```

## 2.Redis 配置

### 2.1 连接池配置

在`application.yml`中配置 Redis 连接池参数。

```yaml title="application.yml"
spring:
  data:
    redis:
      host: localhost
      port: 6379
      password: 123456
      # 连接超时时间
      timeout: 10s
      lettuce:
        pool:
          # 连接池中的最小空闲连接
          min-idle: 2
          # 连接池中的最大空闲连接
          max-idle: 16
          # 连接池的最大数据库连接数
          max-active: 32
          # #连接池最大阻塞等待时间（使用负值表示没有限制）
          max-wait: 10000ms
```

### 2.2 Redis 序列化配置

默认情况下，`RedisTemplate`仅支持`RedisTemplate<String,String>`，只能存储字符串类型数据。通过自定义`RedisTemplate`并设置序列化器，可以实现任意对象的序列化存储。

```java title="RedisConfig.java"
@Configuration
@EnableCaching
public class RedisConfig {
    /**
     * 配置RedisTemplate用于自定义Redis序列化方式
     *
     * @param factory Redis连接工厂，用于创建与Redis服务器的连接
     * @return 配置好的RedisTemplate实例
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        // 设置连接工厂，用于与 Redis 建立连接
        template.setConnectionFactory(factory);

        // 创建StringRedisSerializer，用于字符串类型的序列化
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);

        // 创建FastJson2JsonRedisSerializer，用于将对象序列化为JSON格式
        FastJson2JsonRedisSerializer<Object> fastJson2JsonRedisSerializer = new FastJson2JsonRedisSerializer<>(Object.class);
        // value序列化方式采用jackson
        template.setValueSerializer(fastJson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(fastJson2JsonRedisSerializer);

        // 初始化模板属性
        template.afterPropertiesSet();

        return template;
    }
}
```

### 2.3 FastJson2 序列化器实现

```java title="FastJson2JsonRedisSerializer.java"
public record FastJson2JsonRedisSerializer<T>(Class<T> clazz) implements RedisSerializer<T> {
    // 按需加上需要支持自动类型的类名前缀，范围越小越安全
    static final Filter AUTO_TYPE_FILTER = JSONReader.autoTypeFilter("com.nanxu.domain.pojo");

    /**
     * 序列化对象为字节数组
     *
     * @param t 需要序列化的对象
     * @return 序列化后的字节数组
     * @throws SerializationException 抛出序列化异常
     */
    @Override
    public byte[] serialize(T t) throws SerializationException {
        try {
            if (t == null) {
                return new byte[0];
            }

            // 添加更多序列化特性以提高安全性和兼容性
            return JSON.toJSONBytes(
                    t,
                    // WriteClassName: 写入类名信息以便反序列化时能正确还原对象类型
                    JSONWriter.Feature.WriteClassName,
                    // FieldBased: 基于字段而非getter方法进行序列化，提高性能和一致性
                    JSONWriter.Feature.FieldBased,
                    // IgnoreErrorGetter: 忽略getter方法执行异常，避免因getter方法问题导致序列化失败
                    JSONWriter.Feature.IgnoreErrorGetter
            );
        } catch (Exception ex) {
            throw new SerializationException("无法序列化: " + ex.getMessage(), ex);
        }
    }

    /**
     * 反序列化字节数组为指定类型的对象
     *
     * @param bytes 需要反序列化的字节数组
     * @return 反序列化后的对象实例
     * @throws SerializationException 抛出反序列化异常
     */
    @Override
    public T deserialize(byte[] bytes) throws SerializationException {
        try {
            if (bytes == null || bytes.length == 0) {
                return null;
            }

            // 使用FastJSON将字节数组反序列化为指定类型的对象
            return JSON.parseObject(bytes, clazz, AUTO_TYPE_FILTER);
        } catch (Exception ex) {
            throw new SerializationException("无法反序列化: " + ex.getMessage(), ex);
        }
    }
}
```
