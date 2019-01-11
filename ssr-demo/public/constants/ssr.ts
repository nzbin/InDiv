export const ssrInfo = () => [
    {
      h1: '服务端渲染（SSR）',
      p: [
        '标准的 InDiv 应用会运行在浏览器中，',
        '当 JavaScript 脚本加载完毕后，它会在 DOM 中渲染页面，以响应用户的操作。',
        '但是在特殊场景，比如 SEO，需要提升在低性能设备上的渲染速度，需要迅速显示首屏时，',
        '可能服务端渲染更适合。',
        '它可以生成这些页面，并在浏览器请求时直接用它们给出响应。',
      ],
      info: [
        {
          title: '工作原理',
          p: [
            '通过引入 @indiv/ssr-renderer v1.1.0+。',
            '@indiv/ssr-renderer 包提供了服务端的 DOM 实现，使得渲染 InDiv 应用不再依赖浏览器。',
            '通过 node 端，会把客户端对应用页面的请求传给 @indiv/ssr-renderer 中的 renderToString  函数，',
            '引入 indiv 实例和路由的配置对象，renderToString 会根据对应的路径，返回已经被渲染完的字符串模板。',
            '通过不同框架的渲染机制，将返回的字符串模板渲染到模板的 <div id="root"></div> 中。',
            '最后，服务器就会把渲染好的页面返回给客户端。',
          ],
          pchild: [
            '1. 生命周期受到限制，服务端渲染中仅仅支持 constructor 和 OnInit 的调用。',
            '2. 因为 InDiv 的 nvHttp 对象是封装的 axios 库，因此支持在 node 环境中使用 http 请求。',
            '3. 通过 nv-on:eventName 方式绑定的方法暂时无法渲染。',
          ],
        },
        {
          title: '环境及使用',
          p: [
            'Node.js: v6+',
            'indiv: v1.2.0+',
            '@indiv/ssr-renderer: v1.1.0+',
            '本例子使用 express 及 ejs 模板，你也可以选择适合的 服务端框架 及 模板 。',
          ],
          pchild: [
            '1. 创建 InDiv app',
            '2. 创建一个用于处理请求的 express Web 服务器',
            '3. 创建一个 ejs 模板',
            '4. 引入 @indiv/ssr-renderer 包 renderToString: (url: string, routes: TRouter[], indiv: InDiv) => string',
            '5. 将 request 的 url， indiv app路由配置对象，和 indiv实例 作为参数依次传入 renderToString',
            '6. 最后 renderToString 的返回值渲染至模板中',
          ],
          code: `
  // in index.ejs
  <div id="root">
    <%- content %>
  </div>

  // in service side
  const express = require('express');
  const renderToString = require('@indiv/ssr-renderer');

  const app = express();

  app.use('/indiv-doc', (request, response, next) => {    
    // import indiv app
    const ssrData = require('./dist/main.js');
    response.render('index.ejs', {
      // use in ejs template
      content: renderToString(request.url, ssrData.routes, ssrData.default.inDiv),
    });
  });
    `,
        },
      ],
    },
  ];
  
