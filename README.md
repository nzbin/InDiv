# InDiv

一个 web mvvm 库。
A web mvvm library.

[中文](https://dimalilongji.github.io/indiv-doc)
[npm](https://www.npmjs.com/package/indiv)

current version: v1.2.0

## demo
  - `npm run start`
  - `npm run start-js`
  - open `http://localhost:1234/demo`

## Basic Usage

  1. tsconfig: "emitDecoratorMetadata": true
  2. please use version: v1.2.0+

#### Create a root DOM for route which id is root:

  ```html
  <div id="root"></div>
  ```
#### Create a InDiv:

  1. Use `bootstrapModule` to bootstrap a root module `NvModule`

  ```javascript
  const indiv = new InDiv();
  indiv.bootstrapModule(M1);
  indiv.use(router); // if u are using a router
  indiv.init();
  ```

#### Create a router:

  - Routes must an `Array` includes `Object`

      1. Routes must incloude rootPath `'/'`
      2. Routes must set an component name like `component: 'R1'`， `R1` is a `Component` `selector` from `Root NvModule`.You can use this `Component` from `exports` of other `NvModule` in `Root NvModule`
      3. Routes can assign redirectTo and use `redirectTo: Path`
      4. Routes can assign children and use `children: Array`
      5. Routes can set a path like `path: '/:id'`, but route of the same level can't be set

  - If u are using `Router`, u must need to `router.setRootPath('/RootPath')` to set an root path.
  - `router.routeChange = (old, next)` can listen route change
  - `router.init(routes);` can init Array routes
  - If u want to watch routes changes, plz use `router.routeChange=(old.new) => {}`

      1. Use `this.setLocation(path: String, query: Object, params: Object)` to go to Path or `location.href`
      2. Use `this.getLocation()` to get location states
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

#### Create a Component:

  - Create a `class`
  - Use decorator `Component` in typescript or use function `Component` in javascript
  - Component types:
    ```typescript
    type TComponentOptions<State> = {
      selector: string;
      template: string;
      providers: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; })[];
    };
    ```
  - **Recommend to use `Service` with `RXjs` on communication between `Components`**
  - `selector: string;` is your component tag name for HTML and used in template.
  - `template: string` only accepts `$.` as value of `nv-directive` from `this.state`, and `nv-on:event` only accepts `@eventHandler` from method which belongs to Class instance **`$.` in template is `this.state.`**
  - `providers` declares `Service` for `Component`

    - Providers is an `Array` which has three modes:
      1. Mode1: `Function` is equal to mode2: `{ provide: Function; useClass: Function; }`
      2. Mode2: `{ provide: any; useClass: Function; }`
      3. Mode3: `{ provide: any; useValue: any; }` uses  `useValue` for injector

    - `provide` can be `string` , `function` or `Class` in TypeScript
    - **In TypeScript these three modes can be used and provide can be `function` or `Class`**
    - **In javascript please use `{ provide: string; useClass: Function; }[]` or `{ provide: string; useValue: any; }[]`**

  - `template` only accepts `$.XXX` from this.state, and nv-on:event only accepts `@eventHandler` from method which belongs to Class instance
  - **Please use `setState` after lifecycle `constructor()` and `nvOnInit`**, and you can change or set value for `this.state` without `setState` in lifecycle `constructor()` and `nvOnInit`
  - After `Class`'s `constructor`, u can use `this.props` in any lifecycle
  - Use `nvOnInit` and `nvReceiveProps(nextProps: any): void;` to receive props and set `props` in `state`
  - Use `setLocation` and `getLocation` to controll route or get route info
  - Use `Component` in `template`

    - Use like a HTML element tag: `<test-component></test-component>`
    - Set props like HTML attributes, but use `{}` to include props value: `<test-component man="{@countState(man.name)}" women="{man.name}" handler="{@getProps}"></test-component>`
    - Please use **UnderScoreCase** to set Props in `template`, and use **CamelCase** to use props
      ```javascript
        <p-component props-value="$.a"></p-component>

        this.props.propsValue
      ```

    - Props can use three types:
      1. value from `this.state` and value from repeat data: `women="{$.name}"` `women="{man.name}"`
      2. value use function from `Component` instance with return value: `man="{@countState(man.name)}"`
      3. Function form `Component` instance (must use `@`): `handler="{@getProps}"`

  - About `state` and `props`
      1. action of set value of `state` or using `setState` is a **synchronous action**
      2. action of using callback function from `props` to change `state` which comes from `parent Component` in `child Component` is a synchronous action
      3. rerender of Component is an **asynchronous action**, and after rerendering `props` can be changed in `child Component`
      4. so after using callback function from `props` to change `state` which comes from `parent Component` in `child Component`, `props` in `child Component` can't be changed immediately because of out render mechanism is asynchronous render.You should use `nvReceiveProps(nextProps: any): void;` to watch `props` changes

  -  typescript

    - To use decorator `Component` declare `template` and `state`
    - To implements interface `OnInit, BeforeMount, AfterMount, HasRender, OnDestory, ReceiveProps, WatchState, RouteChange` to use lifecycle hooks
    - To use decorator `Injected` to declare which need to be injected `Service` in `constructor`'s arguments of `Component`**

    ```typescript
    import { Injected, Component, OnInit, AfterMount, ReceiveProps, SetLocation, GetLocation } from 'indiv';
    @Injected
    @Component({
      selector: 'container-wrap',
      template: (`
        <div>
          <p nv-on:click="@go()">container: {{$.a}}</p>
          <input nv-model="$.a" />
          <router-render></router-render>
        </div>
      `),
      providers: [
        HeroSearchService,
        {
          provide: HeroSearchService1,
          useClass: HeroSearchService1,
        }
      ]
    })
    class Container implements OnInit, AfterMount, ReceiveProps {
      public ss: HeroSearchService;
      public state: any;
      public setLocation: SetLocation;

      constructor(
        private hss: HeroSearchService,
      ) {
        this.ss = hss;
        this.ss.test();
        this.state = {
          a: 1,
        };
      }

      public nvOnInit() {
        this.state.propsTest = this.props.test;
      }

      public nvAfterMount() {
        console.log('nvAfterMount Container');
      }

      public nvReceiveProps(nextProps: any) {
        this.state.a = nextProps.test;
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

  -  javascript

    - To use function `Component` declare `template` and `state`
    - Lifecycle hooks are equal in TypeScript, and have no use `implements` interface
    - **Use Class static attribution `injectTokens: string[]` and every item is `provide: string` of provider in `NvModule`**
    - **Class static attribution `injectTokens: string[]` must be `provide` of providers, and arguments of constructor will be instances of `useClass` or value of `useValue` of providers**

    ```javascript
    class Container {
      static injectTokens = [
        'heroSearchService',
      ];

      constructor(
        heroSearchService
      ) {
        this.ss = heroSearchService;
        this.ss.test();
        this.state = {
          a: 1,
        };
      }
      nvOnInit() {
        this.state.a = this.props.test;
        console.log('nvOnInit Container');
      }
      nvReceiveProps(nextProps) {
        this.state.a = nextProps.test;
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
          <p nv-on:click="@go()">container: {{$.a}}</p>
          <input nv-model="$.a" />
          <router-render></router-render>
        </div>`),
      providers: [
        {
          provide: 'heroSearchService',
          useClass: HeroSearchService,
        },
        {
          provide: 'heroSearchService1',
          useClass: HeroSearchService1,
        }
      ]
    })(Container);
    ```

  - `props: Object` is data which `class Controller` sends to `class Component`

  - ** `props: Object` can only be changed or used after lifecycle `constructor()` **


#### NvModule

  - InDiv apps are modular and InDiv has its own modularity system called `NvModule`.
  - An `NvModule` is a container for a cohesive block of code dedicated to an application domain, a workflow, or a closely related set of capabilities.
  - It can contain components, service providers, and other code files whose scope is defined by the containing `NvModule`.
  - It can import functionality that is exported from other `NvModule`, and export selected functionality for use by other `NvModule`.

  - You need to declare 

    1. `imports?: Function[]`
    2. `components: Function[]`
    3. `providers?: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; }[])[]`
    4. `exports?: Function[]`
    5. `bootstrap?: Function` in `options`

  - `imports?: Function[]` imports other `NvModule` and respect it's `exports?: Function[]`
  - `components: Function[]` declares `Components`
  - `providers` declares `Service` for `Component` or `Service`

    - Providers is an `Array` which has three modes:
      1. Mode1: `Function` is equal to mode2: `{ provide: Function; useClass: Function; }`
      2. Mode2: `{ provide: any; useClass: Function; }`
      3. Mode3: `{ provide: any; useValue: any; }` uses  `useValue` for injector

    - `provide` can be `string` , `function` or `Class` in TypeScript
    - **In TypeScript these three modes can be used and provide can be `function` or `Class`**
    - **In javascript please use `{ provide: string; useClass: Function; }[]` or `{ provide: string; useValue: any; }[]`**

  - `exports?: Function[]` exports `Components` for other `NvModules`
  - `bootstrap?: Function` declares `Component` for Module bootstrap only if u don't `Router`

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
          {
            provide: HeroSearchService1,
            useClass: HeroSearchService1
          },
          {
            provide: HeroSearchService3,
            useValue: 123,
          },
        ],
        exports: [
          Container,
          PComponent,
        ]
      })
      class M1 {}
      ```

    2. javascript

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
          {
            provide: 'heroSearchService',
            useClass: HeroSearchService1
          },
          {
            provide: 'heroSearchService1',
            useClass: HeroSearchService1
          },
          {
            provide: 'heroSearchService3',
            useValue: 123,
          },
        ],
        exports: [
          Container,
          PComponent,
        ]
      })(M1);
      ```

#### Template Syntax

  - Now we support: nv-model nv-text nv-html nv-if nv-class nv-repeat nv-key nv-on:Event
  - And also support some directive which can use `DOM.directiveName` to set value, like `nv-src` `nv-href` `nv-alt`
  - Expect value from this.state and value from nv-repeat, and some directives can also use Fuction form this which must return a value like `nv-text="@addCount($.a, $.b)"`
    - `nv-model` `nv-on:event` can't use Fuction as value
    - Fuction must from `Component` instance
    - Arguments in Function can include:
      1. Element: `nv-text="@addCount($element)"`
      2. String: `nv-text="@addCount('xxx')"`
      3. Number: `nv-text="@addCount(123)"`
      4. Index: `$index`, you can only use this in **repeat DOM** : `<input nv-repeat="let b in $.testArray2" nv-class="@addCount($index)" />`
      5. Variable: **`nv-text="@addCount($.a)"`**
      6. Boolean: `nv-text="@addCount(true, false)"`
      7. For nv-repeat: items like: `nv-repeat="let data in $.repeatData" nv-text="@addCount(data.show)"`

  - Event directive, like `nv-on:click`
    - Text: `<p nv-text="$.b"></p>;`
    - Template: `<p>this.$.b是：{{$.b}}</p>;`
    - HTML: `<p nv-html="$.c"></p>;`
    - Model for input: `'<input nv-model="$.c"/>';` **if input is a repeat DOM, and intem of Array is'nt an object, please use `$index`**
    - Class: `<p class="b" nv-class="$.a"></p>';`
    - Directives: ues `nv-on:event`
      - `<p nv-on:click="@componentClick()"></p>;`
    - If:
      - Now `nv-if` will remove this DOM
      - Because continually change DOM structure will lead the waste of performance, so please reduce use this template syntax
      - `<p id="aa" nv-if="$.a" nv-on:click="@changeInput()">{{$.a}}</p>`
    - Repeat: `<p  class="b" nv-class="$.a" nv-repeat="let a in $.b" nv-if="a.f">{{a.z}}</p>`
    - Key:
      - If u are repeating an `Component` or need continually change DOM structure, please use `nv-key` with `nv-repeat`.
      - `nv-key` is a key for InDiv to mark repeat `Component` or `DOM`, and it must be an unique value or index ** `$index` **.
      - If u are not use `nv-repeat` without `nv-key`, InDiv will render this with a new `Component`, and `state` in `Component` will be reset.
      - `<test-component nv-repeat="let man in $.testArray" nv-key="man.id" man="{man.name}"></test-component>`

  - About event function in Template Syntax
    - Arguments in Function can include:
      1. Element: `nv-on:click="@click($element)"`
      2. Event: `nv-on:click="@click($event)"`
      3. String: `nv-on:click="@click('xxx')"`
      4. Number: `nv-on:click="@click(123)"`
      5. Index: `$index`, you can only use this in **repeat DOM** : `<input nv-on:click="this.show(b, $index)" nv-repeat="let b in $.testArray2" nv-model="b" nv-class="b" />`
      6. Variable: **`nv-on:click="@click($.a)"`**
      7. Boolean: `nv-on:click="@click(true, false)"`
      8. For nv-repeat: items like: `nv-repeat="let data in $.repeatData" nv-if="data.show"`

#### Data monitor: this.state && this.setState

  - Use `this.state: Object` and `this.setState(parmars: Function || Object)`
  - If u have some variable, u can set `this.state` in `constructor(){}`
  - If u want to change State, plz use `this.setState`, parmars can be `Object` or `Function` which must return an `Object`
  - And u can recive this change in life cycle `nvWatchState(oldState)`, but we need to use a deep clone for `this.state`, so please minimize the use of life cycle `WatchState`

#### `Watcher` and `KeyWatcher`

  - import {Watcher, KeyWatcher}

    1. `Watcher`
      - Watcher expects two arguments: `data, watcher`
      - data is an Object
      - watcher is a function which has an arguments: `newData`
        ```javascript
        new Watcher(this.object, (newData) => {})
        ```

    2. `KeyWatcher`
      - Watcher expects there arguments: `data, key, watcher`
      - data: `Object`
      - key is a key in Object and type is `String`
      - watcher is a function which has an arguments: `newData`
        ```javascript
        new KeyWatcher(this.object, key, (newData) => {})
        ```

#### Service

  - Components shouldn't fetch or save data directly and they certainly shouldn't knowingly present fake data. They should focus on presenting data and delegate data access to a service.
  - And u can use `Service` to send communication between `Component` , because we have realized singleton.
  - `Service` accepts an object`{ isSingletonMode?: boolean }` to decide use singleton or not, and default value of `isSingletonMode` is `true`
  - If you don't set `isSingletonMode` to `false` and use it in `providers` of `NvModule`, then all `Service` will be singleton instance in an InDiv app and it will only have one instance in this app
  - If you use it in `providers` of `Component`, `Service` will be a singleton instance only in one instance of `Component`, whatever `isSingletonMode` of `Service` is true or not.
  - `Injected` can only inject service in module which own this service or component and in root module in TypeScript
  - Class static attribution `injectTokens: string[]` accepts `provide: string` of `providers` in JavaScript

    1. typescript
      - **usr decorator `Injectable` to declare service**
      - **to use decorator `Injected` to inject `Service` in `constructor`'s arguments of `Service`**

      ```typescript
      @Injected
      @Injectable({ isSingletonMode: false })
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
      - **use `Injectable`**
      - **for inject dependences for service, please use Class static attribution `injectTokens: string[]` like `Component`**

      ```javascript
      class HeroSearchService {
        static injectTokens = [
          'heroSearchService1'
        ];

        constructor(heroSearchService1) {
          this.hsr = heroSearchService1;
          this.hsr.test();
        }
        test() {
          console.log('HeroSearchService !!!000000000');
        }
      }
      Injectable({
        isSingletonMode: false,
      })(HeroSearchService);
      ```

    3. Service `NVHttp`: import NVHttp from 'indiv' and use it like a `Service` which `isSingletonMode` is false (`@Injectable({ isSingletonMode: false })`)
    4. Service `Utils`: import Utils from 'indiv' and use it like a `Service` which `isSingletonMode` is false (`@Injectable({ isSingletonMode: false })`)

#### Dependency Injection

  - Dependency injection is an important application design pattern. It's used so widely that almost everyone just calls it DI.
  - Difference between `providers` of `Component` and `providers` of `NvModule`
      1. `providers` of `Component` will be injected to **component injector** and will be the most preferential.
      2. `providers` of `Component` is a singleton service only in one instance of `Component`, and the instance will only belong to `Component`
      3. `providers` of `NvModule` will be injected to **root injector**. If dependency can't be found in `providers` of `Component`, it will be found in `providers` of `NvModule`
      4. If a service in the `providers` of `NvModule`  is a singleton service or not only depends on `isSingletonMode`

  - Basic Usage

      1. Use Typescript

        - If u are using `Typescript` to build an app, u can easily use our Dependency Injection.
        - use `@Injected` before the `Class` which need to use other services, that which are declarated in `providers` of it's `NvModule` or root `NvModule`.
        - Use `this.` names of constructor arguments to directly use `Service`.
        - If you don't set `isSingletonMode` of `Service` to `false`, all `Service` in an InDiv app will be a singleton instance and it will only have one instance in this app

      ```typescript
      import { Injected, Injectable, Component, NvModule, HasRender } from 'indiv';

      @Injectable()
      class HeroSearchService1 {
        constructor() {}

        public test() {
          console.log('HeroSearchService !!!1111');
        }
      }

      @Injected
      @Injectable()
      class HeroSearchService {
        public hsr: HeroSearchService1;
        constructor(
          private hsrS: HeroSearchService1,
        ) {
          this.hsrS.test();
          this.state = { a: 1 };
        }

        public test() {
          console.log('HeroSearchService !!!000000000');
        }
      }

      @Injected
      @Component({
        selector: 'pc-child',
        template: (`
          <div>
            <p nv-on:click="@go()">container: {{$.a}}</p>
            <input nv-model="$.a" />
            <router-render></router-render>
          </div>
        `),
        providers: [
          {
            provide: HeroSearchService1,
            useClass: HeroSearchService1,
          }
        ]
      })
      class PCChild implements HasRender {
        public props: any;
        constructor(
          private hsrS: HeroSearchService,
          private hsrS1: HeroSearchService1,
        ) {
          this.hsrS.test();
          this.state = { a: 1 };
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
          {
            provide: HeroSearchService1,
            useClass: HeroSearchService1,
          },
          {
            provide: ValueService,
            useClass: 3333,
          }],
      })
      class M1 {}
      ```

    1. Use Javascript

      - A little diffrence between javascript and typescript.
      - use constructor arguments to directly use `Injectable`, and assign them to a variable**

      ```javascript
      class HeroSearchService1 {
        constructor() {
          super();
        }
        test() {
          console.log('HeroSearchService !!!1111');
        }
      }
      Injectable({ isSingletonMode: true })(HeroSearchService1);

      class HeroSearchService {
        static injectTokens = [
          'heroSearchService1'
        ];
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
      Injectable({ isSingletonMode: false })(HeroSearchService);

      class Container {
        static injectTokens = [
          'heroSearchService',
          'heroSearchService1',
        ];
        constructor(
          heroSearchService,
          HeroSearchService1
        ) {
          this.hsrS = heroSearchService;
          this.hsrS.test();
          this.state = {
            a: 'a',
          };
        }
      }
      Component({
        selector: 'container-wrap',
        template: (`
          <div>
            <p>1232{{$.a}}</p>
          </div>
        `),
        providers: [
          {
            provide: 'heroSearchService1',
            useClass: HeroSearchService1,
          }
        ]
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
          {
            provide: 'heroSearchService',
            useClass: HeroSearchService,
          },
          {
            provide: 'heroSearchService1',
            useClass: HeroSearchService1,
          },
          {
            provide: 'value',
            useClass: 3333,
          }],
      })(M1);
      ```

#### LifeCycle hooks which from the beginning to the end:

  - NvModule

    ```typescript
      constructor()
    ```

  - Components

    - You can initialize state in life cycle hooks `constructor nvOnInit`, after that u must use `setState` add listener for additional attributes on state
    - After `constructor` u can get this.props and use it
    - On `nvReceiveProps` u can receive new props in argument `nextProps` and use old props with `this.props`

    ```typescript
      constructor()
      nvOnInit(): void;
      nvBeforeMount(): void;
      nvAfterMount(): void;
      nvHasRender(): void;
      nvOnDestory(): void;
      nvWatchState(oldState?: any): void;
      nvRouteChange(lastRoute?: string, newRoute?: string): void;
      nvReceiveProps(nextProps: any): void;
      setter
      getter
    ```

  - Router

    ```typescript
    routeChange((lastRoute?: string, newRoute?: string): void;
    ```

#### Server Side Render (@indiv/ssr-renderer: v1.1.0+)

    - [npm](https://www.npmjs.com/package/@indiv/ssr-renderer)
    - @indiv/ssr-renderer: v1.1.0+, indiv: v1.2.0+, NodeJs v6+
    - export your InDiv instance and routes
    - use `renderToString(url: string, routes: TRouter[], inDiv: InDiv): string`, render your app to string with `request.url`, `routes` and `InDiv instance`
    - at last render string to your template
    - details in [@indiv/ssr-renderer](https://github.com/DimaLiLongJi/indiv-ssr-renderer#readme)


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
- [x] Template Syntax: nv-text nv-html nv-model nv-class nv-repeat nv-key nv-if nv-src nv-href(7/7)
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
- [x] SSR 服务端渲染
- [ ] 自定义指令
- [ ] route lazy load
- [x] async template render
- [x] optimize setState
