import { IComponent, ComponentList, Utils } from '@indiv/core';

import { Compile } from './compile';
import { CompileUtilForRepeat, CompileUtil } from './compile-utils';
import { getPropsValue, buildProps, buildComponentScope } from './compiler-utils';

import { directiveCompiler } from './directive-compiler';

const utils = new Utils();

const compileUtil = new CompileUtil();
/**
 * mountComponent for Components in Component
 *
 * @export
 * @param {Element} dom
 * @param {IComponent} componentInstance
 */
export function mountComponent(dom: Element, componentInstance: IComponent): void {
  const cacheComponentList: ComponentList<IComponent>[] = [ ...componentInstance.componentList ];
  componentsConstructor(dom, componentInstance);
  const componentListLength = componentInstance.componentList.length;
  for (let i = 0; i < componentListLength; i ++) {
    const component = componentInstance.componentList[i];
    // find Component from cache
    const cacheComponentIndex = cacheComponentList.findIndex(cache => cache.dom === component.dom);
    const cacheComponent = cacheComponentList[cacheComponentIndex];

    // clear cache and the rest need to be destoried
    if (cacheComponentIndex !== -1) cacheComponentList.splice(cacheComponentIndex, 1);
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
      component.scope = buildComponentScope(component.constructorFunction, component.props, component.dom as Element, componentInstance);
    }

    component.scope.$indivInstance = componentInstance.$indivInstance;

    if (component.scope.nvOnInit && !cacheComponent) component.scope.nvOnInit();
    if (component.scope.watchData) component.scope.watchData();
    if (component.scope.nvBeforeMount) component.scope.nvBeforeMount();
  }
  // the rest should use nvOnDestory
  const cacheComponentListLength = cacheComponentList.length;
  for (let i = 0; i < cacheComponentListLength; i ++) {
    const cache = cacheComponentList[i];
    if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
  }

  // after mount
  for (let i = 0; i < componentListLength; i++) {
    const component = componentInstance.componentList[i];
    if (!component.hasRender) component.hasRender = true;
    component.scope.render();
    if (component.scope.nvAfterMount) component.scope.nvAfterMount();
  }
  if (componentInstance.nvHasRender) componentInstance.nvHasRender();
}

/**
 * construct Components in Component
 *
 * @export
 * @param {Element} dom
 * @param {IComponent} componentInstance
 */
export function componentsConstructor(dom: Element, componentInstance: IComponent): void {
  componentInstance.componentList = [];
  const routerRenderNode = dom.querySelectorAll(componentInstance.$indivInstance.getRouteDOMKey())[0];

  componentInstance.declarationMap.forEach((declaration, name) => {
    if ((declaration as any).nvType !== 'nvComponent') return;

    const tags = dom.getElementsByTagName(name);
    Array.from(tags).forEach(node => {
      // protect component in <router-render>
      if (routerRenderNode && routerRenderNode.contains(node)) return;
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
            const propValue = prop[1];
            const valueList = propValue.split('.');
            const key = valueList[0];
            let _prop = null;
            if (/^.*\(.*\)$/.test(propValue)) {
              const utilVm = new CompileUtilForRepeat();
              const fn = utilVm._getVMFunction(componentInstance, propValue);
              const args = propValue.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
              const argsList: any[] = [];
              args.forEach(arg => {
                if (arg === '') return false;
                if (arg === '$element') return argsList.push(node);
                if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
                if (arg === 'null') return argsList.push(null);
                if (arg === 'undefined') return argsList.push(undefined);
                if (utilVm.isFromVM(componentInstance, arg)) return argsList.push(utilVm._getVMVal(componentInstance, arg));
                if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
                if (/^\".*\"$/.test(arg)) return argsList.push(arg.match(/^\"(.*)\"$/)[1]);
                if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/g.test(arg)) return argsList.push(Number(arg));
                if (node.repeatData) {
                  // $index in this
                  Object.keys(node.repeatData).forEach(data => {
                    if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
                  });
                }
              });
              const value = fn.apply(componentInstance, argsList);
              props[attrName] = value;
              return;
            }
            if (compileUtil.isFromVM(componentInstance, propValue)) {
              _prop = compileUtil._getVMVal(componentInstance, propValue);
              props[attrName] = buildProps(_prop, componentInstance);
              return;
            }
            if (_propsKeys.hasOwnProperty(key) || key in _propsKeys) {
              _prop = getPropsValue(valueList, _propsKeys[key]);
              props[attrName] = buildProps(_prop, componentInstance);
              return;
            }
            if (node.repeatData && node.repeatData.hasOwnProperty(key)) {
              _prop = compileUtil._getValueByValue(node.repeatData[key], propValue, key);
              props[attrName] = buildProps(_prop, componentInstance);
              return;
            }
            if (/^\'.*\'$/.test(propValue)) return props[attrName] = propValue.match(/^\'(.*)\'$/)[1];
            if (/^\".*\"$/.test(propValue)) return props[attrName] = propValue.match(/^\"(.*)\"$/)[1];
            if (!/^\'.*\'$/.test(propValue) && !/^\".*\"$/.test(propValue) && /^[0-9]*$/.test(propValue)) return props[attrName] = Number(propValue);
            if (propValue === 'true' || propValue === 'false') return props[attrName] = (propValue === 'true');
            if (propValue === 'null') return props[attrName] = null;
            if (propValue === 'undefined') return props[attrName] = undefined;
          }

          // can't remove indiv_repeat_key
          if (attr.name !== 'indiv_repeat_key')  node.removeAttribute(attrName);
        });
      }

      componentInstance.componentList.push({
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
 * render Component with using renderNode and RenderTask instance
 *
 * @export
 * @param {Element} renderNode
 * @param {IComponent} componentInstance
 * @returns {Promise<IComponent>}
 */
export async function componentCompiler(renderNode: Element, componentInstance: IComponent): Promise<IComponent> {
  return Promise.resolve()
    .then(async() => {
      // compile has been added into Component instance by dirty method
      if (!(componentInstance as any).compileInstance) ((componentInstance as any).compileInstance as Compile) = new Compile(renderNode, componentInstance);
      ((componentInstance as any).compileInstance as Compile).startCompile();

      // first mount directive
      await directiveCompiler(renderNode, componentInstance);

      // then mount component
      mountComponent(renderNode, componentInstance);

      return componentInstance;
    })
    .catch(e => {
      throw new Error(`component ${(componentInstance.constructor as any).selector} render failed: ${e}`);
    });
}
