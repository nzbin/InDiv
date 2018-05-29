# easiest

A minimal, blazing fast web mvvm framework.一个小而快的Web mvvm库。

## demo
  - `npm run start`
  - open `http://localhost:1234`

## Basic Usage

1. Create a root DOM for route which id is root:

  ```html
  <div id="root"></div>
  ```

2. Create a router:
  - routes must an `Array` includes `Object`
  - `router.init(routes);` can init routes
  - if u want to watch routes changes, plz use `router.$routeChange=(old.new) => {}`
  - now you can use two modes: `Router` or `RouterHash`

      1. use `this.$location.go((path: String, query: Object, params: Object)` to go to Path or `location.href`
      2. use `this.$location.state()` to get location states
      3. `Router` : `http://localhost:1234/R1`
      4. `RouterHash`: `http://localhost:1234/#/R1`

  ``` javascript
  const router = new Router();
  const routes = [
    {
      path: '/R1',
      controller: R1,
    },
    {
      path: '/R2',
      controller: R2,
    },
    {
      path: '/R1/C1',
      controller: R2,
    },
  ];
  router.init(routes);
  router.$routeChange = function(old, next) {
    console.log('$routeChange', old, next);
  }
  ```

3. Create a Component:
  - must extends`class Component`
  - must `super(name, props);`
  - **plz setState or setProps after lifecycle `constructor()`**
  - u need to declare template or component in lifecycle `$declare()`

    1. this.$template is used to set component html
    2. this.$components is used to declared $components

    ```javascript
    $declare() {
      this.$template = (`
        <div>
          <pComponent1></pComponent1>
          <input es-repeat="let a in this.state.d" es-model="a.z" />
        </div>
      `);
      this.$components = {
        pComponent1: new PCChild('pComponent1', {
          ax: this.state.a,
          b: this.getProps.bind(this),
        }),
      };
    }
    ```

  - `name: String` is this component use in `class Controller`
  - `props: Object` is data which `class Controller` sends to `class Component`
  - **`props: Object` can only be changed or used after lifecycle `constructor()`**
  - `props: Object` can only be changed by action `this.setProps()` and `this.setProps()` is equal to `setState`

  ```javascript
  class pComponent extends Component {
    constructor(name, props) {
      super(name, props);
      this.state = {
        a: 'a子组件',
      };
    }

    $declare() {
      this.$template = (`
        <div>
          <pComponent1></pComponent1>
        </div>
      `);
      this.$components = {
        pComponent1: new PCChild('pComponent1', {
          ax: this.state.a,
          b: this.getProps.bind(this),
        }),
      };
    }

    $onInit() {
      console.log('props', this.props);
    }
    componentClick(e) {
      alert('点击了组件');
      this.setState({b: 2});
      this.setProps({ax: 5});
      this.$location.go('/R1/R4', { a: '1' });
      this.$location.state();
      // this.props.b(3);
    }
    $watchState(oldData, newData) {
      console.log('oldData Component:', oldData);
      console.log('newData Component:', newData);
    }
  }
  ```

