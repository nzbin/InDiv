import { IDirective, DirectiveList, IComponent } from '../../types';

import { Utils } from '../../utils';
import { CompileUtilForRepeat, CompileUtil } from '../compile';
import { buildDirectiveScope } from './render-utils';
import { RenderTaskQueue } from './render-task-queue';

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
 * @param {IComponent<State, Props, Vm>} vm
 */
export function mountDirective<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  const cacheStates: DirectiveList<IDirective<Props, Vm>>[] = [ ...vm.$directiveList ];
  directivesConstructor(dom, vm);
  const directiveListLength = vm.$directiveList.length;
  for (let i = 0; i < directiveListLength; i ++) {
    const directive = vm.$directiveList[i];
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
      directive.scope = buildDirectiveScope(directive.constructorFunction, directive.props, directive.dom as Element, vm);
    }

    directive.scope.$vm = vm.$vm;

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
 * @param {IComponent<State, Props, Vm>} vm
 */
export function directivesConstructor<State = any, Props = any, Vm = any>(dom: Element, vm: IComponent<State, Props, Vm>): void {
  vm.$directiveList = [];
  const routerRenderDom = dom.querySelectorAll(vm.$vm.getRouteDOMKey())[0];

  vm.$declarationMap.forEach((declaration, name) => {
    if ((declaration as any).nvType !== 'nvDirective') return;

    const tags = dom.querySelectorAll(`*[${name}]`);
    Array.from(tags).forEach(node => {
      //  protect directive in <router-render>
      if (routerRenderDom && routerRenderDom.contains(node)) return;

      const attrValue = node.getAttribute(name);
      let props: any = null;

      // only attribute return
      if (!attrValue) {
        vm.$directiveList.push({
          dom: node,
          props,
          scope: null,
          constructorFunction: declaration,
        });
        return;
      }

      const valueList = attrValue.split('.');
      const key = valueList[0];

      // build props
      if (compileUtil.isFromState(vm.state, attrValue)) {
        props = compileUtil._getVMVal(vm.state, attrValue);
      } else if (/^(\@.).*\(.*\)$/.test(attrValue)) {
        const utilVm = new CompileUtilForRepeat();
        const fn = utilVm._getVMFunction(vm, attrValue);
        const args = attrValue.replace(/^(\@)/, '').match(/\((.*)\)/)[1].replace(/\s+/g, '').split(',');
        const argsList: any[] = [];
        args.forEach(arg => {
          if (arg === '') return false;
          if (arg === '$element') return argsList.push(node);
          if (arg === 'true' || arg === 'false') return argsList.push(arg === 'true');
          if (arg === 'null') return argsList.push(null);
          if (arg === 'undefined') return argsList.push(undefined);
          if (utilVm.isFromState(vm.state, arg)) return argsList.push(utilVm._getVMVal(vm.state, arg));
          if (/^\'.*\'$/.test(arg)) return argsList.push(arg.match(/^\'(.*)\'$/)[1]);
          if (!/^\'.*\'$/.test(arg) && /^[0-9]*$/.test(arg)) return argsList.push(Number(arg));
          if (node.repeatData) {
            // $index in this
            Object.keys(node.repeatData).forEach(data => {
              if (arg.indexOf(data) === 0 || arg.indexOf(`${data}.`) === 0) return argsList.push(utilVm._getValueByValue(node.repeatData[data], arg, data));
            });
          }
        });
        const value = fn.apply(vm, argsList);
        props = value;
      } else if (/^(\@.).*[^\(.*\)]$/g.test(attrValue)) props = compileUtil._getVMVal(vm, attrValue.replace(/^(\@)/, ''));
      else if (node.repeatData && node.repeatData[key] !== null) props = compileUtil._getValueByValue(node.repeatData[key], attrValue, key);
      else if (/^\'.*\'$/.test(attrValue)) props = attrValue.match(/^\'(.*)\'$/)[1];
      else if (!/^\'.*\'$/.test(attrValue) && /^[0-9]*$/.test(attrValue)) props = Number(attrValue);
      else if (attrValue === 'true' || attrValue === 'false') props = (attrValue === 'true');
      else if (attrValue === 'null') props = null;
      else if (attrValue === 'undefined') props = undefined;

      vm.$directiveList.push({
        dom: node,
        props,
        scope: null,
        constructorFunction: declaration,
      });
    });
  });
}

/**
 * render Directive with using renderDom and RenderTask instance
 *
 * @export
 * @param {Element} renderDom
 * @param {RenderTaskQueue} RenderTaskQueue
 * @returns {Promise<IDirective>}
 */
export async function directiveRenderFunction(renderDom: Element, RenderTaskQueue: RenderTaskQueue): Promise<IDirective> {
  return Promise.resolve()
    .then(() => {
      mountDirective(renderDom, RenderTaskQueue.$vm);
      const directiveListLength = RenderTaskQueue.$vm.$directiveList.length;
      for (let i = 0; i < directiveListLength; i++) {
        const directive = RenderTaskQueue.$vm.$directiveList[i];
        if (directive.scope.nvAfterMount) directive.scope.nvAfterMount();
        if (directive.scope.nvHasRender) directive.scope.nvHasRender();
      }
      return RenderTaskQueue.$vm;
    })
    .catch(e => {
      throw new Error(`directive ${(RenderTaskQueue.$vm.constructor as any).$selector} render failed: ${e}`);
    });
}
