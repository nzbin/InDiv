import { IDirective, DirectiveList, IComponent, Utils } from '@indiv/core';

import { CompileUtilForRepeat, CompileUtil } from './compile-utils';
import { buildDirectiveScope } from './compiler-utils';

const utils = new Utils();

const compileUtil = new CompileUtil();
/**
 * mountDirective for Directives in Component
 *
 * @export
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} componentInstance
 */
export function mountDirective<State = any, Props = any, Vm = any>(dom: Element, componentInstance: IComponent<State, Props, Vm>): void {
  const cacheStates: DirectiveList<IDirective<Props, Vm>>[] = [ ...componentInstance.directiveList ];
  directivesConstructor(dom, componentInstance);
  const directiveListLength = componentInstance.directiveList.length;
  for (let i = 0; i < directiveListLength; i ++) {
    const directive = componentInstance.directiveList[i];
    // find Directive from cache
    const cacheDirectiveIndex = cacheStates.findIndex(cache => cache.dom === directive.dom);
    const cacheDirective = cacheStates[cacheDirectiveIndex];

    // clear cache and the rest need to be destoried
    if (cacheDirectiveIndex !== -1) cacheStates.splice(cacheDirectiveIndex, 1);
    if (cacheDirective) {
      directive.scope = cacheDirective.scope;
      // old props: directive.scope.props
      // new props: directive.props
      if (!utils.isEqual(directive.scope.props, directive.props)) {
        if (directive.scope.nvReceiveProps) directive.scope.nvReceiveProps(directive.props);
        directive.scope.props = directive.props;
      }
    } else {
      directive.scope = buildDirectiveScope(directive.constructorFunction, directive.props, directive.dom as Element, componentInstance);
    }

    directive.scope.$indivInstance = componentInstance.$indivInstance;

    if (directive.scope.nvOnInit && !cacheDirective) directive.scope.nvOnInit();
    if (directive.scope.nvBeforeMount) directive.scope.nvBeforeMount();
  }
  // the rest should use nvOnDestory
  const cacheStatesLength = cacheStates.length;
  for (let i = 0; i < cacheStatesLength; i ++) {
    const cache = cacheStates[i];
    if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
  }
}

/**
 * construct Directives in Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {Element} dom
 * @param {IComponent<State, Props, Vm>} componentInstance
 */
export function directivesConstructor<State = any, Props = any, Vm = any>(dom: Element, componentInstance: IComponent<State, Props, Vm>): void {
  componentInstance.directiveList = [];
  const routerRenderNode = dom.querySelectorAll(componentInstance.$indivInstance.getRouteDOMKey())[0];

  componentInstance.declarationMap.forEach((declaration, name) => {
    if ((declaration as any).nvType !== 'nvDirective') return;

    const tags = dom.querySelectorAll(`*[${name}]`);
    Array.from(tags).forEach(node => {
      //  protect directive in <router-render>
      if (routerRenderNode && routerRenderNode.contains(node)) return;

      const attrValue = node.getAttribute(name);
      let props: any = null;

      // only attribute return
      if (!attrValue) {
        componentInstance.directiveList.push({
          dom: node,
          props,
          scope: null,
          constructorFunction: declaration,
        });
        return;
      }

      if (!/^\{(.+)\}$/.test(attrValue)) throw new Error(`Directive ${name} need use \{\} to wrap value!`);

      const prop = /^\{(.+)\}$/.exec(attrValue)[1];
      const valueList = prop.split('.');
      const key = valueList[0];

      // build props
      if (/^.*\(.*\)$/.test(prop)) {
        const utilVm = new CompileUtilForRepeat();
        const fn = utilVm._getVMFunction(componentInstance, prop);
        const args = prop.match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
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
          if (!/^\'.*\'$/.test(arg) && !/^\".*\"$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
          if (node.repeatData) {
            // $index in this
            Object.keys(node.repeatData).forEach(data => {
              if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
            });
          }
        });
        const value = fn.apply(componentInstance, argsList);
        props = value;
      } else if (compileUtil.isFromVM(componentInstance, prop)) props = compileUtil._getVMVal(componentInstance, prop);
      else if (node.repeatData && node.repeatData.hasOwnProperty(key)) props = compileUtil._getValueByValue(node.repeatData[key], prop, key);
      else if (/^\'.*\'$/.test(prop)) props = prop.match(/^\'(.*)\'$/)[1];
      else if (/^\".*\"$/.test(prop)) props = prop.match(/^\"(.*)\"$/)[1];
      else if (!/^\'.*\'$/.test(prop) && !/^\".*\"$/.test(prop) && /^[0-9]*$/.test(prop)) props = Number(prop);
      else if (prop === 'true' || prop === 'false') props = (prop === 'true');
      else if (prop === 'null') props = null;
      else if (prop === 'undefined') props = undefined;

      componentInstance.directiveList.push({
        dom: node,
        props,
        scope: null,
        constructorFunction: declaration,
      });
    });
  });
}

/**
 * render Directive with using renderNode and RenderTask instance
 *
 * @export
 * @param {Element} renderNode
 * @param {IComponent} componentInstance
 * @returns {Promise<IDirective>}
 */
export async function directiveCompiler(renderNode: Element, componentInstance: IComponent): Promise<IDirective> {
  return Promise.resolve()
    .then(() => {
      mountDirective(renderNode, componentInstance);
      const directiveListLength = componentInstance.directiveList.length;
      for (let i = 0; i < directiveListLength; i++) {
        const directive = componentInstance.directiveList[i];
        if (directive.scope.nvAfterMount) directive.scope.nvAfterMount();
        if (directive.scope.nvHasRender) directive.scope.nvHasRender();
      }
      return componentInstance;
    })
    .catch(e => {
      throw new Error(`directive ${(componentInstance.constructor as any).selector} render failed: ${e}`);
    });
}
