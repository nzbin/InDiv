## log

1. 2018-04-28 init program
  - add route and Life cycle

2. 2018-04-29 add watcher
  - add new life cycle: `$watchState` and `$beforeInit`
  - add new class: `Controller`
  - add watcher for state in `Controller` and `Component`

3. 2018-04-30 separate `Controller` and `Component`
  - add new class: `Component`
  - add new life cycle: `$replaceComponent` in class `Controller`

4. 2018-05-01 optimize `Controller` and `Component`
  - add new class `Lifecycle`
  - add new life cycle: `$routeChange` in class `Router`
  - optimize `Controller` and `Component`
  - fix lifecycle of class `Component`

5. 2018-05-02 optimize `Component` and `Controller`
  - add `props` in `Component` when new an instance in `Controller`
  - add two types for `props` for `Component` : value or action
  - optimize `Controller` and `Component`, update `props` in `Component`
  - update the declaration of `Component` in `Controller`
  - add new function `$setProps` for update `props` in `Component`
  - add new lifecycle `$hasRender` for update `props` in `Component` and `Controller`

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

8. 2018-05-03/04 add Template Syntax : `es-repeat="let x in this.state.xxx"`

9. 2018-05-11 strengthen `es-repeat` and function in Template Syntax

10. 2018-05-18 fix `es-repeat`
  - template must be parceled by a father Dom in class `Controller`
  - fix es-repeat can't be compiled exactly

11. 2018-05-19 add `es-if`
  - add `es-if`
  - fix `setProp` and `$setState`, now u can set `false`, `0`

12. 2018-05-26 add `Router` and `RouterHash` and `KeyWatcher`
  - add `Router` and `RouterHash`
  - add `this.$location.go` and `this.$location.state` in `Component` and `Controller`

13. 2018-05-27 reset `props`
  - now thie `props` is an **unidirectional data flow**,can only be changed in Component.If u want to change it in father Controller, plase use callback to change state in father Controller.

14. 2018-05-28 add `this.$componentList` in class `Component`
