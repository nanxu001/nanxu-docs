---
title: Spring Security认证
icon: fas:fa-user-lock
---

本项目使用 Spring Security 实现认证授权功能，结合 JWT 和 Redis 实现无状态认证机制。

## 1.引入相关依赖

在项目中引入 Spring Security 和 JWT 相关依赖来实现认证授权功能。

```xml title="pom.xml"
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-api</artifactId>
    <version>0.13.0</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-impl</artifactId>
    <version>0.13.0</version>
</dependency>
<dependency>
    <groupId>io.jsonwebtoken</groupId>
    <artifactId>jjwt-jackson</artifactId>
    <version>0.13.0</version>
</dependency>
```

## 2.登录流程

### 2.1 JWT 认证流程

1. 前端携带用户名和密码访问服务器的登录接口。
2. 服务器接收到请求后，会去数据库中查询对应的用户名和密码进行校验。
3. 如果用户名和密码正确，服务器会使用用户名或用户 ID 生成一个 JWT Token。
4. 服务器将生成的 JWT Token 响应给前端。
5. 用户登录成功后，前端在访问其他需要认证的接口时，需要在请求头中携带之前获取到的 Token。
6. 服务器接收到带有 Token 的请求后，会解析 Token 获取用户 ID，根据用户 ID 获取用户的相关信息，判断是否有权访问目标资源。
7. 如果有权限，则允许访问目标资源，并将响应信息返回给前端。

### 2.2 Spring Security 登录流程

1.由于登录接口在`SecurityConfig`中已配置为`anonymous()`访问权限，因此不会强制要求认证。同时登录请求不会携带 Token，所以在`JwtAuthenticationTokenFilter`中无法获取到用户信息，当前过滤器会直接放行进入下一个过滤器。
2. 请求进入`IndexController`调用`SysUserService`，创建`UsernamePasswordAuthenticationToken`对象，封装前端传递的用户名和密码。
3. `AuthenticationManager`接收`UsernamePasswordAuthenticationToken`，其具体实现类`ProviderManager`调用`authenticate()`方法进行认证处理。

   ```java title="SysUserServiceImpl.login()"
   @Override
   public Result login(LoginDTO loginDTO) {
       UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());
       Authentication authenticate;
       try {
           // // 断点打在下面这一行
           authenticate = authenticationManager.authenticate(usernamePasswordAuthenticationToken);
       } catch (AuthenticationException e) {
           throw new RuntimeException(e.getMessage());
       }

       LoginUser loginUser = (LoginUser) authenticate.getPrincipal();

       String token = tokenService.createToken(loginUser);

       return Result.success(token);
   }
   ```

4. `ProviderManager`管理多个`AuthenticationProvider`实现，遍历所有`AuthenticationProvider`找到能处理当前`authentication`的`provider`。

   ```java title="ProviderManager.authenticate()关键代码"
   for (AuthenticationProvider provider : getProviders()) {
       if (provider.supports(authentication.getClass())) {
           // 断点打在下面这一行
           Authentication result = provider.authenticate(authentication);
           if (result != null) {
               return result;
           }
       }
   }
   ```

5. `ProviderManager`找到`AbstractUserDetailsAuthenticationProvider`，该 provider 调用`authentication`方法，内部再调用抽象方法`retrieveUser()`，由其子类`DaoAuthenticationProvider`负责从数据库检索用户信息。

   ```java title="AbstractUserDetailsAuthenticationProvider.authenticate()关键代码"
   String username = determineUsername(authentication);
   boolean cacheWasUsed = true;
   UserDetails user = this.userCache.getUserFromCache(username);
   if (user == null) {
       cacheWasUsed = false;
       try {
           // 断点打在下面这一行
           user = retrieveUser(username, (UsernamePasswordAuthenticationToken) authentication);
       } catch (UsernameNotFoundException ex) {
           this.logger.debug(LogMessage.format("Failed to find user '%s'", username));
           if (!this.hideUserNotFoundExceptions) {
               throw ex;
           }
           throw new BadCredentialsException(this.messages
               .getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
       }
       Assert.notNull(user, "retrieveUser returned null - a violation of the interface contract");
   }
   ```

