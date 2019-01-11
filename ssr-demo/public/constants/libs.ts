export const libInfo = () => [
  {
    h1: '工具函数',
    p: [
      '在开发过程中，使用了一些工具函数，现在我把它们继承在一个 Utils 类里。',
      '可以通过依赖注入系统注入直接使用该类的非单例实例，也可以自行 new 出一个实例。',
    ],
    info: [
      {
        title: 'Utils',
        p: [
          'Utils 暴露出共6个方法',
        ],
        pchild: [
          '1. setCookie(name: string, value: any, options?: any): void; 设置 cookie',
          '2. getCookie(name: string): any; 获取 cookie',
          '3. removeCookie(name: string): boolean; 移除 cookie',
          '4. getQuery(name: string): string; 获得location上query的某个字段' ,
          '5. isFunction(func: any): boolean; 判断是否是function' ,
          '6. isEqual(a: any, b: any): boolean; 深度判断两个东西是否相同',
          '7. isBrowser(): boolean; 判断是否为浏览器环境',
        ],
        code: `
  import { Utils, NvModule } from 'InDiv';

  const utils = new Utils;

  @NvModule({
    components: [
      DocsContainer,
    ],
    providers: [
      Utils
    ],
  })
  class DocsModule { }
 `,
      },
    ],
  },
];
