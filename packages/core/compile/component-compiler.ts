import { IComponent, ComponentList, TComAndDir } from '../types';

import { utils } from '../utils';
import { Compile } from './compile';
import { buildComponentScope } from './compiler-utils';
import { Vnode } from '../vnode';
import { mountDirective } from './directive-compiler';

/**
 * mountComponent for Components in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export function mountComponent(componentInstance: IComponent, componentAndDirectives: TComAndDir): void {
  const cacheComponentList: ComponentList<IComponent>[] = [...componentInstance.componentList];
  componentsConstructor(componentInstance, componentAndDirectives);
  const componentListLength = componentInstance.componentList.length;
  for (let i = 0; i < componentListLength; i++) {
    const component = componentInstance.componentList[i];
    // find Component from cache
    const cacheComponentIndex = cacheComponentList.findIndex(cache => cache.nativeElement === component.nativeElement);
    const cacheComponent = cacheComponentList[cacheComponentIndex];

    // clear cache and the rest need to be destoried
    if (cacheComponentIndex !== -1) cacheComponentList.splice(cacheComponentIndex, 1);
    if (cacheComponent) {
      component.instanceScope = cacheComponent.instanceScope;
      // old inputs: component.instanceScope._save_inputs
      // new inputs: component.inputs
      if (!utils.isEqual(component.instanceScope._save_inputs, component.inputs)) {
        if (component.instanceScope.nvReceiveInputs) component.instanceScope.nvReceiveInputs({ ...component.inputs });
        component.instanceScope._save_inputs = component.inputs;
        for (const key in component.inputs) if (component.instanceScope.inputsMap && component.instanceScope.inputsMap.has(key)) (component.instanceScope as any)[component.instanceScope.inputsMap.get(key)] = component.inputs[key];
      }
    } else {
      component.instanceScope = buildComponentScope(component.constructorFunction, component.inputs, component.nativeElement, componentInstance);
    }

    component.instanceScope.$indivInstance = componentInstance.$indivInstance;

    if (component.instanceScope.nvOnInit && !cacheComponent) component.instanceScope.nvOnInit();
    if (component.instanceScope.watchData && !cacheComponent) component.instanceScope.watchData();
    if (component.instanceScope.nvBeforeMount) component.instanceScope.nvBeforeMount();
  }
  // the rest should use nvOnDestory
  const cacheComponentListLength = cacheComponentList.length;
  for (let i = 0; i < cacheComponentListLength; i++) {
    const cache = cacheComponentList[i];
    if (cache.instanceScope.nvOnDestory) cache.instanceScope.nvOnDestory();
  }

  // after mount
  for (let i = 0; i < componentListLength; i++) {
    const component = componentInstance.componentList[i];
    component.instanceScope.render();
    if (component.instanceScope.nvAfterMount) component.instanceScope.nvAfterMount();
  }
  if (componentInstance.nvHasRender) componentInstance.nvHasRender();
}

/**
 * construct Components in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export function componentsConstructor(componentInstance: IComponent, componentAndDirectives: TComAndDir): void {
  componentInstance.componentList = [];

  componentAndDirectives.components.forEach(component => {
    const declaration = componentInstance.declarationMap.get(component.name);
    componentInstance.componentList.push({
      nativeElement: component.nativeElement,
      inputs: component.inputs,
      instanceScope: null,
      constructorFunction: declaration,
    });
  });
}

/**
 * build list for build @Component and @Directive
 *
 * @export
 * @param {Vnode} vnode
 * @param {TComAndDir} componentAndDirectives
 */
export function buildComponentsAndDirectives(vnode: Vnode, componentAndDirectives: TComAndDir): void {
  if (vnode.type === 'text') return;
  const componentInputs: any = {};

  if (vnode.attributes && vnode.attributes.length > 0) {
    vnode.attributes.forEach(attr => {
      if (attr.type === 'directive') componentAndDirectives.directives.push({
        nativeElement: vnode.nativeElement,
        inputs: attr.nvValue,
        name: attr.name,
      });
      if (attr.type === 'prop') componentInputs[attr.name] = attr.nvValue;
    });
  }

  if (vnode.type === 'component') {
    componentAndDirectives.components.push({
      nativeElement: vnode.nativeElement,
      inputs: componentInputs,
      name: vnode.tagName,
    });
  }

  if (vnode.childNodes && vnode.childNodes.length > 0) vnode.childNodes.forEach(child => buildComponentsAndDirectives(child, componentAndDirectives));
}

/**
 * render Component with using nativeElement and RenderTask instance
 *
 * @export
 * @param {any} nativeElement
 * @param {IComponent} componentInstance
 * @returns {Promise<IComponent>}
 */
export async function componentCompiler(nativeElement: any, componentInstance: IComponent): Promise<IComponent> {
  return Promise.resolve()
    .then(() => {
      // compile has been added into Component instance by dirty method
      if (!(componentInstance as any).compileInstance) ((componentInstance as any).compileInstance as Compile) = new Compile(nativeElement, componentInstance);

      let saveVnodes: Vnode[] = [];
      try {
        saveVnodes = ((componentInstance as any).compileInstance as Compile).startCompile();
      } catch (error) {
        throw new Error(`Error: ${error}, compoent ${(componentInstance.constructor as any).selector} was compiled failed!`);
      }

      // for save saveVnode in componentInstance
      componentInstance.saveVnode = saveVnodes;

      const componentAndDirectives: TComAndDir = { components: [], directives: [] };
      saveVnodes.forEach(vnode => buildComponentsAndDirectives(vnode, componentAndDirectives));

      // first mount directive
      try {
        mountDirective(componentInstance, componentAndDirectives);
      } catch (error) {
        throw new Error(`Error: ${error}, directives of compoent ${(componentInstance.constructor as any).selector} were compiled failed!`);
      }

      // then mount component
      try {
        mountComponent(componentInstance, componentAndDirectives);
      } catch (error) {
        throw new Error(`Error: ${error}, components of compoent ${(componentInstance.constructor as any).selector} were compiled failed!`);
      }

      return componentInstance;
    })
    .catch(e => {
      throw new Error(`component ${(componentInstance.constructor as any).selector} render failed: ${e}`);
    });
}
