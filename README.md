# easiest

A minimal, blazing fast web mvvm framework.一个小而快的Web mvvm库。
Now we support for typescript!

## demo
  - `npm run start-ts`
  - `npm run start`
  - open `http://localhost:1234`

## Basic Usage

1. Create a root DOM for route which id is root:

  ```html
  <div id="root"></div>
  ```
2. Create a Easiest:

  1. use `$bootstrapModule` to bootstrap a root module `EsModule`

  ```javascript
  const easiest = new Easiest();
  easiest.$bootstrapModule(M1);
  easiest.$use(router); // if u are using a router
  easiest.$init();
  ```

3. Create a router:

  - routes must an `Array` includes `Object`

      1. routes must incloude rootPath `'/'`
      2. routes must set an component name like `component: 'R1'`， `R1` is declared in `EsModule` in `$declarations => this.$components`
      3. routes can assign redirectTo and use `redirectTo: Path`
      4. routes can assign children and use `children: Array`
      5. routes can set a path like `path: '/:id'`

  - if u are using `Router`, u must need to `router.$setRootPath('/RootPath')` to set an root path.
  - `router.$routeChange = (old, next)` can listen route change
  - `router.$init(routes);` can init Array routes
  - if u want to watch routes changes, plz use `router.$routeChange=(old.new) => {}`

      1. use `this.$location.go((path: String, query: Object, params: Object)` to go to Path or `location.href`
      2. use `this.$location.state()` to get location states
      3. `Router` : `http://localhost:1234/R1`

  ``` typescript
  type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
  };
  const router = new Router();
  const routes: TRouter = [
  {
    path: '/',
    // redirectTo: '/R1',
    component: 'container-wrap',
    children: [
      {
        path: '/R1',
        component: 'R1',
        // redirectTo: '/R2',
        children: [
          {
            path: '/C1',
            component: 'R2',
            children: [
              {
                path: '/D1',
                redirectTo: '/R2',
              },
            ],
          },
          {
            path: '/C2',
            redirectTo: '/R2',
          },
        ],
      },
      {
        path: '/R2',
        component: 'R2',
        children: [
          {
            path: '/:id',
            component: 'R1',
            children: [
              {
                path: '/D1',
                redirectTo: '/R1/C1',
              },
            ],
          },
        ],
      },
    ],
    },
  ];
  router.$setRootPath('/demo'); // so routes:Array => `/` is `/demo`
  router.$init(routes);
  router.$routeChange = function (old, next) {
    console.log('$routeChange', old, next);
  };
  const easiest = new Easiest();
  easiest.$bootstrapModule(M1);
  const routerIndex = easiest.$use(router);
  easiest.$init();
  ```

4. Create a Component:

  - must extends`class Component`
  - must `super(name, props);`
  - **plz $setState or $setProps after lifecycle `constructor()`**
  - u need to declare template or component in lifecycle of `EsModule`  in `$declarations => this.$components`
  - **`$template` must be parceled by a father Dom in lifecycle `$bootstrap()`**

    1. this.$template is used to set component html

    ```javascript
    $bootstrap() {
      this.$template = (`
        <div>
          <pComponent1 ax="{this.state.a}" b="{this.getProps}"></pComponent1>
          <input es-repeat="let a in this.state.d" es-model="a.z" />
        </div>
      `);
    }
    ```
  - `props: Object` is data which `class Controller` sends to `class Component`
  - ** `props: Object` can only be changed or used after lifecycle `constructor()` **
  - `props: Object` can only be changed by action `this.$setProps()` and `this.$setProps()` is equal to `$setState`

  ```javascript
  class pComponent extends Component {
    constructor() {
      super();
      this.state = {
        a: 'a子组件',
      };
    }

    $bootstrap() {
      this.$template = (`
        <div>
          <pComponent1 ax="{this.state.a}" b="{this.getProps}"></pComponent1>
        </div>
      `);
    }

    $onInit() {
      console.log('props', this.props);
    }
    componentClick(e) {
      alert('点击了组件');
      this.$setState({b: 2});
      this.$setProps({ax: 5});
      this.$location.go('/R1/R4', { a: '1' });
      this.$location.state();
      // this.props.b(3);
    }
    $watchState(oldData, newData) {
      console.log('oldData Component:', oldData);
      console.log('newData Component:', newData);
    }

    $routeChange(lastRoute, newRoute) {}
  }
  ```

