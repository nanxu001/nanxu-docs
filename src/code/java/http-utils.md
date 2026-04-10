---
title: HTTP 工具类
icon: fas:globe
order: 6
---

WebClient 是 Spring WebFlux 提供的非阻塞式 HTTP 客户端，它支持同步和异步的调用方式，适合高并发场景下的服务通信。

## 1.引入相关依赖

在项目中引入 WebFlux 依赖来实现 HTTP 请求发送功能。

```xml title="pom.xml"
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```

## 2.配置 WebClient

### 2.1 配置文件设置

```yaml title="application.yml"
webclient:
  connect-timeout: 5000
  read-timeout: 10000
  # 2MB
  max-in-memory-size: 2097152
```

### 2.2 配置类实现

``` java title="WebClientConfig.java"
@Configuration
public class WebClientConfig {
    @Value("${webclient.connect-timeout}")
    private int connectTimeout;

    @Value("${webclient.read-timeout}")
    private int readTimeout;

    @Value("${webclient.max-in-memory-size}")
    private int maxInMemorySize;

    /**
     * 创建 WebClient
     *
     * @return WebClient
     */
    @Bean
    public WebClient webClient() {
        HttpClient httpClient = HttpClient.create()
                // 连接建立超时时间
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, connectTimeout)
                // 响应读取超时时间
                .responseTimeout(Duration.ofMillis(readTimeout))
                // 保持连接活跃
                .option(ChannelOption.SO_KEEPALIVE, true)
                // 禁用重定向以提高安全性
                .followRedirect(false);

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                // 设置响应体最大内存大小
                .codecs(config -> config.defaultCodecs().maxInMemorySize(maxInMemorySize))
                .build();
    }
}
```

## 3.Http工具类实现

```java title="HttpUtils.java"
@Component
@RequiredArgsConstructor
@Slf4j
public class HttpUtils {
    private final WebClient webClient;

    /**
     * 发送 GET 请求
     *
     * @param url    请求地址
     * @param params 请求参数
     * @return 响应结果
     */
    public String sendGet(String url, Map<String, String> params) {
        String finalUrl;

        if (!params.isEmpty()) {
            StringBuilder sb = new StringBuilder(url);
            sb.append("?");
            boolean isFirst = true;
            for (Map.Entry<String, String> entry : params.entrySet()) {
                if (!isFirst) {
                    sb.append("&");
                }

                String key = entry.getKey();
                String value = entry.getValue();
                if (value != null) {
                    sb.append(key).append("=").append(URLEncoder.encode(value, StandardCharsets.UTF_8));
                }

                isFirst = false;
            }

            finalUrl = sb.toString();
        } else {
            finalUrl = url;
        }
        
        return webClient.get()
                .uri(finalUrl)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
```