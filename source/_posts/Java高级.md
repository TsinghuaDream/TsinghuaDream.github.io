---
title: Java高级
date: 2018-12-03 10:03:26
tags: java8
cotegories: java
---

# 标准类制作

1. 成员变量
   - ​	使用private修饰

2. 构造方法
   - 提供一个无参构造方法
   - 提供一个带多个参数的构造方法

3. 成员方法
   - 提供每一个成员变量对应的setXxx( )/getXxx( )
   - 提供一个显示对象信息的show（）
4. 创建对象并对其成员变量赋值的两种方式t
   - 无参构造方法创建对象后使用setXxx( )赋值
   - 使用带参构造方法直接创建带有属性值的对象    

# 集合

编程的时候如果要存储多个数据，使用**长度固定的数组存储格式，不一定满足我们的需求**，更适应不了变化的需求。所以集合应运而生！

**集合的接口们：**Collection,List,Set,泛型，Map,Collections;

集合：**Collection**--> **List**-->ArrayList,LinkedList...

​									**Set**-->HashSet,TreeSet...

​			    **Map**     -->HashMap...

**Collection集合概述** 

​	是单例集合的顶层接口，它表示一组对象，这些对象也称为Collection的元素 

​	JDK 不提供此接口的任何直接实现，它提供更具体的子接口（如Set和List）实现 

**创建Collection集合的对象** 

​	多态的方式 

​	具体的实现类ArrayList

Collection集合常用方法

| 方法名                     | 说明                               |
| -------------------------- | ---------------------------------- |
| boolean add(E e)           | 添加元素                           |
| boolean remove(Object o)   | 从集合中移除指定的元素             |
| void clear()               | 清空集合中的元素                   |
| boolean contains(Object o) | 判断集合中是否存在指定的元素       |
| boolean isEmpty()          | 判断集合是否为空                   |
| int size()                 | 集合的长度，也就是集合中元素的个数 |

**集合类的特点**：提供一种存储空间可变的存储模型，存储的数据容量可以发生改变。

**泛型：可以改变存储的数据类型，使代码更加灵活**

## ArrayList 

```java
public ArrayList();//创建一个空的集合对象
public boolean add(E e);//将指定的元素追加到此集合到末尾
public void add(int index,E element);//在此集合中的指定位置插入指定的元素
public boolean remove(int index);//删除指定索引处的元素，返回被删除的元素
public E remove(int index);//删除指定索引处的元素，返回被删除的元素
public E set(int index,E element);//修改指定索引处的元素，返回被修改的元素
public E get(int index);//返回指定索引处的元素
public int size();//返回集合中的元素的个数
```

# 修饰符(权限修饰符/状态修饰符)

private：同一类中可访问

默认 ：同一包中可访问

protected ：不同包的子类也可访问

public：公开



final和static 

final 关键字是最终的意思，可以修饰成员方法，成员变量，类 

final 修饰的特点

修饰方法：表明该方法是最终方法，不能被重写 

修饰变量：表明该变量是常量，不能再次被赋值 

修饰类：表明该类是最终类，不能被继承

static关键字表明**被类的所有对象共享**，**可以通过类名调用**

# 多态（同一对象，在不同时刻表现出来的不同形态）

举例：猫 

我们可以说猫是猫：猫 cat = new 猫(); 

我们也可以说猫是动物：动物 animal = new 猫(); 

这里猫在不同的时刻表现出来了不同的形态，这就是多态

**多态的前提：有继承/实现关系 有方法重写 有父类引用指向子类对象**

**多态中成员访问特点**：

<u>成员变量：编译看左边，执行看左边</u> 

<u>成员方法：编译看左边，执行看右边</u> 

为什么成员变量和成员方法的访问不一样呢？ 因为成员方法有重写，而成员变量没有

**多态的利弊：**

多态的好处：提高了程序的扩展性 具体体现：定义方法的时候，使用父类型作为参数，将来在使用的时候，使用具体的子类型参与操作 多态的弊端：不能使用子类的特有功能

