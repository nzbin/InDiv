import { InDiv, Component, Router, Utils, NvModule, Injected, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, ReceiveProps, NVHttp, SetState, SetLocation, GetLocation, OnDestory, setState,  setLocation, getLocation } from '../src';
// import { InDiv, Component, Router, Utils, NvModule, Injected, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, ReceiveProps, NVHttp, SetState, SetLocation, GetLocation, OnDestory } from '../build';

@Injectable()
class HeroSearchService1 {
  constructor() {}

  public test() {
    console.log('HeroSearchService !!!1111');
  }
}

@Injectable()
class HeroSearchService2 {
  constructor() {}

  public test(): void {
    console.log('HeroSearchService !!!2222');
  }
}

@Injected
@Injectable()
class HeroSearchService {
  public hsr: HeroSearchService1;
  constructor(
    private heroSearchService1: HeroSearchService1,
  ) {
    console.log('检查 是否相等', heroSearchService1 === this.heroSearchService1);
    console.log('测试 ts 依赖注入', this.heroSearchService1);
    this.heroSearchService1.test();
  }

  public test() {
    console.log('HeroSearchService !!!000000000');
  }
}

class ValueType {}

interface Props {
  a: number;
}

@Injected
@Component({
  selector: 'route-child',
  template: (`
    <div>
      <p>子路由的子组件::{{$.b}}</p>
      <pp-childs ax={$.b}></pp-childs>
    </div>
  `),
})

class RouteChild implements OnInit, HasRender, ReceiveProps, OnDestory {
  public setState: SetState;
  public state: any;
  public heroSearchService: HeroSearchService2;
  public props: Readonly<Props>;
  constructor(
    private heroSearchService2: HeroSearchService2,
  ) {
    console.log('fuck this.heroSearchService2', this.heroSearchService2);
    this.heroSearchService2.test();
    this.state = {
      a: 'a',
      b: null,
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
    this.setState = setState;
  }

  public nvOnInit() {
    // this.setState({
    //   b: this.props.a,
    // });
    // this.setState({
    //   c: this.props.ax,
    // });
    this.state.b = this.props.a;
    console.log(555, 'PCChild nvOnInit props11', this.props);
    // this.props.b(3);
  }

  public nvHasRender() {
    console.log('RouteChild hasRender: this.props.a', this.props.a);
  }

  public nvReceiveProps(nextProps: any) {
    console.log(3333, nextProps);
    this.state.b = nextProps.a;
    // this.setState({
    //   b: nextProps.a,
    // });
  }

  public nvOnDestory() {
    console.log('RouteChild nvOnDestory');
  }
}

@Component({
  selector: 'pp-childs',
  template: (`
    <div>
      子组件的子组件<br/>
      <p nv-on:click="@sendProps(3)">PCChild props.ax:: {{$.b}}</p>
      <p nv-repeat="let a in $.d">state.d {{a.z}}</p>
    </div>
  `),
})
class PCChild implements OnInit, BeforeMount, AfterMount, ReceiveProps, OnDestory {
  public props: any;
  public state: any;
  public setState: SetState;
  constructor() {
    this.state = {
      a: 'a',
      b: null,
      d: [
        {
          z: 101111,
          b: 'a',
        },
        {
          z: 103333,
          b: 'a',
        },
      ],
    };
    this.setState = setState;
  }

  public nvHasRender() {
    console.log('PCChild hasRender : this.props.ax', this.props, this.state);
  }

  public nvOnInit() {
    this.setState({
      b: this.props.ax,
    });
    // this.setState({
    //   c: this.props.ax,
    // });
    console.log(555, 'PCChild nvOnInit props11', this.props);
    // this.props.b(3);
  }

  public sendProps(i: number) {
    // this.props.b(i);
    // this.props.ax = 100;
    console.log('this.props', this.props);
  }

  public nvBeforeMount() {
    console.log('PCChild nvBeforeMount props11', this.props.ax);
  }

  public nvAfterMount() {
    console.log('PCChild nvAfterMount props11', this.props.ax);
  }

  public nvOnDestory() {
    console.log('PCChild nvOnDestory');
  }

  public nvReceiveProps(nextProps: any) {
    console.log(this.props.ax);
    console.log(4444, nextProps);
    this.state.b = nextProps.ax;
    this.setState({
      b: nextProps.ax,
    });
  }
}


@Injected
@Component({
  selector: 'pc-component',
  template: (`
    <div>
      <p nv-if="$.e" nv-class="$.a" nv-repeat="let a in $.d"  nv-on:click="@componentClick($.d)">你好： {{a.z}}</p>
      state.d: <input nv-repeat="let a in $.d" nv-model="a.z" />
      <p nv-on:click="@sendProps(5)">props from component.state.a: {{$.ax}}</p>
    </div>
  `),
})
class PComponent implements OnInit, WatchState, BeforeMount, AfterMount, ReceiveProps, OnDestory {
  public setState: SetState;
  public state: any;
  public props: any;

  constructor() {
    console.log(99900000999);
    this.setState = setState;
  }

  public nvOnInit() {
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
      ax: this.props.ax,
    };
    console.log('nvOnInit props11', this.props);
  }