4. Create a controller for path:
  - must extends`class Controller`
  - must declare template in `this.$template : String`
  - **template must be parceled by a father Dom in class `Controller`**
  - must declare components in  life-cycle `$declare(){}`
  - if u want to rerender Component, plz use `this.$replaceComponent();`

    1. declare template: `this.$template: string`
    2. declare components: `this.$components: Object{key: declare Class(templateName: string, props: object)}`

  - declare Component, `class Component` needs two parmars: `templateName, props`
  - `templateName: String` must be as same as the `html tag` which is used in `this.$template`
  -  `props: Object`'s key is used in `class Component as props's key`
  - now thie `props` is an **unidirectional data flow**,can only be changed in Component.If u want to change it in father Controller, plase use callback to change state in father Controller.

  ``` javascript
  class R1 extends Controller {
    constructor() {
      super();
      this.state = {
        a: 'a',
        b: 2,
        d: [{
          z: 111111111111111,
          b: 'a',
          show: true,
        },
        {
          z: 33333333333333,
          b: 'a',
          show: true,
        }],
        c: 'c',
        e: [{
          z: 232323,
          b: 'a',
          show: true,
        },
        {
          z: 1111,
          b: 'a',
          show: false,
        }],
        f: true,
      };
    }
    $declare() {
      this.$template = (`
      <div>
        <pComponent1/>
        <pComponent2/>
        <div es-if="this.state.f">
          <input es-repeat="let a in this.state.e" es-model="a.z" />
          <p es-class="this.state.c" es-if="a.show" es-repeat="let a in this.state.e" es-text="a.z" es-on:click="this.showAlert(a.z)"></p>
          this.state.a：<br/>
          <input es-model="this.state.a" />
        </div>
      </div>
      `);
      this.$components = {
        pComponent1: new PComponent('pComponent1', {
          ax: this.state.a,
          b: this.getProps.bind(this),
        }),
        pComponent2: new PComponent('pComponent2', {
          ax: this.state.a,
          b: this.getProps.bind(this),
        }),
      };
    }
    $onInit() {
      console.log('is $onInit');
    }
    $beforeMount() {
      console.log('is $beforeMount');
    }
    $afterMount() {
      console.log('is $afterMount');
    }
    $onDestory() {
      console.log('is $onDestory');
    }
    $watchState(oldData, newData) {
      console.log('oldData Controller:', oldData);
      console.log('newData Controller:', newData);
    }
    showAlert() {
      alert('我错了 点下控制台看看吧');
      this.setState({
        a: 2,
        b: !this.state.a
      });
      console.log('state', this.state);
    }
    getProps(a) {
      alert('里面传出来了');
      this.setState({a: a});
    }
  }
  ```

5. Template Syntax
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

6. Data monitor: this.state && this.setState
  - use `this.state: Object` and `this.setState(parmars: Function || Object)`
  - if u have some variable, u can set `this.state` in `constructor(){}`
  - if u want to change State, plz use `this.setState`, parmars can be `Object` or `Function` which must return an `Object`
  - and u can recive this change in life cycle `$watchState(oldData, newData)`

7. `Watcher` and `KeyWatcher`
  - import {Watcher, KeyWatcher}

    1. `Watcher`
      - Watcher expects two arguments: `data, watcher`
      - data is an Object
      - watcher is a function which has two arguments: `oldData, newData`
        ```
        new Watcher(this.object, (oldData, newData) => {})
        ```

    2. `KeyWatcher`
      - Watcher expects there arguments: `data, key, watcher`
      - data: `Object`
      - key is a key in Object and type is `String`
      - watcher is a function which has two arguments: `oldData, newData`
        ```
        new KeyWatcher(this.object, key,(oldData, newData) => {})
        ```


8. Life cycle is:
  - Component
    ```javascript
      constructor()
      $declare()
      $onInit()
      $beforeMount()
      $afterMount()
      $hasRender()
      $onDestory()
      $watchState(oldData, newData)
    ```

  - Controller
    ```javascript
      constructor()
      $declare()
      $onInit()
      $beforeMount()
      $afterMount()
      $hasRender()
      $onDestory()
      $watchState(oldData, newData)
    ```

  - Router
    ```javascript
    $routeChange(oldPath, newPath)
    ```

## Architecture
route => controller => component

## To do
- [x] 公共类提取
- [ ] 子路由(1/2)
- [x] 组件中使用组件
- [x] 改用 history的pushState
- [x] 监听路由变化动态渲染(2/2)
- [x] 数据劫持
- [x] 双向绑定模板
- [x] Template Syntax: es-text es-html es-model es-class es-repeat es-if(6/6)
- [x] 组件props
- [x] 组件渲染
- [X] 组件化(3/3)
- [x] 模块化
- [X] 双向绑定
- [ ] Virtual DOM
- [ ] ts（强类型赛高）
