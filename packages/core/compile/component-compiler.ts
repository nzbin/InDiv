import { IComponent, ComponentList, TComAndDir } from '../types';

import { utils } from '../utils';
import { Compile } from './compile';
import { buildComponentScope } from './compiler-utils';
import { Vnode } from '../vnode';
import { directiveCompiler } from './directive-compiler';

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
      component.scope = cacheComponent.scope;
      // old props: component.scope.props
      // new props: component.props
      if (!utils.isEqual(component.scope.props, component.props)) {
        if (component.scope.nvReceiveProps) component.scope.nvReceiveProps(component.props);
        component.scope.props = component.props;
      }
    } else {
      component.scope = buildComponentScope(component.constructorFunction, component.props, component.nativeElement as Element, componentInstance);
    }

    component.scope.$indivInstance = componentInstance.$indivInstance;

    if (component.scope.nvOnInit && !cacheComponent) component.scope.nvOnInit();
    if (component.scope.watchData && !cacheComponent) component.scope.watchData();
    if (component.scope.nvBeforeMount) component.scope.nvBeforeMount();
  }
  // the rest should use nvOnDestory
  const cacheComponentListLength = cacheComponentList.length;
  for (let i = 0; i < cacheComponentListLength; i++) {
    const cache = cacheComponentList[i];
    if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
  }

  // after mount
  for (let i = 0; i < componentListLength; i++) {
    const component = componentInstance.componentList[i];
    component.scope.render();
    if (component.scope.nvAfterMount) component.scope.nvAfterMount();
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
      props: component.props,
      scope: null,
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
  const componentProps: any = {};

  if (vnode.attributes && vnode.attributes.length > 0) {
    vnode.attributes.forEach(attr => {
      if (attr.type === 'directive') componentAndDirectives.directives.push({
        nativeElement: vnode.nativeElement,
        props: attr.nvValue,
        name: attr.name,
      });
      if (attr.type === 'prop') componentProps[attr.name] = attr.nvValue;
    });
  }

  if (vnode.type === 'component') {
    componentAndDirectives.components.push({
      nativeElement: vnode.nativeElement,
      props: componentProps,
      name: vnode.tagName,
    });
  }

  if (vnode.childNodes && vnode.childNodes.length > 0) vnode.childNodes.forEach(child => buildComponentsAndDirectives(child, componentAndDirectives));
}

/**
 * render Component with using nativeElement and RenderTask instance
 *
 * @export
 * @param {Element} nativeElement
 * @param {IComponent} componentInstance
 * @returns {Promise<IComponent>}
 */
export async function componentCompiler(nativeElement: any, componentInstance: IComponent): Promise<IComponent> {
  return Promise.resolve()
    .then(async () => {
      // compile has been added into Component instance by dirty method
      if (!(componentInstance as any).compileInstance) ((componentInstance as any).compileInstance as Compile) = new Compile(nativeElement, componentInstance);
      const saveVnodes = ((componentInstance as any).compileInstance as Compile).startCompile();

      const componentAndDirectives: TComAndDir = {
        components: [],
        directives: [],
      };
      saveVnodes.forEach(vnode => buildComponentsAndDirectives(vnode, componentAndDirectives));

      // first mount directive
      await directiveCompiler(componentInstance, componentAndDirectives);

      // // then mount component
      mountComponent(componentInstance, componentAndDirectives);

      return componentInstance;
    })
    .catch(e => {
      throw new Error(`component ${(componentInstance.constructor as any).selector} render failed: ${e}`);
    });
}
