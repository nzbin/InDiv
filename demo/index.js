import { Easiest, Component, Router, Utils, EsModule, Service, esHttp } from '../build';

class HeroSearchService1 {
  constructor() {
    console.log('js HeroSearchService1 is comming');
  }

  test() {
    console.log('HeroSearchService !!!1111');
  }
}
Service({
  isSingletonMode: true,
})(HeroSearchService1);


class HeroSearchService2 {
  test() {
    console.log('HeroSearchService !!!2222');
  }
}
Service({
  isSingletonMode: false,
})(HeroSearchService2);

class HeroSearchService {
  constructor(
    heroSearchService1,
  ) {
    console.log('测试 js 依赖注入', heroSearchService1);
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

class RouteChild {
  constructor(heroSearchService2) {
    this.heroSearchService = heroSearchService2;
    this.heroSearchService.test();
  }

  esHasRender() {
    console.log('RouteChild: this.props.a', this.props.a);
  }
}
Component({
  state: {
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
  },
  template: (`
    <div>
    子组件的子组件<br/>
      <p es-on:click="this.props.b(3)">PCChild props.a:: {{this.props.a}}</p>
      <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
    </div>
  `),
})(RouteChild);

class PCChild {
  esHasRender() {
    console.log('PCChild: this.props.ax', this.props.ax);
  }
}
Component({
  state: {
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
  },
  template: (`
    <div>
    子组件的子组件<br/>
      <p es-on:click="this.props.b(3)">PCChild props.ax:: {{this.props.ax}}</p>
      <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
    </div>
  `),
})(PCChild);

class PComponent {
  esOnInit() {
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
  esWatchState(oldData, newData) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

Component({
  state: {
    a: 'a子组件',
    b: 100,
    c: '<p>1111</p>',
    d: [{
      z: 111111111111111,
      b: 'a',
    }, {
      z: 33333333333333,
      b: 'a',
    }],
    e: true,
  },
  template: (`
    <div>
      <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick(this.state.d)">你好： {{a.z}}</p>
      state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
      <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
    </div>
  `),
})(PComponent);


class R1 {
  constructor(heroSearchService) {
    this.heroSearchService = heroSearchService;
    this.heroSearchService.test();
    this.utils = new Utils();
  }

  esOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
  }
  esBeforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is esBeforeMount');
  }
  esAfterMount() {
    // console.log('is esAfterMount');
  }
  esRouteChange(lastRoute, newRoute) {
    console.log('R1 is esRouteChange', lastRoute, newRoute);
  }
  esWatchState(oldData, newData) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  showAlert(a) {
    this.$setLocation('/R1/C1', { a: '1' });
    console.log('this.$location', this.$getLocation());
  }
  getProps(a) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.$setState({ a: a });
  }
}

Component({
  template: (`
    <div>
      <pc-component ax="{this.state.a}" b="{this.getProps}"></pc-component>
      下面跟组件没关系<br/>
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
    `),
  state: {
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
  },
})(R1);


class R2 {
  constructor(
    heroSearchService1,
    heroSearchService,
  ) {
    this.heroSearchService1 = heroSearchService1;
    this.heroSearchService1.test();
  }
  esOnInit() {
    console.log('this.$location222', this.$getLocation());
  }
  esBeforeMount() {
    // console.log('is esBeforeMount');
  }
  esAfterMount() {
    // console.log('is esAfterMount');
  }
  esHasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  esRouteChange(lastRoute, newRoute) {
    console.log('R2 is esRouteChange', lastRoute, newRoute);
  }
  esWatchState(oldData, newData) {
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
    this.$setLocation('/R1/C1/D1', { b: '1' });
    // this.$location.go('/R1/C1/D1', { b: '1' });
    // this.$location.go('/R1/C1/D1', { b: '1' });
    // console.log('this.$location', this.$location.state());
  }
}
Component({
  template: (`
    <div>
      <p es-on:click="this.showLocation()">点击显示子路由跳转</p>
      <input es-model="this.state.a"/>
      <br/>
      <p es-on:click="this.showAlert()">点击显示this.state.a:{{this.state.a}}</p>
      子组件:<br/>
      <route-child a="{this.state.a}"></route-child>
    </div>
  `),
  state: { a: 1 },
})(R2);


class Container {
  constructor(
    heroSearchService,
    heroSearchService1,
  ) {
    this.ss = heroSearchService;
    this.ss.test();
    console.log('heroSearchService1', heroSearchService1);
    console.log('esHttp', esHttp);
  }
  esOnInit() {
    console.log('esOnInit Container');
  }

  esAfterMount() {
  }

  go() {
    this.$setLocation('/R1', { b: '1' });
  }

  show(a, index) {
    console.log('aaaa', a);
    console.log('index', index);
  }
}

Component({
  template: (`
    <div>
      <p es-on:click="this.go()">container: {{this.state.a}}</p>
      <input es-model="this.state.a" />
      <div es-repeat="let man in this.state.testArray">
        <div es-on:click="this.show(this.state.testArray2)">姓名：{{man.name}}</div>
        <div>性别：{{man.sex}}</div>
        <input es-on:click="this.show(b, $index)" es-repeat="let b in this.state.testArray2" es-model="b" es-class="b" />
        <div class="fuck" es-repeat="let b in man.job">
          <input es-on:click="this.show(b)" es-model="b.name" es-class="b.id" />
        </div>
      </div>
      <router-render></router-render>
    </div>`),
  state: {
    a: 1,
    testArray: [{
      name: '李龙吉',
      sex: '男',
      job: [{
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
      // job: ['老师', '英语老师', '美1'],
      job: [{
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
    },
    ],
    testArray2: ['程序员3', '码农3', '帅3'],
  },
})(Container);

class M2 {}
EsModule({
  components: {
    'R2': R2,
    'route-child': RouteChild,
    'pp-childs': PCChild,
  },
  providers: [
    HeroSearchService2,
  ],
  exports: [
    'R2',
    'route-child',
  ],
})(M2);

class M1 {}
EsModule({
  imports: [
    M2,
  ],
  components: {
    'container-wrap': Container,
    'pc-component': PComponent,
    'R1': R1,
  },
  providers: [
    HeroSearchService,
    HeroSearchService1,
  ],
})(M1);

const router = new Router();

const routes = [
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
router.$setRootPath('/demo');
// router.$setRootPath('/');
router.$init(routes);
router.esRouteChange = function (old, next) {
  console.log('esRouteChange 3', old, next);
};

const easiest = new Easiest();
// easiest.$bootstrapModule(M1);
easiest.$bootstrapModule(M1);
easiest.$use(router);
easiest.$init();
