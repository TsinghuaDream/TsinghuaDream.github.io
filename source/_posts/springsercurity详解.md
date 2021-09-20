---
title: springsercurity详解
date: 2021-06-23 07:49:49
tags: spring
category: spring
cover: /img/springsercurity.jpeg
---

# 1. 介绍

springsecurity底层实现为一条过滤器链，就是用户请求进来，判断有没有请求的权限，抛出异常，重定向跳转。

在Java Web工程中，一般使用Servlet过滤器（Filter）对请求进行拦截，然后在Filter中通过自己的验证逻辑来决定是否放行请求。同样地，Spring Security也是基于这个原理，在进入到DispatcherServlet前就可以对Spring MVC的请求进行拦截，然后通过一定的验证，从而决定是否放行请求访问系统。为了对请求进行拦截，**Spring Security提供了过滤器DelegatingFilterProxy类给予开发者配置**。在传统的Web工程中，可以使用web.xml进行配置，但是因为Spring Boot推荐的是全注解的方式，所以这里不再介绍使用web.xml的方式。在传统的Spring全注解的方式下，只需要加入@EnableWebSecurity就可以驱动Spring Sercurity了。

# 2. 原理

一旦启用了Spring Security，SpringIoC容器就会为你创建一个名称为springSecurityFilterChain的Spring Bean。它的类型为FilterChainProxy，事实上它也实现了Filter接口，只是它是一个特殊的拦截器。在Spring Security操作的过程中它会提供Servlet过滤器DelegatingFilterProxy，这个过滤器会通过Spring Web IoC容器去获取Spring Security所自动创建的FilterChainProxy对象，这个对象上存在一个拦截器列表（List），列表上存在用户验证的拦截器、跨站点请求伪造等拦截器，这样它就可以提供多种拦截功能。于是焦点又落到了FilterChainProxy对象上，通过它还可以注册Filter，也就是允许注册自定义的Filter来实现对应的拦截逻辑，以满足不同的需要。当然，Spring Security也实现了大部分常用的安全功能，并提供了相应的机制来简化开发者的工作，所以大部分情况下并不需要自定义开发，使用它提供的机制即可。

![img](springsercurity详解/528977-20190321125335949-1934836347.png)

## 1.2 Spring Boot对Spring Security支持的配置项

```properties
# SECURITY (SecurityProperties)
# Spring Security过滤器排序
spring.security.filter.order=-100
#安全过滤器责任链拦截的分发类型
spring.security.filter.dispatcher-types=async,error,request
#用户名，默认值为user
spring.security.user.name=user
#用户密码
spring.security.user.password=
#用户角色
spring.security.user.roles=

# SECURITY OAUTH2 CLIENT (OAuth2ClientProperties)
# Oauth提供者详细配置信息
spring.security.oauth2.client.provider.*= #
# Oauth客户端登记信息
spring.security.oauth2.client.registration.*=
```

## 1.3 使用WebSecurityConfigurerAdapter自定义

为了给FilterChainProxy对象加入自定义的初始化，SpringSecurity提供了SecurityConfigurer接口，通过它就能够实现对Spring Security的配置。只是有了这个接口还不太方便，因为它只是能够提供接口定义的功能，为了更方便，Spring对Web工程还提供了专门的接口WebSecurityConfigurer，并且在这个接口的定义上提供了一个**抽象类WebSecurityConfigurer Adapter**。**开发者通过继承它就能得到Spring Security默认的安全功能。也可以通过覆盖它提供的方法，来自定义自己的安全拦截方案。**

```java
    //用来配置用户签名服务，主要是user-details机制，还可以给予用户赋予角色
		//@param auth 签名管理构造器,用于构建用户具体权限控制
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        this.disableLocalConfigureAuthenticationBldr = true;
    }
		//用于配置Filtet链
		//@param web spring web security对象
		public void configure(WebSecurity web) throws Exception {
    }
		//用于配置拦截保护的请求，比如什么请求放行，什么请求需要验证
		//@param http http安全请求对象
		protected void configure(HttpSecurity http) throw Exception;
```

