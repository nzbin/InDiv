## 构建一个指令

在这一组文章中, 您将了解 InDiv 的组件`Directive`。主要是了解基本的 InDiv 应用程序的指令是如何建立的。您将构建一个基本的指令。


## 指令

指令用于改变一个 DOM 元素的外观或行为。

其实上文提到的组件也是个特殊的指令。

首项我们先创建个文件夹 directives 用来保存所有的组件 

此时的项目目录应该为

```
src
|
├── directives
├── components
├── modules
├── app.component.ts
├── app.style.less
├── app.module.ts
├── index.html
└── main.ts
```


## 装饰器`@Directive`

让我们先用 装饰器 `@Directive` 写个简单的指令，当鼠标悬浮时，文字颜色将变为红色，当鼠标移除时显示绿色。

为此我们需要引入内置依赖 `ElementRef` 来让 InDiv 知道我们需要注入该指令所绑定的元素。

除此以外像组件一样，还可以通过直接指定 `constructor` 参数为 `InDiv` 导入 InDiv实例。

> directives/change-color.directive.ts

```typescript
import { Directive, ElementRef } from '@indiv/core';

@Directive({
    selector: 'change-color',
})
export default class ChangeColorDirective {
  constructor(private element: ElementRef) {
    this.element.nativeElement.addEventListener('mouseover', this.changeColor);
    this.element.nativeElement.addEventListener('mouseout', this.removeColor);
  }

  public changeColor = () => {
    this.element.nativeElement.style = 'red';
  }

  public removeColor = () => {
    this.element.nativeElement.style.color = 'black';
  }
}
```

`@Directive` 接收两个参数，`selector: string;` `providers?: (Function | TUseClassProvider | TUseValueProvider)[];`

* `selector: string;`  作为指令被渲染成 DOM 的属性，类似于 `<div change-color="{color}"></div>`
* `providers?: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; })[];` 声明可以被指令注入的服务，这个我们放到服务再讲

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import AppComponent from './app.component';
import ShowAgeComponent from './components/show-age/show-age.component';
import ChangeColorDirective from './directives/change-color.directive';

@NvModule({
  imports: [],
  declarations: [ AppComponent, ShowAgeComponent, ChangeColorDirective ],
  providers: [],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```

现在我们将 `ChangeColorDirective` 在 `app.module.ts` 中声明一下并在`AppComponent`的模板中使用。

> app.component.ts

```typescript
import { Component, setState, SetState } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="@addAge()" change-color>name: {{name}}</p>
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


## 接收`props`

指令没有 `state` ，因此无法在指令实例内部主动更新指令。
但是如同组件一样，指令也可以接收实例上的 `props` 属性。`props` 属性来自于指令使用时在模板上所被渲染的字符串变量。
同理，当 `props` 被更新时，指令也会调用生命周期钩子 `nvReceiveProps(nextProps: any): void;`

> directives/change-color.directive.ts

```typescript
import { Directive, ElementRef, ReceiveProps } from '@indiv/core';

@Directive({
    selector: 'change-color',
})
export default class ChangeColorDirective implements ReceiveProps {
  public props: string;

  constructor(private element: ElementRef) {
    this.element.nativeElement.addEventListener('mouseover', this.changeColor);
    this.element.nativeElement.addEventListener('mouseout', this.removeColor);
  }

  public ReceiveProps(nextProps: string) {
    console.log('Directive ReceiveProps', nextProps);
  }

  public changeColor = () => {
    this.element.nativeElement.style = this.props;
  }

  public removeColor = () => {
    this.element.nativeElement.style.color = 'black';
  }
}
```

现在我们更改下 `app.component.ts`，给指令一个`props`

> app.component.ts

```typescript
import { Component, setState, SetState } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="@addAge()" change-color="{color}">name: {{name}}</p>
          <show-age age="{age}" up-date-age="{@upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public state: {
    name: string,
    age?: number,
    color: string,
  } = {
    name: 'InDiv',
    color: 'red',
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

每个指令都有一个被 InDiv 管理的生命周期。
大部分指令的生命周期跟组件相同，但有部分因为指令没有`state`的概念所以缺失`nvWatchState`。
生命周期钩子其实就是定义在实例中的一些方法，在 InDiv 中，通过不同的时刻调用不同的生命周期钩子，赋予你在它们发生时采取行动的能力。
在 TypeScript 中，引用 InDiv 提供的 interface，通过 implements 的方式让类去实现被预先定义好的生命周期，而在 JavaScript 中，你只能自己手动去定义应该实现的生命周期方法。

之前我们已经通过认识 <a href="#/components?id=组件通信-props-与-actions" target="_blank">`props`</a> 认识了 `nvReceiveProps` 的生命周期，而下面将介绍其他生命周期钩子。

* `constructor` 在类被实例化的时候回触发，你可以在这里预先定义你的 state
* `nvOnInit(): void;` constructor 之后，在这个生命周期中，可以通过 this.props 获取 props，并定义 state，此生命周期会在开启监听前被触发，并且之后再也不会触发
* `nvBeforeMount(): void;` 在 nvOnInit 之后，template 挂载页面之前被触发，每次触发渲染页面都会被触发
* `nvAfterMount(): void;` 在 nvBeforeMount 之后，template 挂载页面之后被触发，每次触发渲染页面（render）都会被触发
* `nvHasRender(): void;` 在 nvAfterMount 之后，渲染完成后被触发，每次触发渲染页面（render）都会被触发
* `nvRouteChange(lastRoute?: string, newRoute?: string): void;` 监听路由变化，当更换路由后被触发
* `nvOnDestory(): void;` 仅仅在路由决定销毁此组件时,或是被`nv-if`销毁组件时被触发
* `nvReceiveProps(nextProps: any): void;` 监听 props 变化，当 props 即将被更改时触发
* (原生)`getter`: 当监听 props 时，getter 会先于 nvReceiveProps 被触发
* (原生)`setter`: 当监听 state 时，setter 会晚于 nvWatchState 被触发
