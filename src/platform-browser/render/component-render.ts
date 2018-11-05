import { IComponent, ComponentList, IRenderTaskQueue } from '../../types';

import { Compile } from '../compile';
import { Utils } from '../../utils';
import { CompileUtilForRepeat } from '../compile-utils';
import { getPropsValue, buildProps, buildScope } from './render-utils';

const utils = new Utils();

/**
 * mountComponent for Components in Component
 *
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
      component.scope = buildScope(component.constructorFunction, component.props, component.dom as Element, vm);
    }

    component.scope.$vm = vm.$vm;
    component.scope.$components = vm.$components;
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
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} vm
 */
export function componentsConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  vm.$componentList = [];
  const routerRenderDom = dom.querySelectorAll(vm.$vm.$routeDOMKey)[0];
  (vm.constructor as any)._injectedComponents.forEach((value: Function, key: string) => {
    if (!vm.$components.find((component: any) => component.$selector === key)) vm.$components.push(value);
  });
  const componentsLength = vm.$components.length;
  for (let i = 0; i < componentsLength; i++) {

    const name = ((vm.$components[i]) as any).$selector;
    const tags = dom.getElementsByTagName(name);
    Array.from(tags).forEach(node => {
      //  protect component in <router-render>
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
            if (/^(\$\.).*/g.test(prop[1])) {
              _prop = vm.compileUtil._getVMVal(vm.state, prop[1]);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (/^(\@.).*\(.*\)$/g.test(prop[1])) {
              const utilVm = new CompileUtilForRepeat();
              const fn = utilVm._getVMFunction(vm, prop[1]);
              const args = prop[1].replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
              const argsList: any[] = [];
              args.forEach(arg => {
                if (arg === '') return false;
                if (arg === '$element') return argsList.push(node);
                if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
                if (/(\$\.).*/g.test(arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
                if (/\'.*\'/g.test(arg)) return argsList.push(arg.match(/\'(.*)\'/)[1]);
                if (!/\'.*\'/g.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
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
              _prop = vm.compileUtil._getVMVal(vm, prop[1].replace(/^(\@)/, ''));
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (_propsKeys.hasOwnProperty(key)) {
              _prop = getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
            if (node.repeatData && node.repeatData[key] !== null) {
              _prop = vm.compileUtil._getValueByValue(node.repeatData[key], prop[1], key);
              props[attrName] = buildProps(_prop, vm);
              return;
            }
          }

          // can't remove indiv_repeat_key
          if (attr.name !== 'indiv_repeat_key')  node.removeAttribute(attrName);
        });
      }

      vm.$componentList.push({
        dom: node,
        props,
        scope: null,
        constructorFunction: vm.$components[i],
        // init hasRender false
        hasRender: false,
      });
      // after construct instance remove isComponent
      node.isComponent = false;
    });
  }
}

/**
 * render Component with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {IRenderTaskQueue} vm
 * @returns {Promise<IComponent>}
 */
export async function renderFunction(renderDom: Element, vm: IRenderTaskQueue): Promise<IComponent> {
  return Promise.resolve()
    .then(() => {
      const compile = new Compile(renderDom, vm.$vm);
      mountComponent(renderDom, vm.$vm);
      const componentListLength = vm.$vm.$componentList.length;
      for (let i = 0; i < componentListLength; i++) {
        const component = vm.$vm.$componentList[i];
        // if component has rendered , it will reRender
        if (component.hasRender) {
          component.scope.reRender();
        } else {
          // if component didn't rendered, it will render and set hasRender true
          component.scope.render();
          component.hasRender = true;
        }
        if (component.scope.nvAfterMount) component.scope.nvAfterMount();
      }
      if (vm.$vm.nvHasRender) vm.$vm.nvHasRender();
      return vm.$vm;
    })
    .catch(e => {
      throw new Error(`component ${(vm.$vm.constructor as any).$selector} render failed: ${e}`);
    });
}
