---
title: 记录性能日志
icon: fas:fa-screwdriver-wrench
---

通过 AOP 实现接口性能监控，自动记录每个接口的执行时间、请求路径等性能指标。

## 1.引入AOP所需依赖

添加 Spring AOP 框架依赖以支持切面编程功能。

```xml title="pom.xml"
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-aop</artifactId>
</dependency>
```

## 2.自定义切面类

定义切面类拦截指定包路径下的控制器方法，统计接口执行性能。

::: warning
使用AOP向数据库记录性能日志前，需要先完成[异步记录日志](/docs/nanxu/loginLog.html)的相关配置。
:::

```java title="PerformanceLogAspect.java"
@Aspect
@Component
@RequiredArgsConstructor
public class PerformanceLogAspect {
    private final UnifiedLogService logService;

    @Around("execution(* com.nanxu.controller..*(..))*")
    public Object logPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTimeMillis = System.currentTimeMillis();
        try {
            return joinPoint.proceed();
        } finally {
            long endTimeMillis = System.currentTimeMillis();
            MethodSignature signature = (MethodSignature) joinPoint.getSignature();
            String methodName = signature.getName();
            logService.logPerformance(this, startTimeMillis, endTimeMillis, methodName);
        }
    }
}
```

## 3.性能日志事件

封装性能监控相关的信息，包括请求路径、执行时间等。

```java title="PerformanceLogEvent.java"
@Getter
public class PerformanceLogEvent extends BaseLogEvent {
    /**
     * 请求 URI
     */
    private final String uri;

    /**
     * 开始时间毫秒值
     */
    private final long startTimeMillis;

    /**
     * 结束时间毫秒值
     */
    private final long endTimeMillis;

    /**
     * 方法名称
     */
    private final String methodName;

    public PerformanceLogEvent(Object source, String uri, long startTimeMillis, long endTimeMillis, String methodName) {
        super(source);
        this.uri = uri;
        this.startTimeMillis = startTimeMillis;
        this.endTimeMillis = endTimeMillis;
        this.methodName = methodName;
    }
}
```

## 4.记录性能日志方法

在统一日志服务中新增性能日志记录方法。

```java title="UnifiedLogService.java"
public void logPerformance(Object source, long startTimeMillis, long endTimeMillis, String methodName) {
    String uri = ServletUtils.getRequest().getRequestURI();
    PerformanceLogEvent event = new PerformanceLogEvent(source, uri, startTimeMillis, endTimeMillis, methodName);
    publishLogEvent(event);
}
```

## 5.性能日志实体类

```java title="PerformanceLog.java"
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("performance_log")
public class PerformanceLog {
    /**
     * 主键
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 请求 URI
     */
    private String uri;

    /**
     * 方法名称
     */
    private String methodName;

    /**
     * 开始时间
     */
    private Date startTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 耗时
     */
    private Long time;
}
```

## 6.处理性能日志事件

在统一日志事件监听器中添加处理性能日志事件的方法。

```java title="UnifiedLogEventListener.java"
@Async
@EventListener
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handlePerformanceLogEvent(PerformanceLogEvent event) {
    PerformanceLog log = new PerformanceLog();

    log.setUri(event.getUri());
    log.setMethodName(event.getMethodName());
    long startTimeMillis = event.getStartTimeMillis();
    log.setStartTime(new Date(startTimeMillis));
    long endTimeMillis = event.getEndTimeMillis();
    log.setEndTime(new Date(endTimeMillis));
    log.setTime(endTimeMillis - startTimeMillis);

    performanceLogService.save(log);
}
```