  public nvBeforeMount() {
    console.log('nvBeforeMount props11', this.props);
  }

  public nvAfterMount() {
    console.log('nvAfterMount props11', this.props);
  }
  public componentClick(a: any) {
    // alert('点击了组件');
    // console.log('this.props.ax', this.props.ax);
    // this.setState({ b: 2 });
    // // this.setProps({ ax: 5 });
    // this.props.b(3);
    // this.a = 1;
    console.log('aa', a);
  }
  public sendProps(ax: any) {
    this.props.b(ax);
  }
  public getProps(a: any) {
    alert('子组件里 里面传出来了');
    this.setState({ a: a });
    this.props.b(a);
  }

  public nvWatchState(oldState: string) {
    console.log('oldState Component:', oldState);
  }
  public nvReceiveProps(nextProps: any) {
    console.log(1111111111111, nextProps);
    this.state.ax = nextProps.ax;
  }
  public nvOnDestory() {
    console.log('PComponent is nvOnDestory');
  }
}

@Injected
@Component({
  selector: 'R1',
  template: (`
    <div>
      <pc-component ax="{$.a}" b="{@getProps}"></pc-component>
      下面跟组件没关系<br/>
      <div nv-if="$.f">
        ef
        <input nv-repeat="let a in $.e" nv-model="a.z" />
        <p nv-class="$.c" nv-if="a.z" nv-repeat="let a in $.e" nv-text="a.z" nv-on:click="@showAlert(a)"></p>
        <p>111this.state.a：{{$.a}}</p>
        <input nv-model="$.a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `),
})
class R1 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange, OnDestory {
  public hSr: HeroSearchService;
  public getLocation: GetLocation;
  public setLocation: SetLocation;
  public setState: SetState;
  public props: any;
  public state: any;

  constructor(
    private heroSearchService: HeroSearchService,
    private utils: Utils,
  ) {
    this.setLocation = setLocation;
    this.getLocation = getLocation;
    this.setState = setState;
    this.heroSearchService.test();
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

  public nvOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    console.log('R1 nvOnInit', this.getLocation());
  }
  public nvBeforeMount() {
    const cookie = this.utils.getCookie('tutor');
    console.log('cookie is', cookie);
    console.log('is nvBeforeMount');
  }
  public nvAfterMount() {
    // console.log('is nvAfterMount');
  }
  public nvRouteChange(lastRoute: string, newRoute: string) {
    console.log('R1 is nvRouteChange', lastRoute, newRoute);
  }

  public nvWatchState(oldState: any) {
    console.log('oldState Controller:', oldState);
  }
  public showAlert(a: any) {
    this.setLocation('/R1/C1', { a: '1' });
    console.log('this.$location', this.getLocation());
    // a.show = false;
  }
  public getProps(a: any) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.setState({ a: a });
    // this.state.a = a;
  }

  public nvOnDestory() {
    console.log(this.getLocation(), 'R1 is nvOnDestory');
  }
}

@Injected
@Component({
  selector: 'R2',
  template: (`
    <div>
      <p nv-on:click="@showLocation()">点击显示子路由跳转</p>
      <input nv-model="$.a"/>
      <br/>
      <p nv-on:click="@showAlert()">点击显示this.state.a:{{$.a}}</p>
      子组件:<br/>
      <route-child a="{$.a}"></route-child>
      <router-render></router-render>
    </div>
  `),
})
class R2 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange, OnDestory {
  public getLocation: GetLocation;
  public setLocation: SetLocation;
  public state: any;

  constructor(
    public heroSearchService1: HeroSearchService1,
  ) {
    this.setLocation = setLocation;
    this.getLocation = getLocation;
    this.heroSearchService1.test();
    console.log('this.heroSearchService1', this.heroSearchService1);
    this.state = { a: 1 };
  }
  public nvOnInit() {
    console.log('this.getLocation', this.getLocation());
  }
  public nvBeforeMount() {
    // console.log('is nvBeforeMount');
  }
  public nvAfterMount() {
    // console.log('is nvAfterMount');
  }
  public nvHasRender() {
    console.log('！！father: this.state.a', this.state.a);
  }
  public nvRouteChange(lastRoute: string, newRoute: string) {
    console.log('R2 is nvRouteChange', lastRoute, newRoute);
  }

  public nvWatchState(oldState: any) {
    console.log('oldState Controller:', oldState);
  }

  public nvOnDestory() {
    console.log(this.getLocation(), 'R2 is nvOnDestory');
  }

  public showAlert() {
    console.log('this.state.a', this.state.a);
    // alert('我错了 点下控制台看看吧');
    // this.setState(() => ({ a: 2 }));
  }
  public bindChange(a: any) {
    console.log('aaa', a);
  }
  public showLocation() {
    this.setLocation('/R1/C1/D1', { b: '1' });
    // this.setLocation('/R2/2', { b: '1' });
  }
}

@Component({
  selector: 'test-component',
  template: (`
    <div>
      <p nv-on:click="@click()">测试repeat组件: {{$.man}}</p>
    </div>`),
})
class TestComponent implements OnInit, OnDestory, ReceiveProps {
  public state: any;
  public props: any;

