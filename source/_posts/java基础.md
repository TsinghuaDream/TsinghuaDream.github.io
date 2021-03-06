---
title: java基础
date: 2018-09-21 15:10:50
tags: java8
---

# Java概述

**Java的跨平台性实现原理**：通过jvm（Java virtual machine）作翻译。

**jre和jdk：**

jre是Java的运行环境，包括jvm和运行时所需要的核心类库。如果是运行一个已有Java程序，则只需要安装jre即可。

jdk是Java程序开发工具包，**包含jre和开发人员使用的工具**。其中的开发工具包含编译工具（Javac.exe）和运行工具（Java.exe)。我们需要开发一个全新的Java程序，那么必须安装jdk。

# Java的hello world

开发Java程序，需要三个步骤：编写程序-编译程序-运行程序

​								  文件变化：Java源程序-通过编译器Javac.exe- Java字节码文件- 运行程序Java.exe

```java
public class HelloWorld(){
			public static void main(String[] args){
							System.out.println("HelloWorld");
			}
}
```

# 基本语法

**注释：**不谈

**关键字：**被java语言赋予特定含义的单词，也是命名时需要规避的单词，关键字的字母全部为小写。

**常量：**在程序运行过程中，其值不可发生改变的量。

**基本数据类型：**整数；浮点型；字符；布尔；

**变量：**在程序运行过程中，其值可发生变化的量**从本质上讲，变量是内存中一小块区域**。

**标识符：**就是给类，方法，变量等起名字的符号。**命名规范：小驼峰：firstName（方法、变量）大驼峰：firstName（类）**

**类型转换：**

自动类型转换：把一个表示数据范围小的数值或者变量赋值给另一个表示数据范围大的变量 double a = 10;

强制类型转换：把一个表示数据范围大的数值或者变量赋值给另一个表示数据范围小的变量 int k = (int)88.88;

# 运算符

## **算术运算符：**+ - * / %（加减乘除余）

字符的“+”操作：拿字符在计算机底层对应的数值来进行计算 A+a=162;

算术表达式中**包含多个基本数据类型的值**的时候，**整个算术表达式的类型会自动进行提升**。**提升到表达式中最高等级操作数相同的类型**

提升等级顺序：byte,short,char --> int -->long --> float --> double

当“+”操作中出现字符串，“+”被判定为字符串连接符，而不是算术运算，**而当多个数字和字符串同时出现，则从左到右依次判定。**1+99+“hello”+28+22+“world”=“200hello2822world”

## 赋值运算符：=，+=，-=，*=，/=，%=（赋值，加后赋值，减后赋值，乘后赋值，除后赋值，取余后赋值）

**拓展的赋值运算符隐含了强制类型转换**

```java
int a=1;
int b=2;
a=b;//a=2
a+=b;//a=4
a-=b;//a=2
a*=b;//a=4
a/=b;//a=2
a%=b;//a=0
```

## 自增自减运算符：++，--（自增，自减）

注意事项：

- ++和-- 既可以放在变量的后边，也可以放在变量的前边。
- 单独使用的时候， ++和-- 无论是放在变量的前边还是后边，结果是一样的。
- 参与操作的时候，如果放在变量的后边，先拿变量参与操作，后拿变量做++或者--。       参与操作的时候，如果放在变量的前边，先拿变量做++或者--，后拿变量参与操作。

# 关系运算符：==，！=，>，>=，<，<=

```java
int a=1;
int b=2l;
boolean c=true;
c=a==b;//c=false
c=a!=b;//c=true
c=a>b;//c=false
c=a>=b;//c=false
c=a<=b;//c=true
c=a<b;//c=true
```

## 逻辑运算符 &，|，^，！，&&，｜｜（与，或，异或，非，短路与，短路或）

3<x<6

x>3和x<6

x>3&&x<6

**逻辑运算符，是用来连接关系表达式的运算符。 当然，逻辑运算符也可以直接连接布尔类型的常量或者变量。**



```java
int a=1;
int b=2;
boolean c=true;
c=a&b;//c=true a&b，a和b都是true，结果为true，否则为false
c=a|b;//c=true a|b，a和b都是false，结果为false，否则为true
c=a^b;//c=true a^b，a和b结果不同为true，相同为false
c=!b;//c=true !a，结果和a的结果正好相反
c=a&&b;//c=true 作用和&相同，但是有短路效果
c=a||b;//c=true 作用和|相同，但是有短路效果
```

### **注意事项：**