5. EsModule

  - Easiest apps are modular and Easiest has its own modularity system called `EsModule`. An `EsModule` is a container for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities. It can contain components, service providers, and other code files whose scope is defined by the containing `EsModule`. It can import functionality that is exported from other `EsModule`, and export selected functionality for use by other `EsModule`.

  - u need to declare `$imports: Array` `$components: Object` `$providers: Array` `$exports: Array` `$bootstrap: Component` in `$declarations(){}`
  - `$imports: Array` imports other `EsModule` and respect it's `$exports`
  - `$components: Array` declare `Components`. Key: name, Value: Components
  - `$providers: Array` declare `Service`
  - `$exports: Array` exports `Components` for other `EsModules`
  - `$bootstrap: Component` declare `Component` for Module bootstrap only if u don't `Router`

  ```javascript
  class M1 extends EsModule {
    constructor() {
    super();
   }

    $declarations() {
      this.$imports = [
        M2,
      ];
      this.$components = {
        'pc-component': PComponent,
        'route-child': RouteChild,
        'R1': R1,
        'R2': R2,
      };
      this.$providers = [
        HeroSearchService,
        HeroSearchService1,
      ];
      this.$exports = [
        'R1',
        'R2',
      ];
      // this.$bootstrap = R1; only don't use Route
    }
  }
  ```

6. Template Syntax

  - 规定：指令以 es-xxx 命名
  - now: es-text es-html es-model es-class es-repeat es-if es-on:Event
  - 事件指令, 如 es-on:click
    - Text1: `this.$template = '<p es-text="this.state.b"></p>';`
    - Text2: `this.$template = '<p>this.state.b是：{{this.state.b}}</p>';`
    - HTML: `this.$template = '<p es-html="this.state.c"></p>';`
    - Model for input: `this.$template = '<input es-model="this.state.c"/>';`
    - Class: `this.$template = '<p  class="b" es-class="this.state.a"></p>';`
    - Directives: ues `es-on:event`
      - `this.$template = '<p es-on:click="this.componentClick()"></p>';`
    - Repeat: `this.$template = '<p  class="b" es-class="this.state.a" es-repeat="let a in this.state.b" es-if="a.f">{{a.z}}</p>';`
  - about function in Template Syntax
    - now you can send arguments in Function
    - arguments include:
      1. Event: `$event`
      2. String: `'xxx'`
      3. Number: `123`
      4. Variable: **`this.state.xxx` `this.props.xxx`**
      5. Boolean: `true` `false`
      6. For es-repeat: items like: `es-repeat="let a in this.state.b" es-if="a.f"`

7. Data monitor: this.state && this.$setState

  - use `this.state: Object` and `this.$setState(parmars: Function || Object)`
  - if u have some variable, u can set `this.state` in `constructor(){}`
  - if u want to change State, plz use `this.$setState`, parmars can be `Object` or `Function` which must return an `Object`
  - and u can recive this change in life cycle `$watchState(oldData, newData)`

8. `Watcher` and `KeyWatcher`

  - import {Watcher, KeyWatcher}

    1. `Watcher`
      - Watcher expects two arguments: `data, watcher`
      - data is an Object
      - watcher is a function which has two arguments: `oldData, newData`
        ```javascript
        new Watcher(this.object, (oldData, newData) => {})
        ```

    2. `KeyWatcher`
      - Watcher expects there arguments: `data, key, watcher`
      - data: `Object`
      - key is a key in Object and type is `String`
      - watcher is a function which has two arguments: `oldData, newData`
        ```javascript
        new KeyWatcher(this.object, key,(oldData, newData) => {})
        ```
9. Service

  - Components shouldn't fetch or save data directly and they certainly shouldn't knowingly present fake data. They should focus on presenting data and delegate data access to a service.
  - And u can use `Service` to send communication between `Components` , because we have realized **singleton**. 
  - Use `static isSingletonMode = true;` or `Service.isSingletonMode = true`,
  - U can use `this.$https` or import `class Http` to use AJAX.

  ```javascript
  class HeroSearchService extends Service {
    static isSingletonMode = true; // singleton service

    constructor() {
      super();
      console.log(this.$http); // same as Http
      this.$http.$get(url, params);
      this.$http.$delete(url, params);
      this.$http.$post(url, params);
      this.$http.$put(url, params);
      this.$http.$patch(url, params);
    }

    test() {
      console.log('i am a services !!!');
    }
  }
  // or this method to use singleton service
  HeroSearchService.isSingletonMode = true;

  class ComponentXX extends Component {
    constructor(HeroSearchService) {
      this.heroSearchService = HeroSearchService;
    }
  }
  ```

  ```javascript
  const http = new Http();
  http.$get(url, params);
  http.$delete(url, params);
  http.$post(url, params);
  http.$put(url, params);
  http.$patch(url, params);
  ```