对于使用**WebSecurity参数的方法主要是配置Filter链的内容**，可以配置Filter链忽略哪些内容。WebSecurityConfigurerAdapter提供的是空实现，也就是没有任何的配置。而对于**AuthenticationManager Builder参数的方法，则是定义用户（user）、密码（password）和角色（role）**，在默认的情况下Spring不会为你创建任何的用户和密码，也就是有登录页面而没有可登录的用户。对于**HttpSecurity参数的方法，则是指定用户和角色与对应URL的访问权限**，也就是开发者可以通过覆盖这个方法来指定用户或者角色的访问权限。**在WebSecurityConfigurerAdapter提供的验证方式下满足通过用户验证或者HTTP基本验证的任何请求，Spring Security都会放行。**

# 3. 自定义用户服务信息

主要包含使用内存签名服务、数据库签名服务和自定义签名服务。

## 3.1 使用内存用户

```java
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
        //密码编辑器
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        //使用内存存储
        auth.inMemoryAuthentication()
                //设置密码编辑器
                .passwordEncoder(passwordEncoder)
                //注册用户admin，密码为abc，并赋予user和admin的角色权限
                .withUser("admin")
                    .password("123")
                    .roles("USER","ADMIN")
                //连接方法and
                .and()
                //注册用户myuser，密码为123，并赋予user的角色权限
                .withUser("myser")
                    .password("123")
                    .roles("USER");
    }
    //当然也可以自定义，只要AuthenticationManagerBuilder“把角色吃进去就行了”
        //根据用户名密码实现登录
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        //内存存储用户，写死
        authenticationManagerBuilder
                .inMemoryAuthentication()
                //.passwordEncoder(new BCryptPasswordEncoder())
                .withUser("test").password("123").roles("USER")
                .and()
                .withUser("admin").password("123").roles("ADMIN","USER");
        //动态加载用户
        authenticationManagerBuilder.userDetailsService(myUserDetailsService);
    }
   
```

在Spring 5的**Security中都要求使用密码编码器**，否则会发生异常，所以代码中首先创建了一个BCryptPasswordEncoder实例，这个类实现了PasswordEncoder接口，它采用的是单向不可逆的密码加密方式。这里的**AuthenticationManagerBuilder是关注的焦点**，其中**inMemoryAuthentication方法将返回内存保存用户信息的管理器配置（InMemoryUserDetailsManagerConfigurer），这样启用内存缓存的机制保存用户信息**。首先通过**passwordEncoder方法，设置了密码编码器**，这里的**withUser方法是注册用户名称，返回用户详情构造器（UserDetailsBuilder）对象**，这样就能够去配置用户的信息了；**password方法是设置密码**，采用的是通过BCrypt加密方式加密后的密码字符串，于是用户登录就需要这个密码了；**roles方法赋予角色类型**，将来就可以通过这个角色名称赋予权限了。**只是这个roles方法还有内涵，它实际是另外一个方法的简写，这个方法是authorities，使用它可以注册角色名称，而代码中roles方法给的角色名称实际上Spring Security会加入前缀“ROLE_”；**and方法则是一个连接方法，也就是开启另外一个用户的注册。通过configure(AuthenticationManagerBuilder auth)方法，可以注册两个用户：一个是admin用户，其密码为abc，它拥有ROLE_USER和ROLE_ADMIN两个角色；另一个是myuser用户，其密码为123456，它只拥有ROLE_USER一个角色。

### 3.1.1 UserDetailsBuilder方法简介

