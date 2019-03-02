## 为什么需要用编译工具

首先我们使用 `TypeScript` 或最新的 `ECMAScript` 来编写优雅美观的代码。

但是浏览器可能并不会识别一些我们使用到的 [装饰器](https://www.tslang.cn/docs/handbook/decorators.html)，[模块](https://www.tslang.cn/docs/handbook/modules.html) 等最新的功能。

其次如果想尽量完成组件视图分离，`InDiv` 更推荐使用 `templateUrl` 这样的 `Component` 元数据来告诉组件，我们的视图需要映射哪些 DSL模板。

因此最好的方法就是使用 [webpack](https://webpack.js.org/) 等现代化的编译工具来编译我们的代码。


## HTML Template

在示例开始前，我们先配置过一份 webpack 的 rules。

随着项目的扩大，将模板写入js文件作为字符串模板并不会易与维护与复用，

因此将字符串模板从组件中剥离，使用 HTML 来编写我们的模板，并使用 `templateUrl` 来指定模板路径则是更好的选择。

来改写我们的 `AppComponent`。


> app.component.template.html

```html
<div class="app-component-container">
  <input nv-model="name"/>
  <a router-to="routeTo">点击跳转到/a</a>
  <p nv-on:click="addAge()" change-color="{color}">name: {{name}}</p>
  <show-age age="{age}" uupDateAge="{@upDateAge}"></show-age>
  <router-render></router-render>
</div>
```

> app.component.ts

```typescript
import { Component, StateSetter, SetState, Watch } from '@indiv/core';
import TestService from './provides/test.service';

@Component({
    selector: 'app-component',
    templateUrl: './app.component.template.html'
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public color: string = 'red';

  @StateSetter() public setState: SetState;

  constructor(
    private testService: TestService
  ) {
    console.log(this.testService.count); // 1
    this.testService.count = 2; // 2
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```

现在我们告诉 `AppComponent` 的视图是 `app.component.template.html` 的内容。

但是此时程序无法跑起来，因为浏览器并不知道应该映射哪块 HTML 模板。


## webpack

V2.0.5 开始，增加了新的包 `@indiv/indiv-loader` 作为编译 InDiv 应用的一个 webpack loader。

得益于 AST ，通过 `@indiv/indiv-loader`，将 HTML 模板编译成一个组件的属性，组件就能拿到并渲染了。

### loader

> webpack.config.js

```javascript
{
  test: [ /\.js$/, /\.jsx$/ ],
  exclude: [path.resolve(__dirname, 'node_modules')],
  use: [{
    loader: 'babel-loader',
    options: {
      presets: [ '@babel/preset-env' ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }],
        'dynamic-import-webpack',
      ],
    },
  }, {
    // indiv loader
    loader: '@indiv/indiv-loader',
    options: {
      useTypeScript: false
    }
  }
],
},
{
  test: [ /\.ts$/, /\.tsx$/ ],
  exclude: [path.resolve(__dirname, 'node_modules')],
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: [ '@babel/preset-env' ],
        plugins: [
          '@babel/plugin-syntax-dynamic-import',
          'dynamic-import-webpack',
        ],
      },
    },
    "awesome-typescript-loader",
    // indiv loader
    '@indiv/indiv-loader',
  ],
},
```

`@indiv/indiv-loader` 在内部读取来自 webpack 输入的文件字符串，

通过转化为 AST 语法树，将组件类的元数据 `templateUrl` 按照相对路径找到并解析该文件。

由于 `webpack` 的 loader 执行机制为数组从下到上，因此 `@indiv/indiv-loader` **必须放置在最后一位**，优先读取未被编译过的代码。

### options

`@indiv/indiv-loader` 接收 options `{ useTypeScript?: boolean }`

当 `useTypeScript` 为 `true` 时，loader 会使用 TypeScript 的 AST 规则编译代码，

当 `useTypeScript` 为 `false` 时，loader 会使用 babel 的 AST 规则编译代码。

当 options 不存在时，将使用入口文件的文件类型，`ts tsx` 将匹配为 TypeScript 的 AST 规则，

当 options 不存在时，将使用入口文件的文件类型，`js jsx` 将匹配为 babel 的 AST 规则。
