---
title: Swagger3
icon: far:fa-file-lines
---
## 1.引入Swagger3

通过Maven依赖引入Swagger3相关组件，为项目提供API文档生成功能支持。

```xml title="pom.xml"
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.13</version>
</dependency>
```

## 2.配置

创建Swagger配置类，自定义API文档的基本信息和元数据。

```java title="SwaggerConfig.java"
@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI springShopOpenApi() {
        return new OpenAPI()
                .info(new Info().title("Spring Boot 中使用 Swagger UI 构建 RESTful API")
                        .contact(new Contact())
                        .description("Nanxu提供的 RESTful API")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")))
                .externalDocs(new ExternalDocumentation()
                        .description("外部文档")
                        .url("https://springshop.wiki.github.org/docs"));
    }
}
```

## 3.指定访问路径

配置API文档和UI界面的访问路径，可根据实际需求进行自定义设置。

```yaml title="application.yml"
springdoc:
  api-docs:
    # 开启OpenApi接口
    enabled: true
    # 自定义路径，默认为 "/v3/api-docs"
    path: /v3/api-docs
  swagger-ui:
    # 开启swagger界面，依赖OpenApi，需要OpenApi同时开启
    enabled: true
    # 自定义路径，默认为"/swagger-ui/index.html"
    path: /swagger-ui/index.html
```
## 4.配置拦截器

在拦截器中放行`/swagger-ui/**`和`/v3/api-docs/**`，确保无需认证即可访问API文档界面。

```java
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        // 基于 token，不需要 csrf
        .csrf(AbstractHttpConfigurer::disable)
        // 开启跨域以便前端调用接口
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .authorizeHttpRequests(authorize -> authorize
                // 指定某些接口不需要通过验证即可访问。登录接口肯定是不需要认证的
                .requestMatchers("/admin/system/index/login").permitAll()
                // 静态资源，可匿名访问
                .requestMatchers(HttpMethod.GET, "/").permitAll()
                .requestMatchers(HttpMethod.GET, "/**.html").permitAll()
                .requestMatchers(HttpMethod.GET, "/**.css").permitAll()
                .requestMatchers(HttpMethod.GET, "/**.js").permitAll()
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/druid/**").permitAll()
                // 其它所有接口需要认证才能访问
                .anyRequest().authenticated()
        )
        // 基于 token，不需要 session
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .build();
}
```