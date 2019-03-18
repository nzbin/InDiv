## 变更检测

变更检测的基本任务是获得程序的内部状态并使之在用户界面可见。

这个状态可以是任何的对象、数组、基本数据类型，也就是任意的 `JavaScript` 数据结构。

这个状态在用户界面上最终可能成为段落、表格、链接或者按钮，并且特别对于 web 而言，会成为 `DOM` 。

所以基本上将数据结构作为输入，并生成 `DOM` 作为输出并展现给用户。这一过程就是 rendering(渲染)。

然而，当变更发生在运行时的时候，它会变得很奇怪。

所以如何获得运行时状态的变更便成为一个问题。

之前我们通过初始化之前的依赖收集，获得了所有需要检测变更（被该组件所依赖的）的属性，并为其添加了 `getter setter`，因此运行时的变更将很容易获得。


## 变更的起因

什么引起了变更？ InDiv 什么时候知道必须更新视图呢？

一般而言，引起视图变更的所以因素可以概括于以下几点：

1. 交互事件 - `click`， `mouseover`
2. 网络请求 - 从服务器获取数据
3. Timers - `setTimeout()`， `setInterval()`
4. 生命周期 - `nvAfterMount` 中的同步属性变更

跟 [angular](https://www.angular.cn/) 一样，这几种变更也会引起视图更新，但是基于响应式数据的 InDiv 则可以无视这些变更，只需要更改属性， InDiv 就会获得通知。


## 默认变更策略

在 InDiv 中，每个组件都有它自己的 `change detector` (angular 叫变更检测器或者 InDiv 叫做状态监听器)

偷一张 angular 的图：

![change detector](https://raw.githubusercontent.com/DimaLiLongJi/InDiv/develop/docs/img/cb.png)

这是很明显的，因为这可以单独地控制每个组件的变更检测何时发生以及如何执行。

当执行完依赖收集之后，组件状态监听器被递归添加到所有依赖属性及子属性上。

假设组件树的某处发生了一个事件，可能是一个按钮被点击。

接下来会发生什么？

当按钮被点击，为了防止一次时间或一个生命周期执行触发多次渲染，InDiv 的事件处理器会根据组件实例的 `watchStatus` 与 `isWaitingRender` 来处理是否触发一次 `DoCheck` 和渲染。

> @indiv/core/compile/compile-utils.ts

```typescript
const saveWatchStatus = (vm as IComponent).watchStatus;
if (saveWatchStatus === 'available') (vm as IComponent).watchStatus = 'pending';

fn.apply(vm, argsList);

if (saveWatchStatus === 'available') {
  (vm as IComponent).watchStatus = 'available';
  if ((vm as IComponent).isWaitingRender && (vm as IComponent).nvDoCheck) (vm as IComponent).nvDoCheck();
  if ((vm as IComponent).isWaitingRender) {
    (vm as IComponent).render();
    (vm as IComponent).isWaitingRender = false;
  }
}
```


## OnPush 变更策略（v2.0.6新增）

**与 angular 的 `OnPush` 策略略微不同**

使用 `OnPush` 之后，InDiv 将不会在初始化的时和使用 `StateSetter` 时进行依赖收集和添加状态监听器，并且只有在 `Input` 属性发生变更时和 `nv-model` 触发时才会触发一次 `DoCheck` 组件渲染。

**与 angular 不同，模板绑定的事件不会触发渲染**

更改下之前写的 `<show-age>` 组件：

在类注解 `@Component` 中增加一个新属性 `changeDetection`

> components/show-age/show-age.component.ts

```typescript
import { Component, StateSetter, SetState, nvReceiveInputs, Input, AfterMount, ContentChild, ContentChildren, ChangeDetectionStrategy } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`
      <p nv-on:click="updateAge()">age: {{age}}</p>
      <nv-content></nv-content>
    `),
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShowAgeComponent implements nvReceiveInputs, AfterMount {
  @Input('age') public age: number;
  @Input('upDateAge') public changeAge: (age: number) => void;
  @ContentChild('a') public htmlElementA: HTMLElement;
  @ContentChildren('a') public htmlElementAs: HTMLElement[];

  @StateSetter() public setState: SetState;

  constructor() {}

  public nvAfterMount(): void {
    console.log('ContentChild', this.htmlElementA, this.htmlElementAs);
  }

  public nvReceiveInputs(nextInputs: { age: number }): void {
    this.age = nextInputs.age;
  }

  public updateAge() {
    this.changeAge(3);
  }
}
```

`ChangeDetectionStrategy` 有两个属性：

```typescript
export enum ChangeDetectionStrategy {
  OnPush,
  Default,
}
```

1. `OnPush: 0` 使用 `OnPush` 模式，在 `Input` 属性发生变更时和 `nv-model` 触发时才会触发一次 `DoCheck` 和渲染
2. `Default: 1` 默认变更模式


## @MarkForCheck()

使用 `@MarkForCheck()` ，为 InDiv 组件实例标记需要进行一次检测变更，强行触发组件 `DoCheck` 和渲染。

配合 `OnPush` 模式，手动触发更新，避免不必要的变更造成的性能浪费。

> components/show-age/show-age.component.ts

```typescript
import { Component, StateSetter, SetState, nvReceiveInputs, Input, AfterMount, ContentChild, ContentChildren, ChangeDetectionStrategy, MarkForCheck, TMarkForCheck } from '@indiv/core';

@Component({
    selector: 'show-age',
    template: (`
      <p nv-on:click="updateAge()">age: {{age}} {{testData}}</p>
      <nv-content></nv-content>
    `),
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ShowAgeComponent implements nvReceiveInputs, AfterMount {
  // 新增一个测试属性
  public testData: number = 3;
  @Input('age') public age: number;
  @Input('upDateAge') public changeAge: (age: number) => void;
  @ContentChild('a') public htmlElementA: HTMLElement;
  @ContentChildren('a') public htmlElementAs: HTMLElement[];
  // 注释掉 StateSetter 已经没有用了
  // @StateSetter() public setState: SetState;
  @MarkForCheck() public marker: TMarkForCheck;

  constructor() {}

  public nvAfterMount(): void {
    console.log('ContentChild', this.htmlElementA, this.htmlElementAs);
  }

  public nvReceiveInputs(nextInputs: { age: number }): void {
    this.age = nextInputs.age;
  }

  public updateAge() {
    this.changeAge(3);
    // 在事件处理函数更改属性，并调用 MarkForCheck 来标记需要检测变更
    this.testData = 100;
    this.marker();
  }
}
```
