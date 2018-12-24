import { InDiv, Component, NvModule, HasRender, OnInit, BeforeMount, AfterMount, ReceiveProps, SetState, OnDestory, setState, Directive, ElementRef, Input } from '@indiv/core';
import { RouteChange, RouteModule, TRouter } from '@indiv/router'; 
// import { InDiv, Component, NvModule, HasRender, OnInit, BeforeMount, AfterMount, ReceiveProps, SetState, OnDestory, setState, Directive, ElementRef } from '../build/core';
// import { RouteChange, RouteModule, TRouter } from '../build/router';  
import { HeroSearchService, HeroSearchService2 } from './service';

interface Props {
  a: number;
}

@Component({
  selector: 'route-child',
  template: (`
    <div class="fuck">
      <p>子路由的子组件::{{b}}</p>
      <pp-childs ax="{b}"></pp-childs>
    </div>
  `),
})
class RouteChild implements OnInit, HasRender, ReceiveProps, OnDestory {
  public setState: SetState;
  public heroSearchService: HeroSearchService2;
  @Input() public a: string = 'a';
  public b: any;
  public d: any[] = [
    {
      z: 111111111111111,
      b: 'a',
    },
    {
      z: 33333333333333,
      b: 'a',
    },
  ];
  constructor(
    private heroSearchService2: HeroSearchService2,
    private element: ElementRef,
  ) {
    console.log('fuck this.heroSearchService2', this.heroSearchService2, this.element);
    this.heroSearchService2.test();
    this.setState = setState;
  }

  public nvOnInit() {
    this.b = this.a;
    console.log(555, 'PCChild nvOnInit props11', this.a);
    // this.props.b(3);
  }

  public nvHasRender() {
    console.log('RouteChild hasRender: this.props.a', this.a);
  }

  public nvReceiveProps(nextProps: any) {
    console.log(3333, nextProps);
    this.b = nextProps.a;
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
      <p nv-on:click="sendProps(3)">PCChild props.ax:: {{b}}</p>
      <p nv-repeat="da in d">state.d {{da.z}}</p>
    </div>
  `),
})
class PCChild implements OnInit, BeforeMount, AfterMount, ReceiveProps, OnDestory {
  // public props: any;
  public a: string = 'a';
  @Input('ax') public b: any;
  public d: any[] = [
        {
          z: 101111,
          b: 'a',
        },
        {
          z: 103333,
          b: 'a',
        },
      ];
  public setState: SetState;
  constructor(
    private element: ElementRef,
  ) {
    this.setState = setState;
  }

  public nvHasRender() {
    console.log('PCChild hasRender : this.props', this.b, this.element);
  }

  public nvOnInit() {
    // this.b = this.props.ax;
    // this.setState({
    //   b: this.props.ax,
    // });
    console.log(555, 'PCChild nvOnInit props11', this.b);
    // this.props.b(3);
  }

  public sendProps(i: number) {
    // this.props.b(i);
    // this.props.ax = 100;
    console.log('this.props', this.b);
  }

  public nvBeforeMount() {
    console.log('PCChild nvBeforeMount props11', this.b);
  }

  public nvAfterMount() {
    console.log('PCChild nvAfterMount props11', this.b);
  }

  public nvOnDestory() {
    console.log('PCChild nvOnDestory');
  }

  public nvReceiveProps(nextProps: any) {
    // console.log(this.props.ax);
    console.log(4444, nextProps);
    // this.b = nextProps.ax;
    // this.setState({
    //   b: nextProps.ax,
    // });
  }
}



const routes: TRouter[] = [
  {
    path: '/',
    // redirectTo: '/R1',
    children: [
      {
        path: '/R1',
        component: 'R1',
        // redirectTo: '/R2',
        // loadChild: {
        //   name: 'TestLoadchildModule',
        //   module: () => import('./loadChild'),
        // },
        children: [
          {
            path: '/C1',
            // component: 'R2',
            loadChild: {
              name: 'LoadchildModule',
              child: () => import('./loadChild.module'),
            },
            // redirectTo: '/R1/C1/D1',
            children: [
              {
                path: '/D1',
                component: 'R2',
                // redirectTo: '/R2/2',
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

@Directive({
  selector: 'test-directive',
})
class TestDirective implements OnInit, RouteChange, ReceiveProps {
  @Input('test-directive') public testDirective: string;
  constructor(
    private hss: HeroSearchService,
    private element: ElementRef,
    private indiv: InDiv,
  ) {}

  public nvOnInit() {
    console.log(5555, 'init TestDirective', this.testDirective);
    console.log(666666, 'init TestDirective element', this.element);
    console.log(777777, 'init TestDirective indiv', this.indiv);
    this.hss.test();
    this.element.nativeElement.addEventListener('mouseover', this.changeColor);
    this.element.nativeElement.addEventListener('mouseout', this.removeColor);
  }
  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    console.log(5555, 'nvRouteChange TestDirective', newRoute);
  }
  public nvReceiveProps(nextProps: any): void {
    console.log(33333, 'nvReceiveProps test-directive', nextProps);
  }

  public changeColor = () => {
    this.element.nativeElement.style.color = 'red';
  }
  public removeColor = () => {
    this.element.nativeElement.style.color = 'black';
  }
}

@NvModule({
  imports : [
    RouteModule.forRoot({
      routes,
      rootPath: '/demo',
    }),
  ],
  declarations: [
    PCChild,
    RouteChild,
    TestDirective,
  ],
  exports: [
    PCChild,
    RouteChild,
    TestDirective,
    RouteModule,
  ],
})
export class SharedModule {}
