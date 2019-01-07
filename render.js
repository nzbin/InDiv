const { renderToString } = require('@indiv/platform-server');
const ssrData = require('./dist/app');
console.log(11111111, ssrData);
const routes = [
  {
    path: '/',
    children: [
      {
        path: '/R1',
        component: 'R1',
        children: [
          {
            path: '/C1',
            loadChild: {
              name: 'LoadchildModule',
              child: require('./dist/0'),
            },
            children: [
              {
                path: '/D1',
                component: 'R2',
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

async function render(url) {
  const content = await renderToString(ssrData.inDiv, url, routes);
  return content;
}

module.exports = render;
