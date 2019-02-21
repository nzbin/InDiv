<a name="2.0.5"></a>
# [2.0.5](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.5) (2019-02-21)

I am sorry, that npm packages are empty.

Now from v2.0.5 all will not be empty.

### Fix

* **package:@indiv/core** fix npm
* **package:@indiv/common** fix npm
* **package:@indiv/platform-browser** fix npm
* **package:@indiv/platform-server** fix npm
* **package:@indiv/router** fix npm
* **package:@indiv/indiv-loader** fix npm



<a name="2.0.4"></a>
# [2.0.4](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.4) (2019-02-21)


### Features

* **package:@indiv/core** add `templateUrl` in `@Component`
* **package:@indiv/indiv-loader** add webpack loader for AOT

### Fix

* **package:@indiv/common** fix npm peerDependencies version
* **package:@indiv/platform-browser** fix npm peerDependencies version
* **package:@indiv/platform-server** fix npm peerDependencies version
* **package:@indiv/router** fix npm peerDependencies version



<a name="2.0.3"></a>
# [2.0.3](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.3) (2019-02-15)


### Performance Improvements

* **package:@indiv/core** save `parseVnodeOptions` and `templateVnode` in Component instance，now will compile template to vnode once
* **package:@indiv/core** now `@Component` and `@Directive` can be found in `provide` of `rootInjector` as unsingleton instance

### Fix

* **package:@indiv/route** fix `RouteCanActive` with `redirectTo`



<a name="2.0.2"></a>
# [2.0.2](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.2) (2019-02-05)


### Features

* **package:@indiv/core** now `NvModule` can be injected as singleton dependency in DI
* **package:@indiv/core** optimize DI in `Indiv` and `Renderer`



<a name="2.0.1"></a>
# [2.0.1](https://github.com/DimaLiLongJi/InDiv/releases/tag/2.0.1) (2019-02-04)


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

