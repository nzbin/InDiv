<a name="1.2.1"></a>
# [1.2.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v1.2.1) (2018-10-31)


### Features

* **package:** package size from 114kb to 80kb
* **package:** remove parcel and use rollup to compile package 
* **@NvModule:** `exports` can support `@NvModule`
* **@Component:** removed `setState, setLocation, getLocation` from instance of `@Component` and use `setState, setLocation, getLocation` from `import { setState, getLocation, setLocation } from 'indiv'`
* **Render:** add render task in `platform-browser/render` to replace `render`




<a name="1.2.0"></a>
# [1.2.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v1.2.0) (2018-10-12)


### Bug Fixes

* **DI:** fix dependency injection can't be used in mode of production

### Features

* **@Component:** optimize `setState` to avoid the waste of render
* **Router:** now render is a async function
* **@Injectable:** optimize service and can use `providers` in `@Component`
* **DI:** replace `@Service` `@Injectable` with `@Injectable` `@Injected`




<a name="1.1.0"></a>
# [1.1.0](https://github.com/DimaLiLongJi/InDiv/releases/tag/v1.1.0) (2018-09-20)

### Features

* **Virtual DOM:** rewrite virtual DOM to optimize performance
* **@Component:** add new template syntax: nv-ke
* **SSR:** now support SSR with package @indiv/ssr-renderer 



<a name="1.0.1"></a>
# [1.0.1](https://github.com/DimaLiLongJi/InDiv/releases/tag/v1.0.1) (2018-08-31)

### Bug Fixes

* **Virtual DOM:** fix VNode diff




<a name="1.0.0"></a>
# [1.0.1](https://github.com/DimaLiLongJi/InDiv/releases/tag/v1.0.0) (2018-08-31)
