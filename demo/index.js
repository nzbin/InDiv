import { Easiest, Component, Controller, Router, RouterHash, Utils } from '../src';

class RouteChild extends Component {
  constructor(name, props) {
    super(name, props);
    this.state = {
      a: 'a',
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
    };
  }

  $declare() {
    this.$template = (`
      <div>
        子路由的子组件<br/>
        <p es-on:click="this.props.b(3)">props.ax {{this.props.ax}}</p>
        <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
      </div>
    `);
  }
}
class PCChild extends Component {
  constructor(name, props) {
    super(name, props);
    this.state = {
      a: 'a',
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
    };
  }

  $declare() {
    this.$template = (`
      <div>
        <p es-on:click="this.props.b(3)">props.ax {{this.props.ax}}</p>
        子组件的子组件<br/>
        <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
      </div>
    `);
  }
}

class PComponent extends Component {
  constructor(name, props) {
    super(name, props);
    this.state = {
      a: 'a子组件',
      b: 100,
      c: '<p>1111</p>',
      d: [
        {
          z: 111111111111111,
          b: 'a',
        },
        {
          z: 33333333333333,
          b: 'a',
        },
      ],
      e: true,
    };
  }

  $declare() {
    this.$template = (`
      <div>
        <pComponent1></pComponent1>
        <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick($event, this.state.b, '111', 1, false, true, a, this.aaa)">你好： {{a.z}}</p>
        state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
        <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
      </div>
    `);
    this.$components = {
      pComponent1: new PCChild('pComponent1', {
        ax: this.props.ax,
        b: this.getProps.bind(this),
      }),
    };
  }

  $onInit() {
    console.log('props', this.props);
  }
  componentClick(e) {
    alert('点击了组件');
    this.setState({ b: 2 });
    this.setProps({ ax: 5 });
    this.props.b(3);
  }
  sendProps(ax) {
    this.setProps({ ax: ax });
    this.props.b(ax);
  }
  getProps(a) {
    alert('子组件里 里面传出来了');
    // this.setState({ a: a });
    this.setProps({ ax: a });
    this.props.b(a);
  }
  $watchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

class R1 extends Controller {
  constructor() {
    super();
    this.utils = new Utils();
    this.state = {
      a: 'a11',
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
      <pComponent1></pComponent1>
      下面跟组件没关系<br/>
      <div es-if="this.state.f">
        <input es-repeat="let a in this.state.e" es-model="a.z" />
        <p es-class="this.state.c" es-if="a.show" es-repeat="let a in this.state.e" es-text="a.z" es-on:click="this.showAlert(a.z)"></p>
        this.state.a：<br/>
        <input es-model="this.state.a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `);
    this.$components = {
      pComponent1: new PComponent('pComponent1', {
        ax: this.state.a,
        b: this.getProps.bind(this), // action in this
      }),
    };
  }
  $onInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    // console.log('is $onInit');
  }
  $beforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $onDestory() {
    // console.log('is $onDestory');
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert(a) {
    this.$location.go('/R1/C1', { a: '1' });
    console.log('this.$location', this.$location.state());

    // console.log('location2', history.length);
    // history.go(1);
    // alert('我错了 点下控制台看看吧');
    // console.log('aa', a);
    // console.log('!this.state.f', !this.state.f);
    // this.setState({
    // a: 'a2323',
    // b: 100,
    // f: !this.state.f,
    // });
    // console.log('state', this.state.f);
  }
  getProps(a) {
    alert('里面传出来了');
    this.setState({ a: a });
  }
}

class R2 extends Controller {
  constructor() {
    super();
    this.state = { a: 1 };
  }
  $declare() {
    this.$template = (`
      <div>
      <p es-on:click="this.showLocation()">点击显示子路由跳转</p>
        <input es-model="this.state.a"/>
        <br/>
        <p es-on:click="this.showAlert()">点击显示this.state.a:</p>
        子组件:<br/>
        <pComponent1></pComponent1>
        <router-render></router-render>    
      </div>
    `);
    this.$components = {
      pComponent1: new RouteChild('pComponent1', {
        ax: this.state.a,
        b: this.bindChange.bind(this),
      }),
    };
  }
  $onInit() {
    // console.log('is $onInit');
  }
  $beforeMount() {
    // console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $onDestory() {
    // console.log('is $onDestory');
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.setState(() => ({ a: 2 }));
  }
  bindChange(a) {
    console.log('aaa', a);
  }
  showLocation() {
    this.$location.go('/R1/C1/D1', { b: '1' });
    console.log('this.$location', this.$location.state());
  }
}

// const router = new Router();
const router = new RouterHash();
// const routes = [
//   {
//     path: '/R1',
//     controller: R1,
//   },
//   {
//     path: '/R2',
//     controller: R2,
//   },
//   {
//     path: '/R2/R3',
//     controller: R1,
//   },
//   {
//     path: '/R1/R4',
//     controller: R2,
//   },
// ];
const routes = [
  {
    path: '/',
    redirectTo: '/R1',
  },
  {
    path: '/R1',
    controller: R1,
    children: [
      {
        path: '/C1',
        controller: R2,
        children: [
          {
            path: '/D1',
            redirectTo: '/R2',
          },
        ],
      },
    ],
  },
  {
    path: '/R2',
    controller: R2,
  },
];
router.init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange', old, next);
};

const easiest = new Easiest();
const routerIndex = easiest.use(router);
console.log('routerIndex', routerIndex);
