export const httpInfo = () => [
  {
    h1: 'HTTP',
    p: [
      'Class NVHttp 是 InDiv 通过 HTTP 与远程服务器通讯的机制。',
    ],
    info: [
      {
        title: 'NVHttp',
        p: [
          '通过封装 axios 库，InDiv 可以通过 NVHttp 发送网络请求。',
          'NVHttp 共封装了5中方法，可以直接注入 NVHttp 使用该类的非单例实例，也可以自己 new 出一个实例。',
          '如果需要更多方法，欢迎通过使用 axios 来获得更多体验。',
        ],
        pchild: [
          '1. get: <P = any, R = any>(url: string, params?: P): Promise<R>;',
          '2. delete: <P = any, R = any>(url: string, params?: P): Promise<R>;',
          '3. post?<P = any, R = any>(url: string, params?: P): Promise<R>;',
          '4. put?<P = any, R = any>(url: string, params?: P): Promise<R>;',
          '5. patch?<P = any, R = any>(url: string, params?: P): Promise<R>;',
        ],
        code: `
  import { NVHttp, NvModule,  } from 'InDiv';

  @NvModule({
    components: [
      DocsContainer,
    ],
    providers: [
      NVHttp
    ],
  })
  class DocsModule { }
  @Component({
    selector: 'docs-container',
    template: ('
      <div class="page-wrapper">
        <p></p>
      </div>
    '),
  })
  class DocsContainer {
    constructor( privite nvHttp: NVHttp ) {
      nvHttp.get(url, params);
      nvHttp.delete(url, params);
      nvHttp.post(url, params);
      nvHttp.put(url, params);
      nvHttp.patch(url, params);
    }
  }
 `,
      },
    ],
  },
];