**多态的转型：**

- 向上转型 从子到父 父类引用指向子类对象 
- 向下转型 从父到子 父类引用转为子类对象

# 抽象类和接口

在Java中，**一个没有方法体的方法应该定义为抽象方法**，**而类中如果有抽象方法，该类必须定义为抽象类**

**抽象类特点：**

**<u>抽象类和抽象方法必须使用</u> <u>abstract</u> <u>关键字修饰</u>**

**<u>抽象类中不一定有抽象方法</u>，<u>有抽象方法的类一定是抽象类</u>**

**抽象类不能实例化 抽象类如何实例化呢？<u>参照多态的方式，通过子类对象实例化，这叫抽象类多态</u>**

**抽象类的子类 要么重写抽象类中的所有抽象方法 要么是抽象类**

------

接口就是一种公共的规范标准，只要符合规范标准，大家都可以通用 Java中的接口更多的体现在对行为的抽象

**接口特点：**

接口用关键字interface修饰 

​	public interface 接口名 {}  

类实现接口用implements表示 

​	public class 类名 implements 接口名 {} 

接口不能实例化 

接口如何实例化呢？参照多态的方式，通过实现类对象实例化，这叫接口多态。 

```
多态的形式：具体类多态，抽象类多态，接口多态。  

多态的前提：有继承或者实现关系；有方法重写；有父(类/接口)引用指向(子/实现)类对象 
```

**<u>接口的子类 要么重写接口中的所有抽象方法 要么是抽象类</u>**

------

**抽象类和接口的区别：**

**成员区别** 

​	抽象类 	变量,常量；有构造方法；有抽象方法,也有非抽象方法 

​	接口 		常量；抽象方法 

**关系区别** 

​	类与类 		继承，单继承 

​	类与接口 	实现，可以单实现，也可以多实现 

​	接口与接口 	继承，单继承，多继承 

**设计理念区别** 

​	抽象类 	对类抽象，包括属性、行为 

​	接口 		对行为抽象，主要是行为

```java
/*案例*/
//抽象类
  public abstract class Door {
     public abstract void open();
     public abstract void close();
  }
//接口  
  public interface Door {
     void open();
     void close();
  }
//例子
public interface Alram {
     void alarm();
  }
  public abstract class Door {
     public abstract void open();
     public abstract void close();
  }
  public class AlarmDoor extends Door implements Alarm {
     public void oepn() {
        //....
     }
     public void close() {
        //....
     }
     public void alarm() {
        //....
     }
  }
```

# 形参和返回值注意事项

- 类名作为形参和返回值
  - 方法的形参是类名，其实需要的是该类的对象 
  - 方法的返回值是类名，其实返回的是该类的对象
- 抽象类名作为形参和返回值
  - 方法的形参上抽象类名，其实需要的是该抽象类的子类对象
  - 方法的返回值是抽象类名，其实返回的是该抽象类的子类对象
- 接口名作为形参和返回值
  - 方法的形参是接口名，其实需要的是该接口的实现类对象
  - 方法的返回值是接口名，其实返回的是该接口的实现类对象

# 内部类（就是在一个类中定义一个类。）

```java
public class Outer {
	public class Inner {
  
      	} 	
}
```

**内部类的访问特点**:内部类可以直接访问外部类的成员，包括私有;外部类要访问内部类的成员，必须创建对象

**内部类的分类：**

**成员内部类；局部内部类；匿名内部类。**

在类的成员位置：成员内部类，外界创建对象使用成员内部类：

```java
//外部类名.内部类名 对象名 = 外部类对象.内部类对象;
Outer.Inner oi = new Outer().new Inner();
```

在类的局部位置：局部内部类 ;

局部内部类是在方法中定义的类，所以外界是无法直接使用，需要在方法内部创建对象并使用 该类可以直接访问外部类的成员，也可以访问方法内的局部变量。

# 常用API (Math System Object Arrays 基本类型包装类 日期类)常用的工具类的设计思想：构造方法私有。成员都用static修饰。

## **Math 类概述**：

