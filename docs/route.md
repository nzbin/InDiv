## 路由

类似于其他前端框架，InDiv 也提供了一套路由系统来帮助页面渲染。让用户从一个视图导航到另一个视图。它们应该聚焦于展示数据，而把数据访问的职责委托给某个服务。

InDiv 的 Router（即“路由器”）借鉴了这个浏览器的导航模型。

它把浏览器中的 URL 看做一个操作指南， 据此导航到一个由客户端生成的视图，并可以把参数传给支撑视图的相应组件，帮它决定具体该展现哪些内容。

你可以为页面中的链接绑定一个路由，这样，当用户点击链接时，就会导航到应用中相应的视图。

当用户点击按钮、从下拉框中选取，或响应来自任何地方的事件时，你也可以在代码控制下进行导航。

路由器还在浏览器的历史日志中记录下这些活动，这样浏览器的前进和后退按钮也能照常工作。


## 配置路由

InDiv 2.0.0+ 放气以前使用插件构建路由，开始使用 NvModule 重构路由系统。

通过引入默认的路由模块，就可以快速搭建一个拥有路由导航的应用程序。

当引入`RouteModule` 时，仅仅导出`RouterTo, RouterFrom,`这两个指令和对全局Injector注入`NvLocation`提供商。但是当调用`RouteModule`的静态方法时，将返回一个开启路由监听的`RouteModule`。

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import { RouteModule, TRouter } from '@indiv/router';
import AppComponent from './app.component';
import ShowAgeComponent from './components/show-age/show-age.component';
import ChangeColorDirective from './directives/change-color.directive';
import TestService from './provides/test.service';

const routes: TRouter[] = [
  {
    path: '/',
  },
];

