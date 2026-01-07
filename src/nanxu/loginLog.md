---
title: 异步记录日志
icon: fas:fa-screwdriver-wrench
---

采用事件驱动模式实现异步记录登录日志到数据库，通过 Spring 的事件发布/监听机制将日志记录操作与业务逻辑解耦，避免日志记录对业务处理性能的影响。

## 1.异步配置类

配置异步执行所需的线程池资源和异常处理策略。

```java title="AsyncConfig.java"
@Configuration
@EnableAsync
@Slf4j
public class AsyncConfig implements AsyncConfigurer {
    /**
     * 创建异步线程池
     *
     * @return 线程池
     */
    @Override
    public @Nullable Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(1000);
        // 设置线程名称前缀，方便查看日志
        executor.setThreadNamePrefix("log-async-");
        executor.initialize();
        return executor;
    }

    /**
     * 异步任务异常处理
     *
     * @return 异常处理
     */
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return (throwable, method, params) -> {
            log.error("异步任务执行异常: ", throwable);
            log.error("异常方法: {}.{}", method.getDeclaringClass().getSimpleName(), method.getName());
        };
    }
}
```

## 2.统一日志事件基类

定义日志事件的统一基类，为各类日志事件提供基础结构。

```java title="BaseLogEvent.java"
public abstract class BaseLogEvent extends ApplicationEvent {
    public BaseLogEvent(Object source) {
        super(source);
    }
}
```

## 3.登录日志事件

封装登录相关的信息，包括用户信息、IP 地址、用户代理等。

```java title="LoginLogEvent.java"
@Getter
public class LoginLogEvent extends BaseLogEvent {
    /**
     * 用户名
     */
    private final String username;

    /**
     * 登录信息
     */
    private final String msg;

    /**
     * 登录状态
     */
    private final Integer status;

    /**
     * IP 地址
     */
    private final String ip;

    /**
     * User-Agent 字符串
     */
    private final String userAgentString;

    public LoginLogEvent(Object source, String username, String msg, Integer status, HttpServletRequest request) {
        super(source);
        this.username = username;
        this.msg = msg;
        this.status = status;
        this.ip = IPUtils.getIpAddr(request);
        this.userAgentString = request.getHeader("User-Agent");
    }
}
```

## 4.通用日志服务类

提供统一的日志记录入口，通过事件发布机制触发日志记录操作。

```java title="UnifiedLogService.java"
@Service
@RequiredArgsConstructor
public class UnifiedLogService {
    private final ApplicationEventPublisher eventPublisher;

    /**
     * 发布日志事件
     *
     * @param event 日志事件
     */
    private void publishLogEvent(BaseLogEvent event) {
        eventPublisher.publishEvent(event);
    }

    /**
     * 记录登录日志
     *
     * @param source 源
     */
    public void logLogin(Object source, String username, String msg, Integer status) {
        HttpServletRequest request = ServletUtils.getRequest();
        LoginLogEvent event = new LoginLogEvent(source, username, msg, status, request);
        publishLogEvent(event);
    }
}
```

## 5.登录日志实体类

```java title="SysLoginLog.java"
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("sys_login_log")
public class SysLoginLog {
    /**
     * 主键id
     */
    @TableId(type = IdType.AUTO)
    private Integer id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 登录ip
     */
    private String ip;

    /**
     * 登录地址
     */
    private String address;

    /**
     * 浏览器
     */
    private String browser;

    /**
     * 操作系统
     */
    private String os;

    /**
     * 登录状态（0-成功，1-失败）
     */
    private Integer status;

    /**
     * 操作信息
     */
    private String msg;

    /**
     * 登录时间
     */
    private Date time;
}
```

## 6.通用日志事件监听器

负责处理日志事件，执行具体的数据库记录操作。

```java title="UnifiedLogEventListener.java"
@Slf4j
@Component
@RequiredArgsConstructor
public class UnifiedLogEventListener {
    private final SysLoginLogService loginLogService;

    private final AddressUtils addressUtils;

    /**
     * 处理登录日志事件
     *
     * @param event 登录日志事件
     */
    @Async
    @EventListener
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleLoginLogEvent(LoginLogEvent event) {
        SysLoginLog log = new SysLoginLog();
        log.setUsername(event.getUsername());
        String ip = event.getIp();
        log.setIp(ip);
        if (LOCAL_IP.equals(ip)) {
            log.setAddress(INTRANET_IP);
        } else {
            log.setAddress(addressUtils.getAddressByIp(ip));
        }

        UserAgent userAgent = UserAgent.parseUserAgentString(event.getUserAgentString());
        log.setBrowser(userAgent.getBrowser().getName());
        log.setOs(userAgent.getOperatingSystem().getName());
        log.setStatus(event.getStatus());
        log.setMsg(event.getMsg());
        log.setTime(new Date());
        loginLogService.save(log);
    }
}
```

## 7.修改登录接口

在登录流程中集成日志记录功能，确保登录成功和失败都能记录日志。

```java title="SysUserServiceImpl.java"
@Slf4j
@Service
@RequiredArgsConstructor
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {
    private final AuthenticationManager authenticationManager;

    private final TokenService tokenService;

    private final UnifiedLogService logService;

    /**
     * 登录
     *
     * @param loginDTO 登录参数
     * @return 登录结果
     */
    @Override
    public Result login(LoginDTO loginDTO) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());
        Authentication authenticate;
        try {
            authenticate = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
        } catch (AuthenticationException e) {
            logService.logLogin(this, loginDTO.getUsername(), e.getMessage(), FAIL); // [!code highlight]
            throw new ServiceException(e.getMessage());
        }

        logService.logLogin(this, loginDTO.getUsername(), AUTHENTICATION_SUCCESS, SUCCESS); // [!code highlight]

        LoginUser loginUser = (LoginUser) authenticate.getPrincipal();
        String token = tokenService.createToken(loginUser);
        return Result.success(token);
    }
}
```

## 8.修改退出登录接口

在用户退出登录时同样记录相应的日志信息。

```java title = "LogoutSuccessHandlerImpl.java"
@Component
@RequiredArgsConstructor
public class LogoutSuccessHandlerImpl implements LogoutSuccessHandler {
    private final TokenService tokenService;

    private final UnifiedLogService logService;

    /**
     * 登出成功处理
     *
     * @param request        请求
     * @param response       响应
     * @param authentication 认证
     * @throws IOException IO异常
     */
    @Override
    public void onLogoutSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        LoginUser loginUser = tokenService.getLoginUser(request);

        if (Objects.nonNull(loginUser)) {
            tokenService.deleteLoginUser(loginUser);

            logService.logLogin(this, loginUser.getUsername(), LOGOUT_SUCCESS, SUCCESS); // [!code highlight]
        }

        Result success = Result.success(LOGOUT_SUCCESS);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(JSON.toJSONString(success));
    }
}
```