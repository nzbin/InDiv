# router.js
a simple and naive front-end router and DOM render 一个图样、图乃义务的前端路由和DOM渲染

## log
1. 2018-04-28 init program
  - add route and Life cycle
2. 2018-04-29 add watcher
  - add new life cycle: `$watchState` and `$beforeInit`
  - add new class: `Controller` and `Component`
  - add watcher for state in `Controller` and `Component`

## Basic Usage

1. Create a root DOM for route which id is root:
```html
<div id="root"></div>
```

2. Create a router:
``` javascript
const router = new Router();
```

3. Create a controller for path:
  - must extends`class Controller`
  - if u have some variable, u can set `this.state` in `constructor(){}`
  - and u can recive this change in life cycle
``` javascript
class R1 extends Controller {
  constructor() {
    super();
    this.template = '<p rtClick="this.showAlert()">点我！！！！！啊哈哈</p>';
    this.console = document.getElementById('console');
    this.state = {a: 1};
  }
  $onInit() {
    this.console.innerText = 'is $onInit';
    console.log('is $onInit');
  }
  $beforeMount() {
    this.console.innerText = 'is $beforeMount';
    console.log('is $beforeMount');
  }
  $afterMount() {
    this.console.innerText = 'is $afterMount';
    console.log('is $afterMount');
  }
  $onDestory() {
    this.console.innerText = 'is $onDestory';
    console.log('is $onDestory');
  }
  $watchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
  showAlert() {
    this.setState('a',2);
    alert('草拟吗1');
  }
}
```

4. Create an array for routes, and init a router:
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

5. Life cycle is:
```javascript
constructor
$beforeInit // don't use this ,because it's prepare for watch state
$onInit
$beforeMount
$afterMount
$onDestory
$watchState
```

## To do
1. 改用 history 模块的 pushState 方法去触发 url 更新
2. 双向绑定
3. 数据监听
4. 动态渲染DOM
