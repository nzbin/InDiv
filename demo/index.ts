import { Easiest, Component, Router, Utils, EsModule, Service, Injectable } from '../src';
// import { Easiest, Component, Router, Utils, EsModule, Service, Injectable } from '../build';

class HeroSearchService1 extends Service {
  public static isSingletonMode: boolean = true;
  constructor() {
    super();
    console.log('fuck ts HeroSearchService1 is comming');
  }

  public test() {
    console.log('HeroSearchService !!!1111');
  }
}

class HeroSearchService2 extends Service {
  constructor() {
    super();
  }

  public test(): void {
    console.log('HeroSearchService !!!2222');
  }
}

@Injectable
class HeroSearchService extends Service {
  public hsr: HeroSearchService1;
  constructor(
    private hsrS: HeroSearchService1,
  ) {
    super();
    this.hsr = hsrS;
    this.hsr.test();
  }

  public test() {
    console.log('HeroSearchService !!!000000000');
  }
}

class RouteChild extends Component {
  public heroSearchService: HeroSearchService2;
  constructor(
    private heroSearchService2: HeroSearchService2,
  ) {
    super();
    this.heroSearchService = heroSearchService2;
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

  public $bootstrap() {
    this.$template = (`
      <div>
        <p>子路由的子组件::{{this.props.a}}</p>
        <pp-childs ax={this.props.a}></pp-childs>
      </div>
    `);
  }

  public $hasRender() {
    console.log('RouteChild: this.props.a', this.props.a);
  }
}
class PCChild extends Component<any, any> {
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

  public $bootstrap() {
    this.$template = (`
      <div>
      子组件的子组件<br/>
        <p es-on:click="this.props.b(3)">PCChild props.ax:: {{this.props.ax}}</p>
        <p es-repeat="let a in this.state.d">1232{{a.z}}</p>
      </div>
    `);
  }

  public $hasRender() {
    console.log('PCChild: this.props.ax', this.props.ax);
  }
}

class PComponent extends Component {
  private a: number;

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

  public $bootstrap() {
    this.$template = (`
      <div>
        $globalContext in Component: <span>{{this.$globalContext.a}}</span>
        <p es-if="this.state.e" es-class="this.state.a" es-repeat="let a in this.state.d"  es-on:click="this.componentClick($event, this.state.b, '111', 1, false, true, a, this.aaa)">你好： {{a.z}}</p>
        state.d: <input es-repeat="let a in this.state.d" es-model="a.z" />
        <p es-on:click="this.sendProps(5)">props from component.state.a: {{this.props.ax}}</p>
      </div>
    `);
  }

  public $onInit() {
    console.log('props11', this.props);
  }
  public componentClick(e: Event) {
    alert('点击了组件');
    console.log('this.props.ax', this.props.ax);
    this.$setState({ b: 2 });
    // this.$setProps({ ax: 5 });
    this.props.b(3);
    this.a = 1;
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
  public $watchState(oldData: string, newData: string) {
    console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
}

@Injectable
class R1 extends Component {
  public hSr: HeroSearchService;

  constructor(
    private heroSearchService: HeroSearchService,
  ) {
    super();
    this.hSr = heroSearchService;
    this.hSr.test();
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

  public $bootstrap() {
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

  public $onInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    console.log('is $this.$globalContext', this.$globalContext);
  }
  public $beforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is $beforeMount');
  }
  public $afterMount() {
    // console.log('is $afterMount');
  }
  public $routeChange(lastRoute: string, newRoute: string) {
    console.log('R1 is $routeChange', lastRoute, newRoute);
  }
  public $watchState(oldData: any, newData: any) {
    console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  public showAlert(a: any) {
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
  public getProps(a: any) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.$setState({ a: a });
  }
}

class R2 extends Component {
  public heroSearchService1: HeroSearchService1;

  constructor(
    heroSearchService1: HeroSearchService1,
    heroSearchService: HeroSearchService,
  ) {
    super();
    this.state = { a: 1 };
    this.heroSearchService1 = heroSearchService1;
    this.heroSearchService1.test();
  }
  public $bootstrap() {
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
  public $onInit() {
    console.log('this.$vm', this.$vm);
    console.log('this.$globalContext R2', this.$globalContext);
    console.log('this.$location222', this.$location.state());
    // console.log('is $onInit');
  }
  public $beforeMount() {
    // console.log('is $beforeMount');
  }
  public $afterMount() {
    // console.log('is $afterMount');
  }
  public $hasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  public $routeChange(lastRoute: string, newRoute: string) {
    console.log('R2 is $routeChange', lastRoute, newRoute);
  }
  public $watchState(oldData: any, newData: any) {
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
    this.$location.go('/R1/C1/D1', { b: '1' });
    console.log('this.$location', this.$location.state());
  }
}

@Injectable
class Container extends Component {
  public ss: HeroSearchService;
  constructor(
    private hss: HeroSearchService,
  ) {
    super();
    this.ss = hss;
    this.ss.test();
    this.state = {
      a: 1,
      testArray: [
        {
          name: '李龙吉',
          sex: '男',
          job: [ '程序员1', '码农1', '帅1' ],
        },
        // {
        //   name: '邱宝环',
        //   sex: '女',
        //   job: [ '程序员2', '码农2', '帅2' ],
        // },
        // {
        //   name: '胡文',
        //   sex: '男',
        //   job: [ '程序员3', '码农3', '帅3' ],
        // },
      ],
      testArray2: [ '程序员3', '码农3', '帅3' ],
    };
  }

  public $bootstrap() {
    //  <input es-repeat="let a in man.job" es-model="a" />
    // <div es-repeat="let a in man.job" es-class="man.name">{{a}}</div>
    this.$template = (`
      <div>
        <p es-on:click="this.go()">container: {{this.state.a}}</p>
        <input es-model="this.state.a" />
        <div es-repeat="let man in this.state.testArray">
          <div es-on:click="this.show(man)">姓名：{{man.name}}</div>
          <div>性别：{{man.sex}}</div>
          <input es-model="this.state.a" es-on:click="this.show(this.state.a)" es-repeat="let b in this.state.testArray2" es-class="b" />
        </div>
        <router-render></router-render>
      </div>
    `);
  }

  public $afterMount() {
    // this.$location.go('/R1', { b: '1' });
  }

  public go() {
    this.$location.go('/R1', { b: '1' });
  }
  public show(a: any) {
    console.log('aaaa', a);
  }
}

class M2 extends EsModule {
  constructor() {
    super();
  }

  public $declarations(): void {
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

  public $declarations() {
    this.$imports = [
      M2,
    ];
    this.$components = {
      'container-wrap': Container,
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
  console.log('$routeChange', old, next);
};

const easiest = new Easiest();
easiest.$bootstrapModule(M1);
easiest.$use(router);
easiest.$init();