```java
public class UserDetailsBuilder {
  			//用户详细信息
        private UserBuilder user;
        private final C builder;
				//构造方法
        private UserDetailsBuilder(C builder) {
            this.builder = builder;
        }
				//连接
        public C and() {
            return this.builder;
        }
				//用户名
        private UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder username(String username) {
            this.user = User.withUsername(username);
            return this;
        }
				//密码
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder password(String password) {
            this.user.password(password);
            return this;
        }
				//赋予角色，会自动加入前缀“ROLE_”
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder roles(String... roles) {
            this.user.roles(roles);
            return this;
        }
				//赋予一个“或”权限
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder authorities(GrantedAuthority... authorities) {
            this.user.authorities(authorities);
            return this;
        }
				//使用列表赋予权限
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder authorities(List<? extends GrantedAuthority> authorities) {
            this.user.authorities(authorities);
            return this;
        }
				//赋予权限名
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder authorities(String... authorities) {
            this.user.authorities(authorities);
            return this;
        }
				//设置账号是否过期
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder accountExpired(boolean accountExpired) {
            this.user.accountExpired(accountExpired);
            return this;
        }
				//是否锁定账号
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder accountLocked(boolean accountLocked) {
            this.user.accountLocked(accountLocked);
            return this;
        }
				//定义凭证是否过期
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder credentialsExpired(boolean credentialsExpired) {
            this.user.credentialsExpired(credentialsExpired);
            return this;
        }
				//是否禁用用户
        public UserDetailsManagerConfigurer<B, C>.UserDetailsBuilder disabled(boolean disabled) {
            this.user.disabled(disabled);
            return this;
        }
				//返回用户解码后密码
        UserDetails build() {
            return this.user.build();
        }
    }
```

## 3.2 使用数据库定义用户认证服务

在大部分的情况下，用户的信息会存放在数据库，为此Spring Security提供了对数据库的查询方法来满足开发者的需要。JdbcUserDetailsManagerConfigurer是一个Spring Security对于数据库配置的支持，并且它也提供了默认的SQL。只是在大部分的情况下，不会采用它默认提供的SQL，基于实用的原则，这里就不再深入讨论默认的SQL了。既然涉及了数据库，就需要准备好数据库（MySQL）的表和数据。

### 3.2.1 自定义登录页 与 UserDetailsService 用户名密码校验

```java
import com.springboot.entity.Menu;
import com.springboot.entity.Role;
import com.springboot.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;

import java.util.List;


@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception{
        //配置资源文件 其中/css/**，/index可以任意访问，/select需要USER权限，/delete需要ADMIN权限
        httpSecurity
                .authorizeRequests()
                .antMatchers("/css/**", "/index").permitAll()
                .antMatchers("/select").hasRole("USER")
                .antMatchers("/delete").hasRole("ADMIN");
        //动态加载数据库中角色权限
        List<Role> roleList = roleRepository.findAll();
        for(Role role : roleList){
            List<Menu> menuList = role.getMenuList();
            for (Menu menu : menuList){
                //在SpringSecurity校验权限的时候，会自动将权限前面加ROLE_，所以我们需要 将我们数据库中配置的ROLE_截取掉。
                String roleName = role.getRoleName().replace("ROLE_","");
                String menuName = "/" + menu.getMenuName();
                httpSecurity
                        .authorizeRequests()
                        .antMatchers(menuName)
                        .hasRole(roleName);
            }
        }
        //配置登录请求/login 登录失败请求/login_error 登录成功请求/
        httpSecurity
                .formLogin()
                .loginPage("/login")
                .failureUrl("/login_error")
                .successForwardUrl("/");
        //登录异常，如权限不符合 请求/401
        httpSecurity
                .exceptionHandling().accessDeniedPage("/401");
        //注销登录 请求/logout
        httpSecurity
                .logout()
                .logoutSuccessUrl("/logout");
    }

    @Bean
    public static NoOpPasswordEncoder passwordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }


    //根据用户名密码实现登录
    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        authenticationManagerBuilder
                .inMemoryAuthentication()
                //.passwordEncoder(new BCryptPasswordEncoder())
                .withUser("test").password("123").roles("USER")
                .and()
                .withUser("admin").password("123").roles("ADMIN","USER");
        authenticationManagerBuilder.userDetailsService(myUserDetailsService);
    }
}
```



然后实现UserDetailsService接口进行用户姓名密码校验 (由于springboot2.x中security是5.x版本的，所以这里的密码是默认做了BCrypt加密的，就需要bean一个BCrypt),首先设置用户权限的方式，对于Spring Security提供了一个UserDetailsService接口，通过它可以获取用户信息，而这个接口只有一个loadUserByUsername方法需要实现，这个方法定义返回UserDetails接口对象

