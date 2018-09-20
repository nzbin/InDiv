import { InDiv, Component, Router, Utils, NvModule, Service, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, ReceiveProps, nvHttp, SetState, SetLocation, GetLocation } from '../src';
// import { InDiv, Component, Router, Utils, NvModule, Service, Injectable, HasRender, OnInit, WatchState, BeforeMount, AfterMount, RouteChange, ReceiveProps, nvHttp, SetState, SetLocation, GetLocation } from '../build';

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
    console.log('检查 是否相等', heroSearchService1 === this.heroSearchService1);
    console.log('测试 ts 依赖注入', this.heroSearchService1);
    this.heroSearchService1.test();
  }

  public test() {
    console.log('HeroSearchService !!!000000000');
  }
}


interface Props {
  a: number;
}
// @Injectable
@Component({
  selector: 'route-child',
  template: (`
    <div>
      <p>子路由的子组件::{{state.b}}</p>
      <pp-childs ax={state.b}></pp-childs>
    </div>
  `),
})

class RouteChild implements OnInit, HasRender, ReceiveProps {
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
}

@Component({
  selector: 'pp-childs',
  template: (`
    <div>
      子组件的子组件<br/>
      <p nv-on:click="@sendProps(3)">PCChild props.ax:: {{state.b}}</p>
      <p nv-repeat="let a in state.d">state.d {{a.z}}</p>
    </div>
  `),
})
class PCChild implements OnInit, BeforeMount, AfterMount, ReceiveProps {
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

  public nvReceiveProps(nextProps: any) {
    console.log(this.props.ax);
    console.log(4444, nextProps);
    this.state.b = nextProps.ax;
    this.setState({
      b: nextProps.ax,
    });
  }
}


@Injectable
@Component({
  selector: 'pc-component',
  template: (`
    <div>
      <p nv-if="state.e" nv-class="state.a" nv-repeat="let a in state.d"  nv-on:click="@componentClick(state.d)">你好： {{a.z}}</p>
      state.d: <input nv-repeat="let a in state.d" nv-model="a.z" />
      <p nv-on:click="@sendProps(5)">props from component.state.a: {{state.ax}}</p>
    </div>
  `),
})
class PComponent implements OnInit, WatchState, BeforeMount, AfterMount, ReceiveProps {
  public setState: SetState;
  public state: any;
  public props: any;

  constructor() {}

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
    console.log('this', this);
  }
  public getProps(a: any) {
    alert('子组件里 里面传出来了');
    this.setState({ a: a });
    this.props.b(a);
  }
  // public nvWatchState(oldData: string, newData: string) {
  public nvWatchState(newData: string) {
    // console.log('oldData Component:', oldData);
    console.log('newData Component:', newData);
  }
  public nvReceiveProps(nextProps: any) {
    console.log(1111111111111, nextProps);
    this.state.ax = nextProps.ax;
  }
}

@Injectable
@Component({
  selector: 'R1',
  template: (`
    <div>
      <pc-component ax="{state.a}" b="{@getProps}"></pc-component>
      下面跟组件没关系<br/>
      <div nv-if="state.f">
        ef
        <input nv-repeat="let a in state.e" nv-model="a.z" />
        <p nv-class="state.c" nv-if="a.show" nv-repeat="let a in state.e" nv-text="a.z" nv-on:click="@showAlert(a.z)"></p>
        <p>111this.state.a：{{state.a}}</p>
        <input nv-model="state.a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `),
})
class R1 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange {
  public hSr: HeroSearchService;
  public utils: Utils;
  public getLocation: GetLocation;
  public setLocation: SetLocation;
  public setState: SetState;
  public props: any;
  public state: any;