6. `DaoAuthenticationProvider`调用`retrieveUser()`，获取配置的`UserDetailsService`，然后调用自定义实现的`loadUserByUsername()`方法查询数据库用户信息。

   ```java title="DaoAuthenticationProvider.retrieveUser()关键代码"
   try {
       // 断点打在下面这一行
       UserDetails loadedUser = this.getUserDetailsService().loadUserByUsername(username);
       if (loadedUser == null) {
           throw new InternalAuthenticationServiceException("UserDetailsService returned null, which is an interface contract violation");
       }
       return loadedUser;
   }
   ```

7. `UserDetailsService`调用`loadUserByUsername()`方法，从数据库查询用户信息并封装成`LoginUser`对象。

   ```java title="UserDetailsServiceImpl.loadUserByUsername()"
   @Override
   public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
       SysUser sysUser = Db.lambdaQuery(SysUser.class).eq(SysUser::getUsername, username).one();

       if (Objects.isNull(sysUser)) {
           throw new UsernameNotFoundException("用户不存在");
       }

       if (sysUser.getStatus() == -1) {
           throw new LockedException("账号已停用");
       }

       return new LoginUser(sysUser, Collections.emptySet());
   }
   ```

8. 将用户信息封装到`LoginUser`后返回到`AbstractUserDetailsAuthenticationProvider`的`authentication`方法，继续执行后续验证流程。

   ```java title="AbstractUserDetailsAuthenticationProvider.authenticate()关键代码"
   try {
           // 断点打在下面这两行
   		this.preAuthenticationChecks.check(user);
   		additionalAuthenticationChecks(user, (UsernamePasswordAuthenticationToken) authentication);
   	}
   	catch (AuthenticationException ex) {
   		if (!cacheWasUsed) {
   			throw ex;
   		}
   		// There was a problem, so try again after checking
   		// we're using latest data (i.e. not from the cache)
   		cacheWasUsed = false;
   		user = retrieveUser(username, (UsernamePasswordAuthenticationToken) authentication);
   		this.preAuthenticationChecks.check(user);
   		additionalAuthenticationChecks(user, (UsernamePasswordAuthenticationToken) authentication);
   	}
   ```

