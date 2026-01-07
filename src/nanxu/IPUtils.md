---
title: IP 工具类
icon: fas:fa-screwdriver-wrench
---

IP 工具类用于获取用户真实 IP 地址，通过多种 HTTP 头信息和请求参数来获取客户端的原始 IP 地址，有效处理了经过代理服务器、负载均衡器等网络设备转发后的情况。

## 1.实现原理
按照优先级依次从以下 HTTP 头中获取 IP 地址：
1. `X-Forwarded-For`
2. `X-Real-IP`
3. `X-Forwarded-Host`
4. `Proxy-Client-IP`
5. `WL-Proxy-Client-IP`
6. `HTTP_CLIENT_IP`
7. `HTTP_X_FORWARDED_FOR`
8. 最后使用 `request.getRemoteAddr()` 获取原始 IP

## 2. 工具类实现

```java title = "IPUtils.java"
@Slf4j
public class IPUtils {
    /**
     * 获取用户真实 IP 地址
     *
     * @param request HttpServletRequest
     * @return IP 地址
     */
    public static String getIpAddr(HttpServletRequest request) {
        if (request == null) {
            return "unknown";
        }

        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Forwarded-Host");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 多个IP地址的情况下，取第一个非unknown的有效IP
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        // 如果获取到的IP是0:0:0:0:0:0:0:1，则转换为127.0.0.1
        if ("0:0:0:0:0:0:0:1".equals(ip) || "localhost".equals(ip) || "127.0.0.1".equals(ip)) {
            return "127.0.0.1";
        }

        return ip;
    }
}
```