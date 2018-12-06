import { InDiv, Component, Utils, NvModule, OnInit, WatchState, BeforeMount, AfterMount, ReceiveProps, SetState, OnDestory, setState, ElementRef, Watch } from '@indiv/core';
import { RouteChange, NvLocation, RouteModule } from '@indiv/router';
import { PlatformBrowser } from '@indiv/platform-browser';
import { HttpClient, HttpClientResponse } from '@indiv/common';
// import { InDiv, Component, Utils, NvModule, OnInit, WatchState, BeforeMount, AfterMount, ReceiveProps, SetState, OnDestory, setState, ElementRef } from '../build/core';
// import { RouteChange, NvLocation, RouteModule } from '../build/router';
// import { PlatformBrowser } from '../build/platform-browser';
// import { HttpClient, HttpClientResponse } from '../build/common';


import { Observable } from 'rxjs';

import { SharedModule } from './share.module';
import { HeroSearchService, HeroSearchService1, HeroSearchService2 } from './service';
import { PrivateService } from './private.service';

class ValueType { }

@Component({
  selector: 'pc-component',
  template: (`
    <div>
      <p nv-if="e" nv-class="a" nv-repeat="let da in d"  nv-on:click="componentClick(d)">你好： {{da.z}}</p>
      state.d: <input nv-repeat="let da in d" nv-model="da.z" />
      <p nv-on:click="sendProps(5)">props from component.state.a: {{ax}}</p>
    </div>
  `),
})
class PComponent implements OnInit, WatchState, BeforeMount, AfterMount, ReceiveProps, OnDestory {
  public setState: SetState;
  public state: any;
  public props: any;
  public a: any = 'a子组件';
  public b: number = 100;
  public c: string = '<p>1111</p>';
  public d: any = [
    {
      z: 111111111111111,
      b: 'a',
    },
    {
      z: 33333333333333,
      b: 'a',
    }];
  public e: boolean = true;
  public ax: any;

  constructor(
    private element: ElementRef,
  ) {
    this.setState = setState;
  }

  public nvOnInit() {
    this.ax = this.props.ax;
    console.log('nvOnInit props11', this.props, this.element);
  }

  public nvBeforeMount() {
    console.log('nvBeforeMount props11', this.props);
  }

  public nvAfterMount() {
    console.log('nvAfterMount props11', this.props);
  }
  public componentClick(a: any) {
    console.log('aa', a);
  }
  public sendProps(ax: any) {
    console.log(4423213, this.props.b);
    this.props.b(ax);
  }
  public getProps(a: any) {
    alert('子组件里 里面传出来了');
    // this.setState({ a: a });
    this.a = a;
    this.props.b(a);
  }

  public nvWatchState(oldState: string) {
    console.log('oldState Component:', oldState);
  }
  public nvReceiveProps(nextProps: any) {
    console.log(1111111111111, nextProps);
    this.ax = nextProps.ax;
  }
  public nvOnDestory() {
    console.log('PComponent is nvOnDestory');
  }
}

@Component({
  selector: 'R1',
  template: (`
    <div>
      <pc-component ax="{a}" b="{getProps}"></pc-component>
      下面跟组件没关系<br/>
      <div nv-if="f">
        ef
        <input nv-repeat="let ea in e" nv-model="ea.z" />
        <p nv-class="c" nv-if="ea.z" nv-repeat="let ea in e" nv-text="ea.z" nv-on:click="showAlert(ea)"></p>
        <p>111this.state.a：{{a}}</p>
        <input nv-model="a" />
      </div>
      下面是子路由<br/>
      <router-render></router-render>
    </div>
    `),
})
class R1 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange, OnDestory {
  public hSr: HeroSearchService;
  public setState: SetState;
  public props: any;
  public a: string = 'a11';
  public b: number = 2;
  public d: any[] = [{
    z: 111111111111111,
    b: 'a',
    show: true,
  },
                     {
    z: 33333333333333,
    b: 'a',
    show: true,
  }];
  public c: string = 'c';
  public e: any = [{
    z: 232323,
    b: 'a',
    show: true,
  },
                   {
    z: 1111,
    b: 'a',
    show: false,
  }];
  public f: boolean = true;

