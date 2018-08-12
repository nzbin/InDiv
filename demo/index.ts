import { Easiest, Component, Router, Utils, EsModule, Service, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, esHttp } from '../src';
// import { Easiest, Component, Router, Utils, EsModule, Service, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, esHttp } from '../build';

@Service({
  isSingletonMode: true,
})
class HeroSearchService1 {
  constructor() {}

  public test() {
    console.log('HeroSearchService !!!1111');
  }
}

@Service()
class HeroSearchService2 {
  constructor() {}

  public test(): void {
    console.log('HeroSearchService !!!2222');
  }
}

@Injectable
@Service()
class HeroSearchService {
  public hsr: HeroSearchService1;
  constructor(
    private heroSearchService1: HeroSearchService1,
  ) {
    console.log('测试 ts 依赖注入', this.heroSearchService1);
    this.heroSearchService1.test();
  }

  public test() {
    console.log('HeroSearchService !!!000000000');
  }
}

// @Injectable
@Component({
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
      <p>子路由的子组件::{{this.props.a}}</p>
      <pp-childs ax={this.props.a}></pp-childs>
    </div>
  `),
})

class RouteChild implements HasRender {
  public heroSearchService: HeroSearchService2;
  public props: any;
  constructor(
    private heroSearchService2: HeroSearchService2,
  ) {
    console.log('fuck this.heroSearchService2', this.heroSearchService2);
    this.heroSearchService2.test();
  }

  public esHasRender() {
    console.log('RouteChild hasRender: this.props.a', this.props.a);
  }
}

@Component({
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
})
class PCChild implements HasRender {
  public props: any;
  constructor() {}

  public esHasRender() {
    console.log('PCChild hasRender : this.props.ax', this.props.ax);
  }
}


@Injectable
@Component({
  state: {
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
  },
  template: (`
    <div>
      <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick(this.state.d)">你好： {{a.z}}</p>
      state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
      <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
    </div>
  `),
})
class PComponent implements OnInit, WatchState {
  public $setState: (newState: any) => void;
  public $setProps: (newState: any) => void;
  public props: any;
  private a: number;

  constructor() {}

  public esOnInit() {
    console.log('props11', this.props);
  }
  public componentClick(a: any) {
    // alert('点击了组件');
    // console.log('this.props.ax', this.props.ax);
    // this.$setState({ b: 2 });
    // // this.$setProps({ ax: 5 });
    // this.props.b(3);
    // this.a = 1;
    console.log('aa', a);
  }
  public sendProps(ax: any) {
    this.$setProps({ ax: ax });
    this.props.b(ax);
    console.log('this', this);
  }
  public getProps(a: any) {
    alert('子组件里 里面传出来了');
    this.$setState({ a: a });
    this.$setProps({ ax: a });
    this.props.b(a);
  }
  public esWatchState(oldData: string, newData: string) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

@Injectable
@Component({
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
})
class R1 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange {
  public hSr: HeroSearchService;
  public utils: Utils;
  public $getLocation: () => any;
  public $setLocation: (path: string, query?: any, params?: any) => void;
  public $setState: (newState: any) => void;
  public props: any;

  constructor(
    private heroSearchService: HeroSearchService,
  ) {
    this.heroSearchService.test();
  }

  public esOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
  }
  public esBeforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is esBeforeMount');
  }
  public esAfterMount() {
    // console.log('is esAfterMount');
  }
  public esRouteChange(lastRoute: string, newRoute: string) {
    console.log('R1 is esRouteChange', lastRoute, newRoute);
  }
  public esWatchState(oldData: any, newData: any) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  public showAlert(a: any) {
    this.$setLocation('/R1/C1', { a: '1' });
    console.log('this.$location', this.$getLocation());
  }
  public getProps(a: any) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.$setState({ a: a });
  }
}

@Injectable
@Component({
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
})
class R2 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange {
  public $getLocation: () => any;
  public $setLocation: (path: string, query?: any, params?: any) => void;
  public state: any;

  constructor(
    public heroSearchService1: HeroSearchService1,
  ) {
    this.heroSearchService1.test();
    console.log('this.heroSearchService1', this.heroSearchService1);
  }
  public esOnInit() {
    console.log('this.$getLocation', this.$getLocation());
  }
  public esBeforeMount() {
    // console.log('is esBeforeMount');
  }
  public esAfterMount() {
    // console.log('is esAfterMount');
  }
  public esHasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  public esRouteChange(lastRoute: string, newRoute: string) {
    console.log('R2 is esRouteChange', lastRoute, newRoute);
  }
  public esWatchState(oldData: any, newData: any) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  public showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.$setState(() => ({ a: 2 }));
  }
  public bindChange(a: any) {
    console.log('aaa', a);
  }
  public showLocation() {
    this.$setLocation('/R1/C1/D1', { b: '1' });
  }
}


@Injectable
@Component({
  template: (`
    <div>
      <p es-on:click="this.go()">container: {{this.state.a}}</p>
      <input es-model="this.state.a" />
      <div es-repeat="let man in this.state.testArray">
        <div es-on:click="this.show(this.state.testArray2)">姓名：{{man.name}}</div>
        <div>性别：{{man.sex}}</div>
        <input es-on:click="this.show(b, $index)" es-repeat="let b in this.state.testArray2" es-model="b" es-class="b" />
        <div class="fuck" es-repeat="let b in man.job">
          <input es-on:click="this.show(b.name)" es-model="b.name" es-class="b.id" />
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
        // job: ['老师', '英语老师', '美1'],
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
})

class Container implements OnInit, AfterMount {
  public ss: HeroSearchService;
  public ss2: HeroSearchService1;
  public state: any;
  public $setLocation: (path: string, query?: any, params?: any) => void;

  constructor(
    private hss: HeroSearchService,
    private hss2: HeroSearchService1,
  ) {
    this.hss.test();
    // console.log(this.state);
    console.log('esHttp', esHttp);
    // console.log('hss', this.hss);
    // console.log('hss2', this.hss2);
  }

  public esOnInit() {
    console.log('esOnInit Container');
  }

  public esAfterMount() {
    console.log('esAfterMount Container');
  }

  public go() {
    this.$setLocation('/R1', { b: '1' });
  }
  public show(a: any, index?: string) {
    console.log('aaaa', a);
    console.log('$index', index);
  }
}

@EsModule({
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
})
class M2 {}

@EsModule({
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
})
class M1 {}

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
router.$routeChange = function (old: string, next: string) {
  console.log('esRouteChange', old, next);
};

const easiest = new Easiest();
easiest.$bootstrapModule(M1);
easiest.$use(router);
easiest.$init();
