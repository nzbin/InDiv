import { IComponent, ComponentList, DirectiveList } from '../types';
import { utils } from '../utils';

/**
 * to build foundMap for function buildViewChild, buildViewChildren
 *
 * @param {IComponent} component
 * @param {(string | Function)} selector
 * @returns {(ComponentList[] | DirectiveList[])}
 */
function buildFoundMap(component: IComponent, selector: string | Function): ComponentList[] | DirectiveList[] {
  let toFindMap: ComponentList[] | DirectiveList[];
  if (typeof selector === 'string') {
    if ((component.declarationMap.get(selector) as any).nvType === 'nvComponent') toFindMap = component.componentList;
    if ((component.declarationMap.get(selector) as any).nvType === 'nvDirective') toFindMap = component.directiveList;
  }
  if (utils.isFunction(selector)) {
    if ((selector as any).nvType === 'nvComponent') toFindMap = component.componentList;
    if ((selector as any).nvType === 'nvDirective') toFindMap = component.directiveList;
  }
  return toFindMap;
}

/**
 * for build @ViewChild in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export function buildViewChild(component: IComponent): void {
  if (!component.viewChildList) return;
  component.viewChildList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        const found = foundMap.find(value => (value.constructorFunction as any).selector === selector);
        if (found) (component as any)[propertyName] = found.instanceScope;
      } else {
        const findElementRef = component.$indivInstance.getRenderer.getElementsByTagName(selector);
        if (findElementRef && findElementRef.length > 0) (component as any)[propertyName] = findElementRef[0];
      }
    }
    if (utils.isFunction(selector)) {
      const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
      if (foundMap) (component as any)[propertyName] = foundMap.find(value => value.constructorFunction === selector).instanceScope;
    }
  });
}

/**
 * for build @ViewChildren in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export function buildViewChildren(component: IComponent): void {
  if (!component.viewChildrenList) return;
  component.viewChildrenList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        (component as any)[propertyName] = (foundMap as any[]).map(value => {
          if ((value.constructorFunction as any).selector === selector) return value.instanceScope;
        });
      } else (component as any)[propertyName] = component.$indivInstance.getRenderer.getElementsByTagName(selector);
    }
    if (utils.isFunction(selector)) {
      const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
      if (foundMap) (component as any)[propertyName] = (foundMap as any[]).map(value => {
        if (value.constructorFunction === selector) return value.instanceScope;
      });
    }
  });
}

/**
 * use Decorator @ViewChild to select a DOM or Component/Directive instance
 * 
 * usage:
 * 1. selector: string;
 *  if selector is a DOM tagName, @ViewChildren will select the first matched DOM
 *  if selector is a selector of Component or Directive, @ViewChildren will select the first matched Component/Directive instance
 * 2. selector: Function;
 *  if selector is a  Component or Directive, @ViewChildren will select the first matched Component/Directive instance
 *
 * @export
 * @param {(Function | string)} selector
 * @returns
 */
export function ViewChild(selector: Function | string) {
  return function (target: IComponent, propertyName: string) {
    if (!target.viewChildList) target.viewChildList = [];
    target.viewChildList.push({ propertyName, selector });
  };
}

/**
 * use Decorator @ViewChildren to select a DOM or Component/Directive instance
 * 
 * usage:
 * 1. selector: string;
 *  if selector is a DOM tagName, @ViewChildren will select all matched DOM
 *  if selector is a selector of Component or Directive, @ViewChildren will select all matched Component/Directive instances
 * 2. selector: Function;
 *  if selector is a  Component or Directive, @ViewChildren will select all matched Component/Directive instances
 *
 * @export
 * @param {(Function | string)} selector
 * @returns
 */
export function ViewChildren(selector: Function | string) {
  return function (target: IComponent, propertyName: string) {
    if (!target.viewChildrenList) target.viewChildrenList = [];
    target.viewChildrenList.push({ selector, propertyName });
  };
}