```java
import com.springboot.entity.Role;
import com.springboot.entity.User;
import com.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {
    @Autowired
    private  UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUserName(username);
        if (user == null){
            throw new UsernameNotFoundException("用户不存在！");
        }
      	//获取权限列表
        List<SimpleGrantedAuthority> simpleGrantedAuthorities = new ArrayList<>();
        for (Role role : user.getRoleList()) {
            simpleGrantedAuthorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
      	//返回一个UserDetailes对象
        return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getPassWord(), simpleGrantedAuthorities);
    }
}
```

实体类们：

```java
@Entity
public class User implements Serializable {

    @Id
    @GeneratedValue
    private Integer userId;
    private String userName;
    private String passWord;

    @ManyToMany(fetch= FetchType.EAGER)
    @JoinTable(name = "UserRole", joinColumns = { @JoinColumn(name = "userId") },
            inverseJoinColumns ={@JoinColumn(name = "roleId") })
    private List<Role> roleList;

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassWord() {
        return passWord;
    }

    public void setPassWord(String passWord) {
        this.passWord = passWord;
    }

    public List<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Role> roleList) {
        this.roleList = roleList;
    }

    public User(String userName, String passWord, List<Role> roleList) {
        this.userName = userName;
        this.passWord = passWord;
        this.roleList = roleList;
    }

    public User() {
    }
}
```

```java
@Entity
public class Menu  implements Serializable {

    @Id
    @GeneratedValue
    private Integer menuId;
    private String menuName;

    @ManyToMany
    @JoinTable(name="RoleMenu",joinColumns={@JoinColumn(name="menuId")},inverseJoinColumns={@JoinColumn(name="roleId")})
    private List<Role> roleList;

    public Integer getMenuId() {
        return menuId;
    }

    public void setMenuId(Integer menuId) {
        this.menuId = menuId;
    }

    public String getMenuName() {
        return menuName;
    }

    public void setMenuName(String menuName) {
        this.menuName = menuName;
    }

    public List<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Role> roleList) {
        this.roleList = roleList;
    }

}
```

```java
@Entity
public class Role implements Serializable {

    @Id
    @GeneratedValue
    private Integer roleId;
    private String roleName;


    @ManyToMany(fetch= FetchType.EAGER)
    @JoinTable(name="RoleMenu",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="menuId")})
    private List<Menu> menuList;

    @ManyToMany
    @JoinTable(name="UserRole",joinColumns={@JoinColumn(name="roleId")},inverseJoinColumns={@JoinColumn(name="userId")})
    private List<User> userList;

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public List<Menu> getMenuList() {
        return menuList;
    }

    public void setMenuList(List<Menu> menuList) {
        this.menuList = menuList;
    }

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

}
```

# Spring Security OAuth2

## 1.应用场景

为了理解OAuth的适用场合，让我举一个假设的例子。

有一个"云冲印"的网站，可以将用户储存在Google的照片，冲印出来。用户为了使用该服务，必须让"云冲印"读取自己储存在Google上的照片。

![云冲印](springsercurity详解/bg2014051202.png)

问题是只有得到用户的授权，Google才会同意"云冲印"读取这些照片。那么，"云冲印"怎样获得用户的授权呢？

**传统方法是，用户将自己的Google用户名和密码，告诉"云冲印"**，后者就可以读取用户的照片了。这样的做法有以下几个严重的缺点。

> （1）"云冲印"为了后续的服务，会保存用户的密码，这样很不安全。
>
> （2）Google不得不部署密码登录，而我们知道，单纯的密码登录并不安全。
>
> （3）"云冲印"拥有了获取用户储存在Google所有资料的权力，用户没法限制"云冲印"获得授权的范围和有效期。
>
> （4）用户只有修改密码，才能收回赋予"云冲印"的权力。但是这样做，会使得其他所有获得用户授权的第三方应用程序全部失效。
>
> （5）只要有一个第三方应用程序被破解，就会导致用户密码泄漏，以及所有被密码保护的数据泄漏。

OAuth就是为了解决上面这些问题而诞生的，它可以让Google不赋予云冲印密码实现读取。

## 2.名词定义

（1） **Third-party application**：第三方应用程序，本文中又称"客户端"（client），即上一节例子中的"云冲印"。

（2）**HTTP service**：HTTP服务提供商，本文中简称"服务提供商"，即上一节例子中的Google。

（3）**Resource Owner**：资源所有者，本文中又称"用户"（user）。

