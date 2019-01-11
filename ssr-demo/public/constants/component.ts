export const componentInfo = () => [
  {
    h1: '组件与模板',
    p: [
      '在 InDiv 中最典型的数据显示方式，就是把 HTML 模板中的控件绑定到 InDiv 组件的属性。',
    ],
    info: [
      {
        title: '装饰器 Component',
        p: [
          '@Component 装饰器会指出紧随其后的那个类是个组件类，并为其指定元数据。',
          '在下面的范例代码中，你可以看到 ContainerComponent 只是一个普通类，完全没有 InDiv 特有的标记或语法。 直到给它加上了 @Component 装饰器，它才变成了组件。',
          '@Component 接收3个参数: selector, template, providers',
        ],
        pchild: [
          '1. selector: string; 作为组件（component）被渲染成 DOM 的标签，类似于 <div></div>',
          '2. template: string; 视图模板，用来声明被渲染的视图',
          '3. providers?: (Function | { provide: any; useClass: Function; } | { provide: any; useValue: any; })[]; 声明可以被组件注入的服务。',
          '4. 在 JavaScript 中，只能把 装饰器Component 当做一个函数使用，最后应该导出被声明的类。',
          '5. 组件会优先去组件 providers 查找依赖，其次才会去模块 providers 查找依赖。',
          '6. 组件 providers 中的服务在每个组件实例内都有独立的实例。而模块 providers 则根据 isSingletonMode 决定是否为 全局单例 还是每次都实现一个新的实例。',
          '7. 在 TypeScript 中 providers 仅仅能使用 providers: (Function | { provide: Function; useClass: Function; } | { provide: Function; useValue: any; })[]; 类型。',
          '8. 在 JavaScript 中 providers 仅仅能使用 providers: ({ provide: string; useClass: Function; } | { provide: string; useValue: any; })[]; 类型。',
          '9. 从v1.2.1开始，实例上将无法找到 setState, setLocation, getLocation 方法，你需要在 indiv包 中手动引入并赋值给实例的一个方法。但在v1.2.0及之前版本都存在于实例中。',
        ],
        code: `
  // in TypeScript
  import { Component, setState, setLocation, getLocation, SetState, SetLocation, GetLocation } from 'indiv';
  @Component({
    selector: 'container-component'
    template: ('
      <div>ContainerComponent {{a}}</div>
    '),
    providers: [
      TestService,
      {
        provide: TestService1,
        useClass: TestService1,
      },
      {
        provide: TestService2,
        useClass: '123',
      },
    ],
  })
  export default class ContainerComponent {
    public state: {
      a: number;
    };
    private setState: SetState;
    private setLocation: SetLocation;
    private getLocation: GetLocation;

    constructor(
      private: testService: TestService
    ) {
      this.state = {
        a: 1
      };
      this.setState = setState;
      this.setLocation = setLocation;
      this.getLocation = getLocation;
    }
  }

  // in JavaScript
  import { Component, setState, setLocation, getLocation } from 'indiv';

  export default class ContainerComponent {
    static injectTokens = [
      'testService'
    ];

    constructor(testService) {
      this.testService = testService;
      this.state = {
        a: 1
      };
      this.setState = setState;
      this.setLocation = setLocation;
      this.getLocation = getLocation;
    }
  }
  Component({
    selector: 'container-component'
    template: ('
      <div>ContainerComponent {{a}}</div>
    '),
    providers: [
      {
        provide: 'testService',
        useClass: TestService,
      },
      {
        provide: 'testService1',
        useClass: TestService1,
      },
      {
        provide: 'testService2',
        useClass: '123',
      },
    ],
  })(ContainerComponent)
 `,
      },
      {
        title: '模板数据绑定',
        p: [
          '如果没有框架，你就要自己负责把数据渲染到 HTML 控件中，并把来自用户的响应转换成动作和对值的更新。 手动写这种数据推拉逻辑会很枯燥、容易出错，难以阅读 —— 用过 jQuery 的程序员一定深有体会。',
          'InDiv 支持双向数据绑定，这是一种对模板中的各个部件与组件中的各个部件进行协调的机制。',
        ],
        pchild: [
          '1. 往模板HTML字符串中添加绑定 nv- 开头的标记可以告诉 InDiv 该如何渲染它们。',
          '2. 因为 InDiv 使用单向数据流，所以仅仅支持使用 this.state 内的值(开头，作为this.state.的指代) 或是 有返回值的实例上的方法(@开头，作为this的指代) 作为绑定数据， 实例的方法作为事件方法。',
          '3. 如果要在组件内使用 props ，请在 nvReceiveProps 或 Class的getter setter方法 或 在 nvOnInit 生命周期内用 props 对 state 赋值。',
          '4. 如果组件在 根模块（root NvModule）或模块（NvModule） 上的 components：Function[]; 声明过，则在其他同模块组件内的 template 可以像 HTML 标签一样使用组件。',
          '4. 模板上的组件可接受的 props的值 必须用 {} 包裹起来。',
          '5. props的值 有三种: <test-component man="{@countState(man.name)}" women="{name}" handler="{@getProps}"></test-component>',
          '(1) 直接使用 state上的值 或 nv-repeat 的值：women="{name} women="{man.name}"',
          '(2) 使用 @ 加 实例上带有返回值的方法，返回值将作为被传递的值：man="{@countState(name)}"',
          '(3) 使用 @ 加 实例上的方法，方法将作为 props 传递：handler="{@getProps}"',
        ],
        code: `
  @Component({
    selector: 'container-component',
    template: ('
      <div nv-on:click="@show(a)">
        ContainerComponent {{a}}
        <test-component value-a="{a}" show="{@show}"></test-component>
      </div>
      '),
  })
  export default class ContainerComponent {
    constructor() {
      this.state = {
        a: null,
      };
    }

    public show(a: any) {
      console.log(a);
    }

    public nvReceiveProps(nextProps: any): void {
      this.state.a = nextProps.a;
    }
  }
 `,
      },
      {
        title: '组件通信1: props 与 state',
        p: [
          'InDiv 的组件之间可以 props 来通信。',
          '组件间通信应该是单向的，通过传递值到子组件，并通过传递一个回调方法在子组件调用来更改对应父组件的值来完成通信。',
          '直接改变 state 上的值，或通过 setState 更改 state 的值时，state会被立刻改变，因此更改state的行为为 同步的。',
          '但是更改 state 值时，会触发异步的重新渲染，并在渲染后更新子组件的 props，',
          '因此，通过在子组件中调用 props 上的方法来更新父组件的 state 时，子组件的 props 并不会立即更新。',
          '如果想知道子组件的 props 何时被更新，应该通过生命周期 nvReceiveProps(nextProps: Props) 或 Class的getter setter方法去监听props的变化。',
          '从v1.2.1开始，实例上将无法找到 setState 方法，你需要在 indiv包 中手动引入setState并赋值给实例的一个方法。但在v1.2.0及之前版本都存在于实例中。',
        ],
        pchild: [
          '1. 可以直接在 template 上使用在 NvModule 注册过的组件标签，并通过 prop-value="{value}" prop-value="{@returnValue(value)}" pro-function="{@fn}" 的引号包裹花括号的写法传递值与方法。',
          '2. template 上组件内的传值应按照 下划线命名法(UnderScoreCase) 书写，而在组件Class中应按照 驼峰命名法(CamelCase) 使用。例如: prop-value="{value}" => this.props.propValue',
          '3. 例如在下面例子，在 hero-component 内可以用循环 nv-repeat 的value，也可以使用 实例上有返回值的方法，也可以直接在实例方法中触发 handelClick 回调。',
          '4. 如果该 DOM 会发生频繁变化，并且有可追踪的唯一 key 值，可以添加指令 nv-key, 让 InDiv 直接追踪到 DOM 变化，帮助保存 组件 内的 state。',
          '5. 但是渲染的时候，不可以在模板上直接使用 props 的值，仅仅可以使用 class 实例的方法和 this.state 的值。',
          '6. 在生命周期 constructor 和 nvOnInit 之后，会开启对 this.state 的监听，此监听会监听每个挂载到 this.state 上的属性及属性的属性，因此如果不对 this.state 添加新的属性或对属性的属性添加新的属性的话，可以直接对某个属性赋值。',
          '7. 相反，如果要对 this.state 上的属性 增加属性或删除，则需要使用 setState<S>(newState: {[key: string]: S}) 方法对 this.state 重新添加监听',
          '8. 可以直接引用 InDiv 的 SetState 来为 setState方法声明类型。',
          '9. 可以通过生命周期 nvReceiveProps(nextProps: Props) 或 Class的getter setter方法去监听props的变化。(nvReceiveProps会先于getter setter被触发)。',
        ],
        code: `
  import { Component, SetState, OnInit, ReceiveProps, setState } from 'InDiv';
  @Component({
    selector: 'hero-component',
    template: ('
      <div>
        <p>来自父组件的stateValue: {{stateValue}}</p>
        <p>idValue: {{idValue}}</p>
      </div>
    '),
  })
  export default class HeroComponent implements OnInit, ReceiveProps {
    private setState: SetState;
    public state: any;
    public props: any;
    public _props: any;

    public nvOnInit() {
      this.state = {
        idValue: this.props.idValue,
        stateValue: this.props.stateValue,
      };
      this.setState = setState;
    }

    public show(a: any) {
      this.props.handelClick(a);
    }

    set props(props: any) {
      this._props = props;
    }

    get props(): any {
      return this._props;
    }

    public nvReceiveProps(nextProps: any): void {
      this.state.idValue = nextProps.idValue;
      this.setState({
        stateValue: nextProps.stateValue,
      });
    }
  }

 @Component({
    selector: 'container-component',
    template: ('
      <div>
        <div nv-repeat="let person in b" nv-key="person.id">
          <hero-component handel-click="@show" state-value="a" id-value="person.id" ></hero-component>
        </div>
      </div>
    '),
  })
  export default class ContainerComponent {
    constructor() {
      this.state = {
        a: {
          id: 3,
          name: '码农3',
        },
        b: [
          {id: 1, name: '码农1'},
          {id: 2, name: '码农2'},
        ],
      };
    }

    public show(a: any) {
      console.log(a);
    }
  }
 `,
      },
      {
        title: '组件通信2: service 与 RxJS',
        p: [
          '父子组件的通信可以通过 props , 但跨层级组件间的通信该怎么办？',
          '相比于构建全局变量，InDiv 的服务显然更适合这种场景。',
        ],
        pchild: [
          '1. InDiv 的组件之间可以通过注入同一个 单例service。（既全局仅仅产生一个实例）',
          '2. 通过 RxJS 实现订阅与通知（RxJS 详细：https://rxjs-dev.firebaseapp.com/）',
          '3. 通过RxJS可观察者对象，获得组件之间通信或状态变更',
          '4. 在 nvOnDestory 生命周期钩子里取消订阅',
        ],
      },
      {
        title: '组件的依赖注入',
        p: [
          '通过依赖注入系统，可以无需关注任何过程直接拿到一个所需的服务实例。',
          '每个组件实例都拥有一个同级的注入器，负责调用组件和模块的 providers，获取组件依赖的实例。',
          '在 TypeScript 与 JavaScript 中，声明依赖的方式不一样',
          '组件 providers 中的服务在每个组件实例内都有独立的实例。而模块 providers 则根据 isSingletonMode 决定是否为 全局单例 还是每次都实现一个新的实例。',
        ],
        pchild: [
          '1. 在 TypeScript 中，通过 @Injected 注解，获取组件的构造函数中参数的类型，根据 provide: Function  查找依赖，并注入实例。',
          '2. 在 JavaScript 中，通过组件类的静态属性 injectTokens: string[]，查找 provide: string 查找依赖，并注入实例。',
          '3. 优先查找组件中被声明的服务，其次再在模块中被声明的服务中查找依赖',
        ],
        code: `
 import { Component, Injected } from 'InDiv';
 
 // in TypeScript
 @Injected
 @Component({
    selector: 'hero-component',
    template: ('
      <div>
        <p>{{stateValue}}</p>
      </div>
    '),
    providers: [ HeroService ],
  })
  export default class HeroComponent {
    public state: any;

    constructor(
      private heroService: HeroService
    ) {}

    public nvOnInit() {
      this.state = {
        stateValue: 111,
      };
    }
  }

  // in JavaScript
  export default class HeroComponent {
    static injectTokens = [
      'heroService'
    ];

    constructor(heroService) {
      this.heroService = heroService;
    }

    nvOnInit() {
      this.state = {
        stateValue: 111,
      };
    }
  }
  Component({
    selector: 'hero-component',
    template: ('
      <div>
        <p>{{stateValue}}</p>
      </div>
    '),
    providers: [{
      provide: 'heroService',
      useClass: HeroService,
    }],
  })(HeroComponent);
 `,
      },
      {
        title: '生命周期钩子',
        p: [
          '每个组件都有一个被 InDiv 管理的生命周期。',
          '生命周期钩子其实就是定义在实例中的一些方法，在 InDiv 中，通过不同的时刻调用不同的生命周期钩子，',
          '赋予你在它们发生时采取行动的能力。',
          '在 TypeScript 中，引用 InDiv 提供的 interface，通过 implements 的方式让类去实现被预先定义好的生命周期，而在 JavaScript 中，你只能自己手动去定义应该实现的生命周期方法。',
        ],
        pchild: [
          '1. constructor 在类被实例化的时候回触发，你可以在这里预先定义你的 state',
          '2. nvOnInit(): void; constructor 之后，在这个生命周期中，可以通过 this.props 获取 props，并定义 state，此生命周期会在开启监听前被触发，并且之后再也不会触发',
          '3. nvBeforeMount(): void; 在 nvOnInit 之后，template 挂载页面之前被触发，每次触发渲染页面都会被触发',
          '4. nvAfterMount(): void; 在 nvBeforeMount 之后，template 挂载页面之后被触发，每次触发渲染页面（render）都会被触发',
          '5. nvHasRender(): void; 在 nvAfterMount 之后，渲染完成后被触发，每次触发渲染页面（render）都会被触发',
          '6. nvRouteChange(lastRoute?: string, newRoute?: string): void; 监听路由变化，当更换路由后被触发',
          '7. nvOnDestory(): void; 仅仅在路由决定销毁此组件时被触发',
          '8. nvWatchState(oldState?: any): void; 监听 state 变化，当 state 被更改后触发',
          '9. nvReceiveProps(nextProps: any): void; 监听 props 变化，当 props 即将被更改时触发',
          '10. getter: 当监听 props 时，getter 会先于 nvReceiveProps 被触发',
          '11. setter: 当监听 state 时，setter 会晚于 nvWatchState 被触发',
        ],
        code: `
 import { Component, OnInit, BeforeMount, AfterMount, HasRender, OnDestory, WatchState, ReceiveProps } from 'InDiv';

 @Component({
    selector: 'hero-component',
    template: ('
      <div>
        <p>来自父组件的stateValue: {{stateValue}}</p>
        <p>idValue: {{idValue}}</p>
      </div>
    '),
  })
  class HeroComponent implements
    OnInit,
    BeforeMount,
    AfterMount,
    HasRender,
    WatchState,
    ReceiveProps,
  {
    public setState: SetState;
    public state: any;
    public props: any;

    public nvOnInit() {
      this.state = {
        idValue: this.props.idValue,
        stateValue: this.props.stateValue,
      };
    }

    public nvBeforeMount() {
      console.log('component in BeforeMount');
    }

    public nvAfterMount() {
      console.log('component in AfterMount');
    }

    public nvHasRender() {
      console.log('component in HasRender');
    }

    public nvWatchState(oldState?: any) {
      console.log('component in WatchState');
    }

    public nvReceiveProps(nextProps: any): void {
      this.state.idValue = nextProps.idValue;
      this.setState({
        stateValue: nextProps.stateValue,
      });
    }

    public show(a: any) {
      this.props.handelClick(a);
    }
  }
 `,
      },
    ],
  },
];
