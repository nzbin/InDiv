# indiv

A minimal web mvvm framework.一个小Web mvvm库。
Now we support for typescript!

[中文](https://dimalilongji.github.io/indiv-doc)
[npm](https://www.npmjs.com/package/indiv)

## demo
  - `npm run start`
  - `npm run start-js`
  - open `http://localhost:1234`

## Basic Usage

1. Create a root DOM for route which id is root:

  ```html
  <div id="root"></div>
  ```
2. Create a InDiv:

  1. use `bootstrapModule` to bootstrap a root module `NvModule`

  ```javascript
  const indiv = new InDiv();
  indiv.bootstrapModule(M1);
  indiv.use(router); // if u are using a router
  indiv.init();
  ```

3. Create a router:

  - routes must an `Array` includes `Object`

      1. routes must incloude rootPath `'/'`
      2. routes must set an component name like `component: 'R1'`， `R1` is declared in `NvModule` in `$declarations => this.$components`
      3. routes can assign redirectTo and use `redirectTo: Path`
      4. routes can assign children and use `children: Array`
      5. routes can set a path like `path: '/:id'`

  - if u are using `Router`, u must need to `router.setRootPath('/RootPath')` to set an root path.
  - `router.routeChange = (old, next)` can listen route change
  - `router.init(routes);` can init Array routes
  - if u want to watch routes changes, plz use `router.routeChange=(old.new) => {}`

      1. use `this.setLocation((path: String, query: Object, params: Object)` to go to Path or `location.href`
      2. use `this.getLocation()` to get location states
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
  router.setRootPath('/demo'); // so routes:Array => `/` is `/demo`
  router.init(routes);
  router.routeChange = (old, next) => {
    console.log('nvRouteChange', old, next);
  };
  const indiv = new InDiv();
  indiv.bootstrapModule(M1);
  const routerIndex = indiv.use(router);
  indiv.init();
  ```

4. Create a Component:

  - create a `class`
  - use decorator `Component` in typescript or use function `Component` in javascript
  - Component types:

    ```typescript
    type TComponentOptions<State> = {
      selector: string;
      template: string;
      state?: State;
    };
    ```
  
  - `selector` is your component tag name for HTML and used in template.
  - `template` only accepts `state.XXX` from this.state, and event only accepts `@eventHandler` from method which commes from this
  - `state` you can set an initial state for component
  - **please use `setState` after lifecycle `constructor()` and `nvOnInit`**, so you can change or set value for `this.state` without `setState` in lifecycle `constructor()` and `nvOnInit`
  - after `Class`'s `constructor()`, u can use `this.props` in any lifecycle

    1. typescript

      - to use decorator `Component` declare `template` and `state`
      - to implements interface `HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange` to use lifecycle
      - to use decorator `Injectable` to inject `Service` in `constructor`'s arguments of `Component` 

      ```typescript
      @Injectable
      @Component({
        selector: 'container-wrap',
        state: {
          a: 1,
          testArray: [
            {
              name: '李龙吉',
              sex: '男',
              job: [
                {
                  id: 1,
                  name: '程序员',
                },
                {
                  id: 2,
                  name: '码农',
                },
                {
                  id: 3,
                  name: '帅',
                },
              ],
            },
            {
              name: '邱宝环',
              sex: '女',
              job: [
                {
                  id: 1,
                  name: '老师',
                },
                {
                  id: 2,
                  name: '英语老师',
                },
                {
                  id: 3,
                  name: '美',
                },
              ],
            }],
          testArray2: ['程序员3', '码农3', '帅3'],
        },
        template: (`
          <div>
            <p nv-on:click="@go()">container: {{state.a}}</p>
            <input nv-model="state.a" />
            <div nv-repeat="let man in state.testArray">
              <div nv-on:click="@show(state.testArray2)">姓名：{{man.name}}</div>
              <div>性别：{{man.sex}}</div>
              <input nv-on:click="@show(b, $index)" nv-repeat="let b in state.testArray2" nv-model="b" nv-class="b" />
              <div class="fuck" nv-repeat="let b in man.job">
                <input nv-on:click="@show(b.name)" nv-model="b.name" nv-class="b.id" />
              </div>
            </div>
            <router-render></router-render>
          </div>
        `),
      })
      class Container implements OnInit, AfterMount {
        public ss: HeroSearchService;
        public state: any;
        public setLocation: SetLocation;

        constructor(
          private hss: HeroSearchService,
        ) {
          this.ss = hss;
          this.ss.test();
          console.log(this.state);
        }

        public nvOnInit() {
          console.log('nvOnInit Container');
        }

        public nvAfterMount() {
          console.log('nvAfterMount Container');
        }

        public go() {
          this.setLocation('/R1', { b: '1' });
        }
        public show(a: any, index?: string) {
          console.log('aaaa', a);
          console.log('$index', index);
        }
      }
      ```

    2. javascript

      - to use function `Component` declare `template` and `state`
      - to use lifecycle `nvOnInit nvBeforeMount nvAfterMount nvOnDestory nvHasRender nvWatchState nvRouteChange` in Class
      - to use `constructor`'s arguments of `Component` for inject `Service`, and arguments must be lowercase lette of initials lette  of Service class name. For example, you want to inject a service  class `HeroService`, you must write argument in `constructor` with `heroService`

      ```javascript
      class Container {
        constructor(
          heroSearchService
        ) {
          this.ss = heroSearchService;
          this.ss.test();
        }
        nvOnInit() {
          console.log('nvOnInit Container');
        }

        go() {
          this.setLocation('/R1', { b: '1' });
        }

        show(a, index) {
          console.log('aaaa', a);
          console.log('$index', index);
        }
      }

      Component({
        selector: 'container-wrap',
        template: (`
          <div>
            <p nv-on:click="@go()">container: {{state.a}}</p>
            <input nv-model="state.a" />
            <div nv-repeat="let man in state.testArray">
              <div nv-on:click="@show(state.testArray2)">姓名：{{man.name}}</div>
              <div>性别：{{man.sex}}</div>
              <input nv-on:click="@show(b, $index)" nv-repeat="let b in state.testArray2" nv-model="b" nv-class="b" />
              <div class="fuck" nv-repeat="let b in man.job">
                <input nv-on:click="@show(b.name)" nv-model="b.name" nv-class="b.id" />
              </div>
            </div>
            <router-render></router-render>
          </div>`),
        state: {
          a: 1,
          testArray: [
            {
              name: '李龙吉',
              sex: '男',
              job: [
                {
                  id: 1,
                  name: '程序员',
                },
                {
                  id: 2,
                  name: '码农',
                },
                {
                  id: 3,
                  name: '帅',
                },
              ],
            },
            {
              name: '邱宝环',
              sex: '女',
              job: [
                {
                  id: 1,
                  name: '老师',
                },
                {
                  id: 2,
                  name: '英语老师',
                },
                {
                  id: 3,
                  name: '美',
                },
              ],
            }],
          testArray2: ['程序员3', '码农3', '帅3'],
        },
      })(Container);
      ```

  - `props: Object` is data which `class Controller` sends to `class Component`

  - ** `props: Object` can only be changed or used after lifecycle `constructor()` **


5. NvModule

  - InDiv apps are modular and InDiv has its own modularity system called `NvModule`. An `NvModule` is a container for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities. It can contain components, service providers, and other code files whose scope is defined by the containing `NvModule`. It can import functionality that is exported from other `NvModule`, and export selected functionality for use by other `NvModule`.

  - u need to declare `imports?: Function[]` `components: Function[]` `providers?: Function[]` `exports?: Function[]` `bootstrap?: Function` in `options`
  - `imports` imports other `NvModule` and respect it's `exports`
  - `components` declare `Components`
  - `providers` declare `Service`
  - `exports:` exports `Components` for other `NvModules`
  - `bootstrap` declare `Component` for Module bootstrap only if u don't `Router`

    1. typescript

    ```typescript
    @NvModule({
      imports: [
        M2,
      ],
      components: [
        Container,
        PComponent,
        R1,
      ],
      providers: [
        HeroSearchService,
        HeroSearchService1,
      ],
      exports: [
        Container,
        PComponent,
      ]
    })
    class M1 {}
    ```
    1. javascript
  
    ```javascript
    class M1 {}
    NvModule({
      imports: [
        M2,
      ],
      components: [
        Container,
        PComponent,
        R1,
      ],
      providers: [
        HeroSearchService,
        HeroSearchService1,
      ],
      exports: [
        Container,
        PComponent,
      ]
    })(M1);
    ```

6. Template Syntax

  - 规定：指令以 nv-xxx 命名
  - now: nv-text nv-html nv-model nv-class nv-repeat nv-if nv-on:Event
  - 事件指令, 如 nv-on:click
    - Text1: `<p nv-text="state.b"></p>;`
    - Text2: `<p>this.state.b是：{{state.b}}</p>;`
    - HTML: `<p nv-html="state.c"></p>;`
    - Model for input: `'<input nv-model="state.c"/>';` **if input is a repeat DOM, and intem of Array is'nt an object, please use `$index`**
    - Class: `<p  class="b" nv-class="state.a"></p>';`
    - Directives: ues `nv-on:event`
      - `<p nv-on:click="@componentClick()"></p>;`
    - Repeat: `<p  class="b" nv-class="state.a" nv-repeat="let a in state.b" nv-if="a.f">{{a.z}}</p>`
  - about function in Template Syntax
    - now you can send arguments in Function
    - arguments include:
      1. Event: `$event`
      2. String: `'xxx'`
      3. Number: `123`
      4. Index: `$index`, you can only use this in **repeat DOM** : `<input nv-on:click="this.show(b, $index)" nv-repeat="let b in state.testArray2" nv-model="b" nv-class="b" />`
      5. Variable: **`state.xxx`**
      6. Boolean: `true` `false`
      7. For nv-repeat: items like: `nv-repeat="let a in state.b" nv-if="a.f"`

7. Data monitor: this.state && this.setState

  - use `this.state: Object` and `this.setState(parmars: Function || Object)`
  - if u have some variable, u can set `this.state` in `constructor(){}`
  - if u want to change State, plz use `this.setState`, parmars can be `Object` or `Function` which must return an `Object`
  - and u can recive this change in life cycle `nvWatchState(oldData, newData)`, but we need to use a deep clone for `this.state`, so please minimize the use of life cycle `WatchState`

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
  - And u can use `Service` to send communication between `Component` , because we have realized singleton.
  - `Service` accepts an object`isSingletonMode: boolean` to decide use singleton or not.

    1. typescript

      -  to use decorator `Injectable` to inject `Service` in `constructor`'s arguments of `Service` 

      ```typescript
      @Injectable
      @Service({isSingletonMode: false})
      class HeroSearchService {
        public hsr: HeroSearchService1;
        constructor(
          private hsrS: HeroSearchService1,
        ) {
          this.hsr = hsrS;
          this.hsr.test();
        }

        public test() {
          console.log('HeroSearchService !!!000000000');
        }
      }
      ```

    2. javascript

      - to use `constructor`'s arguments of `Service` for inject an other `Service`, and arguments must be lowercase lette of initials lette  of Service class name. For example, you want to inject a service  class `HeroSearchService`, you must write argument in `constructor` with `heroSearchService`

      ```javascript
      class HeroSearchService {
        constructor(heroSearchService1) {
          this.hsr = heroSearchService1;
          this.hsr.test();
        }
        test() {
          console.log('HeroSearchService !!!000000000');
        }
      }

      Service({
        isSingletonMode: false,
      })(HeroSearchService);
      ```

    3. http

      ```javascript
      import { nvHttp } from 'InDiv';
      const http = nvHttp;
      http.get(url, params);
      http.delete(url, params);
      http.post(url, params);
      http.put(url, params);
      http.patch(url, params);
      ```

10. Dependency Injection
    
    Dependency injection is an important application design pattern. It's used so widely that almost everyone just calls it DI
    
    1. Use Typescript

      - If u are using `Typescript` to build an app, u can easily use our Dependency Injection.Only use `@Injectable` before the `Class` which need to use other services, that which are declarated in `this.$providers` of `NvModule` or root module.
      - Use `this.` names of constructor arguments to directly use `Service`.

      ```typescript
      import { Injectable, Component, NvModule, Service, HasRender } from 'indiv';

      @Service({
        isSingletonMode: true,
      })
      class HeroSearchService1 {
        constructor() {}

        public test() {
          console.log('HeroSearchService !!!1111');
        }
      }

      @Injectable
      @Service()
      class HeroSearchService {
        public hsr: HeroSearchService1;
        constructor(
          private hsrS: HeroSearchService1,
        ) {
          this.hsrS.test();
        }

        public test() {
          console.log('HeroSearchService !!!000000000');
        }
      }

      @Injectable
      @Component({
        selector: 'pc-child',
        state: {
          a: 'a',
        },
        template: (`
          <div>
            <p nv-on:click="@go()">container: {{state.a}}</p>
            <input nv-model="state.a" />
            <div nv-repeat="let man in state.testArray">
              <div nv-on:click="@show(state.testArray2)">姓名：{{man.name}}</div>
              <div>性别：{{man.sex}}</div>
              <input nv-on:click="@show(b, $index)" nv-repeat="let b in state.testArray2" nv-model="b" nv-class="b" />
              <div class="fuck" nv-repeat="let b in man.job">
                <input nv-on:click="@show(b.name)" nv-model="b.name" nv-class="b.id" />
              </div>
            </div>
            <router-render></router-render>
          </div>
        `),
      })
      class PCChild implements HasRender {
        public props: any;
        public hsr: HeroSearchService;
        constructor(
          private hsrS: HeroSearchService,
        ) {
          this.hsrS.test();
        }

        public nvHasRender() {}
      }

      @NvModule({
        imports: [
          M2,
        ],
        components: [
          PCChild,
        ],
        providers: [
          HeroSearchService,
          HeroSearchService1,
        ],
      })
      class M1 {}
      ```

    2. Use Javascript

      - to use `constructor`'s arguments of `Service` for inject an other `Service`, and arguments must be lowercase lette of initials lette  of Service class name. For example, you want to inject a service  class `HeroSearchService`, you must write argument in `constructor` with `heroSearchService`
      - A little diffrence between javascript and typescript, use constructor arguments to directly use `Service`, and assign them to a variable.

      ```javascript
      class HeroSearchService1 {
        constructor() {
          super();
        }
        test() {
          console.log('HeroSearchService !!!1111');
        }
      }
      Service({
        isSingletonMode: true,
      })(HeroSearchService1);

      class HeroSearchService {
        constructor(
          heroSearchService1,
        ) {
          super();
          this.hsr = heroSearchService1;
          this.hsr.test();
        }

        test() {
          console.log('HeroSearchService !!!000000000');
        }
      }
      Service({
      isSingletonMode: false,
      })(HeroSearchService);

      class Container {
        constructor(heroSearchService) {
          this.ss = heroSearchService;
          this.ss.test();
        }
      }

      Component({
        selector: 'container-wrap',
        state: {
          a: 'a',
        },
        template: (`
          <div>
            <p>1232{{state.a}}</p>
          </div>
        `),
      })(Container)

      class M1 {}
      NvModule({
        imports: [
          M2,
        ],
        components: [
          Container,
        ],
        providers: [
          HeroSearchService,
          HeroSearchService1,
        ],
      })(M1);
      ```

11. LifeCycle hooks which from the beginning to the end:

  - NvModule

    ```typescript
      constructor()
    ```

  - Components

    - You can initialize state in life cycle hooks `constructor nvOnInit`, after that u must use `setState` add listener for additional attributes on state
    - After `constructor` u can get this.props and use it
    - On `nvReceiveProps` u can receive new props with argument `nextProps` and use old props with `this.props`

    ```typescript
      constructor()
      nvOnInit(): void;
      nvBeforeMount(): void;
      nvAfterMount(): void;
      nvHasRender(): void;
      nvOnDestory(): void;
      nvWatchState(oldData?: any, newData?: any): void;
      nvRouteChange(lastRoute?: string, newRoute?: string): void;
      nvReceiveProps(nextProps: any): void;
    ```

  - Router

    ```typescript
    routeChange((lastRoute?: string, newRoute?: string): void;
    ```

## Architecture

route => NvModule => component

## To do

- [x] 类分离，通过use来绑定方法
- [x] 无需route渲染
- [x] 子路由(2/2)
- [X] 组件化(3/3)
- [x] 模块化 + NvModule
- [X] 双向绑定
- [x] 公共类提取
- [x] 数据劫持
- [x] 双向绑定模板
- [x] Template Syntax: nv-text nv-html nv-model nv-class nv-repeat nv-if(6/6)
- [x] 组件props
- [x] 组件渲染
- [x] 组件中使用组件
- [x] 改用 history的pushState
- [x] 监听路由变化动态渲染(2/2)
- [x] Virtual DOM
- [x] Service
- [x] Route bug
- [x] ts (强类型赛高)
- [x] DI
