# router.js
a simple and naive front-end router and DOM render 一个图样、图乃义务的前端路由和DOM渲染

## Basic Usage

Create a root DOM for route which id is root:
```html
<div id="root"></div>
```

Create a router:
``` javascript
const router = new Router();
```

Create a controller for path:
``` javascript
class R1 {
  constructor() {
    console.log('init1');
    this.template = '<p rtClick="this.showAlert1()">点我！！！！！</p>';
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
  showAlert1() {
    alert('草拟吗1')
  }
}
```

Create an array for routes, and init a router:
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

Life cycle is:
```javascript
constructor
$onInit
$beforeMount
$afterMount
$onDestory
```

## To do
双向绑定 数据监听 动态渲染DOM