@NvModule({
  imports: [
    RouteModule.forRoot({
      routes,
      rootPath: '/demo', // 根路径 如果该页面不是基于'/'的话需要手动填写
      routeChange: (lastRoute?: string, nextRoute?: string) => {},
    }),
  ],
  declarations: [ AppComponent, ShowAgeComponent, ChangeColorDirective ],
  providers: [
    {
      provide: TestService,
      useClass: TestService,
    }
  ],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```

`routes` 是一个多维数组，数组的每一项都拥有下面五个key值：

  1. `path: string;` 定义路由的路径，在`routes`数组的第一层只允许拥有一个对象，相应地 `path` 应该为 `/`，该项只需要写在该层级的路径即可
  2. `redirectTo?: string;` 当完整的路由到这一层级时，将被重定向到另外一个路径中，需要写除根路径之外的完整路径。该路由可以拥有 `children`
  3. `component?: string;` 路由到达该层级需要加载的组件`selector`，该`selector`需要是 在根模块中声明的组件`selector` 或是 被导入的组件`selector`
  4. `children?: TRouter[];` 该层级路由的子路由
  5. `loadChild?: { name: string; child: () => Promise<any>; } | () => Promise<any>;` 懒加载路由配置，如果文件`export`出一个模块，则使用`{ name: string; child: () => Promise<any>; `,如果文件使用`export defalut`则使用`() => Promise<any>;` loadChild 与 component 二者尽可保留一个

  ```typescript
  {
    path: '/C1',
    loadChild: {
      name: 'TestLoadchildModule',
      child: () => import('./loadChild'),
    },
  }
  ```

**需要注意的是位于数组最顶层的 `path: '/'` 必须指定，但是不能指定`component` 和 `loadChild`，因为根模块的`bootstrap`将取代这一项**

现在让我们为路由多加一层 `/a` 并让根路径直接重定向到 `/a`，首先再写一个组件作为路由渲染的视图组件导入根模块并配置路由的`child`

> components/page-a/page-a.component.ts

```typescript
import { Component, setState, SetState, nvReceiveInputs } from '@indiv/core';

@Component({
    selector: 'page-a',
    template: (`<p>page A</p>`),
})
export default class PageAComponent {}
```

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import { RouteModule, TRouter } from '@indiv/router';
import AppComponent from './app.component';
import ShowAgeComponent from './components/show-age/show-age.component';
import ChangeColorDirective from './directives/change-color.directive';
import TestService from './provides/test.service';
import PageAComponent from './components/page-a/page-a.component';

const routes: TRouter[] = [
  {
    path: '/',
    redirectTo: '/a',
    children: [
      path: '/a',
      component: 'page-a',
    ]
  },
];

@NvModule({
  imports: [
    RouteModule.forRoot({
      routes,
      rootPath: '/demo',
      routeChange: (lastRoute?: string, nextRoute?: string) => {},
    }),
  ],
  declarations: [ AppComponent, ShowAgeComponent, ChangeColorDirective, PageAComponent ],
  providers: [
    {
      provide: TestService,
      useClass: TestService,
    }
  ],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```

回到根组件`app-component`，作为父级路由的组件，必须包括一个标签`<router-render></router-render>`，子路由组件渲染将渲染到父级路由组件的该元素内。

关于重定向 `redirectTo` ，它与 `component` `children` 或下文的 `loadChild` 都不冲突，因为只有当你访问完整的路径到达该路径才会触发重定向，因而拥有重定向 `redirectTo` 的路径依然可以拥有子路由`children``loadChild`。并且当路由渲染到子路由时，依然可以正确渲染而不会在中途就重定向出去。

> app.component.ts

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';
import TestService from './provides/test.service';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="addAge()" change-color="{color}">name: {{name}}</p>
          <show-age age="{age}" uupDateAge="{@upDateAge}"></show-age>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public color: string = 'red';

  public setState: SetState;

  constructor(
    private testService: TestService
  ) {
    this.setState = setState;
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

此时可以浏览`/demo` 和 `/demo/a`


## 手动更改导航

如果引入`RouteModule`之后，根Injector中将拥有`NvLocation`这个提供商，通过依赖注入系统注入该服务商可以直接获得修改路由的权力。

```typescript
interface NvLocation {
  get(): { path?: string; query?: any; params?: any; data?: any; rootPath?: string; };
  set(path: string, query?: any, data?: any, title?: string): void;
  redirectTo(path: string, query?: any, data?: any, title?: string): void;
}
```

下面将添加点击事件，发生路由跳转。

> app.component.ts

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';
import { NvLocation } from '@indiv/router';
import TestService from './provides/test.service';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <p on-on:click="addAge()" change-color="{color}">name: {{name}}</p>
          <show-age age="{age}" uupDateAge="{@upDateAge}"></show-age>
          <router-render></router-render>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public color: string = 'red';

  public setState: SetState;

  constructor(
    private testService: TestService,
    private nvLocation: NvLocation
  ) {
    this.setState = setState;
    console.log(this.testService.count); // 1
    this.testService.count = 2; // 2
  }

  public addAge(): void {
    this.setState({ age: 24 });
    this.nvLocation.set('/a');
    console.log('此时路由：', this.nvLocation.get());
  }

  public upDateAge(age: number) {
    this.age = age;
    // this.setState({ age: 24 });
  }
}
```

或者我们可以使用指令来做到这件事

> app.component.ts

```typescript
import { Component, setState, SetState, Watch } from '@indiv/core';
import TestService from './provides/test.service';

@Component({
    selector: 'app-component',
    template: (`
        <div class="app-component-container">
          <input nv-model="name"/>
          <a router-to="routeTo">点击跳转到/a</a>
          <p on-on:click="addAge()" change-color="{color}">name: {{name}}</p>
          <show-age age="{age}" uupDateAge="{@upDateAge}"></show-age>
          <router-render></router-render>
        </div>
    `),
})
export default class AppComponent {
  public name: string = 'InDiv';
  @Watch() public age: number;
  public color: string = 'red';

  public setState: SetState;

  constructor(
    private testService: TestService
  ) {
    this.setState = setState;
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


## 路由懒加载

在继续构应用程序的过程中，应用的尺寸将会变得更大。在某一个时间点，你将达到一个顶点，应用将会需要过多的时间来加载。所以你不可能一下子把所有模块都 import 进根模块。

通过引进异步路由，可以获得在请求时才惰性加载特性模块的能力。

当然你需要优先修改你的打包程序，让其识别`import()`并可以根据动态引入进行代码切片，

像webpack parcel之类的都提供动态引入，因为我们仅仅使用 `import()`，因此并不需要像 angular 需要写loader去让编译器识别 `loadChildren`。

首先我们要把`PageAComponent` 从 根模块中删除。

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import { RouteModule, TRouter } from '@indiv/router';
import AppComponent from './app.component';
import ShowAgeComponent from './components/show-age/show-age.component';
import ChangeColorDirective from './directives/change-color.directive';
import TestService from './provides/test.service';
// import PageAComponent from './components/page-a/page-a.component';

const routes: TRouter[] = [
  {
    path: '/',
    redirectTo: '/a',
    children: [
      path: '/a',
      component: 'page-a',
    ]
  },
];

@NvModule({
  imports: [
    RouteModule.forRoot({
      routes,
      rootPath: '/demo',
      routeChange: (lastRoute?: string, nextRoute?: string) => {},
    }),
  ],
  declarations: [
    AppComponent, 
    ShowAgeComponent,
    ChangeColorDirective,
    // PageAComponent
  ],
  providers: [
    {
      provide: TestService,
      useClass: TestService,
    }
  ],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```

然后为了这个路由重新构建一个新的模块，在 `modules`中新建一个模块`page-a/page-a.lazy.module.ts`，并引入模块`PageAComponent`并设为`bootstrap`

> modules/page-a/page-a.lazy.module.ts

```typescript
import { NvModule } from '@indiv/core';
import PageAComponent from '../../components/page-a/page-a.component';

@NvModule({
  declarations: [
    PageAComponent,
  ],
  bootstrap: PageAComponent,
})
export default class PageALazyModule {}
```

最后我们回到根模块来修改下路由的配置

> app.module.ts

```typescript
import { NvModule } from '@indiv/core';
import { TRouter, RouteModule } from '@indiv/router';
import AppComponent from './app.component';
import ShowAgeComponent from './components/show-age/show-age.component';
import ChangeColorDirective from './directives/change-color.directive';
import TestService from './provides/test.service';

const routes: TRouter[] = [
  {
    path: '/',
    redirectTo: '/a',
    children: [
      path: '/a',
      // 使用 export default 打包
      loadChild: () => import('./components/page-a/page-a.component'),
      // 使用 export 打包 需要指定导出的模块名
      // loadChild: {
      //   name: 'PageALazyModule',
      //   child: () => import('./components/page-a/page-a.component'),
      // },
    ]
  },
];

@NvModule({
  imports: [
    RouteModule.forRoot({
      routes,
      rootPath: '/demo',
      routeChange: (lastRoute?: string, nextRoute?: string) => {},
    }),
  ],
  declarations: [
    AppComponent, 
    ShowAgeComponent,
    ChangeColorDirective,
  ],
  providers: [
    {
      provide: TestService,
      useClass: TestService,
    }
  ],
  bootstrap: AppComponent,
  exports: [],
})
export default class AppModule {}
```

注意模块导出的方法

如果使用 `export default` 的方式：

```typescript
loadChild: () => import('./components/page-a/page-a.component'),
```

如果使用 `export` 的方式：loadChild则是个对象，name 为模块名

```typescript
loadChild: {
  name: 'PageALazyModule',
  child: () => import('./components/page-a/page-a.component'),
},
```

最后懒加载模块之后的 `children`子路 由可以继续像普通的方法（定义`component`等方式）定义，但如果懒加载模块之后的子路由中并不存在对应的组件，则 `RouteModule` 会去 **根模块中寻找对应的组件** 渲染路由，并从 **根模块和根注入器** 寻找组件，指令及依赖提供商。

`RouteModule.forRoot` 仅仅是一个静态方法，参数类型`{ routes: TRouter[], rootPath?: string, routeChange?: (lastRoute?: string, nextRoute?: string) => void }`，返回一个开启监听路由的`RouteModule`，当工厂函数开始实例化的时候，


## 懒加载模块的依赖提供商

NvModule 级的依赖提供商可以在 `@NgModule()` `providers` 元数据中指定，但是其实全局只有一个根注入器 `rootInjector` ，他负责全局的依赖收集。

在整个服务启动之后，根注入器便停止收集新的 `providers`，因此懒加载的模块中的 `providers` 依赖提供商并不会被收集到根注入器中。

`RouteModule` 为懒加载请求到的模块重新配置了新的`injector`，并且与懒加载模块同级存在。

但一旦 懒加载的模块中的 `providers` 依赖提供商 并不存在对应的 DI令牌 ，则 `RouteModule` 会去 根注入器 继续寻找依赖及实例。

所以，想要在 **懒加载模块与根模块之间的组件** 实现通信，请不要在懒加载模块中声明 **公用的依赖提供商**。