  constructor(
    private heroSearchService: HeroSearchService,
    private utils: Utils,
    private location: NvLocation,
    private element: ElementRef,
    private indiv: InDiv,
  ) {
    this.setState = setState;
    console.log(9999888777, 'from R1', this.element, this.indiv);
    this.heroSearchService.test();
  }

  public nvOnInit() {
    this.utils.setCookie('tutor', {
      name: 'gerry',
      github: 'https://github.com/DimaLiLongJi',
    }, { expires: 7 });
    console.log('R1 nvOnInit', this.location.get());
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
    this.location.set('/R1/C1', { a: '1' });
    console.log('this.$location', this.location.get());
  }
  public getProps(a: any) {
    console.log('被触发了！', a);
    this.a = a;
    // this.setState({ a: a });
  }

  public nvOnDestory() {
    console.log(this.location.get(), 'R1 is nvOnDestory');
  }
}

// @Injected
@Component({
  selector: 'R2',
  template: (`
    <div>
      <p nv-on:click="showLocation()">点击显示子路由跳转</p>
      <input nv-model="a"/>
      <br/>
      <p nv-on:click="showAlert()">点击显示this.state.a:{{a}}</p>
      子组件:<br/>
      <route-child a="{a}"></route-child>
      <router-render></router-render>
    </div>
  `),
})
class R2 implements OnInit, BeforeMount, AfterMount, WatchState, RouteChange, OnDestory {
  public state: any;
  public a: any = 1;
  constructor(
    private heroSearchService1: HeroSearchService1,
    private location: NvLocation,
    private sss: HeroSearchService,
    private element: ElementRef,
  ) {
    this.heroSearchService1.test();
    console.log('this.heroSearchService1', this.heroSearchService1, this.element);
    this.sss.test();
  }
  public nvOnInit() {
    console.log('this.getLocation', this.location.get());
  }
  public nvBeforeMount() {
    // console.log('is nvBeforeMount');
  }
  public nvAfterMount() {
    // console.log('is nvAfterMount');
  }
  public nvHasRender() {
    console.log('！！father: this.a', this.a);
  }
  public nvRouteChange(lastRoute: string, newRoute: string) {
    console.log('R2 is nvRouteChange', lastRoute, newRoute);
  }

  public nvWatchState(oldState: any) {
    console.log('oldState Controller:', oldState);
  }

  public nvOnDestory() {
    console.log(this.location.get(), 'R2 is nvOnDestory');
  }

  public showAlert() {
    console.log('this.a', this.a);
    // alert('我错了 点下控制台看看吧');
    // this.setState(() => ({ a: 2 }));
  }
  public bindChange(a: any) {
    console.log('aaa', a);
  }
  public showLocation() {
    this.location.set('/R1/C1/D1', { b: '1' });
  }
}

@Component({
  selector: 'test-component',
  template: (`
    <div>
      <p nv-on:click="click()">测试repeat组件: {{man}}</p>
    </div>`),
})
class TestComponent implements OnInit, OnDestory, ReceiveProps {
  public state: any;
  public props: any;
  public man: any;

  constructor(
    private httpClient: HttpClient,
    private indiv: InDiv,
    private element: ElementRef,
  ) {
    console.log(55544333, this.indiv, this.element);
    this.httpClient.get('/success').subscribe({
      next: (value: any) => { console.log(4444, value); },
    });
  }

  public nvOnInit() {
    this.man = this.props.man;
  }

  public click() {
    console.log('this.state.man', this.man);
    this.man = 'fuck!';
  }

  public nvOnDestory() {
    console.log('TestComponent OnDestory');
  }

  public nvReceiveProps(p: any) {
    console.log('test-component nvReceiveProps', p);
  }
}

