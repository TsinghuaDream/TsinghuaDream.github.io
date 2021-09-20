---
title: 让vue入个门吧
date: 2021-04-21 15:15:20
tags: vue
categories: vue
cover: /img/vue.jpeg
---

# 一、VS环境搭建

之前写过了，需要在VScode中安装如下插件：

Auto Close Tag
Auto Rename Tag
Chinese
ESlint
HTML CSS Support
HTML Snippets
JavaScript ES6
Live Server
open in brower
Vetur33
Vue 2Snippets 语法提示
谷歌浏览器中安装插件Vue Devtools

# 二、ES6特性

## 1、let作用域

- let不会作用到{}外，var会越域跳到{}外
- var可以多次声明同一变量，let会报错
- var定义之前可以使用，let定义之前不可使用。（变量提升问题）

```javascript
    <script>
        // var 声明的变量往往会越域
        // let 声明的变量有严格局部作用域
          {
              var a = 1;
              let b = 2;
          }
          console.log(a);  // 1
          console.log(b);  // ReferenceError: b is not defined
 
          // var 可以声明多次
          // let 只能声明一次
          var m = 1
          var m = 2
          let n = 3
 				 // let n = 4
          console.log(m)  // 2
          console.log(n)  // Identifier 'n' has already been declared
 
         // var 会变量提升
         // let 不存在变量提升
          console.log(x);  // undefined
          var x = 10;
          console.log(y);   //ReferenceError: y is not defined
          let y = 20;
 
         // let
         // 1. const声明之后不允许改变
            // 2. 一但声明必须初始化，否则会报错
         const a = 1;
         a = 3; //Uncaught TypeError: Assignment to constant variable.
     
     </script>
```

## 2、解构表达式const🌟

- 支持`let arr = [1,2,3]; let [a,b,c] = arr;`这种语法
- 支持对象解析：`const { name: abc, age, language } = person;` 冒号代表属性重新改名，`旧:新`  其它不变，
- 字符串函数扩展
- 可以定义多行的字符串
- 占位符功能 ${}


```javascript
<script>
        //数组解构
        let arr = [1,2,3];
        // // let a = arr[0];
        // // let b = arr[1];
        // // let c = arr[2];    
		let [a,b,c] = arr;
    console.log(a,b,c)

    const person = {
        name: "jack",
        age: 21,
        language: ['java', 'js', 'css']
    }
    //         const name = person.name;
    //         const age = person.age;
    //         const language = person.language;

    //对象解构 // 把name属性变为abc，声明了abc、age、language三个变量
    const { name: abc, age, language } = person;
    console.log(abc, age, language)

    //4、字符串扩展
    let str = "hello.vue";
    console.log(str.startsWith("hello"));//true
    console.log(str.endsWith(".vue"));//true
    console.log(str.includes("e"));//true
    console.log(str.includes("hello"));//true

    //字符串模板 ``可以定义多行字符串
    let ss = `<div>
                <span>hello world<span>
            </div>`;
    console.log(ss);
    
    function fun() {
        return "这是一个函数"
    }

    // 2、字符串插入变量和表达式。变量名写在 ${} 中，${} 中可以放入 JavaScript 表达式。
    let info = `我是${abc}，今年${age + 10}了, 我想说： ${fun()}`;
    console.log(info);

</script>
```
## 3、函数优化

