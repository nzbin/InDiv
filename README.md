# router.js
a simple and naive front-end router and DOM render 一个图样、图乃义务的前端路由和DOM渲染

## log
1. 2018-04-28 init program
  - add route and Life cycle
2. 2018-04-29 add watcher
  - add new life cycle: `$watchState` and `$beforeInit`
  - add new class: `Controller`
  - add watcher for state in `Controller` and `Component`
3. 2018-04-30 separate `Controller` and `Component`
  - add new class: `Component`
  - add new life cycle: `$renderComponent` in class `Controller`

## Basic Usage

1. Create a root DOM for route which id is root:
```html
<div id="root"></div>
```

2. Create a router:
``` javascript
const router = new Router();
```

3. Create a Component:
  -
```javascript
class pComponent extends Component {
  constructor() {
    super();
    this.declareTemplate = '<p rtClick="this.componentClick()">被替换的组件</p>';
    this.state = {a: 1};
  }
  componentClick() {
    this.setState({a: 2});
    alert('点击了组件');
  }
}
```

4. Create a controller for path:
  - must extends`class Controller`
  - must declare template in `this.declareTemplate : String`
  - must declare components in `this.declareComponents : Object`
  - if u want to rerender Component, plz use `this.$renderComponent();`
``` javascript
class R1 extends Controller {
  constructor() {
    super();
    this.declareTemplate = '<p rtClick="this.showAlert()">点我！！！！！啊哈哈</p>';
    this.declareComponents = {
      pComponent: new pComponent(),
    };
    this.state = {a: 1};
    // this.$renderComponent(); if u want to rerender
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
    this.setState({a: 2});
    this.setState(() => {a: 2});
    alert('草拟吗1');
  }
}
```

5. Create an array for routes, and init a router:
```javascript
const routes = [
  {
    path: 'R1',
    controller: R1,
  },
  {
    path: 'R2',
    controller: R2,
  },
];
router.init(routes);
```
6. Data monitor: this.state && this.setState
- use `this.state: Object` and `this.setState(parmars: Function || Object)`
- if u have some variable, u can set `this.state` in `constructor(){}`
- if u want to change State, plz use `this.setState`, parmars can be `Object` or `Function` which must return an `Object`
- and u can recive this change in life cycle `$watchState(oldData, newData)`


7. Life cycle is:
```javascript
constructor
$beforeInit // don't use this ,because it's prepare for watch state
$renderComponent // don't use this ,because it's prepare for render Component
$onInit
$beforeMount
$afterMount
$onDestory
$watchState
```

## Architecture
route => controller => component

## To do
- [x] 公共类提取
- [x] 路由变化渲染dom
- [x] 数据监听
- [ ] 双向绑定html模板
- [x] 组件渲染
- [ ] 组件化(1/3)
- [ ] 模块化
- [ ] 改用 history 模块的 pushState 方法去触发 url 更新
- [ ] 双向绑定
- [ ] 动态渲染DOM
- [ ] ts实现 （强类型赛高）
