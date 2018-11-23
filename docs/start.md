## 开始第一步

在这一组文章中, 您将了解 InDiv 的核心基础知识。主要是了解基本的 InDiv 应用程序构建模块。您将构建一个基本的网页应用程序, 其中的功能涵盖了大量的入门基础。

## 语言

 我爱上了 [TypeScript](https://www.tslang.cn)，但最重要的是，我喜欢 JavaScript。 这就是为什么 InDiv 兼容 TypeScript 和纯 JavaScript 。 InDiv 正利用最新的语言功能，所以要使用简单的 JavaScript 框架。当然我推荐你使用 TypeScript，因为 JavaScript 版本会有些不同。

 在文章中，我们主要使用 TypeScript ，但是当它包含一些 Typescript 特定的表达式时，您总是可以将代码片段切换到 JavaScript 版本。

## 先决条件

 请确保您的操作系统上安装了 [Node.js](http://nodejs.cn/download/)（> = 6.11.0）。

## 建立

只要确保你已经安装了 npm，然后在你的 OS 终端中使用以下命令：


```
$ npm i --save indiv
```


 项目的`src` 目录中应该包含几个核心文件。

```
src
|
├── app.component.ts
├── app.style.less
├── app.module.ts
├── index.html
└── main.ts
```

按照约定，新创建的模块应该有一个专用目录。

|      |           |   
| ------------- |:-------------:| 
| main.ts     | 应用程序入口文件。实例化 `InDiv` 并使用  `bootstrapModule` 用来启动根模块。 | 
| index.html     | 应用程序入口HTML文件，应包含一个 `id="root"` 的 `<div>` | 
| app.module.ts      | 定义 `AppModule` 应用程序的根模块。      |   
| app.component.ts | 根模块的根组件，用于 `bootstrap`。     |   
| app.style.less | 根模块的根组件的样式文件。     |   


 `main.ts` 负责引导创建我们的应用程序：

> main.ts

```typescript
import { InDiv } from 'indiv';

import RootModule from './modules';

const inDiv = new InDiv();
inDiv.bootstrapModule(RootModule);
inDiv.init();
```



 要创建一个 InDiv 应用实例，我们使用了 `bootstrapModule`  和 `init`。 `bootstrapModule(RootModule)` 方法引导了根模块创建, `init()` 将在创建完根模块之后初始化整个应用并将组件渲染到页面中，在后面的章节中将对此进行详细描述。
