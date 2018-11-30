## 构建一个组件

在这一组文章中, 您将了解 InDiv 的组件`Component`。主要是了解基本的 InDiv 应用程序组件化是如何建立的。您将构建两个基本的组件，并学习组件是如何交互的。


## 组件

InDiv 基于组件。在 InDiv 中最典型的数据显示方式，就是把 字符串模板 中的控件绑定到 InDiv 组件。

为了创建一个基本的组件，我们必须使用`装饰器`。多亏了他们，InDiv 知道如何将组件渲染为一个真实的 DOM 。

首项我们先创建个文件夹 components 用来保存所有的组件 

此时的项目目录应该为

```
src
|
├── components
├── modules
├── app.component.ts
├── app.style.less
├── app.module.ts
├── index.html
└── main.ts
```


## 装饰器`@Component`

让我们先用 装饰器`@Component` 写个根组件

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`<div class="app-component-container"></div>`),
})
export default class AppComponent {}
```

这个装饰器是强制性的，每个被创建的 InDiv 组件都需要使用 `@Component`。

`@Component` 接收三个参数，`selector: string;` `template: string;` `providers?: (Function | TUseClassProvider | TUseValueProvider)[];`

* `selector: string;`  作为组件被渲染成 DOM 的标签，类似于 `<div></div>`
* `template: string;` 视图模板，用来声明被渲染的视图
* `providers?: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; })[];` 声明可以被组件注入的服务，这个我们放到服务再讲

现在我们将 `AppComponent` 在 `app.module.ts` 中声明一下并放入引导启动的 `bootstrap`中。启动http服务就可以看到页面上渲染出 `AppComponent` 的模板了。

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import AppComponent from './app.component';

@NvModule({
  imports: [],
  declarations: [ AppComponent ],
  providers: [],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```


## 状态（state）与 内置指令

一个组件的交互行为应该由组件内部的状态决定。类似于 `React`，InDiv 选择将组件内的状态收集到一个对象上管理(可能这就是所谓的状态收集)。

在组件内中声明一个对象

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`<div class="app-component-container"></div>`),
})
export default class AppComponent {
  state: {
    name: string,
  } = {
    name: 'InDiv',
  };
}
```

为了将状态表现在页面上，我们需要用模板语法及内置指令将状态绑定到模板上的某些属性。
当我们更改 `state` 上面的变量时，页面也会随着模板而变化。
当然，具体模板语法之后详细再了解。

> app.component.ts

```typescript
import { Component } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p>name: {{name}}</p>
        </div>
    `),
})
export default class AppComponent {
  state: {
    name: string,
  } = {
    name: 'InDiv',
  };
}
```

当然在具体业务中，不可能上来就全部声明好所有状态，但是由于某些原因，在生命周期 `constructor` 和 `nvOnInit` 之后，组件实力上`state`的变量增加删除或数组的一些方法将无法更新视图，因此我们需要引入一个新的方法 `setState` 来重新设置状态收集及监听。

> app.component.ts

```typescript
import { Component, setState, SetState } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="@addAge()">name: {{name}}</p>
        </div>
    `),
})
export default class AppComponent {
  public state: {
    name: string,
    age?: number,
  } = {
    name: 'InDiv',
  };

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }

  public upDateAge(age: number) {
    this.state.age = age;
    // this.setState({ age: 24 });
  }
}
```

除此以外组件中还可以通过直接指定 `constructor` 参数为 `InDiv` 导入 InDiv实例，或直接指定 `constructor` 参数为 内置类型 `ElementRef` 来获得当前组件的 DOM 实体。


## 组件通信: props 与 actions

又是类似 `React` ，InDiv 的组件之间可以 props 与 actions 来通信。此外还可以通过 `service` 与 `rxjs` 来进行响应式通信。
组件间通信应该是单向的，通过传递值到子组件，并通过传递一个回调方法在子组件调用来更改对应父组件的值来完成通信，被传递的值称为 `props`，回调方法称为 `actions`。
直接改变 state 上的值，或通过 setState 更改 state 的值时，state会被立刻改变，因此更改state的行为为 同步的。
但是更改 state 值时，会触发异步的重新渲染，并在渲染后更新子组件的 props，因此，通过在子组件中调用 props 上的方法来更新父组件的 state 时，子组件的 props 并不会立即更新。
如果想知道子组件的 props 何时被更新，应该通过生命周期 nvReceiveProps(nextProps: Props) 或 Class的getter setter方法去监听props的变化。

我们在 components 文件夹下面写一个组件: `<show-age></show-age>`

> components/show-age/show-age.component.ts

```typescript
import { Component, setState, SetState, nvReceiveProps } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`<p>age: {{age}}</p>`),
})
export default class ShowAgeComponent implements nvReceiveProps {
  public state: { age?: number };
  public props: { age?: number };