9. `this.preAuthenticationChecks.check(user)`内部会校验 [登录实体类](/docs/nanxu/authentication.html#_5-2-登录实体类) 中实现的`UserDetails`接口方法返回值，如检查账户是否被锁定、是否过期等状态。
10. 抽象方法`additionalAuthenticationChecks()`会调用`DaoAuthenticationProvider`的具体实现。首先判断 [登录实体类](/docs/nanxu/authentication.html#_5-2-登录实体类) 中重写的`getPassword()`方法是否为空，然后调用`matches()`方法，按照 [Spring Security 配置](/docs/nanxu/authentication.html#_3-spring-security-配置) 中配置的密码加密方式进行密码匹配。

    ```java title="DaoAuthenticationProvider.additionalAuthenticationChecks()"
    protected void additionalAuthenticationChecks(UserDetails userDetails,
            UsernamePasswordAuthenticationToken authentication) throws AuthenticationException {
        if (authentication.getCredentials() == null) {
            this.logger.debug("Failed to authenticate since no credentials provided");
            throw new BadCredentialsException(this.messages
                .getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }

        // 断点打在下面这一行
        String presentedPassword = authentication.getCredentials().toString();
        if (!this.passwordEncoder.get().matches(presentedPassword, userDetails.getPassword())) {
            this.logger.debug("Failed to authenticate since password does not match stored value");
            throw new BadCredentialsException(this.messages
                .getMessage("AbstractUserDetailsAuthenticationProvider.badCredentials", "Bad credentials"));
        }
    }
    ```

11. 本项目配置的是`BCryptPasswordEncoder`，进入`matches()`方法后，先进行格式校验，验证密码是否符合 BCrypt 格式，之后进入`checkpw()`方法进行密码比对。

    ```java title="BCryptPasswordEncoder.matches()"
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
    	if (rawPassword == null) {
    		throw new IllegalArgumentException("rawPassword cannot be null");
    	}
    	if (encodedPassword == null || encodedPassword.length() == 0) {
    		this.logger.warn("Empty encoded password");
    		return false;
    	}
    	if (!this.BCRYPT_PATTERN.matcher(encodedPassword).matches()) {
    		this.logger.warn("Encoded password does not look like BCrypt");
    		return false;
    	}

        // 断点打在下面这一行
    	return BCrypt.checkpw(rawPassword.toString(), encodedPassword);
    }
    ```

12. `checkpw()`方法接收两个参数：用户输入的未加密密码和数据库中存储的加密密码。将未加密密码转换为字节数组后传入`hashpwforcheck()`方法进行加密处理，最后通过`MessageDigest.isEqual()`方法安全地比较两个密码。

    ```java title="BCrypt核心代码"
    public static boolean checkpw(String plaintext, String hashed) {
    	byte[] passwordb = plaintext.getBytes(StandardCharsets.UTF_8);
        // 断点打在下面这一行
    	return equalsNoEarlyReturn(hashed, hashpwforcheck(passwordb, hashed));
    }
    static boolean equalsNoEarlyReturn(String a, String b) {
    	return MessageDigest.isEqual(a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
    ```

13. 密码比对成功后，认证流程逐层返回，最终回到`SysUserServiceImpl.login()`方法，从`authenticate`对象中获取`LoginUser`信息，然后调用`TokenService`生成 Token 并返回给前端。
14. 响应返回时会再次经过`JwtAuthenticationTokenFilter`，但由于这是登录请求的响应，请求中尚未携带有效的 Token，因此无法获取到用户信息，过滤器会直接放行进入下一个过滤器。

    ```java title="JwtAuthenticationTokenFilter.doFilterInternal()"
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        LoginUser loginUser = tokenService.getLoginUser(request);

        if (loginUser != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            tokenService.refreshToken(loginUser);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
    ```

15. 登录成功后，后续请求中前端会将 Token 存入请求头中。在`JwtAuthenticationTokenFilter`中获取用户信息，并将用户存入`SecurityContextHolder`，方便在业务代码中获取当前用户信息。

## 3.Spring Security 配置

### 3.1 安全配置类

```java title="SecurityConfig.java"
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final TokenService tokenService;
    private final AuthenticationEntryPoint authenticationEntryPoint;

    /**
     * 密码加密
     *
     * @return 密码加密
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        // 数值越大计算越慢，安全性越高
        return new BCryptPasswordEncoder(12);
    }

    /**
     * 获取AuthenticationManager（认证管理器），登录时认证使用
     *
     * @param authenticationConfiguration 认证配置
     * @return AuthenticationManager 认证管理器
     * @throws Exception 认证异常
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    /**
     * 跨域配置
     *
     * @return CorsConfigurationSource 跨域配置源
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 允许所有请求头
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        // 允许所有请求方法
        configuration.setAllowedMethods(Collections.singletonList("*"));
        // 允许所有源
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        // 预检请求的缓存时间，单位秒，即在这个时间段里，对于相同的跨域请求不会再预检了
        configuration.setMaxAge(3600L);
        // 添加配置
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 所有请求都允许跨域
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * 配置过滤器链
     *
     * @param http http
     * @return SecurityFilterChain 拦截器链
     * @throws Exception 认证异常
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // 基于 token，不需要 csrf
                .csrf(AbstractHttpConfigurer::disable)
                // 开启跨域以便前端调用接口
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authorize -> authorize
                        // 指定某些接口不需要通过验证即可访问。
                        .requestMatchers(HttpMethod.POST,"/index/login").anonymous()
                        // 静态资源，可匿名访问
                        .requestMatchers(HttpMethod.GET, "/").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**.html").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**.css").permitAll()
                        .requestMatchers(HttpMethod.GET, "/**.js").permitAll()
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/druid/**").permitAll()
                        // 其它所有接口需要认证才能访问
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        // 自定义登录页面
                        .loginPage("/login.html")
                        .permitAll()
                )
                // 基于 token，不需要 session
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // 添加自定义认证过滤器
                .addFilterBefore(new JwtAuthenticationTokenFilter(tokenService), UsernamePasswordAuthenticationFilter.class)
                // 认证失败处理
                .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint))
                .build();
    }
}
```

### 3.2 自定义 MD5 密码加密器

可以选择自定义密码加密方式来对用户密码进行加密处理。

```java title="CustomerMd5PasswordEncoder.java"
public class CustomerMd5PasswordEncoder implements PasswordEncoder {
    /**
     * 进行MD5加密
     *
     * @param rawPassword 原始密码
     * @return 加密后的密码
     */
    @Override
    public String encode(CharSequence rawPassword) {
        return DigestUtils.md5DigestAsHex(rawPassword.toString().getBytes(StandardCharsets.UTF_8));
    }

    /**
     * 验证密码是否匹配
     *
     * @param rawPassword     要编码和匹配的原始密码
     * @param encodedPassword 数据库中加密后的密码
     * @return 匹配结果
     */
    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        String md5OfRawPassword = DigestUtils.md5DigestAsHex(rawPassword.toString().getBytes(StandardCharsets.UTF_8));
        return encodedPassword.equals(md5OfRawPassword);
    }
}
```

## 4.Token 管理

### 4.1 生成 secret

```java title="SecretKeyGenerator.java"
public class SecretKeyGenerator {
    public static void main(String[] args) {
        SecretKey key = Jwts.SIG.HS512.key().build();
        String encodedKey = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Generated Key: " + encodedKey);
    }
}
```

### 4.2 JWT 配置

在`application.yml`中配置 JWT 密钥和 Token 过期时间(分钟)。

```yaml title="application.yml"
jwt:
  secret: bJksEnnZIgZ0nWuDZhJwikkRLXRtoeCRmPtWAkm+34h3anFzzwqjtM19towUuhB7t5G00/RH8zCnJ+HdLEl+/Q==
  expireTime: 1440
```

### 4.3 Token 服务类

```java title="TokenService.java"
@Component
@RequiredArgsConstructor
public class TokenService {
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expireTime}")
    private int expireTime;

    private final RedisTemplate<String, Object> redisTemplate;

    /**
     * 创建Token
     *
     * @param loginUser 登录用户
     * @return token
     */
    public String createToken(LoginUser loginUser) {
        String token = UUID.randomUUID().toString();
        loginUser.setToken(token);

        // 将用户信息缓存到Redis
        cacheLoginUser(loginUser);

        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN, token);
        return doCreateToken(claims);
    }

    /**
     * 缓存登录用户
     *
     * @param loginUser 登录用户
     */
    private void cacheLoginUser(LoginUser loginUser) {
        loginUser.setLoginTime(System.currentTimeMillis());
        loginUser.setExpireTime(loginUser.getLoginTime() + expireTime * MILLIS_MINUTE);

        String tokenKey = REDIS_LOGIN_TOKEN_PREFIX + loginUser.getToken();

        redisTemplate.opsForValue().set(tokenKey, loginUser, expireTime, TimeUnit.MINUTES);
    }

    /**
     * 刷新Token
     *
     * @param loginUser 登录用户
     */
    public void refreshToken(LoginUser loginUser) {
        Long loginTime = loginUser.getLoginTime();
        Long expireTime = loginUser.getExpireTime();

        if (expireTime - loginTime <= TWENTY_MILLIS_MINUTE) {
            cacheLoginUser(loginUser);
        }
    }

    /**
     * 创建Token
     *
     * @param claims 参数
     * @return token
     */
    private String doCreateToken(Map<String, Object> claims) {
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .claims(claims)
                .signWith(secretKey, Jwts.SIG.HS512)
                .compact();
    }

    /**
     * 获取登录用户
     *
     * @param request 请求
     * @return 登录用户
     */
    public LoginUser getLoginUser(HttpServletRequest request) {
        String token = getToken(request);

        if (StringUtils.isNotEmpty(token)) {
            String uuid = parseToken(token);
            String tokenKey = REDIS_LOGIN_TOKEN_PREFIX + uuid;

            return (LoginUser) redisTemplate.opsForValue().get(tokenKey);
        }

        return null;
    }

    /**
     * 从请求中获取Token
     *
     * @param request 请求
     * @return Token
     */
    private String getToken(HttpServletRequest request) {
        String token = request.getHeader(REQUEST_TOKEN_HEADER);

        if (StringUtils.isNotEmpty(token) && token.startsWith(REQUEST_TOKEN_PREFIX)) {
            token = token.replace(REQUEST_TOKEN_PREFIX, "");
        }

        return token;
    }

    /**
     * 解析Token
     *
     * @param token 令牌
     * @return 解析结果
     */
    public String parseToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get(TOKEN).toString();
    }
}
```

## 5.实体类

### 5.1 用户实体类

数据库中新建用户表，此类与数据库中表的字段相对应。

```java title="SysUser.java"
@Data
@NoArgsConstructor
@AllArgsConstructor
@TableName("`sys_user`")
public class SysUser implements Serializable {
    /**
     * 主键ID
     */
    @TableId(type = IdType.ASSIGN_UUID)
    private Long id;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 年龄
     */
    private Integer age;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码，不进行序列化
     */
    @JSONField(serialize = false)
    private String password;

    /**
     * 状态：0-正常、-1-停用
     */
    private Integer status;
}
```

### 5.2 登录实体类

要使用 Spring Security 完成登录功能，需要一个实体类实现 UserDetails 接口，再将数据库中的实体存入此类。

::: important
1. 默认情况下，FastJSON2 会通过`getter`方法来序列化对象属性，对于重写的字段需要添加`@JSONField(serialize = false)`注解以取消序列化这些不必要的属性。也可以在[Redis 序列化器](/docs/nanxu/redis.html#_2-2-redis-序列化配置)中配置`JSONWriter.Feature.FieldBased`特性，基于字段而非`getter`方法进行序列化，提高性能和一致性。
2. 在使用 FastJSON 反序列化 Redis 中的对象时，由于 DevTools 使用了不同的类加载器（RestartClassLoader）加载应用类，而 FastJSON 使用默认类加载器，这可能导致反序列化后得到的是`JSONObject`而非期望的对象类型。在[Redis 序列化器](/docs/nanxu/redis.html#_2-2-redis-序列化配置)中已配置`JSONWriter.Feature.WriteClassName`特性，通过写入类名信息确保反序列化时能正确还原对象类型。此外，也可以从 Redis 中查询到数据后，先通过`toString()`方法转换为字符串，再使用`JSONObject.parseObject()`来避免反序列化失败的问题。
:::

```java title="LoginUser.java"
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginUser implements UserDetails {
    /**
     * 登录令牌
     */
    private String token;

    /**
     * 登录时间
     */
    private Long loginTime;

    /**
     * 过期时间
     */
    private Long expireTime;

    /**
     * 用户信息
     */
    private SysUser sysUser;

    /**
     * 权限信息
     */
    private Set<String> permissions;

    public LoginUser(SysUser sysUser, Set<String> permissions) {
        this.sysUser = sysUser;
        this.permissions = permissions;
    }

    /**
     * 权限信息
     *
     * @return 权限信息
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }

    /**
     * 密码
     *
     * @return 密码
     */
    @Override
    public String getPassword() {
        return sysUser.getPassword();
    }

    /**
     * 用户名
     *
     * @return 用户名
     */
    @Override
    public String getUsername() {
        return sysUser.getUsername();
    }

    /**
     * 账户是否未过期，过期无法验证
     *
     * @return 状态
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * 账户是否未锁定，锁定的用户无法进行身份验证
     *
     * @return 状态
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * 密码是否未过期，过期无法验证
     *
     * @return 状态
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * 是否可用，禁用的用户不能身份验证
     *
     * @return 状态
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}
```

### 5.3 统一响应结果

统一响应结果类，将状态码、提示信息、数据封装为 Result 对象返回给前端。

```java title="Result.java"
public class Result extends HashMap<String, Object> {
    /**
     * 状态码
     */
    public static final String CODE_TAG = "code";

    /**
     * 提示信息
     */
    public static final String MSG_TAG = "msg";

    /**
     * 数据
     */
    public static final String DATA_TAG = "data";

    /**
     * 初始化一个新创建的 Result 对象，使其表示一个空消息。
     */
    public Result() {

    }

    /**
     * 初始化一个新创建的 Result 对象
     *
     * @param code 状态码
     * @param msg  返回内容
     */
    public Result(int code, String msg) {
        super.put(CODE_TAG, code);
        super.put(MSG_TAG, msg);
    }

    /**
     * 初始化一个新创建的 Result 对象
     *
     * @param code 状态码
     * @param msg  返回内容
     * @param data 数据对象
     */
    public Result(int code, String msg, Object data) {
        super.put(CODE_TAG, code);
        super.put(MSG_TAG, msg);

        if (Objects.nonNull(data)) {
            super.put(DATA_TAG, data);
        }
    }

    /**
     * 返回成功消息
     *
     * @return 成功消息
     */
    public static Result success() {
        return Result.success("操作成功");
    }

    /**
     * 返回成功数据
     *
     * @return 成功消息
     */
    public static Result success(Object data) {
        return Result.success("操作成功", data);
    }

    /**
     * 返回成功消息
     *
     * @param msg 返回内容
     * @return 成功消息
     */
    public static Result success(String msg) {
        return Result.success(msg, null);
    }

    /**
     * 返回成功消息
     *
     * @param msg  返回内容
     * @param data 数据对象
     * @return 成功消息
     */
    public static Result success(String msg, Object data) {
        return new Result(HttpStatus.OK.value(), msg, data);
    }

    /**
     * 返回错误消息
     *
     * @return 警告消息
     */
    public static Result error()
    {
        return Result.error("操作失败");
    }

    /**
     * 返回错误消息
     *
     * @param msg 返回内容
     * @return 警告消息
     */
    public static Result error(String msg)
    {
        return Result.error(msg, null);
    }

    /**
     * 返回错误消息
     *
     * @param msg 返回内容
     * @param data 数据对象
     * @return 警告消息
     */
    public static Result error(String msg, Object data)
    {
        return new Result(HttpStatus.INTERNAL_SERVER_ERROR.value(), msg, data);
    }

    /**
     * 返回错误消息
     *
     * @param code 状态码
     * @param msg 返回内容
     * @return 警告消息
     */
    public static Result error(int code, String msg)
    {
        return new Result(code, msg, null);
    }
}
```

### 5.4 登录参数

```java title="LoginDTO.java"
@Data
public class LoginDTO {
    private String username;
    private String password;
}
```

## 6.登录接口

```java title="IndexController.java"
@Tag(name = "登录")
@RestController
@RequestMapping("/index")
@RequiredArgsConstructor
public class IndexController {
    private final SysUserService sysUserService;

    @Operation(summary = "登录接口")
    @PostMapping("/login")
    public Result login(@RequestBody LoginDTO loginDTO) {
        return sysUserService.login(loginDTO);
    }
}
```

在 Service 中将前端传递的登录用户名和密码封装到 UsernamePasswordAuthenticationToken 中，再将其传递到 AuthenticationManager 进行认证，会调用 UserDetailsService 的 loadUserByUsername 方法查询数据库中的用户并封装到 LoginUser，生成 Token 后返回给前端。

```java title="SysUserServiceImpl.java"
@Service
@RequiredArgsConstructor
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

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
            throw new RuntimeException(e.getMessage());
        }

        LoginUser loginUser = (LoginUser) authenticate.getPrincipal();

        String token = tokenService.createToken(loginUser);

        return Result.success(token);
    }
}
```

在此类中会根据前端传递的用户名查询数据库中的用户，UsernameNotFoundException 会被 SpringSecurity 内部捕获，再将 BadCredentialsException(用户名或密码错误) 抛出，避免用户根据提示信息猜测数据库中是否存在此用户，因此这里的自定义异常信息无效，如果需要提示给用户，可以抛出 RuntimeException。

```java title="UserDetailServiceImpl.java"
@Service
public class UserDetailServiceImpl implements UserDetailsService {
    /**
     * 根据用户名查询用户信息
     *
     * @param username 登录传入的用户名
     * @return 用户信息
     * @throws UsernameNotFoundException 用户不存在
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        SysUser sysUser = Db.lambdaQuery(SysUser.class).eq(SysUser::getUsername, username).one();

        // UsernameNotFoundException会被内部捕获，转换为BadCredentialsException(用户名或密码错误)再抛出，防止根据异常信息判断用户是否存在，因此这里的自定义异常信息无效，可以抛出RuntimeException提示用户
        if (Objects.isNull(sysUser)) {
            throw new UsernameNotFoundException("用户不存在");
        }

        if (sysUser.getStatus() == -1) {
            throw new LockedException("账号已停用");
        }

        return new LoginUser(sysUser, Collections.emptySet());
    }
}
```

## 7.JWT 认证过滤器

登录成功后，前端请求时会携带 Token，需要在过滤器中获取到 Token 并检查用户是否成功登录，同时需要在 SecurityConfig 中进行配置。如果没有从缓存中获取到用户，说明用户没有登录成功，则不会向 SecurityContextHolder 中存储用户信息，否则会先检查用户的过期时间是否小于 30 分钟，如果小于 30 分钟则会刷新 Token，并将用户信息保存到 SecurityContextHolder。

```java title="JwtAuthenticationTokenFilter.java"
@Component
@RequiredArgsConstructor
public class JwtAuthenticationTokenFilter extends OncePerRequestFilter {
    private final TokenService tokenService;

    /**
     * 拦截请求
     *
     * @param request     请求
     * @param response    响应
     * @param filterChain 过滤器链
     * @throws ServletException Servlet异常
     * @throws IOException      IO异常
     */
    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {
        LoginUser loginUser = tokenService.getLoginUser(request);

        if (loginUser != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            tokenService.refreshToken(loginUser);

            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(loginUser, null, loginUser.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authenticationToken);
        }

        filterChain.doFilter(request, response);
    }
}
```

## 8.认证失败处理器

如果上一步过滤器中没有获取到用户，则会进入此处理器，向前端返回 401，同样需要在 SecurityConfig 中进行配置。

```java title="AuthenticationEntryPointImpl.java"
@Component
public class AuthenticationEntryPointImpl implements AuthenticationEntryPoint {
    /**
     * 认证失败处理
     *
     * @param request       请求
     * @param response      响应
     * @param authException 认证异常
     * @throws IOException IO异常
     */
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        int code = HttpStatus.UNAUTHORIZED.value();
        String msg = "认证失败";
        Result result = Result.error(code, msg);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(JSON.toJSONString(result));
        response.setStatus(code);
    }
}
```

## 9.测试认证功能

完成上述认证授权功能的开发后，可以通过两个简单的 HTML 页面来进行功能验证。请将以下前端页面文件放置在`/resources/statics`目录下。

### 9.1 前端页面

#### 9.1.1 登录页面 (login.html)

```html title="login.html"
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>用户登录</title>
    <link rel="stylesheet" href="login.css" />
  </head>
  <body>
    <div class="login-container">
      <h2>用户登录</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="username">用户名:</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div class="form-group">
          <label for="password">密码:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">登录</button>
      </form>
      <div id="message"></div>
    </div>
    <script src="login.js"></script>
  </body>
</html>
```

#### 9.1.2 登录页面样式 (login.css)

```css title="login.css"
.login-container {
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 3px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

#message {
  margin-top: 15px;
  padding: 10px;
  border-radius: 3px;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
```

#### 9.1.3 登录页面脚本 (login.js)

```javascript title="login.js"
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const messageDiv = document.getElementById("message");

  // 构造请求数据
  const loginData = {
    username: username,
    password: password,
  };

  // 发送登录请求
  fetch("http://localhost:8888/index/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.code === 200) {
        // 登录成功
        messageDiv.className = "success";
        // 保存token到localStorage
        if (data.msg) {
          localStorage.setItem("authToken", data.msg);
          messageDiv.textContent = "登录成功，Token已保存";
        } else {
          messageDiv.textContent = "登录成功";
        }
        // 登录成功后跳转test-db.html
        window.location.href = "test-db.html";
      } else {
        // 登录失败
        messageDiv.className = "error";
        messageDiv.textContent = data.message || "登录失败";
      }
    })
    .catch((error) => {
      messageDiv.className = "error";
      messageDiv.textContent = "网络错误，请稍后重试";
      console.error("Error:", error);
    });
});
```

#### 9.1.4 数据库测试页面 (test-db.html)

```html title="test-db.html"
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>数据库测试页面</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .container {
        background-color: #f5f5f5;
        padding: 20px;
        border-radius: 5px;
        margin-top: 20px;
      }
      button {
        background-color: #007bff;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background-color: #0056b3;
      }
      #result {
        margin-top: 20px;
        padding: 15px;
        border-radius: 4px;
        white-space: pre-wrap;
      }
      .success {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
      }
      .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
      }
    </style>
  </head>
  <body>
    <h1>数据库测试页面</h1>
    <div class="container">
      <button id="testDbBtn">调用Test DB接口</button>
      <div id="result"></div>
    </div>
    <button id="clearTokenBtn">清除认证token</button>
    <script>
      // 页面加载时检查认证状态
      window.addEventListener("DOMContentLoaded", function () {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/login.html";
        }
      });

      document
        .getElementById("clearTokenBtn")
        .addEventListener("click", function () {
          // 从localStorage删除token
          localStorage.removeItem("authToken");

          // 更新页面提示
          const resultDiv = document.getElementById("result");
          resultDiv.className = "success";
          resultDiv.textContent = "已成功清除认证token";
        });

      document
        .getElementById("testDbBtn")
        .addEventListener("click", function () {
          const resultDiv = document.getElementById("result");

          // 从localStorage获取token
          const token = localStorage.getItem("authToken");

          // 如果没有token，直接跳转到登录页面
          if (!token) {
            window.location.href = "/login.html";
            return;
          }

          // 动态设置请求头
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          };

          fetch("http://localhost:8888/test-db", {
            method: "GET",
            headers: headers,
          })
            .then((response) => {
              if (!response.ok) {
                // 特别处理401状态
                if (response.status === 401) {
                  window.location.href = "/login.html";
                  return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then((data) => {
              resultDiv.className = "success";
              resultDiv.textContent =
                "请求成功:\n" + JSON.stringify(data, null, 2);
            })
            .catch((error) => {
              resultDiv.className = "error";
              resultDiv.textContent = "请求失败: " + error.message;
              console.error("Error:", error);
            });
        });
    </script>
  </body>
</html>
```

### 9.2 测试 Controller

```java title="TestController.java"
@RestController
public class TestController {
    @Autowired
    private SysUserMapper sysUserMapper;

    @GetMapping("/test-db")
    public Result testDB() {
        System.out.println(("----- selectAll method test ------"));
        List<SysUser> sysUserList = sysUserMapper.selectList(null);
        Assert.isTrue(5 == sysUserList.size(), "");
        sysUserList.forEach(System.out::println);

        return Result.success(sysUserList);
    }
}
```

### 9.3 测试密码生成

为了测试认证功能，需要生成测试密码并手动存入数据库。Spring Security 会将前端传递的密码加密后与数据库中的密码进行比对。

```java title="BCryptPasswordGenerator.java"
public class BCryptPasswordGenerator {
    public static void main(String[] args) {
        // 创建BCryptPasswordEncoder实例，参数12与SecurityConfig中配置一致
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

        // 测试密码
        String rawPassword = "1";

        // 生成加密密码
        String encodedPassword = passwordEncoder.encode(rawPassword);

        System.out.println("原始密码: " + rawPassword);
        System.out.println("BCrypt加密后: " + encodedPassword);

        // 验证密码
        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        System.out.println("密码验证结果: " + matches);
    }
}
```

### 9.4 功能验证步骤

1. 访问`http://localhost:8888/test-db.html`，使用生成的测试密码进行登录。

2. 登录成功后，可在 Redis 中查看已缓存的用户数据。

![Redis 缓存](/assets/image/nanxu/loginRedisCache.png)

3. 点击`调用Test DB接口`按钮，验证能够正常查询到数据，请求头中包含认证 token。

![Authorization 请求头](/assets/image/nanxu/authorizationHeader.png)

4. 点击`清除认证token`按钮后再次点击`调用Test DB接口`，验证系统跳转到登录界面。

5. 再次登录后，将 Redis 缓存的`TTL`以及`value`中的`expireTime`修改至 30 分钟内，再次点击`调用Test DB接口`，刷新 Redis 缓存，可以看到过期时间已经刷新。

至此，完整的认证功能测试完成。建议在`SysUserServiceImpl`类中，从`authenticationManager.authenticate()`方法开始设置断点，结合 [Spring Security 登录流程](/docs/nanxu/authentication.html#_2-2-spring-security-登录流程) 进行调试，以便更深入地理解整个认证流程的执行过程。