（4）**User Agent**：用户代理，本文中就是指浏览器。

（5）**Authorization server**：认证服务器，即服务提供商专门用来处理认证的服务器。

（6）**Resource server**：资源服务器，即服务提供商存放用户生成的资源的服务器。它与认证服务器，可以是同一台服务器，也可以是不同的服务器。

## 3.Oauth的思路

OAuth在"客户端"与"服务提供商"之间，**设置了一个授权层（authorization layer）**。**"客户端"不能直接登录"服务提供商"，只能登录授权层，以此将用户与客户端区分开来。"客户端"登录授权层所用的令牌（token），与用户的密码不同。用户可以在登录的时候，指定授权层令牌的权限范围和有效期。**

"客户端"登录授权层以后，"服务提供商"根据令牌的权限范围和有效期，向"客户端"开放用户储存的资料。

## 4. 运行流程

OAuth 2.0的运行流程如下图，摘自RFC 6749。

![OAuth运行流程](springsercurity详解/bg2014051203.png)

> （A）用户打开客户端以后，客户端要求用户给予授权。
>
> （B）用户同意给予客户端授权。
>
> （C）客户端使用上一步获得的授权，向认证服务器申请令牌。
>
> （D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌。
>
> （E）客户端使用令牌，向资源服务器申请获取资源。
>
> （F）资源服务器确认令牌无误，同意向客户端开放资源。

不难看出来，上面六个步骤之中，B是关键，即用户怎样才能给于客户端授权。有了这个授权以后，客户端就可以获取令牌，进而凭令牌获取资源。

下面一一讲解客户端获取授权的四种模式。

## 5.客户端的授权模式

流程AB中客户端必须得到用户的授权（authorization grant），才能获得令牌（access token）。OAuth 2.0定义了四种授权方式。

- 授权码模式（authorization code）
- 简化模式（implicit）
- 密码模式（resource owner password credentials）
- 客户端模式（client credentials）

## 6.授权码模式（🌟）

授权码模式（authorization code）是功能最完整、流程最严密的授权模式。它的特点就是通过客户端的后台服务器，与"服务提供商"的认证服务器进行互动。

**主要用于需要第三方登录的程序中**。

![授权码模式](springsercurity详解/bg2014051204.png)

它的步骤如下：

> （A）用户访问客户端，后者将前者导向认证服务器。
>
> （B）用户选择是否给予客户端授权。
>
> （C）假设用户给予授权，认证服务器将用户导向客户端事先指定的"重定向URI"（redirection URI），同时附上一个授权码。
>
> （D）客户端收到授权码，附上早先的"重定向URI"，向认证服务器申请令牌。这一步是在客户端的后台的服务器上完成的，对用户不可见。
>
> （E）认证服务器核对了授权码和重定向URI，确认无误后，向客户端发送访问令牌（access token）和更新令牌（refresh token）。

下面是上面这些步骤所需要的参数。

A步骤中，客户端申请认证的URI，包含以下参数：

- response_type：表示授权类型，必选项，此处的值固定为"code"
- client_id：表示客户端的ID，必选项
- redirect_uri：表示重定向URI，可选项
- scope：表示申请的权限范围，可选项
- state：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值。

下面是一个请求参数例子。

> ```http
> GET /authorize?response_type=code&client_id=s6BhdRkqt3&state=xyz
>         &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
> Host: server.example.com
> ```

C步骤中，服务器回应客户端的URI，包含以下参数：

- code：表示授权码，必选项。该码的有效期应该很短，通常设为10分钟，客户端只能使用该码一次，否则会被授权服务器拒绝。该码与客户端ID和重定向URI，是一一对应关系。
- state：如果客户端的请求中包含这个参数，认证服务器的回应也必须一模一样包含这个参数。

下面是一个回应参数例子。

> ```http
> HTTP/1.1 302 Found
> Location: https://client.example.com/cb?code=SplxlOBeZQQYbYS6WxSbIA
>           &state=xyz
> ```

D步骤中，客户端向认证服务器申请令牌的HTTP请求，包含以下参数：