- 逻辑与&，无论左边真假，右边都要执行。       短路与&&，如果左边为真，右边执行；如果左边为假，右边不执行。
- 逻辑或|，无论左边真假，右边都要执行。       短路或||，如果左边为假，右边执行；如果左边为真，右边不执行。
- 最常用的逻辑运算符：&&，||，!

## 三元运算符

格式：关系表达式？表达式1:表达式2；

范式：a>b?a:b;

计算规则：

​			首先计算关系表达式的值

​			如果值为true，表达式1的值就是运算结果

​			如果值为false，表达式2的值就是运算结果

```java
int a = 1;
int b = 2; 
int c = 3;
c = a > b ? a:b;// c = b;
```

三元案例：动物园有两只老虎，已知两只老虎的体重分别为180kg、200kg，请用程序实现判断力两只老虎的体重是否相同。

```java
int weight1 = 180;
int weight2 = 200;
(weight1 == weight2)?true : false;
```

# 数据输入（Scanner）

```java
import java.util.Scanner;//导包的动作必须出现在类定义的上边

Scanner sc = new Scanner(System.in);//上面这个格式里面，只有sc是变量名，可以变，其他的都不允许变。
int i = sc.nextInt();//上面这个格式里面，只有i是变量名，可以变，其他的都不允许变。
```

# 流程控制（循环(for, while,do...while)，顺序，分支（if,switch））

需求：一年有12个月，分属于春夏秋冬4个季节，键盘录入一个月份，请用程序实现判断该月份属于哪个季节，并输出。

分析：

1. 键盘录入月份数据，使用变量接收

   import java.util.Scanner;

   Scanner sc = new Scanner(System.in);

   int month = sc.nextInt();

2. 多情况判断，采用switch语句实现

   switch (month) {    

   case X:    

   case X:    

   case X:    

   default:}

3. 在每种情况中，完成输出对应的季节（选择了几个）

   case 3:    

   ​	System.out.println("春季");    

   ​	break; 

   case 6:    

   ​	System.out.println("夏季");

       break; 

   case 9: 

      System.out.println("秋季");

   ​    break;

   case 12:

   ​    System.out.println("冬季");

   ​    break;

**注意事项**：在switch语句中，如果case控制的语句体后面不写break，将出现穿透现象，在不判断下一个case值的情况下，向下运行，直到遇到break，或者整体switch语句结束

# 数组（array）

数组(array)是一种用于存储多个相同类型数据的存储模型

**数组的定义格式：**

- 格式一：数据类型[ ] 变量名
- 范式： int [ ] arr;
- 定义了一个int类型的变量，变量名上arr数组



- 格式二：数据类型 变量名[ ]
- 范式：int arr[ ]
- 定义了一个int类型的变量，变量名是arr数组

**数组初始化方式：**

**数组动态初始化**：初始化时只指定数组长度，由系统为数组分配初始值

- 格式：数据类型 [ ] 变量名 = new 数据类型 [ ];
- 范式：int [ ] arr = new int[3]; 

**数组元素访问：**数组名[索引]

**内存分配：**Java程序在运行时，需要在内存中分配空间。为了提高运算效率，就对空间进行了不同区域的划分，因为每一片区域都有特定的处理数据方式和内存管理方式。

栈内存：存储局部变量 定义在方法中的变量，例如：arr 使用完毕，立即消失 

**堆内存**：存储new出来的内容(实体，对象) 数组在初始化时，会为存储空间添加默认值 整数：0 浮点数：0.0 布尔：false 字符：空字符 引用数据类型：null 每一个new出来的东西都有一个地址值 使用完毕，会在垃圾回收器空闲时被回收

**数组静态初始化：**初始化时指定每个数组元素的初始值，由系统决定数组长度

- 格式： 数据类型 [] 变量名 = new 数据类型[ ]{数据1，数据2，数据3，......};
- 范例：int [ ] arr = new int [ ]{1,2,3};
- 简化格式：数据类型 [ ] 变量名 = {数据1，数据2，数据3，......};
- 范例：int [ ] arr = {1,2,3};

```java
/*例子 获取最大值 152 150 163 171 128 130 81 168*/
int [] arr = {152,150,163,171,128,130,81,168};
int max;
int max = arr[0];
for(i=0;i<arr.length;i++){
  if(arr[i]>max){
    max=arr[i];
  }
}
sout arr[i];
```

# 方法

**方法重载：**方法重载指同一个类中定义的多个方法之间的关系，满足下列条件的多个方法相互构成重载

- 多个方法在同一个类中
- 多个方法具有相同的方法名
- 多个方法的参数不相同，类型不同或者数量不同

# Debug（调试）

使用断点