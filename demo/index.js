import { Easiest, Component, Router, RouterHash, Utils, EsModule, Service, Http } from '../src';
// import { Easiest, Component, Router, RouterHash, Utils, EsModule, Service } from '../build';

class HeroSearchService extends Service {
  constructor() {
    super();
  }

  test() {
    console.log('HeroSearchService !!!000000000');
  }
}
class HeroSearchService2 extends Service {
  constructor() {
    super();
  }

  test() {
    console.log('HeroSearchService !!!2222');
  }
}
class HeroSearchService1 extends Service {
  constructor() {
    super();
  }

  test() {
    console.log('HeroSearchService !!!1111');
  }
}

class RouteChild extends Component {
  constructor(HeroSearchService2) {
    super();
    this.heroSearchService = HeroSearchService2;
    this.heroSearchService.test();
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

  $bootstrap() {
    this.$template = (`
      <div>
        <p>子路由的子组件::{{this.props.a}}</p>
        <pp-childs ax={this.props.a}></pp-childs>
      </div>
    `);
  }

  $hasRender() {
    console.log('RouteChild: this.props.a', this.props.a);
  }
}
class PCChild extends Component {
  constructor() {
    super();
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

  $bootstrap() {
    this.$template = (`
      <div>
      子组件的子组件<br/>
        <p es-on:click="this.props.b(3)">PCChild props.ax:: {{this.props.ax}}</p>
        <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
      </div>
    `);
  }

  $hasRender() {
    console.log('PCChild: this.props.ax', this.props.ax);
  }
}

class PComponent extends Component {
  constructor() {
    super();
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

  $bootstrap() {
    this.$template = (`
      <div>
        $globalContext in Component: <span>{{this.$globalContext.a}}</span>
        <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick($event, this.state.b, '111', 1, false, true, a, this.aaa)">你好： {{a.z}}</p>
        state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
        <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
      </div>
    `);
  }

  $onInit() {
    console.log('props11', this.props);
  }
  componentClick(e) {
    alert('点击了组件');
    console.log('this.props.ax', this.props.ax);
    this.$setState({ b: 2 });
    // this.$setProps({ ax: 5 });
    this.props.b(3);
    this.a = 1;
  }
  sendProps(ax) {
    this.$setProps({ ax: ax });
    this.props.b(ax);
    console.log('this', this);
  }
  getProps(a) {
    alert('子组件里 里面传出来了');
    this.$setState({ a: a });
    this.$setProps({ ax: a });
    this.props.b(a);
  }
  $watchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

class R1 extends Component {
  constructor(HeroSearchService) {
    super();
    this.heroSearchService = HeroSearchService;
    this.heroSearchService.test();
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

  $bootstrap() {
    this.$template = (`
    <div>
      <pc-component ax="{this.state.a}" b="{this.getProps}"></pc-component>
      下面跟组件没关系<br/>
      $globalContext in Component: <span>{{this.$globalContext.a}}</span>
      <div es-if="this.state.f">
        ef
        <input es-repeat="let a in this.state.e" es-model="a.z" />
        <p es-class="this.state.c" es-if="a.show" es-repeat="let a in this.state.e" es-text="a.z" es-on:click="this.showAlert(a.z)"></p>
        <p>111this.state.a：{{this.state.a}}</p>
        <input es-model="this.state.a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `);
  }

  $onInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    console.log('is $this.$globalContext', this.$globalContext);
  }
  $beforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $routeChange(lastRoute, newRoute) {
    console.log('R1 is $routeChange', lastRoute, newRoute);
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert(a) {
    console.log('this.$globalContext R1', this.$globalContext);
    this.$setGlobalContext({ a: 3 });
    console.log('this.$globalContext R12', this.$globalContext);
    this.$location.go('/R1/C1', { a: '1' });
    console.log('this.$location', this.$location.state());

    // console.log('location2', history.length);
    // history.go(1);
    // alert('我错了 点下控制台看看吧');
    // console.log('aa', a);
    // console.log('!this.state.f', !this.state.f);
    // this.$setState({
    //   a: 'a2323',
    //   b: 100,
    //   f: !this.state.f,
    // });
    // console.log('state', this.state.f);
  }
  getProps(a) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.$setState({ a: a });
  }
}

class R2 extends Component {
  constructor(
    HeroSearchService1,
    HeroSearchService,
  ) {
    super();
    this.state = { a: 1 };
    this.heroSearchService1 = HeroSearchService1;
    this.heroSearchService1.test();
  }
  $bootstrap() {
    this.$template = (`
      <div>
      <p es-on:click="this.showLocation()">点击显示子路由跳转</p>
        <input es-model="this.state.a"/>
        <br/>
        <p es-on:click="this.showAlert()">点击显示this.state.a:{{this.state.a}}</p>
        子组件:<br/>
        <route-child a="{this.state.a}"></route-child>
      </div>
    `);
  }
  $onInit() {
    console.log('this.$vm', this.$vm);
    console.log('this.$globalContext R2', this.$globalContext);
    console.log('this.$location222', this.$location.state());
    // console.log('is $onInit');
  }
  $beforeMount() {
    // console.log('is $beforeMount');
  }
  $afterMount() {
    // console.log('is $afterMount');
  }
  $hasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  $routeChange(lastRoute, newRoute) {
    console.log('R2 is $routeChange', lastRoute, newRoute);
  }
  $watchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.$setState(() => ({ a: 2 }));
  }
  bindChange(a) {
    console.log('aaa', a);
  }
  showLocation() {
    this.$location.go('/R1/C1/D1', { b: '1' });
    console.log('this.$location', this.$location.state());
  }
}

class M2 extends EsModule {
  constructor() {
    super();
  }

  $declarations() {
    this.$components = {
      'R2': R2,
      'route-child': RouteChild,
      'pp-childs': PCChild,
    };
    this.$providers = [
      HeroSearchService2,
    ];
    this.$exports = [
      'R2',
      'route-child',
    ];
    // this.$bootstrap = R2;
  }
}

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
      'R1': R1,
    };
    this.$providers = [
      HeroSearchService,
      HeroSearchService1,
    ];
    // this.$bootstrap = R1;
  }
}

const router = new Router();
// const router = new RouterHash();
const routes = [
  {
    path: '/',
    redirectTo: '/R1',
  },
  {
    path: '/R1',
    component: 'R1',
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
];
router.$setRootPath('/demo');
// router.$setRootPath('/');
router.$init(routes);
router.$routeChange = function (old, next) {
  console.log('$routeChange', old, next);
};

const easiest = new Easiest();
easiest.$bootstrapModule(M1);
easiest.$use(router);
easiest.$init();
