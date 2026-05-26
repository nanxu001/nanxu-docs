---
title: 认证功能测试
icon: fas:flask
order: 12
index: false
---

完成 Spring Security 认证授权功能的开发后，可通过以下前端页面进行功能验证。请将页面文件放置在 `/resources/statics` 目录下。

## 1.前端页面

### 1.1 登录页面 (login.html)

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

### 1.2 登录页面样式 (login.css)

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

### 1.3 登录页面脚本 (login.js)

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

### 1.4 数据库测试页面 (test-db.html)

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
    <button id="logoutBtn">退出登录</button>
    <script>
      // 页面加载时检查认证状态
      window.addEventListener("DOMContentLoaded", function () {
        const token = localStorage.getItem("authToken");
        if (!token) {
          window.location.href = "/login.html";
        }
      });

      // 退出登录
      document.getElementById('logoutBtn').addEventListener('click', function() {
        const token = localStorage.getItem('authToken');
        fetch('http://localhost:8888/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
          .then(response => response.json())
          .then(data => {
              if (data.code === 200) {
                  localStorage.removeItem('authToken');
                  window.location.href = '/login.html';
              }
          })
          .catch(() => window.location.href = '/login.html');
      });

      // 清除认证token
      document.getElementById("clearTokenBtn").addEventListener("click", function () {
        localStorage.removeItem("authToken");
        const resultDiv = document.getElementById("result");
        resultDiv.className = "success";
        resultDiv.textContent = "已成功清除认证token";
      });

      // 调用Test DB接口
      document.getElementById("testDbBtn").addEventListener("click", function () {
        const resultDiv = document.getElementById("result");
        const token = localStorage.getItem("authToken");

        if (!token) {
          window.location.href = "/login.html";
          return;
        }

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };

        fetch("http://localhost:8888/test-db", {
          method: "GET",
          headers: headers,
        })
          .then((response) => {
            if (response.status === 401) {
              window.location.href = "/login.html";
              return;
            }
            return response.json();
          })
          .then((data) => {
            resultDiv.className = "success";
            resultDiv.textContent = "请求成功:\n" + JSON.stringify(data, null, 2);
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

## 2.测试 Controller

```java title="TestController.java"
@RestController
public class TestController {
    @Autowired
    private SysUserMapper sysUserMapper;

    @GetMapping("/test-db")
    public Result testDB() {
        List<SysUser> sysUserList = sysUserMapper.selectList(null);
        Assert.isTrue(5 == sysUserList.size(), "");
        sysUserList.forEach(System.out::println);
        return Result.success(sysUserList);
    }
}
```

## 3.测试密码生成

为了测试认证功能，需要生成测试密码并手动存入数据库。Spring Security 会将前端传递的密码加密后与数据库中的密码进行比对。

```java title="BCryptPasswordGenerator.java"
public class BCryptPasswordGenerator {
    public static void main(String[] args) {
        // 参数12与SecurityConfig中配置一致
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

        String rawPassword = "1";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        System.out.println("原始密码: " + rawPassword);
        System.out.println("BCrypt加密后: " + encodedPassword);

        boolean matches = passwordEncoder.matches(rawPassword, encodedPassword);
        System.out.println("密码验证结果: " + matches);
    }
}
```

## 4.功能验证步骤

1. 访问 `http://localhost:8888/login.html`，使用生成的测试密码进行登录

2. 登录成功后，可在 Redis 中查看已缓存的用户数据

   ![Redis 缓存](/assets/image/code/java/login-redis-cache.png)

3. 点击"调用Test DB接口"按钮，验证能够正常查询到数据，请求头中包含认证 token

   ![Authorization 请求头](/assets/image/code/java/authorization-header.png)

4. 点击"清除认证token"按钮后再次点击"调用Test DB接口"，验证系统跳转到登录界面

5. 再次登录后，将 Redis 缓存的 TTL 以及 value 中的 expireTime 修改至 30 分钟内，再次点击"调用Test DB接口"，刷新 Redis 缓存，可以看到过期时间已经刷新

6. 点击"退出登录"按钮，验证跳转回登录界面，Redis 中的用户缓存被清除

至此，完整的认证功能测试完成。建议在 `SysUserServiceImpl` 类中，从 `authenticationManager.authenticate()` 方法开始设置断点，结合 [Spring Security 登录流程](/code/java/authentication.html#_2-2-spring-security-登录流程) 进行调试。
