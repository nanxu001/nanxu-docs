---
title: 全局异常处理
icon: fas:fa-bug
order: 11
---

全局异常处理机制用于捕获和处理应用程序中未被捕获的异常，提供统一的异常处理流程和响应格式。该机制不仅能够确保系统在发生异常时返回标准化的错误信息，还可以根据需要自定义异常处理后的操作，如将异常信息记录到数据库中进行后续分析。

::: warning
使用全局异常处理向数据库记录日志功能前，需要先完成[异步记录登录日志](/code/java/loginLog.html)的相关配置，如不需要此功能可以跳过相关配置。
:::

## 1.全局异常处理器

定义全局异常处理逻辑，捕获运行时异常并返回统一的错误响应。

```java title="GlobalExceptionHandler.java"
@Slf4j
@RestControllerAdvice
@RequiredArgsConstructor
public class GlobalExceptionHandler {
    private final UnifiedLogService logService;

    @ExceptionHandler(RuntimeException.class)
    public Result handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        log.error("{} 发生异常", request.getRequestURI(), e);
        // 登录失败异常不记录日志
        if (!isLoginFailureException(request)) {
            logService.logException(this, e);
        }
        return Result.error(e.getMessage());
    }

    /**
     * 判断是否为登录失败异常，避免重复记录日志
     *
     * @param request HTTP 请求
     * @return 是否为登录失败异常
     */
    private boolean isLoginFailureException(HttpServletRequest request) {
        // 检查是否为登录接口的请求
        String requestUri = request.getRequestURI();
        return requestUri.contains("/index/login") || requestUri.endsWith("/login");
    }
}
```

## 2.异常日志事件

封装异常相关的信息，包括请求上下文、异常详情等。

```java title="ExceptionLogEvent.class"
@Getter
public class ExceptionLogEvent extends BaseLogEvent {
    /**
     * 请求 URI
     */
    private final String uri;

    /**
     * 请求方法
     */
    private final String method;

    /**
     * 用户名
     */
    private final String username;

    /**
     * 异常类
     */
    private final String exceptionClass;

    /**
     * 异常信息
     */
    private final String msg;

    /**
     * 堆栈信息
     */
    private final String stackTrace;

    public ExceptionLogEvent(Object source, HttpServletRequest request, Exception e) {
        super(source);
        this.uri = request.getRequestURI();
        this.method = request.getMethod();
        this.username = SecurityUtils.getLoginUser().getUsername();
        this.exceptionClass = e.getClass().getName();
        this.msg = e.getMessage();
        this.stackTrace = getStackTraceAsString(e);
    }

    /**
     * 获取堆栈信息
     *
     * @param exception 异常
     * @return 堆栈信息
     */
    private String getStackTraceAsString(Exception exception) {
        StackTraceElement[] stackTrace = exception.getStackTrace();
        StringBuilder sb = new StringBuilder();

        for (StackTraceElement element : stackTrace) {
            String className = element.getClassName();

            if (className.startsWith(BASE_PACKAGE)) {
                sb.append(className).append("->").append(element.getMethodName())
                        .append("：第 ").append(element.getLineNumber()).append(" 行")
                        .append(LINE_SEPARATOR);
            }
        }

        return sb.toString();
    }
}
```

## 3.记录异常日志方法

在[通用日志服务](/code/java/loginLog.html#_4-通用日志服务类)中新增记录异常日志方法。

```java title="UnifiedLogService.java"
/**
 * 记录异常日志
 *
 * @param source    源
 * @param exception 异常
 */
public void logException(Object source, Exception exception) {
    HttpServletRequest request = ServletUtils.getRequest();
    ExceptionLogEvent event = new ExceptionLogEvent(source, request, exception);
    publishLogEvent(event);
}
```

## 4.异常日志实体类

```java title="SysExceptionLog.java"
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("sys_exception_log")
public class SysExceptionLog {
    /**
     * 主键 id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 请求 URI
     */
    private String uri;

    /**
     * 请求方法
     */
    private String method;

    /**
     * 用户名
     */
    private String username;

    /**
     * 异常类
     */
    private String exceptionClass;

    /**
     * 异常信息
     */
    private String msg;

    /**
     * 堆栈信息
     */
    private String stackTrace;

    /**
     * 发生异常时间
     */
    private Date time;
}
```

## 5.处理异常日志事件

在[通用日志事件监听器](/code/java/loginLog.html#_6-通用日志事件监听器)中添加处理异常日志事件的方法。

```java title="UnifiedLogEventListener.java"
private final SysExceptionService exceptionService;

/**
 * 处理异常日志事件
 *
 * @param event 异常日志事件
 */
@Async
@EventListener
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void handleExceptionLogEvent(ExceptionLogEvent event) {
    SysExceptionLog log = new SysExceptionLog();
    log.setUri(event.getUri());
    log.setMethod(event.getMethod());
    log.setUsername(event.getUsername());
    log.setExceptionClass(event.getExceptionClass());
    log.setMsg(event.getMsg());
    log.setStackTrace(event.getStackTrace());
    log.setTime(new Date());
    exceptionService.save(log);
}
```
