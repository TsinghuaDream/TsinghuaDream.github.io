---
title: springMVC4
date: 2021-07-22 17:35:14
tags: spring
categories: spring
---

# 1、上下文配置

spring最为精彩的地方的便是它的容器思想和AOP切面编程，那么spring是如何实现的容器化呢？ 在源码阅读阶段我们可知通过它的bean思想实现，那么这里变产生了歧义，因为Java似乎也预留了一个Java bean，那么@bean和Java bean的区别在哪呢？

## 1.1 Java bean 和@bean

- Java bean指的是一种规范，它实现序列化，且包含get set方法以及构造函数；
- @bean
