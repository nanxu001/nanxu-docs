---
title: 地址工具类
icon: fas:fa-screwdriver-wrench
---

地址工具类通过集成高德地图 API 实现根据用户 IP 地址查询地理位置信息的功能。

## 1. 技术实现

### 1.1 API 服务提供商

使用[高德地图 IP 定位 API](https://lbs.amap.com/api/webservice/guide/api/ipconfig/)提供的 IP 地址定位服务，该服务能够根据 IP 地址返回对应的地理位置信息。

### 1.2 配置参数

- `addre.url`: 高德地图 IP 定位 API 的请求地址
- `address.key`: 高德地图开发者密钥，用于 API 调用认证

## 2.工具类实现

```java title="AddressUtils.java"
@Slf4j
@Component
@RequiredArgsConstructor
public class AddressUtils {
    private final HttpUtils httpUtils;

    @Value("${address.url}")
    private String url;

    @Value("${address.key}")
    private String key;

    public String getAddressByIp(String ip) {
        HashMap<String, String> params = new HashMap<>();
        params.put("key", key);
        params.put("ip", ip);

        String response = httpUtils.sendGet(url, params);
        JSONObject jsonObject = JSONObject.parseObject(response);
        String status = jsonObject.getString(ADDRESS_STATUS);
        if (ADDRESS_STATUS_FAIL.equals(status)) {
            String info = jsonObject.getString(ADDRESS_INFO);
            log.warn("请求失败：{}", info);
            return "未知地址";
        }
        String province = jsonObject.getString(ADDRESS_PROVINCE);
        String city = jsonObject.getString(ADDRESS_CITY);
        return province + " " + city;
    }
}
```