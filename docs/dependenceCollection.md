## 状态监听

状态的变更与追踪，在mvvm框架中都决定了视图的呈现。

不管是angular的脏检查zonejs暴力代理，还是vue的响应式和react的State与Props，其实全部是为了解决view与model的状态匹配问题。

借鉴vue的响应式原理，InDiv 也决定使用 `Object.defineProperty` 这个原生api追踪监听状态。

由此也产生了另一个问题，如果被监听的状态变更是数组或是其他无法被 `Object.defineProperty` 监听到的数据类型，就需要引入一个类似 vue 中的 `this.$set Vue.set` 这种 api或是重写原型上的一些方法来解决状态的临时监听。为了减少开发者的工作量，所以在 InDiv 中增加了 `SetState` 这个看起来很像 react 的api来直接产生变更。

下面这个例子就是在 AppComponent 中添加一个数组，当我点击时，来为数组新增一项。

通过直接引入 `setState` 方法及类型 `SetState` 来赋值为类中某个方法调用该方法。

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p nv-on:click="addAge()" nv-repeat="li in list">id{{li}}name: {{name}}</p>
          <show-age age="{age}" upDateAge="{upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public list: number[] = [1, 2, 3, 4];

  public setState: SetState;

  constructor() {
    this.setState = setState;
  }

  public addAge(): void {
    this.setState({
      age: 24,
      list: this.list.push(5),
    });
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```

或是通过 `@StateSetter` 属性装饰器及类型 `SetState` 来装饰该方法。（**更推荐该方法，更优雅**）

> app.component.ts

```typescript
import { Component, StateSetter, SetState, Watch } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p nv-on:click="addAge()" nv-repeat="li in list">id{{li}}name: {{name}}</p>
          <show-age age="{age}" upDateAge="{upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public list: number[] = [1, 2, 3, 4];

  @StateSetter() public setState: SetState;

  constructor() {}

  public addAge(): void {
    this.setState({
      age: 24,
      list: this.list.push(5),
    });
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```


## 依赖收集

但是在实际开发中，其实不需要对组件实例中所有的属性都进行追踪监听或是diff，而且因为静态化的原因，所有需要检测变更（被该组件所依赖的）的属性都可以在实例化之前获得。

因此 InDiv 在组件开始状态监听之前对模板中用到 **所有来自实例中的成员属性的 `name`** 都添加到了一个数组中。

组件将仅仅监听这个数组中出现的 `name` 来避免一些不必要的监听及触发的无用渲染造成的性能浪费。

> @indiv/core/component/utils.ts

```typescript
/**
 * collect dependences from @Component template
 *
 * @export
 * @param {IComponent} componentInstance
 */
export function collectDependencesFromViewModel(componentInstance: IComponent): void {
  resolveInputs(componentInstance);
  resolveDirective(componentInstance);
  resolveTemplateText(componentInstance);
}
```

通过将组件实例上的 `input` 指令 及 {{}}的字符变量提取，获得了最少且必要的监听。

但是如果想让一些别的属性也在变更是能够触发 `DoCheck` 并触发渲染呢？

这里就是 `Watch` 这个属性解释器存在的意义了。

之前我们已经对 `AppComponent` 中 `age：number` 添加过 `@Watch()` 了，因此所有导致 `age` 变化的行为都会触发 `DoCheck` 和视图渲染。（当然这里不需要，因为age已经作为input被加入到监听队列中了）

> app.component.ts

```typescript
import { Component, StateSetter, SetState, Watch } from '@indiv/core';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p nv-on:click="addAge()" nv-repeat="li in list">id{{li}}name: {{name}}</p>
          <show-age age="{age}" upDateAge="{upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public list: number[] = [1, 2, 3, 4];

  @StateSetter() public setState: SetState;

  constructor() {}

  public addAge(): void {
    this.setState({
      age: 24,
      list: this.list.push(5),
    });
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```