  public nvOnInit() {
    this.state = {
      man: this.props.man,
    };
  }

  public click() {
    console.log('this.state.man', this.state.man);
    this.state.man = 'fuck!';
  }

  public nvOnDestory() {
    console.log('TestComponent OnDestory');
  }

  public nvReceiveProps(p: any) {
    console.log('test-component nvReceiveProps', p);
  }
}

@Injected
@Component({
  selector: 'container-wrap',
  template: (`
    <div>
      <p test-directive="$.a" nv-id="@countState($.a)" nv-if="@countState($.a)" nv-on:click="@changeInput()">{{$.a}}</p>
      <test-component nv-repeat="let man in $.testArray" nv-key="man.name" man="{@countState(man.name)}" nv-if="$.a"></test-component>
      <p nv-on:click="@go()">container: {{@countState($.a)}}</p>
      <input nv-model="$.a" />
      <div nv-repeat="let man in $.testArray" nv-key="man.name">
          <div nv-on:click="@show($.testArray2, '你111')">姓名：{{man.name}}</div>
          <div>性别：{{@countState(man.sex, $index)}}</div>
          <a nv-href="@countState(man.sex, $index)">a {{man.sex}}</a>
          <img nv-src="man.sex" nv-alt="man.sex" />
          <test-component nv-key="man.name" man="{@countState(man.name)}"></test-component>
          <input nv-on:click="@show(b, $index)" nv-repeat="let b in $.testArray2" nv-on:input="@showInput($event, $index)" nv-text="b" nv-class="b" />
          <div class="fuck" nv-repeat="let c in man.job" nv-key="c.id">
            <input nv-on:click="@show(c, $index)" nv-model="c.name" nv-class="c.id" />
          </div>
      </div>
      <router-render></router-render>
    </div>
  `),
})

class Container implements OnInit, AfterMount, WatchState {
  public ss: HeroSearchService;
  public ss2: HeroSearchService1;
  public state: any;
  public props: any;
  public setLocation: SetLocation;
  public getLocation: GetLocation;
  public setState: SetState;

  constructor(
    private hss: HeroSearchService,
    private hss2: HeroSearchService1,
    private nvHttp: NVHttp,
    private value: ValueType,
  ) {
    this.setState = setState;
    this.getLocation = getLocation;
    this.setLocation = setLocation;
    this.hss.test();
    console.log('nvHttp', this.nvHttp);
    console.log('value', this.value);
    this.state = {
      a: 1,
      b: 3,
      // testArray: [],
      testArray: [
        {
          name: 'gerry',
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
          name: 'nina',
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
    };
  }

  public nvOnInit() {
    console.log('nvOnInit Container');
    console.log('R1 nvOnInit', this.getLocation());
  }

  public nvAfterMount() {
    console.log('nvAfterMount Container');
  }

  public go() {
    this.setLocation('/R1', { b: '1' });
  }
  public countState(a: any, index: number): any {
    if (!a) return 'false';
    return a;
  }
  public show(a: any, index?: string) {
    console.log('aaaa', a);
    console.log('$index', index);
    console.log('testArray2', this.state.testArray2);
  }

  public showInput(event: any, index: number) {
    console.log(1111, event.target.value);
    console.log(2222, this.state.testArray2);
    // const testArray2 = this.state.testArray2;
    // testArray2[index] = event.target.value;
    // this.setState({
    //   testArray2,
    // });
    this.state.testArray2[index] = event.target.value;
  }

  public nvWatchState(oldState: any) {
    console.log('oldState Controller:', oldState);
  }

  public changeInput() {
    // this.state.a = 4;
    this.setState({
      testArray: [
        {
          name: 'gerry',
          sex: '女',
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
          name: 'gerry2',
          sex: '男2',
          job: [
            {
              id: 1,
              name: '程序员2',
            },
            {
              id: 2,
              name: '码农2',
            },
            {
              id: 3,
              name: '帅2',
            },
          ],
        },
        {
          name: 'nina',
          sex: '男',
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
    });
  }
}

@NvModule({
  components: [
    R2,
    RouteChild,
    PCChild,
  ],
  providers: [
    HeroSearchService2,
  ],
  exports: [
    R2,
    RouteChild,
  ],
})
class M2 {}

@NvModule({
  imports: [
    M2,
  ],
  components: [
    Container,
    PComponent,
    TestComponent,
    R1,
  ],
  providers: [
    Utils,
    NVHttp,
    HeroSearchService,
    {
      provide: HeroSearchService1,
      useClass: HeroSearchService1,
    },
    {
      provide: ValueType,
      useValue: 1123,
    },
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
            // redirectTo: '/R1/C1/D1',
            children: [
              {
                path: '/D1',
                // component: 'R2',
                redirectTo: '/R2/2',
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
router.setRootPath('/demo');
// router.setRootPath('/');
router.init(routes);
router.routeChange = (old: string, next: string) => {
  console.log('nvRouteChange', old, next);
};

const inDiv = new InDiv();
inDiv.bootstrapModule(M1);
inDiv.use(router);
inDiv.init();
