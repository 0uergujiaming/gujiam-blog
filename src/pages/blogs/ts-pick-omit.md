---
title: Typescript学习-实现Exclude、Pick、Omit
date: 2021-05-24
description:
---

[[toc]]

### Ts内置的Exclude、Pick、Omit用法

```ts twoslash
interface Todo {
  title: string
  description: string
  completed: boolean
}

type T = Exclude<'a' | 'b', 'b'>
type TodoPreview = Pick<Todo, 'title' | 'completed'>
type TodoPreview2 = Omit<Todo, 'description'>
```

`Exclude<UnionType, ExcludedMembers>`通过从`UnionType`中排除所有可分配给`ExcludedMembers`的联合成员来构造类型

`Pick<Type, Keys>`从`Type`中获取指定的`Keys`构建一个新的类型,`Keys`可以是`string`或`string`的联合类型,`Omit`与之相反

### 实现Exclude

刷到这个题的时候非常懵，因为没有系统性的学习过`Typescript`就直接上手开始用了，也正是因为这个原因所以才准备通过刨根问底的刷题并记录过程来深入学习`Typescript`,根本无从下手的我直接看了`Exclude`源码

```ts twoslash
type Exclude<T, U> = T extends U ? never : T
```

第一眼：？？？ 这怎么实现的？`extends`用来做判断条件是不就是左边的类型可以赋值给右边的类型时就为`true`吗，这不就是个三元运算吗？不论`T`和`U`传了什么这个表达式不就是要么返回`never`要么返回`T`吗？怎么会返回了一个新的联合类型呢？
于是继续深挖，模拟一遍

```ts twoslash
type A = Exclude<'a' | 'b', 'b'>
//           ⬇️
type B = 'a' | 'b' extends 'b' ? never : 'a' | 'b'
type C = 'a' | 'b' extends 'a' | 'b' ? never : 'a' | 'b'
```

`B`和`C`的结果确实跟我想的一样啊，为什么`A`用`Exclude`就不一样了呢，没办法，老规矩，翻文档

> When conditional types act on a generic type, they become distributive when given a union type
>
> 机翻过来就是：当条件类型作用于泛型类型时，如果给定联合类型，它们就会变得具有分布式性。
>
> ```ts twoslash
> type ToArray<Type> = Type extends any ? Type[] : never
> type StrArrOrNumArr = ToArray<string | number>
> ```
>
> 也就是说当`Type`被用在条件类型中`extends`的左边且传入一个联合类型时，会把这个联合类型拆分依次代入执行，最后把所有的结果组成一个新的联合类型，实际执行效果如下

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never

type StrArrOrNumArr = ToArray<string | number>
// ⬇️
// string extends any ? string[] : never => string[]
// number extends any ? number[] : never => number
// string[] | number[]
```

那上面所有的疑惑也就都说得通了，既然都到这了那就再学一下这个分配式条件类型，官方叫[`Distributive Conditional Types`](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types)

什么时候会分配？我的理解是同时满足以下条件时：

- 首先是基于分配式条件类型是基于条件类型，必须是在条件类型表达式中`A extends B ? true : false`,且只分配`extends`前面的类型,也就是被检查的类型
- 类型作为泛型参数且被传入联合类型时
- 类型未做任何处理，也就是裸类型参数，例如官方文档中提到的避免分配性的方式`type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;`,这里`Type`被`[]`包裹之后就不是裸类型参数了，不会再做分配

### 实现Pick

```ts twoslash
interface Todo {
  title: string
  description: string
  completed: boolean
}

type MyPick<T, K extends keyof T> = {
  [k in K]: T[k]
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>
```

`Pick`的实现就很简单了，首先限制`K`只能传入`T`的`key`然后使用映射类型就可以实现了

### 实现Omit

既然实现了`Pick`和`Exclude`,那就用它们先实现一次

```ts twoslash
type MyOmit<T, K> = Pick<T, Exclude<keyof T, K>>

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoShow = MyOmit<Todo, 'completed'>
```

先用`Exclude`从所有`key`中排除掉传入的`key`，再用`Pick`去取出这些`key`

不使用`Pick`和`Exclude`的实现思路是用`as`,`as`我们一般用来做类型断言，但是在`Typescript4.1`之后，`as`被赋予了一个新的功能：在映射类型中通过`as`实现重新映射，例如：

```ts twoslash
type Getters<T> = {
  [k in keyof T as `get${Capitalize<k & string>}`]: () => T[k]
}
interface Person {
  name: string
  age: number
}
type PersonGetters = Getters<Person>
```

那我在遇到需要排除掉的`key`时需要重新映射成什么才能达到排除的效果呢？那就是`never`啦

```ts twoslash
type MyOmit<T, K extends keyof T> = {
  [k in keyof T as k extends K ? never : k]: T[k]
}

interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoShow = MyOmit<Todo, 'completed'>
```