  constructor(
    private heroSearchService: HeroSearchService,
  ) {
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
  // public nvWatchState(oldData: any, newData: any) {
  public nvWatchState(newData: any) {
    // console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
  }
  public showAlert(a: any) {
    this.setLocation('/R1/C1', { a: '1' });
    console.log('this.$location', this.getLocation());
  }
  public getProps(a: any) {
    // alert('里面传出来了');
    console.log('被触发了！', a);
    this.setState({ a: a });
  }
}

@Injectable
@Component({
  selector: 'R2',
  template: (`
    <div>
      <p nv-on:click="@showLocation()">点击显示子路由跳转</p>
      <input nv-model="state.a"/>
      <br/>
      <p nv-on:click="@showAlert()">点击显示this.state.a:{{state.a}}</p>
      子组件:<br/>
      <route-child a="{state.a}"></route-child>
      <router-render></router-render>
    </div>
  `),
})
class R2 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange {
  public getLocation: GetLocation;
  public setLocation: SetLocation;
  public state: any;

  constructor(
    public heroSearchService1: HeroSearchService1,
  ) {
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
  // public nvWatchState(oldData: any, newData: any) {
  public nvWatchState(newData: any) {
    // console.log('oldData Controller:', oldData);
    console.log('newData Controller:', newData);
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
      <p nv-on:click="@click()">测试repeat组件: {{state.man}}</p>
    </div>`),
})
class TestComponent implements OnInit {
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
}


@Injectable
@Component({
  selector: 'container-wrap',
  template: (`
    <div>
      <p id="aa" nv-if="state.a" nv-on:click="@changeInput()">{{state.a}}</p>
      <test-component nv-repeat="let man in state.testArray" nv-key="man.name" man="{man.name}" nv-if="state.a"></test-component>
      <p nv-on:click="@go()">container: {{state.a}}</p>
      <input nv-model="state.a" />
      <div nv-repeat="let man in state.testArray" nv-key="man.name">
          <div nv-on:click="@show(state.testArray2)">姓名：{{man.name}}</div>
          <div>性别：{{man.sex}}</div>
          <input nv-on:click="@show(b, $index)" nv-repeat="let b in state.testArray2" nv-key="$index" nv-on:input="@showInput($event, $index)" nv-text="b" nv-class="b" />
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
  ) {
    this.hss.test();
    // console.log(this.state);
    console.log(' nvHttp', nvHttp);
    // console.log('hss', this.hss);
    // console.log('hss2', this.hss2);
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
  public show(a: any, index?: string) {
    console.log('aaaa', a);
    console.log('$index', index);
    console.log('testArray2', this.state.testArray2);
  }

  public showInput(event: any, index: number) {
    console.log('aaaa', event.target.value);
    const testArray2 = this.state.testArray2;
    testArray2[index] = event.target.value;
    // this.state.testArray2[index] = event.target.value;
  }

  public nvWatchState(newData: any) {
    console.log('newData Controller:', newData);
  }

  public changeInput() {
    // this.state.a = 4;
    this.setState({
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
          sex: '女',
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
      // this.state.testArray = [
      //   {
      //     name: 'gerry',
      //     sex: '男',
      //     job: [
      //       {
      //         id: 1,
      //         name: '程序员',
      //       },
      //       {
      //         id: 2,
      //         name: '码农',
      //       },
      //       {
      //         id: 3,
      //         name: '帅',
      //       },
      //     ],
      //   },
      //   {
      //     name: 'gerry2',
      //     sex: '男2',
      //     job: [
      //       {
      //         id: 1,
      //         name: '程序员2',
      //       },
      //       {
      //         id: 2,
      //         name: '码农2',
      //       },
      //       {
      //         id: 3,
      //         name: '帅2',
      //       },
      //     ],
      //   },
      //   {
      //     name: 'nina',
      //     sex: '女',
      //     job: [
      //       {
      //         id: 1,
      //         name: '老师',
      //       },
      //       {
      //         id: 2,
      //         name: '英语老师',
      //       },
      //       {
      //         id: 3,
      //         name: '美',
      //       },
      //     ],
      //   }];
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