Math 包含执行基本数字运算的方法 没有构造方法，如何使用类中的成员呢？ 看类的成员是否都是静态的，如果是，通过类名就可以直接调用

Math类的常用方法：

| 方法名                                      | 说明                                           |
| :------------------------------------------ | :--------------------------------------------- |
| public static int abs(int a)                | 返回参数的绝对值                               |
| public static double ceil(double a)         | 返回大于或等于参数的最小double值，等于一个整数 |
| public static double floor(double a)        | 返回小于或等于参数的最大double值，等于一个整数 |
| **public static int round(float a)**        | 按照四舍五入返回最接近参数的int                |
| **public static int max(int a,int b)**      | 返回两个int值中的较大值                        |
| public static int min(int a,int b)          | 返回两个int值中的较小值                        |
| public static double pow(double a,double b) | 返回a的b次幂的值                               |
| public static double random()               | 返回值为double的正值，[0.0,1.0)                |

## **System类概述：**

System包含几个有用的类字段和方法，它不能被实例化

| 方法名                                     | 说明                                       |
| ------------------------------------------ | ------------------------------------------ |
| public static void exit（int status）      | 终止当前运行的Java虚拟机，非零表示异常终止 |
| **public static long currentTimeMillis()** | **返回当前时间（以毫秒为单位）**           |

## **Object 类的概述：**

Object 是类层次结构的根，每个类都可以将 Object 作为超类。所有类都直接或者间接的继承自该类。

| 方法名                            | 说明                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| public String toString()          | 返回对象的字符串表示形式。建议所有子类重写该方法，自动生成 |
| public boolean equals(Object obj) | 比较对象是否相等。默认比较地址，重写可以比较内容，自动生成 |

## **Arrays类概述：**

Arrays类包含用于操作数组的各种方法

| 方法名                                     | 说明                               |
| ------------------------------------------ | ---------------------------------- |
| **public static String toString(int[] a)** | 返回指定数组的内容的字符串表示形式 |
| **public static void sort(int[] a)**       | 按照数字顺序排列指定的数组         |

**基本类型包装类概述：**将基本数据类型封装成对象的好处在于可以在对象中定义更多的功能方法操作该数据 

常用的操作之一：用于基本数据类型与字符串之间的转换。

| 基本数据类型 | 包装类    |
| ------------ | --------- |
| byte         | Byte      |
| short        | Short     |
| int          | Integer   |
| long         | Long      |
| float        | Float     |
| double       | Double    |
| char         | Character |
| boolean      | Boolean   |

**自动装箱和拆箱**

装箱：把基本数据类型转换为对应的包装类类型 

拆箱：把包装类类型转换为对应的基本数据类型

```java
Integer i = 100;  // 自动装箱
i += 200;         // i = i + 200;  i + 200 自动拆箱；i = i + 200; 是自动装箱
```

**注意**：在使用包装类类型的时候，如果做操作，最好先判断是否为 null          

我们推荐的是，只要是对象，在使用前就必须进行不为 null 的判断

## 日期类（Date）

Date 代表了一个特定的时间，精确到毫秒

| 方法名                             | 说明                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| public Date()                      | 分配一个Date对象，并初始化，以便它代表它被分配到时间，精确到毫秒 |
| public Date(long date)             | 分配一个Date对象，并将其初始化为表示从标准基准时间起指定的毫秒数 |
| **public long getTime()**          | 获取的是日期对象从1970年1月1日 00:00:00到现在的毫秒值        |
| **public void setTime(long time)** | 设置时间，给的是毫秒值                                       |

### SimpleDateFormat 类概述（具体类，用于以区域设置敏感的方式格式化和解析日期）

| 方法名                                  | 说明                                                   |
| --------------------------------------- | ------------------------------------------------------ |
| public SimpleDateFormat()               | 构造一个SimpleDateFormat，使用默认模式和日期格式       |
| public SimpleDateFormat(String pattern) | 构造一个SimpleDateFormat使用给定的模式和默认的日期格式 |

