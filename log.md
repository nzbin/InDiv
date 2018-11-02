## log

1. 2018-04-28 init program
  - add route and Life cycle

2. 2018-04-29 add watcher
  - add new life cycle: `nvWatchState` and `$beforeInit`
  - add new class: `Controller`
  - add watcher for state in `Controller` and `Component`

3. 2018-04-30 separate `Controller` and `Component`
  - add new class: `Component`
  - add new life cycle: `$replaceComponent` in class `Controller`

4. 2018-05-01 optimize `Controller` and `Component`
  - add new class `Lifecycle`
  - add new life cycle: `nvRouteChange` in class `Router`
  - optimize `Controller` and `Component`
  - fix lifecycle of class `Component`

5. 2018-05-02 optimize `Component` and `Controller`
  - add `props` in `Component` when new an instance in `Controller`
  - add two types for `props` for `Component` : value or action
  - optimize `Controller` and `Component`, update `props` in `Component`
  - update the declaration of `Component` in `Controller`
  - add new function `setProps` for update `props` in `Component`
  - add new lifecycle `nvHasRender` for update `props` in `Component` and `Controller`

6. 2018-05-03/04 optimize
  - add new class `Utils`
  - add new class `Compile`
  - change renderComponent and use class `Compile`
  - add new **Template Syntax**

7. 2018-05-08 add `Watcher`
  - u can use this class `Watcher` to watch some data `new Watcher(data, func.bind(this))`
  - `func` must respect two arguments `(oldData, newData)` like
    ```
    watchSomething(oldData, newData) {}
    ```

8. 2018-05-03/04 add Template Syntax : `nv-repeat="let x in this.state.xxx"`

9. 2018-05-11 strengthen `nv-repeat` and function in Template Syntax

10. 2018-05-18 fix `nv-repeat`
  - template must be parceled by a father Dom in class `Controller`
  - fix nv-repeat can't be compiled exactly

11. 2018-05-19 add `nv-if`
  - add `nv-if`
  - fix `setProp` and `setState`, now u can set `false`, `0`

12. 2018-05-26 add `Router` and `RouterHash` and `KeyWatcher`
  - add `Router` and `RouterHash`
  - add `this.$location.go` and `this.$location.state` in `Component` and `Controller`

13. 2018-05-27 reset `props`
  - now thie `props` is an **unidirectional data flow**,can only be changed in Component.If u want to change it in father Controller, plase use callback to change state in father Controller.

14. 2018-05-28 add `this.$componentList` in class `Component`

15. 2018-07-10 add rewrite `Component`, discard `Controllor`, and add `NvModule`

16. 2018-07-14 finish singleton in `Service`

17. 2018-07-28 support for ts

18. 2018-08-12 fix nv-repeat, remove class `Component` `NvModule` `Service`, and add decorator `Component` `NvModule` `Service`

19. 2018-08-17 remove watch this.props and only use state and function in `Component` for `Component: template`

20. 2018-08-31 rename to InDiv

21. 2018-09-17 fix some bugs and support ssr render

22. 2018-09-18 rewrite virtual DOM algorithm

23. 2018-09-29 v1.2.0 write DI system and place  `@Service` `@Injectable` with `@Injectable` `@Injected`

24. 2018-10-04 add `providers` in `@Component`

25. 2018-10-6 `NvModule` now can use `NvModule` in `exports` and  removed `setState, setLocation, getLocation`. From v1.2.1 you can use `setState, setLocation, getLocation` from `import { setState, getLocation, setLocation } from 'indiv'`

26. 2018-10-31 add render task in `platform-browser/render` to replace `render`

27. 2018-11-02 add route lazy load and allow `@NvModule` can use service from it's `providers`
