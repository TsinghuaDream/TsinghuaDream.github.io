---
title: servlet
date: 2021-04-01 16:03:01
tags: java
---

# 古老的技术Servlet

## tomcat

tomcat是一个web服务器（**同时也是servlet容器**），通过它我们可以很方便地接收和返回到请求（如果不用tomcat，那我们需要自己写socket来接收和返回请求）。

各个目录的含义：

bin：存放启动和关闭tomcat的脚本文件

conf：存放tomcat服务器的各种配置文件

lib：存放tomcat服务器的支撑jar包

logs：存放tomcat的日志文件

temp：存放tomcat运行时产生的临时文件

webapps：web应用所在目录，即供外界访问的web资源的存放目录。

work：tomcat工作目录

## Servlet版"hello world"

首先，我们需要认清一个JavaWeb的标准目录结构：





webapps-->bbs(web应用目录)-->html文件，jsp文件

​													 -->web-inf目录-->web.xml、taolib.tld

​        																	   -->classes目录-->类的包目录-->各种class文件标签处理类

​													-->lib目录（web应用需要的jar包）

### servlet案例

