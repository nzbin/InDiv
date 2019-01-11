export const inDivInfo = () => [
  {
    h1: '启动',
    p: [
      '通过引入 InDiv 来启动整个应用',
    ],
    info: [
      {
        title: '引导启动',
        p: [
          '现在我们配置好了 模块，组件，服务，和路由，',
          '开始引入核心来启动整个应用！',
        ],
        pchild: [
          '1. 实例化 InDiv',
          '2. 启动根模块（root NvModule）',
          '3. 使用 use 方法来启用中间件，例如 Route',
          '4. 使用 init 方法启动整个应用',
        ],
        code: `
  const inDiv = new InDiv();
  inDiv.bootstrapModule(M1);
  inDiv.use(router);
  inDiv.init();
 `,
      },
    ],
  },
];