- grant_type：表示使用的授权模式，必选项，此处的值固定为"authorization_code"。
- code：表示上一步获得的授权码，必选项。
- redirect_uri：表示重定向URI，必选项，且必须与A步骤中的该参数值保持一致。
- client_id：表示客户端ID，必选项。

这是一个请求参数例子。

```http
POST /token HTTP/1.1
Host: server.example.com
Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb
```

E步骤中，认证服务器发送的HTTP回复，包含以下参数：

- access_token：表示访问令牌，必选项。
- token_type：表示令牌类型，该值大小写不敏感，必选项，可以是bearer类型或mac类型。
- expires_in：表示过期时间，单位为秒。如果省略该参数，必须其他方式设置过期时间。
- refresh_token：表示更新令牌，用来获取下一次的访问令牌，可选项。
- scope：表示权限范围，如果与客户端申请的范围一致，此项可省略。

下面是一个例子。

 ```http
      HTTP/1.1 200 OK
      Content-Type: application/json;charset=UTF-8
      Cache-Control: no-store
      Pragma: no-cache
 
      {
        "access_token":"2YotnFZFEjr1zCsicMWpAA",
        "token_type":"example",
        "expires_in":3600,
        "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
        "example_parameter":"example_value"
      }
 ```

从上面代码可以看到，相关参数使用JSON格式发送（Content-Type: application/json）。此外，HTTP头信息中明确指定不得缓存。

## 7.简化模式

简化模式（implicit grant type）**不通过第三方应用程序的服务器，直接在浏览器中向认证服务器申请令牌，跳过了"授权码"这个步骤**，因此得名。所有步骤在浏览器中完成，令牌对访问者是可见的，且客户端不需要认证。

![简化模式](springsercurity详解/bg2014051205.png)

它的步骤如下：

> （A）客户端将用户导向认证服务器。
>
> （B）用户决定是否给于客户端授权。
>
> （C）假设用户给予授权，认证服务器将用户导向客户端指定的"重定向URI"，并在URI的Hash部分包含了访问令牌。
>
> （D）浏览器向资源服务器发出请求，其中不包括上一步收到的Hash值。
>
> （E）资源服务器返回一个网页，其中包含的代码可以获取Hash值中的令牌。
>
> （F）浏览器执行上一步获得的脚本，提取出令牌。
>
> （G）浏览器将令牌发给客户端。

下面是上面这些步骤所需要的参数。

A步骤中，客户端发出的HTTP请求，包含以下参数：

- response_type：表示授权类型，此处的值固定为"token"，必选项。
- client_id：表示客户端的ID，必选项。
- redirect_uri：表示重定向的URI，可选项。
- scope：表示权限范围，可选项。
- state：表示客户端的当前状态，可以指定任意值，认证服务器会原封不动地返回这个值。

下面是一个例子。

> ```http
>     GET /authorize?response_type=token&client_id=s6BhdRkqt3&state=xyz
>         &redirect_uri=https%3A%2F%2Fclient%2Eexample%2Ecom%2Fcb HTTP/1.1
>     Host: server.example.com
> ```

C步骤中，认证服务器回应客户端的URI，包含以下参数：

- access_token：表示访问令牌，必选项。
- token_type：表示令牌类型，该值大小写不敏感，必选项。
- expires_in：表示过期时间，单位为秒。如果省略该参数，必须其他方式设置过期时间。
- scope：表示权限范围，如果与客户端申请的范围一致，此项可省略。
- state：如果客户端的请求中包含这个参数，认证服务器的回应也必须一模一样包含这个参数。

下面是一个例子。

> ```http
>      HTTP/1.1 302 Found
>      Location: http://example.com/cb#access_token=2YotnFZFEjr1zCsicMWpAA
>                &state=xyz&token_type=example&expires_in=3600
> ```

在上面的例子中，认证服务器用HTTP头信息的Location栏，指定浏览器重定向的网址。注意，在这个网址的Hash部分包含了令牌。

根据上面的D步骤，下一步浏览器会访问Location指定的网址，但是Hash部分不会发送。接下来的E步骤，服务提供商的资源服务器发送过来的代码，会提取出Hash中的令牌。

## 8.密码模式（🌟）

密码模式（Resource Owner Password Credentials Grant）中，用户向客户端提供自己的用户名和密码。客户端使用这些信息，向"服务商提供商"索要授权。