@Component({
  selector: 'container-wrap',
  template: (`
    <div>
      <input nv-model="test.a" nv-on:click="show(test)" />
      <p test-directive="{'123'}" nv-id="232" nv-if="countState(a)" nv-on:click="changeInput()">{{a}}</p>
      <test-component nv-repeat="let man in testArray" nv-key="man.name" man="{countState(man.name)}" nv-if="a"></test-component>
      <p nv-on:click="go()">container: {{countState(color)}}</p>
      <input nv-model="a" />
      <div nv-repeat="let man in testArray" nv-key="man.name">
          <div nv-on:click="show(testArray2, '你111')">姓名：{{man.name}}</div>
          <div>性别：{{countState(man.sex, $index)}}</div>
          <a nv-href="countState(man.sex, $index)">a {{man.sex}}</a>
          <img nv-src="man.sex" nv-alt="man.sex" />
          <test-component nv-key="man.name" man="{countState(man.name)}"></test-component>
          <input nv-on:click="show(b, $index)" nv-repeat="let b in testArray2" nv-on:input="showInput($event, $index)" nv-text="b" nv-class="b" />
          <input nv-model="test.a"/>
          <div class="fuck" nv-repeat="let c in man.job" nv-key="c.id">
            <input nv-on:click="show(c, $index)" nv-model="c.name" nv-class="c.id" />
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
  public color: any = 'red';
  public test: any = {
    a: 3,
  };
  public a: any = 1;
  public b: any = 3;
  public testArray: any = [
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
    }];
  public testArray2: any = ['程序员3', '码农3', '帅3'];
  public props: any;
  public setState: SetState;
  public http$: Observable<HttpClientResponse>;

  constructor(
    private hss: HeroSearchService,
    private value: ValueType,
    private location: NvLocation,
    private httpClient: HttpClient,
    private element: ElementRef,
    private indiv: InDiv,
    private privateService: PrivateService,
  ) {
    this.privateService.change();
    this.setState = setState;
    console.log(99988, 'from Container', this.element, this.indiv, this.privateService.isPrivate);
    this.httpClient.createResponseInterceptor((value: HttpClientResponse) => {
      return {
        data: value.data,
      };
    });
    this.http$ = this.httpClient.get('/success');
    this.http$.subscribe({
      next: this.httpHandler,
    });
    this.hss.test();
    console.log('value', this.value);
  }

  public nvOnInit() {
    console.log('nvOnInit Container', this.location.get());
  }

  public nvAfterMount() {
    console.log('nvAfterMount Container');
    // document.getElementById('1').className = '3333';
  }

  public go() {
    this.location.redirectTo('/R1', { b: '1' });
  }
  public countState(a: any, index: number): any {
    if (!a) return 'false';
    return a;
  }
  public show(a: any, index?: string) {
    console.log('aaaa', a);
    console.log('$index', index);
    // console.log('testArray2', this.state.testArray2);
    console.log('testArray2', this.testArray2);
  }

  public showInput(event: any, index: number) {
    // this.state.testArray2[index] = event.target.value;
    this.testArray2[index] = event.target.value;
  }

  public nvWatchState(oldState: any) {
    console.log('oldState Controller:', oldState);
  }

  public changeInput() {
    this.color = 'green';
    this.a = 5;
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

  private httpHandler = (value: any) => {
    // this.state.a = 100;
    this.a = 100;
    console.log(33333, 'from container', value);
  }
}

@NvModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    R2,
  ],
  providers: [
    Utils,
    HttpClient,
    HeroSearchService,
    {
      provide: HeroSearchService1,
      useClass: HeroSearchService1,
    },
    HeroSearchService2,
    {
      provide: ValueType,
      useValue: 1123,
    },
    NvLocation,
  ],
  exports: [
    R2,
    SharedModule,
  ],
})
class M2 {
  constructor(
    private indiv: InDiv,
  ) {
    console.log(99999988866666, '来自注入的模块 M2', this.indiv);
  }
}


@NvModule({
  imports: [
    M2,
  ],
  declarations: [
    Container,
    PComponent,
    TestComponent,
    R1,
  ],
  exports: [
    RouteModule,
  ],
  bootstrap: Container,
})
class M1 {
  constructor(
    private hsr: HeroSearchService,
    private indiv: InDiv,
  ) {
    console.log(999999888777, '来自注入的模块 M1', this.hsr, this.indiv);
  }
}

const inDiv = new InDiv();
inDiv.bootstrapModule(M1);
inDiv.use(PlatformBrowser);
inDiv.init();
