export const routeInfo = () => [
  {
    h1: '路由 与 导航',
    p: [
      '类似于其他前端框架，InDiv 也提供了一套路由来帮助页面渲染。让用户从一个视图导航到另一个视图。',
      '它们应该聚焦于展示数据，而把数据访问的职责委托给某个服务。',
      'InDiv 的 Router（即“路由器”）借鉴了这个浏览器的导航模型。',
      '它把浏览器中的 URL 看做一个操作指南， 据此导航到一个由客户端生成的视图，并可以把参数传给支撑视图的相应组件，帮它决定具体该展现哪些内容。',
      '你可以为页面中的链接绑定一个路由，这样，当用户点击链接时，就会导航到应用中相应的视图。',
      '当用户点击按钮、从下拉框中选取，或响应来自任何地方的事件时，你也可以在代码控制下进行导航。',
      '路由器还在浏览器的历史日志中记录下这些活动，这样浏览器的前进和后退按钮也能照常工作。',
    ],
    info: [
      {
        title: '配置路由',
        p: [
          `该配置为一个数组，需要设置 跟路由 '/'`,
          '每个对应的路由应该有四个键值对，可以引入 TRouter 来看所有类型',
        ],
        pchild: [
          '1. path: string; 路径，提供代码直接更改或在浏览器里访问, 可以设置成 /:id 这种params模式，但不能设置其他同级路由。',
          '2. component?: string; 需要渲染的 组件（component） 的 selector，如果没有 子路由（children） 并且有 重定向（redirectTo） 可以不写该项 ',
          '3. redirectTo?: string; 当访问此路径时，需要重定向的地址，值为路由的完整路径。',
          '4. children?: TRouter[]， 子路由，TRouter 重复上述所有配置',
        ],
        code: `
  const routes: TRouter[] = [
    {
      path: '/',
      redirectTo: '/introduction',
      component: 'root-component',
      children: [
        {
          path: '/introduction',
          component: 'introduction-container',
        },
        {
          path: '/docs',
          redirectTo: '/docs/component',
          component: 'docs-container',
          children: [
            {
                path: '/component',
                component: 'docs-component-container',
            },
            {
                path: '/template',
                redirectTo: '/docs/component',
                children: [{
                  path: '/:id',
                  component: 'docs-id-container',
                }]
            },
          ],
        },
      ],
    },
  ];
 `,
      },
      {
        title: '路由 Router',
        p: [
          '需要声明一份路由的配置 router: TRouter[]，来告诉 路由（Router） 应该以什么样的模式渲染页面。',
          `需要调用 setRootPath(rootPath: string): void 方法，声明一个 根路径（rootPath） 。如未声明，将把 '/' 当做根路径。`,
          '路由提供一个 routeChange 的事件，可以监听到全局的路由变化。',
        ],
        pchild: [
          '需要根据如下顺序设置路由',
          '1. 设置跟路由',
          '2. 初始化路由',
          '3. 开始监听路由变化',
        ],
        code: `
  import { Route, TRouter } from 'InDiv';

  const router = new Router();

  const routes: TRouter[] = ....;

  router.setRootPath('/demo');
  router.init(routes);
  router.routeChange = (old: string, next: string) => {};
 `,
      },
      {
        title: '工具函数',
        p: [
          'InDiv 提供了一些函数，来方便跳转或获取路由相关参数。',
          '在组件（component）里可以通过引入相应的类型来使用。',
        ],
        pchild: [
          '1. SetLocation: <Q, P>(path: string, query?: Q, params?: P, title?: string) => void;',
          '2. GetLocation: () => { path: string; query?: any; params?: any; data?: any; };',
          'path: string; 当前路由的路径',
          'query?: string; 拼在路由后面的query, request.query',
          'params?: any; 如果该路径为 /:id 类似这种模式，则params 为 {id: 123}',
          'data?: any; 额外传递的值',
          'title?: string; 跳转路由时需要更改的 title',
          '3. 从v1.2.1开始，实例上将无法找到 setLocation, getLocation 方法，你需要在 indiv包 中手动引入并赋值给实例的一个方法。但在v1.2.0及之前版本都存在于实例中。',
        ],
        code: `
  // import { GetLocation, SetLocation } from 'InDiv'; v1.2.1之前都可以在实例上找到，因此无需引入
  import { GetLocation, SetLocation, setLocation, getLocation } from 'InDiv';
  
  class RoutrComponent {
    public getLocation: GetLocation;
    public setLocation: SetLocation;

    constructor() {
      this.getLocation = getLocation;
      this.setLocation = setLocation;
    }
    public nvOnInit() {
      console.log('this.getLocation', this.getLocation());
      this.setLocation('/R1/C1/D1', { b: '1' });
    }
  }
 `,
      },
    ],
  },
];
