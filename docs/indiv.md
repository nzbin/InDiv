## InDiv

作为整个应用的入口，InDiv 负责启动整个应用并存储一些全局变量，并通过在模块或是组件指令上通过注入 class `InDiv` 来获取当前实例及方法。


## 公开方法

1. `public use(Plugin: Type<IPlugin>): number` InDiv实例调用 插件 的入口，传入实现了`IPlugin`的类，InDiv 负责实例化插件并将在调用插件实例的的方法 `bootstrap(indivInstance: InDiv)` 将 InDiv 实例传入插件(将在插件中详细讲解)。

2. `bootstrapModule(Nvmodule: Function): void` InDiv实例启动引导 根模块app.module.ts 的入口。传入根模块并开始相关模块的初始化。

3. `init(): void` 初始化 InDiv 应用，整个应用中的初始化方法。

4. `renderComponent(BootstrapComponent: Function, renderDOM: Element, otherModule?: INvModule): Promise<IComponent>` 渲染组件的公共方法，`RouteModule`中 多次使用。

  - `BootstrapComponent: Function` 需要实例化的组件类
  - `renderDOM: Element` 实例化的地方
  - `otherModule?: INvModule` 如果来自非根模块，在这里指定，并使用`otherModule`的 IOC容器`injector` 去注入服务给组件
  - 返回 `Promise<IComponent>` 返回 promise 组件实例

5. `setComponentCompiler(compiler: (renderNode: Element | any, componentInstace: IComponent) => Promise<IComponent>): void` 重置 InDiv 组件编译方法，该方法接收1个参数，为即将在组件中使用的编译方法。该方法可用于 **跨平台渲染** 修改编译方法。

6. `getComponentCompiler(): (renderNode: Element | any, componentInstace: IComponent) => Promise<IComponent>` 返回 InDiv 组件编译的方法。

7. `getBootstrapComponent(): IComponent` 获取引导根组件是获得的根组件的`bootstrap`组件实例。

8. `setRouteDOMKey(routeDOMKey: string): void` 设置 InDiv 的路由出口 tag name。

9. `getRouteDOMKey(): string` 获取 InDiv 的路由出口 tag name。

10. `getRootModule(): INvModule` 获取根模块

11. `getDeclarations(): Function[]` 获取根模块上包括`imports`在内所有的`declarations`的组件和指令。

12. `setRootElement(node: any): void` 设置整个应用挂载的节点，不一定是Element类型，可以是任意类型仅仅为编译器使用，常用用于跨平台渲染

13. `getRootElement(): any` 获取整个应用挂载的节点，不一定是Element类型，可以是任意类型仅仅为编译器使用，常用用于跨平台渲染
