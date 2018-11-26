## InDiv

作为整个应用的入口，InDiv 负责启动整个应用并存储一些全局变量，并通过在模块或是组件指令上通过注入 class `InDiv` 来获取当前实例及方法。


## 公开方法

1. `public use(modal: IMiddleware<InDiv>): number` InDiv实例调用 中间件 的入口，传入中间件实例，并将在方法中调用中间件实例的的方法 `bootstrap(indivInstance: InDiv)` 将 InDiv 实例传入中间件(将在中间件中详细讲解)。

2. `bootstrapModule(Esmodule: Function): void` InDiv实例启动引导 根模块app.module.ts 的入口。传入 根模块 并开始相关初始化。

3. `init(): void` 初始化 InDiv 应用，整个应用中的初始化方法。

4. `renderComponent(BootstrapComponent: Function, renderDOM: Element, otherModule?: INvModule, otherInjector?: Injector): Promise<IComponent>` 渲染组件的公共方法，`RouteModule` 多次使用。

  - `BootstrapComponent: Function` 需要实例化的组件类
  - `renderDOM: Element` 实例化的地方
  - `otherModule?: INvModule` 如果来自非根组件，在这里指定
  - `otherInjector?: Injector` 如果 IOC 容器不是 `rootInjector`，需要在此指定
  - 返回 `Promise<IComponent>` 返回 promise 组件实例

5. `setComponentRender<S = any, P = any, V = any>(render: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void` 重置 InDiv 组件渲染方法，该方法接收2个参数，第一个是渲染方法，第二个是重新渲染调用的方法。如果没有传第二个参数 `reRender`，则无论怎么渲染都将调用 `render`。该方法可用于 **跨平台渲染** 修改渲染方法。

6. `getComponentRender(): { render: () => Promise<IComponent>, reRender: () => Promise<IComponent> }` 返回 InDiv 组件渲染的方法。

7. `getBootstrapComponent(): IComponent` 获取引导根组件是获得的根组件的`bootstrap`组件实例。

8. `setRouteDOMKey(routeDOMKey: string): void` 设置 InDiv 的路由出口 tag name。

9. `getRouteDOMKey(): string` 获取 InDiv 的路由出口 tag name。

10. `getRootModule(): INvModule` 获取根模块

11. `getDeclarations(): Function[]` 获取根模块上包括`imports`在内所有的`declarations`的组件和指令。