### Calendar类概述（Calendar 为某一时刻和一组日历字段之间的转换提供了一些方法，并为操作日历字段提供了一些方法）

Calendar 提供了一个类方法 getInstance 用于获取 Calendar 对象，其日历字段已使用当前日期和时间初始化：Calendar rightNow = Calendar.getInstance();

| 方法名                                             | 说明                                                   |
| -------------------------------------------------- | ------------------------------------------------------ |
| public int get(int field)                          | 返回给定日历字段的值                                   |
| public abstract void add(int field, int amount)    | 根据日历的规则，将指定的时间量添加或减去给定的日历字段 |
| public final void set(int year,int month,int date) | 设置当前日历的年月日                                   |

# 异常Throwable

异常体系：Throwable-->Error & Exception-->RuntimeException&非RuntimeException

Error：严重问题，不需要处理 

Exception：称为异常类，它表示程序本身可以处理的问题 

RuntimeException：在编译期是不检查的，出现问题后，需要我们回来修改代码  

非 RuntimeException：编译期就必须处理的，否则程序不能通过编译，就更不能正常运行了

**如果程序出现问题，我们没有做任何异常处理，最终jvm会把异常的名称，异常原因及出现位置信息输出在控制台，然后程序停止执行**

抛出异常两种方案：try...catch...  &  throws 异常类名；

Thtowable的成员方法

| 方法名                        | 说明                              |
| ----------------------------- | --------------------------------- |
| public String getMessage()    | 返回此 throwable 的详细消息字符串 |
| public String toString()      | 返回此可抛出的简短描述            |
| public void printStackTrace() | 把异常的错误信息输出在控制台      |

## 自定义异常

```
当Java内置的异常都不能明确的说明异常情况的时候，需要创建自己的异常
需要注意的是，唯一有用的就是类型名这个信息，所以我们不需要在异常类的设计上花费太多精力
一个类要想成为异常类的一员，要么继承Exception，要么继承RuntimeException
通常情况下，会直接继承自Exception类，给出无参和带参构造方法即可
```



```java
public class 异常类名 extends Exception {
	//无参构造
	//带参构造
}
//demo
public class ScoreException extends Exception {
	public ScoreException() {}
	public ScoreException(String message) {
	     super(message);
	}
} 
```

## throws 和 throw 的区别

throws 

- 用在方法声明后面，跟的是异常类名 

- 表示抛出异常，由该方法的调用者来处理 

- 表示出现异常的一种可能性，并不一定会发生这些异常

throw 

- 用在方法体内，跟的是异常对象名 

- 表示抛出异常，由方法体内的语句处理 

- 执行 throw 一定抛出了某种异常

# IO流处理

## File类（用于操作文件和目录）

File：它说文件和目录路径名的抽象表示

- 文件和目录说可以通过file封装成对象的

- 对于file而言，其封装的并不是一个真正存在的文件，仅仅是一个路径名而已。它可以是存在的，也可以是不存在的。 

- 将来是通过具体的操作把这个路径的内容转换成具体存在

  | 方法名                            | 说明                                                       |
  | --------------------------------- | ---------------------------------------------------------- |
  | File(String pathname)             | 通过将给定的路径名字符串转换成抽象路径名来创建新的File实例 |
  | File(String parent, String child) | 从父路径名字符串和子路径名字符串创建新的 File实例          |
  | File(File parent, String child)   | 从父抽象路径名和子路径名字符串创建新的 File实例            |

   

## File类增删功能

| 方法名                         | 说明                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| public boolean createNewFile() | 当具有该名称的文件不存在时，创建一个由该抽象路径名命名的新空文件 |
| public boolean mkdir()         | 创建由此抽象路径名命名的目录                                 |
| public boolean mkdirs()        | 创建由此抽象路径名命名的目录，包括任何必需但不存在的父目录   |

| 方法名                  | 说明                               |
| ----------------------- | ---------------------------------- |
| public boolean delete() | 删除由此抽象路径名表示的文件或目录 |

**绝对路径和相对路径的区别**