在这种模式中，用户必须把自己的密码给客户端，但是客户端不得储存密码。这通常用在用户对客户端高度信任的情况下，比如客户端是操作系统的一部分，或者由一个著名公司出品。而认证服务器只有在其他授权模式无法执行的情况下，才能考虑使用这种模式。

![密码模式](springsercurity详解/bg2014051206.png)

它的步骤如下：

> （A）用户向客户端提供用户名和密码。
>
> （B）客户端将用户名和密码发给认证服务器，向后者请求令牌。
>
> （C）认证服务器确认无误后，向客户端提供访问令牌。

B步骤中，客户端发出的HTTP请求，包含以下参数：

- grant_type：表示授权类型，此处的值固定为"password"，必选项。
- username：表示用户名，必选项。
- password：表示用户的密码，必选项。
- scope：表示权限范围，可选项。

下面是一个例子。

> ```http
>      POST /token HTTP/1.1
>      Host: server.example.com
>      Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
>      Content-Type: application/x-www-form-urlencoded
> 
>      grant_type=password&username=johndoe&password=A3ddj3w
> ```

C步骤中，认证服务器向客户端发送访问令牌，下面是一个例子。

> ```http
>      HTTP/1.1 200 OK
>      Content-Type: application/json;charset=UTF-8
>      Cache-Control: no-store
>      Pragma: no-cache
> 
>      {
>        "access_token":"2YotnFZFEjr1zCsicMWpAA",
>        "token_type":"example",
>        "expires_in":3600,
>        "refresh_token":"tGzv3JOkF0XG5Qx2TlKWIA",
>        "example_parameter":"example_value"
>      }
> ```

上面代码中，各个参数的含义参见《授权码模式》一节。

整个过程中，客户端不得保存用户的密码。

## 9.客户端模式（🌟）

客户端模式（Client Credentials Grant）指客户端以自己的名义，而不是以用户的名义，向"服务提供商"进行认证。严格地说，客户端模式并不属于OAuth框架所要解决的问题。在这种模式中，用户直接向客户端注册，客户端以自己的名义要求"服务提供商"提供服务，其实不存在授权问题。

![客户端模式](springsercurity详解/bg2014051207.png)

它的步骤如下：

> （A）客户端向认证服务器进行身份认证，并要求一个访问令牌。
>
> （B）认证服务器确认无误后，向客户端提供访问令牌。

A步骤中，客户端发出的HTTP请求，包含以下参数：

- grant*type：表示授权类型，此处的值固定为"client*credentials"，必选项。
- scope：表示权限范围，可选项。

> ```http
>      POST /token HTTP/1.1
>      Host: server.example.com
>      Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
>      Content-Type: application/x-www-form-urlencoded
> 
>      grant_type=client_credentials
> ```

认证服务器必须以某种方式，验证客户端身份。

B步骤中，认证服务器向客户端发送访问令牌，下面是一个例子。

> ```http
>      HTTP/1.1 200 OK
>      Content-Type: application/json;charset=UTF-8
>      Cache-Control: no-store
>      Pragma: no-cache
> 
>      {
>        "access_token":"2YotnFZFEjr1zCsicMWpAA",
>        "token_type":"example",
>        "expires_in":3600,
>        "example_parameter":"example_value"
>      }
> ```

上面代码中，各个参数的含义参见《授权码模式》一节。

## 10.更新令牌

如果用户访问的时候，客户端的"访问令牌"已经过期，则需要使用"更新令牌"申请一个新的访问令牌。

客户端发出更新令牌的HTTP请求，包含以下参数：

- grant*type：表示使用的授权模式，此处的值固定为"refresh*token"，必选项。
- refresh_token：表示早前收到的更新令牌，必选项。
- scope：表示申请的授权范围，不可以超出上一次申请的范围，如果省略该参数，则表示与上一次一致。

下面是一个例子。

 ```http
      POST /token HTTP/1.1
      Host: server.example.com
      Authorization: Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW
      Content-Type: application/x-www-form-urlencoded
 
      grant_type=refresh_token&refresh_token=tGzv3JOkF0XG5Qx2TlKWIA
 ```

# 授权码模式
