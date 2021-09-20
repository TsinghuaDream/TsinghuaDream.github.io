---
title: mysql8配置信息
date: 2021-06-12 18:03:33
tags: mysql
---

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bim?serverTimezone=Asia/Shanghai&zeroDateTimeBehavior=convertToNull&autoReconnect=true&useSSL=false&failOverReadOnly=false
spring.datasource.username=bimengine
spring.datasource.password=fgBQLZpgDaxH7xuu
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.12</version>
</dependency>
```