​	l绝对路径：完整的路径名，不需要任何其他信息就可以定位它所表示的文件。例如：E:\itcast\java.txt

​	l相对路径：必须使用取自其他路径名的信息进行解释。例如：myFile\\java.txt

**删除目录时的注意事项：**

​	l如果一个目录中有内容(目录，文件)，不能直接删除。应该先删除目录中的内容，最后才能删除目录

## File类判断和获取功能

| 方法名                          | 说明                                                     |
| ------------------------------- | -------------------------------------------------------- |
| public boolean isDirectory()    | 测试此抽象路径名表示的File是否为目录                     |
| public boolean isFile()         | 测试此抽象路径名表示的File是否为文件                     |
| public boolean exists()         | 测试此抽象路径名表示的File是否存在                       |
| public String getAbsolutePath() | 返回此抽象路径名的绝对路径名字符串                       |
| public String getPath()         | 将此抽象路径名转换为路径名字符串                         |
| public String getName()         | 返回由此抽象路径名表示的文件或目录的名称                 |
| public String[] list()          | 返回此抽象路径名表示的目录中的文件和目录的名称字符串数组 |
| public File[] listFiles()       | 返回此抽象路径名表示的目录中的文件和目录的File对象数组   |

# 字节流和字符流（操作文件传输）

IO流概述：

- IO：输入/输出(Input/Output)

- 流：是一种抽象概念，是对数据传输的总称。也就是说数据在设备间的传输称为流，流的本质是数据传输

- IO流就是用来处理设备间数据传输问题的

  ​	常见的应用：文件复制；文件上传；文件下载

- IO流分类：

  - 按照数据的流向

    - 输入流：读数据

      输出流：写数据

  - 按照数据类型来分

    - 字节流

       字节输入流；字节输出流

      字符流

       字符输入流；字符输出流

  一般来说，我们说IO流的分类是按照**数据类型**来分的

- 如果数据通过Window自带的记事本软件打开，我们还可以**读懂里面的内容**，就使用**字符流**，

  否则使用字节流。**如果你不知道该使用哪种类型的流，就使用字节流**

# 内存划分（伊甸园区，旧生代区，永久区）

内存的优良划分是系统优化很关键的一环，主要考察内存优化和GC机制

Runtime类：

```java
public class MemoryT {
    public static void main(String[] args) {
        Runtime run=Runtime.getRuntime();//取得Runtime对象
//        Runtime rund = new Runtime();//这个不行，因为Runtime类采用单例设计模式 它的构造方法Runtime()是私有的；
        System.out.println("内存1"+run.maxMemory());
        
        System.out.println("内存3"+run.totalMemory());//返回值都为long类型 就是一子节 1byte；
      
     	  System.out.println("内存2"+run.freeMemory());
    }
}
```

伊甸园区：新生的对象都存在这里，但不是所有对象都永久存在，伴随着内存的不足会进行gc处理空出空间给新生的对象；

旧生代区：长期使用的对象存在这里，当伊甸园区进行了gc处理仍然空间不足时，该区进行gc处理；

永久区：永不清理的内存空间；

调整内存大小：xms-初始内存大小  默认为物理内存1/64但小于1g；

​                           xmx-最大内存大小 默认为物理内存的1/4但小于1g ；

​						   xmn-伊甸园区堆内存大小； 因为默认值实在太小了，我们实际服务器基本就16g以上，所以需要手动调整优化性能；

# 加载器

```java
class dmp{}
public class LoaderT {
    class demo{}
    public static void main(String[] args) throws ClassNotFoundException {
        Class<?> cls = Class.forName("dmp");
        System.out.println(cls.getClassLoader());//AppClassLoade sun.misc.Launcher$AppClassLoader@18b4aac2
        System.out.println(cls.getClassLoader().getParent());//ExtClassLoade
        System.out.println(cls.getClassLoader().getParent().getParent());//三层加载器
    }
}
```

类加载器可自定义，Java中采用双亲加载方式，加载系统类时调用另一套加载器。