10. Dependency Injection
    
    Dependency injection is an important application design pattern. It's used so widely that almost everyone just calls it DI
    
    - Use Typescript

    If u are using `Typescript` to build an app, u can easily use our Dependency Injection.Only use `@Injectable` before the `Class` which need to use other services, that which are declarated in `this.$providers` of `EsModule` or root module.

    ```typescript
    import { Injectable, Component, EsModule, Service } from 'easiest';

    class HeroSearchService1 extends Service {
      constructor() {
        super();
      }
      public test() {
        console.log('HeroSearchService !!!1111');
      }
    }

    @Injectable
    class HeroSearchService extends Service {
      public hsr: HeroSearchService1;
      constructor(
        private hsrS: HeroSearchService1,
      ) {
        super();
        this.hsr = hsrS;
        this.hsr.test();
      }

      public test() {
        console.log('HeroSearchService !!!000000000');
      }
    }

    @Injectable
    class Container extends Component {
      public ss: HeroSearchService;
      constructor(private hss: HeroSearchService) {
        super();
        this.ss = hss;
        this.ss.test();
      }

      public $bootstrap() {
        this.$template = (`
          <div>1111</div>
        `);
      }
    }

    class M1 extends EsModule {
      constructor() {
        super();
      }

      public $declarations() {
        this.$imports = [
          M2,
        ];
        this.$components = {
          'container-wrap': Container,
        };
        this.$providers = [
          HeroSearchService,
          HeroSearchService1,
        ];
      }
    }
    ```

    - Use Javascript

    If u are using Javascript, plase use lower-case initial letter of `Class`. Like `Service HeroService`, u must inject `heroService` in `constructor` of `Class`

    ```javascript
    class HeroSearchService1 extends Service {
      constructor() {
        super();
      }
      test() {
        console.log('HeroSearchService !!!1111');
      }
    }
    class HeroSearchService extends Service {
      constructor(
        heroSearchService1, // inject Service and use lower-case initial letter of Class
      ) {
        super();
        this.hsr = heroSearchService1;
        this.hsr.test();
      }

      test() {
        console.log('HeroSearchService !!!000000000');
      }
    }

    class Container extends Component {
      constructor(heroSearchService) { // inject Service and use lower-case initial letter of Class
        super();
        this.ss = heroSearchService;
        this.ss.test();
      }

      $bootstrap() {
        this.$template = (`<div>1111</div>`);
      }
    }
    ```

11. LifeCycle hooks which from the beginning to the end:

  - EsModule

    ```javascript
      constructor()
      $declarations()
    ```

  - Components

    ```javascript
      constructor()
      $bootstrap()
      $onInit()
      $beforeMount()
      $hasRender()
      $afterMount()
      $onDestory()
      $routeChange(lastRoute, newRoute)
      $watchState(oldData, newData)
      // $routeChange only for route Component
    ```

  - Router

    ```javascript
    $routeChange(oldPath, newPath)
    ```

## Architecture

route => EsModule => component

## To do

- [x] 类分离，通过use来绑定方法
- [x] 无需route渲染
- [x] 子路由(2/2)
- [X] 组件化(3/3)
- [x] 模块化 EsModule
- [X] 双向绑定
- [x] 公共类提取
- [x] 数据劫持
- [x] 双向绑定模板
- [x] Template Syntax: es-text es-html es-model es-class es-repeat es-if(6/6)
- [x] 组件props
- [x] 组件渲染
- [x] 组件中使用组件
- [x] 改用 history的pushState
- [x] 监听路由变化动态渲染(2/2)
- [x] Virtual DOM
- [x] Service => $http
- [x] Route bug
- [x] ts (strongly typed 赛高)
- [x] 依赖注入
