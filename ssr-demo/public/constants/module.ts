export const moduleInfo = () => [
  {
    h1: 'InDiv 模块',
    p: [
      'JavaScript 和 InDiv 都使用模块来组织代码，虽然它们的组织形式不同，但 InDiv 的应用会同时依赖两者。',
      '此处不过多讲 JavaScript 模块，而着重叙述 InDiv 模块。',
    ],
    info: [
      {
        title: '装饰器 NvModule',
        p: [
          'NvModule 是一些带有 @NvModule 装饰器的类。',
          '@NvModule 装饰器的 会告诉 InDiv 哪些其它的东西是当前模块所需的。',
          '@NvModule 接收5个参数。',
        ],
        pchild: [
          '声明某些组件（component）、服务（service）属于这个模块',
          '公开其中的部分组件，以便其它模块中的组件模板中可以使用它们',
          '导入其它带有组件、服务的模块（NvModule），这些模块中的元件都是本模块所需的',
          '提供一些供应用中的其它组件使用的服务',
        ],
        code: `
  // in TypeScript
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
      {
        provide: HeroSearchService1,
        useClass: HeroSearchService1,
      },
      {
        provide: ValueClass,
        useValue: '12324',
      },
    ],
  })
  export default class M1 {}

  // in JavaScript
  export default class M1 {}
  NvModule({
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
      {
        provide: 'heroSearchService',
        useClass: HeroSearchService,
      },
      {
        provide: 'heroSearchService1',
        useClass: HeroSearchService1,
      },
      {
        provide: 'valueClass',
        useValue: '12324',
      },
    ],
  })(M1);
 `,
      },
      {
        title: '1. imports 导入模块',
        p: [
          'imports?: Function[];',
        ],
        pchild: [
          'imports 数组 会告诉 InDiv 哪些其它的 模块 是当前 模块 所需的',
          'imports 数组中的这些模块（NvModule）与 JavaScript 模块不同，它们都是 NvModule 而不是常规的 JavaScript 模块。',
          '而是因为它带有 @NvModule 装饰器及其元数据。',
          '被 imports 的 模块 一定要有 exports，否则将无效。',
        ],
        code: `
  // NvModule M2
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

  // NvModule M1
  @NvModule({
    imports: [
      M2,
    ],
    components: [
      Container,
    ],
  })
  export default class M1 {}
 `,
      },
      {
        title: '2. components 声明组件',
        p: [
          'components: Function[];',
        ],
        pchild: [
          'components 用来声明 组件 。',
          '在 NvModule 中被声明的 组件 里，可以直接使用该 NvModule 中声明过的 组件 和被 imports 进来的 模块 导出过的 组件。',
        ],
        code: `
  // NvModule M2
  @Component({
    selector: 'pp-childs',
    template: (\`
      <div>
        <p>子组件</p>
      </div>
    \`),
  })
  class PCChild {}

  @NvModule({
    components: [
      PCChild,
    ],
    exports: [
      PCChild,
    ],
  })
  class M2 {}


  // NvModule M1
  @Component({
    selector: 'cc-ontainer',
    template: (\`
      <div>
        <pp-childs></pp-childs>
      </div>
    \`),
  })
  class Container {}

  @NvModule({
    imports: [
      M2,
    ],
    components: [
      Container,
    ],
  })
  export default class M1 {}

 `,
      },
      {
        title: '3. providers 声明被提供的服务',
        p: [
          'providers 用来声明被提供的服务。',
          '服务可以被声明在 模块 的 providers 中。',
          '被声明后，所有该模块的组件，被该模块导出的组件，和该模块中的服务都可以直接依赖模块中的所有服务。',
        ],
        pchild: [
          'providers 有三种类型',
          '1. Function (相当于{provide: Function; useClass: Function;}的简写)，最简便的方法，但在 JavaScript 中无法使用',
          '2. { provide: any; useClass: Function; } 该类型将提供 provide 作为injectToken，并将 useClass 实例化提供给 DI 系统',
          '3. { provide: any; useValue: any; } 该类型将提供 provide 作为injectToken，并将 useValue 直接提供给 DI 系统',
          '在 TypeScript 中三种类型都可以使用，但 provide 必须为类(provide: Function)，因为要通过反射拿到 constructor 的参数类型作为 injectToken 进行匹配',
          '但在 JavaScript 中，仅仅可以使用后两种对象的形式，通过主动声明 provide 为字符串(provide: string)，再通过 Class 的静态属性 injectTokens 进行匹配',
        ],
        code: `
  // in TypeScript
  @Injected
  @Component({
    selector: 'pp-childs',
    template: ('
      <div>
        <p>子组件</p>
      </div>'),
  })
  class PCChild {
    constructor (
      private heroS: HeroSearchService2,
    ) {
      this.service = heroS;
    }
  }

  @NvModule({
    components: [
      PCChild,
    ],
    providers: [
      HeroSearchService2,
    ],
    exports: [
      PCChild,
    ],
  })
  class M2 {}


  // in JavaScript
  class PCChild {
    static injectTokens = [
      'heroSearchService2'
    ];

    constructor (
      private heroS,
    ) {
      this.service = heroS;
    }
  }
  Component({
    selector: 'pp-childs',
    template: (\`
      <div>
        <p>子组件</p>
      </div>
    \`),
  })(PCChild)

  class M2 {}
  NvModule({
    components: [
      PCChild,
    ],
    providers: [
      {
        provide: 'heroSearchService2',
        useClass: HeroSearchService2,
      },
    ],
    exports: [
      PCChild,
    ],
  })(M2)
 `,
      },
      {
        title: '4. exports 模块导出的组件',
        p: [
          'exports?: Function[];',
        ],
        pchild: [
          'exports 用来声明模块被导出的组件（component）。',
          '模块只能导出可声明的类。它不会声明或导出任何其它类型的类。',
          '被模块导出的组件，可以随意在 导入该模块的模块（NvModule） 中的 组件（component） 使用。',
          '被模块导出的组件，只能获取模块本身声明的依赖，组件本身声明的依赖，和根模块声明的依赖。',
          '从v1.2.1 除了组件外，模块可以导出其他模块。实际上相当于模块导出了 被导出模块 的exports。',
          '依赖此模块可以导出模块的特性，你可以写一个公共模块导出一些基础的组件或其他模块，然后导入该公共模块到根模块提供给全局使用！',
        ],
        code: `
  // common module
  @NvModule({
    components: [
      SomeCommonComponent,
    ],
    exports: [
      SomeCommonComponent,
    ],
  })
  class CommonModule {}

  // NvModule M2
  @Injectable
  @Component({
    selector: 'pp-childs',
    template: (\`
      <div>
        <p>子组件</p>
      </div>
    \`),
  })
  class PCChild {
    constructor (
      private heroS: HeroSearchService2,
    ) {
      this.service = heroS;
    }
  }

  @NvModule({
    components: [
      PCChild,
    ],
    providers: [
      HeroSearchService2,
    ],
    exports: [
      PCChild,
      CommonModule,
    ],
  })
  class M2 {}


  // NvModule M1
  @Component({
    selector: 'cc-ontainer',
    template: (\`
      <div>
        <pp-childs></pp-childs>
      </div>
    \`),
  })
  class Container {}

  @NvModule({
    imports: [
      M2,
    ],
    components: [
      Container,
    ],
  })
  export default class M1 {}

 `,
      },
      {
        title: '5. bootstrap 引导启动',
        p: [
          'bootstrap?: Function;',
        ],
        pchild: [
          '从分类上说，入口组件是 InDiv 命令式加载的任意组件。',
          '如果你没有使用路由，则需要在 根模块 中将一个 组件 声明给该项，被声明的 组件 将作为 入口组件 被 InDiv 渲染到页面。',
          '如果你使用路由，则无需对此项赋值，因为路由会自动根据配置去找到需要渲染的页面。',
        ],
        code: `
  @Component({
    selector: 'cc-ontainer',
    template: (\`
      <div>
        <pp-childs></pp-childs>
      </div>
    \`),
  })
  class Container {}

  @NvModule({
    components: [
      Container,
    ],
    bootstrap: Container,
  })
  export default class M1 {}
 `,
      },
    ],
  },
];
