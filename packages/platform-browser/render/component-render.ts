import { IComponent, ComponentList, Utils } from '@indiv/core';

import { Compile, CompileUtilForRepeat, CompileUtil } from '../compile';
import { getPropsValue, buildProps, buildComponentScope } from './render-utils';
import { directiveRenderFunction } from './directive-render';
import { RenderTaskQueue } from './render-task-queue';

const utils = new Utils();

const compileUtil = new CompileUtil();
/**
 * mountComponent for Components in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export function mountComponent<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  const cacheStates: ComponentList<IComponent<State, Props, Vm>>[] = [ ...vm.$componentList ];
  componentsConstructor(dom, vm);
  const componentListLength = vm.$componentList.length;
  for (let i = 0; i < componentListLength; i ++) {
    const component = vm.$componentList[i];
    // find Component from cache
    const cacheComponentIndex = cacheStates.findIndex(cache => cache.dom === component.dom);
    const cacheComponent = cacheStates[cacheComponentIndex];

    // clear cache and the rest need to be destoried
    if (cacheComponentIndex !== -1) cacheStates.splice(cacheComponentIndex, 1);
    if (cacheComponent) {
      component.scope = cacheComponent.scope;
      // old props: component.scope.props
      // new props: component.props
      if (!utils.isEqual(component.scope.props, component.props)) {
        if (component.scope.nvReceiveProps) component.scope.nvReceiveProps(component.props);
        component.scope.props = component.props;
      }
      // change hasRender to true
      component.hasRender = true;
    } else {
      component.scope = buildComponentScope(component.constructorFunction, component.props, component.dom as Element, vm);
    }

    component.scope.$vm = vm.$vm;

    if (component.scope.nvOnInit && !cacheComponent) component.scope.nvOnInit();
    if (component.scope.watchData) component.scope.watchData();
    if (component.scope.nvBeforeMount) component.scope.nvBeforeMount();
  }
  // the rest should use nvOnDestory
  const cacheStatesLength = cacheStates.length;
  for (let i = 0; i < cacheStatesLength; i ++) {
    const cache = cacheStates[i];
    if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
  }
}

/**
 * construct Components in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export function componentsConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  vm.$componentList = [];
  const routerRenderDom = dom.querySelectorAll(vm.$vm.getRouteDOMKey())[0];

  vm.$declarationMap.forEach((declaration, name) => {
    if ((declaration as any).nvType !== 'nvComponent') return;

    const tags = dom.getElementsByTagName(name);
    Array.from(tags).forEach(node => {
      // protect component in <router-render>
      if (routerRenderDom && routerRenderDom.contains(node)) return;
      // protect Component in Component
      if (!node.isComponent) return;

      const nodeAttrs = node.attributes;
      const props: any = {};

      if (nodeAttrs) {
        const attrList = Array.from(nodeAttrs);
        const _propsKeys: any = {};

        attrList.forEach((attr: any) => {
          if (/^\_prop\-(.+)/.test(attr.name)) {
            _propsKeys[attr.name.replace('_prop-', '')] = JSON.parse(attr.value);
            node.removeAttribute(attr.name);
          }
        });

        attrList.forEach((attr: any) => {
          let attrName: string = attr.name;

          if ((/^\_prop\-(.+)/.test(attrName))) return;

          const attrNameSplit = attrName.split('-');
          if (attrNameSplit.length > 1) {
            attrNameSplit.forEach((name, index) => {
              if (index === 0) attrName = name;
              if (index !== 0) attrName += name.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
            });
          }

          const prop = /^\{(.+)\}$/.exec(attr.value);
          if (prop) {
            const valueList = prop[1].split('.');
            const key = valueList[0];
            let _prop = null;
            if (compileUtil.isFromState(vm.state, prop[1])) {
              _prop = compileUtil._getVMVal(vm.state, prop[1]);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (/^(\@.).*\(.*\)$/.test(prop[1])) {
              const utilVm = new CompileUtilForRepeat();
              const fn = utilVm._getVMFunction(vm, prop[1]);
              const args = prop[1].replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
              const argsList: any[] = [];
              args.forEach(arg => {
                if (arg === '') return false;
                if (arg === '$element') return argsList.push(node);
                if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
                if (arg === 'null') return argsList.push(null);
                if (arg === 'undefined') return argsList.push(undefined);
                if (utilVm.isFromState(vm.state, arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
                if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
                if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
                if (node.repeatData) {
                  // $index in this
                  Object.keys(node.repeatData).forEach(data => {
                    if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
                  });
                }
              });
              const value = fn.apply(vm, argsList);
              props[attrName] = value;
              return;
            }
            if (/^(\@.).*[^\(.*\)]$/g.test(prop[1])) {
              _prop = compileUtil._getVMVal(vm, prop[1].replace(/^(\@)/, ''));
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (_propsKeys.hasOwnProperty(key)) {
              _prop = getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (node.repeatData && node.repeatData[key] !== null) {
              _prop = compileUtil._getValueByValue(node.repeatData[key], prop[1], key);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (/^\'.*\'$/.test(prop[1])) return props[attrName] = prop[1].match(/^\'(.*)\'$/)[1];
            if (!/^\'.*\'$/.test(prop[1]) && /^[0-9]*$/.test(prop[1])) return props[attrName] = Number(prop[1]);
            if (prop[1] === 'true' || prop[1] === 'false') return props[attrName] = (prop[1] === 'true');
            if (prop[1] === 'null') return props[attrName] = null;
            if (prop[1] === 'undefined') return props[attrName] = undefined;
          }

          // can't remove indiv_repeat_key
          if (attr.name !== 'indiv_repeat_key')  node.removeAttribute(attrName);
        });
      }

      vm.$componentList.push({
        dom: node,
        props,
        scope: null,
        constructorFunction: declaration,
        // init hasRender false
        hasRender: false,
      });
      // after construct instance remove isComponent
      node.isComponent = false;
    });
  });
}

/**
 * render Component with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {RenderTaskQueue} RenderTaskQueue
 * @returns {Promise<IComponent>}
 */
export async function componentRenderFunction(renderDom: Element, RenderTaskQueue: RenderTaskQueue): Promise<IComponent> {
  return Promise.resolve()
    .then(async() => {
      // compile has been added into Component instance by dirty method
      if (!(RenderTaskQueue.$vm as any).compile) ((RenderTaskQueue.$vm as any).compile as Compile) = new Compile(renderDom, RenderTaskQueue.$vm);
      ((RenderTaskQueue.$vm as any).compile as Compile).startCompile();

      // first mount directive
      await directiveRenderFunction(renderDom, RenderTaskQueue);

      // then mount component
      mountComponent(renderDom, RenderTaskQueue.$vm);
      const componentListLength = RenderTaskQueue.$vm.$componentList.length;
      for (let i = 0; i < componentListLength; i++) {
        const component = RenderTaskQueue.$vm.$componentList[i];
        if (component.hasRender) {
          component.scope.reRender();
        } else {
          // if component didn't rendered, it will render and set hasRender true
          component.scope.render();
          component.hasRender = true;
        }
        if (component.scope.nvAfterMount) component.scope.nvAfterMount();
      }
      if (RenderTaskQueue.$vm.nvHasRender) RenderTaskQueue.$vm.nvHasRender();
      return RenderTaskQueue.$vm;
    })
    .catch(e => {
      throw new Error(`component ${(RenderTaskQueue.$vm.constructor as any).$selector} render failed: ${e}`);
    });
}