  public setState: SetState;

  constructor() {
    this.state = {
      age: this.props.age,
    };
  }

  public nvReceiveProps(nextProps: { age: number }): void {
    this.state.age = nextProps.age;
  }
}
```

现在该组件只能被动接收来自父组件的传入，现在我们要使用 `action` 主动通知父组件更新 `props`。
假设父组件传来个回调函数`updateAge(age: number)`，我们同样可以再 `props` 对象上找到对应的方法。

> components/show-age/show-age.component.ts

```typescript
import { Component, setState, SetState, nvReceiveProps } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`<p nv-on:click="@updateAge()">age: {{age}}</p>`),
})
export default class ShowAgeComponent implements nvReceiveProps {
  public state: { age?: number };
  public props: { age?: number, upDateAge?: (age: number) => void };

  public setState: SetState;

  constructor() {
    this.state = {
      age: this.props.age,
    };
  }

  public nvReceiveProps(nextProps: { age: number }): void {
    this.state.age = nextProps.age;
  }

  public updateAge() {
    this.props.upDateAge(3);
  }
}
```

现在我们把新的`ShowAgeComponent`也在 根模块 中声明一下，并在 `AppComponent` 中使用一下。
与普通的指令不同，props的值在组件中应用 `{}` 包一下，例如 `age="{age}"`。
注意: 如果 `props` 为驼峰命名法的值，在`template` 中需要用 破折线命名法来使用。

> app.component.ts

```typescript
import { Component, setState, SetState } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="@addAge()">name: {{name}}</p>
          <show-age age="{age}" up-date-age="{@upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public state: {
    name: string,
    age?: number,
  } = {
    name: 'InDiv',
  };

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({ age: 24 });
  }

  public upDateAge(age: number) {
    this.state.age = age;
    // this.setState({ age: 24 });
  }
}
```


## 生命周期

每个组件都有一个被 InDiv 管理的生命周期。
生命周期钩子其实就是定义在实例中的一些方法，在 InDiv 中，通过不同的时刻调用不同的生命周期钩子，赋予你在它们发生时采取行动的能力。
在 TypeScript 中，引用 InDiv 提供的 interface，通过 implements 的方式让类去实现被预先定义好的生命周期，而在 JavaScript 中，你只能自己手动去定义应该实现的生命周期方法。

之前我们已经通过认识 `props` 认识了 `nvReceiveProps` 的生命周期，而下面将介绍其他生命周期钩子。

* `constructor` 在类被实例化的时候回触发，你可以在这里预先定义你的 state
* `nvOnInit(): void;` constructor 之后，在这个生命周期中，可以通过 this.props 获取 props，并定义 state，此生命周期会在开启监听前被触发，并且之后再也不会触发
* `nvBeforeMount(): void;` 在 nvOnInit 之后，template 挂载页面之前被触发，每次触发渲染页面都会被触发
* `nvAfterMount(): void;` 在 nvBeforeMount 之后，template 挂载页面之后被触发，每次触发渲染页面（render）都会被触发
* `nvHasRender(): void;` 在 nvAfterMount 之后，渲染完成后被触发，每次触发渲染页面（render）都会被触发
* `nvRouteChange(lastRoute?: string, newRoute?: string): void;` 监听路由变化，当更换路由后被触发
* `nvOnDestory(): void;` 仅仅在路由决定销毁此组件时,或是被`nv-if`销毁组件时被触发
* `nvWatchState(oldState?: any): void;` 监听 state 变化，当 state 被更改后触发
* `nvReceiveProps(nextProps: any): void;` 监听 props 变化，当 props 即将被更改时触发
* (原生)`getter`: 当监听 props 时，getter 会先于 nvReceiveProps 被触发
* (原生)`setter`: 当监听 state 时，setter 会晚于 nvWatchState 被触发