支持函数形参默认值 function add2(a, b = 1) {
支持不定参数 function fun(...values) {
支持箭头函数 var print = obj => console.log(obj);
**箭头函数**+解构 var hello2 = ({name}) => console.log("hello," +name);，本来应该是person.name

```javascript
    <script>
        //在ES6以前，我们无法给一个函数参数设置默认值，只能采用变通写法：
        function add(a, b) {
            // 判断b是否为空，为空就给默认值1
            b = b || 1;
            return a + b;
        }
        // 传一个参数
        console.log(add(10));


        //现在可以这么写：直接给参数写上默认值，没传就会自动使用默认值
        function add2(a, b = 1) {
            return a + b;
        }
        console.log(add2(20));


        //2）、不定参数
        function fun(...values) {
            console.log(values.length)
        }
        fun(1, 2)      //2
        fun(1, 2, 3, 4)  //4

        //3）、箭头函数。lambda
        //以前声明一个方法
        // var print = function (obj) {
        //     console.log(obj);
        // }
        var print = obj => console.log(obj);
        print("hello");

        var sum = function (a, b) {
            c = a + b;
            return a + c;
        }

        var sum2 = (a, b) => a + b;
        console.log(sum2(11, 12));

        var sum3 = (a, b) => {
            c = a + b;
            return a + c;
        }
        console.log(sum3(10, 20))


        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        function hello(person) {
            console.log("hello," + person.name)
        }

        //箭头函数+解构
        var hello2 = ({name}) => console.log("hello," +name);
        hello2(person);

    </script>
```

## 4、对象优化

可以获取map的键值对等Object.keys()、values、entries
Object.assgn(target,source1,source2) 合并
如果属性名和属性值的变量名相同，可以省略const person2 = { age, name } 代表age属性的值是变量age的值
…代表取出该对象所有属性拷贝到当前对象。let someone = { …p1 }

```javascript
    <script>
        const person = {
            name: "jack",
            age: 21,
            language: ['java', 'js', 'css']
        }

        console.log(Object.keys(person));//["name", "age", "language"]
        console.log(Object.values(person));//["jack", 21, Array(3)]
        console.log(Object.entries(person));//[Array(2), Array(2), Array(2)]

        const target  = { a: 1 };
        const source1 = { b: 2 };
        const source2 = { c: 3 };

        // 合并
        //{a:1,b:2,c:3}
        Object.assign(target, source1, source2);

        console.log(target);//["name", "age", "language"]

        //2）、声明对象简写
        const age = 23
        const name = "张三"
        const person1 = { age: age, name: name }
        // 等价于
        const person2 = { age, name }//声明对象简写
        console.log(person2);

        //3）、对象的函数属性简写
        let person3 = {
            name: "jack",
            // 以前：
            eat: function (food) {
                console.log(this.name + "在吃" + food);
            },
            //箭头函数this不能使用，要使用的话需要使用：对象.属性
            eat2: food => console.log(person3.name + "在吃" + food),
            eat3(food) {
                console.log(this.name + "在吃" + food);
            }
        }

        person3.eat("香蕉");
        person3.eat2("苹果")
        person3.eat3("橘子");

        //4）、对象拓展运算符

        // 1、拷贝对象（深拷贝）
        let p1 = { name: "Amy", age: 15 }
        let someone = { ...p1 }
        console.log(someone)  //{name: "Amy", age: 15}

        // 2、合并对象
        let age1 = { age: 15 }
        let name1 = { name: "Amy" }
        let p2 = {name:"zhangsan"}
        p2 = { ...age1, ...name1 } 
        console.log(p2)
    </script>
```

## 5、map和reduce

`map()`：接收一个函数，将原数组中的所有元素用这个函数处理后放入新数组返回。
`reduce()` 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，

```javascript
arr = arr.map(item=> item*2);

//[2, 40, -10, 6]
arr.reduce(callback,[initialValue])
/**
    1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
    2、currentValue （数组中当前被处理的元素）
    3、index （当前元素在数组中的索引）
    4、array （调用 reduce 的数组）*/
```

- map处理，arr = arr.map(item=> item*2);
- reduce。arr.reduce((原来的值,处理后的值即return的值)=>{

```javascript
    <script>
        //数组中新增了map和reduce方法。
         let arr = ['1', '20', '-5', '3'];
         
        //map()：接收一个函数，将原数组中的所有元素用这个函数处理后放入新数组返回。
        //  arr = arr.map((item)=>{
        //     return item*2
        //  });
         arr = arr.map(item=> item*2);

        

         console.log(arr);
        //reduce() 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素，
        //[2, 40, -10, 6]
        //arr.reduce(callback,[initialValue])
        /**
        1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
        2、currentValue （数组中当前被处理的元素）
        3、index （当前元素在数组中的索引）
        4、array （调用 reduce 的数组）*/
        let result = arr.reduce((a,b)=>{
            console.log("上一次处理后："+a);
            console.log("当前正在处理："+b);
            return a + b;
        },100);
        console.log(result)

    
    </script>
```

## 6、promise优化异步操作封装ajax

```javascript
    <script>
        //1、查出当前用户信息
        //2、按照当前用户的id查出他的课程
        //3、按照当前课程id查出分数
        // $.ajax({
        //     url: "mock/user.json",
        //     success(data) {
        //         console.log("查询用户：", data);
        //         $.ajax({
        //             url: `mock/user_corse_${data.id}.json`,
        //             success(data) {
        //                 console.log("查询到课程：", data);
        //                 $.ajax({
        //                     url: `mock/corse_score_${data.id}.json`,
        //                     success(data) {
        //                         console.log("查询到分数：", data);
        //                     },
        //                     error(error) {
        //                         console.log("出现异常了：" + error);
        //                     }
        //                 });
        //             },
        //             error(error) {
        //                 console.log("出现异常了：" + error);
        //             }
        //         });
        //     },
        //     error(error) {
        //         console.log("出现异常了：" + error);
        //     }
        // });


        //1、Promise可以封装异步操作
        // let p = new Promise((resolve, reject) => { //传入成功解析，失败拒绝
        //     //1、异步操作
        //     $.ajax({
        //         url: "mock/user.json",
        //         success: function (data) {
        //             console.log("查询用户成功:", data)
        //             resolve(data);
        //         },
        //         error: function (err) {
        //             reject(err);
        //         }
        //     });
        // });

        // p.then((obj) => { //成功以后做什么
        //     return new Promise((resolve, reject) => {
        //         $.ajax({
        //             url: `mock/user_corse_${obj.id}.json`,
        //             success: function (data) {
        //                 console.log("查询用户课程成功:", data)
        //                 resolve(data);
        //             },
        //             error: function (err) {
        //                 reject(err)
        //             }
        //         });
        //     })
        // }).then((data) => { //成功以后干什么
        //     console.log("上一步的结果", data)
        //     $.ajax({
        //         url: `mock/corse_score_${data.id}.json`,
        //         success: function (data) {
        //             console.log("查询课程得分成功:", data)
        //         },
        //         error: function (err) {
        //         }
        //     });
        // })

        function get(url, data) { //自己定义一个方法整合一下
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: url,
                    data: data,
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (err) {
                        reject(err)
                    }
                })
            });
        }

        get("mock/user.json")
            .then((data) => {
                console.log("用户查询成功~~~:", data)
                return get(`mock/user_corse_${data.id}.json`);
            })
            .then((data) => {
                console.log("课程查询成功~~~:", data)
                return get(`mock/corse_score_${data.id}.json`);
            })
            .then((data)=>{
                console.log("课程成绩查询成功~~~:", data)
            })
            .catch((err)=>{ //失败的话catch
                console.log("出现异常",err)
            });

    </script>
```

## 7、模块化import/export

user.js

```javascript
var name = "jack"
var age = 21
function add(a,b){
    return a + b;
}
// 导出变量和函数
export {name,age,add}
```

Hello.js

```javascript
// export const util = {
//     sum(a, b) {
//         return a + b;
//     }
// }

// 导出后可以重命名
export default {
    sum(a, b) {
        return a + b;
    }
}
// export {util}

//`export`不仅可以导出对象，一切JS变量都可以导出。比如：基本类型变量、函数、数组、对象。
```

Main.js

```javascript
import abc from "./hello.js"
import {name,add} from "./user.js"

abc.sum(1,2);
console.log(name);
add(1,3);
```

# 三、Vue

MVVM思想

M：model 包括数据和一些基本操作
V：view 视图，页面渲染结果
VM：View-model，模型与视图间的双向操作（无需开发人员干涉）
视图和数据通过VM绑定起来，model里有变化会自动地通过Directives填写到视view中，视图表单中添加了内容也会自动地通过DOM Listeners保存到模型中。


