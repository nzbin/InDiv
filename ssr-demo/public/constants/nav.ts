export const navs = () => [
    {
        name: '介绍',
        to: '/introduction',
    },
    {
        name: '概览',
        to: '/architecture',
    },
    {
        name: '文档',
        to: '/docs',
        child: [
            {
                name: '组件',
                to: '/docs/component',
            },
            {
                name: '模板语法',
                to: '/docs/template',
            },
            {
                name: '服务 与 依赖注入',
                to: '/docs/service',
            },
            {
                name: '模块',
                to: '/docs/module',
            },
            {
                name: '路由 与 导航',
                to: '/docs/route',
            },
            {
                name: '引导启动',
                to: '/docs/indiv',
            },
            {
                name: '工具函数',
                to: '/docs/libs',
            },
            {
                name: 'HTTP',
                to: '/docs/http',
            },
        ],
    },
    {
        name: '服务端渲染',
        to: '/ssr',
    },
    {
        name: '中间件及其他开发',
        to: '/middleware',
    },
];
