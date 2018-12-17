import { IDirective, DirectiveList, IComponent, TComAndDir } from '../types';

import { utils } from '../utils';
import { buildDirectiveScope } from './compiler-utils';

/**
 * mountDirective for Directives in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export function mountDirective(componentInstance: IComponent, componentAndDirectives: TComAndDir): void {
  const cacheDirectiveList: DirectiveList<IDirective>[] = [ ...componentInstance.directiveList ];
  directivesConstructor(componentInstance, componentAndDirectives);
  const directiveListLength = componentInstance.directiveList.length;
  for (let i = 0; i < directiveListLength; i ++) {
    const directive = componentInstance.directiveList[i];
    // find Directive from cache
    const cacheDirectiveIndex = cacheDirectiveList.findIndex(cache => cache.dom === directive.dom);
    const cacheDirective = cacheDirectiveList[cacheDirectiveIndex];

    // clear cache and the rest need to be destoried
    if (cacheDirectiveIndex !== -1) cacheDirectiveList.splice(cacheDirectiveIndex, 1);
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
  }
  // the rest should use nvOnDestory
  const cacheDirectiveListLength = cacheDirectiveList.length;
  for (let i = 0; i < cacheDirectiveListLength; i ++) {
    const cache = cacheDirectiveList[i];
    if (cache.scope.nvOnDestory) cache.scope.nvOnDestory();
  }

  // after mount
  for (let i = 0; i < directiveListLength; i++) {
    const directive = componentInstance.directiveList[i];
    if (directive.scope.nvHasRender) directive.scope.nvHasRender();
  }
}

/**
 * construct Directives in Directive
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export function directivesConstructor(componentInstance: IComponent, componentAndDirectives: TComAndDir): void {
  componentInstance.directiveList = [];

  componentAndDirectives.directives.forEach(directive => {
    const declaration = componentInstance.declarationMap.get(directive.name);
    componentInstance.directiveList.push({
      dom: directive.nativeElement,
      props: directive.props,
      scope: null,
      constructorFunction: declaration,
    });
  });
}

/**
 * render Directive with using nativeElement and RenderTask instance
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 * @returns {Promise<IDirective>}
 */
export async function directiveCompiler(componentInstance: IComponent, componentAndDirectives: TComAndDir): Promise<IDirective> {
  return Promise.resolve()
    .then(() => {
      mountDirective(componentInstance, componentAndDirectives);
      return componentInstance;
    })
    .catch(e => {
      throw new Error(`directive ${(componentInstance.constructor as any).selector} render failed: ${e}`);
    });
}
