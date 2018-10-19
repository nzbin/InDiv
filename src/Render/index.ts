import { IComponent } from '../types';

import Compile from '../Compile';
import { CompileUtil } from '../CompileUtils';
import { mountComponent } from './component-render';

/**
 * render function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
export function render<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  (this as IComponent<State, Props, Vm>).compileUtil = new CompileUtil();
  const dom = (this as IComponent<State, Props, Vm>).renderDom;
  return Promise.resolve()
  .then(() => {
    const compile = new Compile(dom, this as IComponent<State, Props, Vm>);
    mountComponent(dom, this);
    const componentListLength = (this as IComponent<State, Props, Vm>).$componentList.length;
    for (let i = 0; i < componentListLength; i++) {
      const component = (this as IComponent<State, Props, Vm>).$componentList[i];
      if (component.scope.render) component.scope.render();
      if (component.scope.nvAfterMount) component.scope.nvAfterMount();
    }
    if (this.nvHasRender) this.nvHasRender();
    return this;
  })
  .catch(e => {
    throw new Error(`component ${this.constructor.$selector} render failed: ${e}`);
  });
}

/**
 * reRender function for Component
 *
 * @template State
 * @template Props
 * @template Vm
 * @returns {Promise<IComponent<State, Props, Vm>>}
 */
export function reRender<State = any, Props = any, Vm = any>(): Promise<IComponent<State, Props, Vm>> {
  const dom = (this as IComponent<State, Props, Vm>).renderDom;
  return Promise.resolve()
  .then(() => {
    const compile = new Compile(dom, (this as IComponent<State, Props, Vm>));
    mountComponent(dom, this);
    const componentListLength = (this as IComponent<State, Props, Vm>).$componentList.length;
    for (let i = 0; i < componentListLength; i++) {
      const component = (this as IComponent<State, Props, Vm>).$componentList[i];
      if (component.scope.render) component.scope.reRender();
      if (component.scope.nvAfterMount) component.scope.nvAfterMount();
    }
    if ((this as IComponent<State, Props, Vm>).nvHasRender) (this as IComponent<State, Props, Vm>).nvHasRender();
    return this;
  })
  .catch(e => {
    throw new Error(`component ${this.constructor.$selector} render failed: ${e}`);
  });
}
