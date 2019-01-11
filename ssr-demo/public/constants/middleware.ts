export const middlewareInfo = () => [
    {
      h1: '中间件 及 其他开发',
      p: [
        '中间件是一个在 InDiv 挂载根模块（bootstrapModule(NvModule: Function): void;）之后初始化程序（init: () => void;）之前被调用的对象。',
        '中间件接收 InDiv 实例上的全部属性及方法，因此中间件可以修改 InDiv 的行为。',
        '插件可以是 InDiv模块（NvModule），也可以就是一个可以提供给providers的服务。',
      ],
      info: [
        {
          title: '中间件',
          p: [
            '中间件应该是一个类型为 interface IMiddleware<InDiv> { bootstrap(vm: InDiv): void; } 的对象。',
            '中间件对象应有 bootstrap 方法，接收整个 InDiv 实例。',
            '可以通过修改 InDiv 实例上的全部属性及方法，改变整个应用的行为。',
            'InDiv 实例会暴露如下方法及属性：',
          ],
          pchild: [
            '1. modalList: IMiddleware<InDiv>[]; 中间件的列表',
            '2. rootDom: Element; 挂载在页面的元素',
            '3. $rootPath: string; 根地址，提供给路由器使用',
            '4. $canRenderModule: boolean; 可否渲染根模块提供的 bootstrap',
            '5. $routeDOMKey: string; 挂载路由的元素tagName',
            '6. $rootModule: INvModule; 根模块',
            '7. $components: Function[]; 根模块暴露出的组件类',
            '8. setRootPath: (rootPath: string) => void; 更改设置根地址',
            '9. bootstrapModule: (NvModule: Function) => void; 引导初始化根模块',
            '10. v1.2.1新增: render() => Promise<IComponent>; 组件初次异步渲染的方法，返回一个Promise<IComponent>',
            '11. v1.2.1新增: reRender() => Promise<IComponent>; 组件非初次异步渲染的方法，返回一个Promise<IComponent>',
          ],
        },
        {
          title: '其他开发',
          pchild: [
            '可以提供模块（NvModule），在 exports: Function[] 中导出提供给开发者的组件，并像普通的模块一样使用。',
            '也可以提供服务，并像普通的服务一样使用。',
          ],
        },
      ],
    },
  ];
  
