<a name="2.0.1"></a>
# [2.0.1](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.0) (2019-02-04)


### Features

新年前最后一版！新年快乐！
* **package:@indiv/core** now `NvModule` will be push into `rootInjector` and it will be a singleton instance
* **package:@indiv/core** add methods: `getModuleFromRootInjector` for finding `NvModule` in `rootInjector`. If `NvModule` isn't in `rootInjector`, `rootInjector` will save instance of `NvModule` automatically
* **package:@indiv/core** add new property Decorator `StateSetter` for mapping function `setState`

### Fix

* **package:@indiv/core** fix `@Watch` can't watch property which is unassigned
* **package:@indiv/core** fix `@Input` can't set property which is unassigned



<a name="2.0.0"></a>
# [2.0.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.0) (2019-01-31)


### Features

* **package:@indiv/router** add navigation guards `RouteChange` `RouteCanActive`
* **package:@indiv/router** add new interface `IComponentWithRoute` `IDirectiveWithRoute`
* **package:@indiv/core** add methods: `initComponent` `runComponentRenderer`
* **package:@indiv/platform-server** synchronize navigation guards with @indiv/router



<a name="0.0.3-alpha.0"></a>
# [0.0.3-alpha.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v0.0.3-alpha.0) (2019-01-18)


### Features

* **package:@indiv/core** add @ViewChild and @ViewChildren
* **package:@indiv/core** optimize @Input

### Fix

* **package:@indiv/core** fix compile `nv-repeat`
* **package:@indiv/platform-server** fix nvLocation parmas



<a name="0.0.2-alpha.0"></a>
# [0.0.2-alpha.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v0.0.2-alpha.0) (2019-01-11)


### Features

* **package:@indiv/core** optimize render
* **package:@indiv/platform-server** add package of server side render



<a name="0.0.1-alpha.0"></a>
# [0.0.1-alpha.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v0.0.1-alpha.0) (2019-01-04)


### Features

* **package** now @indiv/core @indiv/common @indiv/platform-browser @indiv/router
* **Virtual DOM:** rewrite virtual DOM and renderer

