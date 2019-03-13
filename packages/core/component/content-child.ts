import { IComponent, ComponentList, DirectiveList } from '../types';
import { utils } from '../utils';
import { ElementRef } from './element-ref';

/**
 * to build foundMap for function buildContentChild, buildContentChildren
 *
 * @param {IComponent} component
 * @param {(string | Function)} selector
 * @returns {(ComponentList[] | DirectiveList[])}
 */
function buildFoundMap(component: IComponent, selector: string | Function): ComponentList[] | DirectiveList[] {
  let toFindMap: ComponentList[] | DirectiveList[];
  if (typeof selector === 'string') {
    if ((component.parentComponent.declarationMap.get(selector) as any).nvType === 'nvComponent') toFindMap = component.parentComponent.componentList;
    if ((component.parentComponent.declarationMap.get(selector) as any).nvType === 'nvDirective') toFindMap = component.parentComponent.directiveList;
  }
  if (utils.isFunction(selector)) {
    if ((selector as any).nvType === 'nvComponent') toFindMap = component.parentComponent.componentList;
    if ((selector as any).nvType === 'nvDirective') toFindMap = component.parentComponent.directiveList;
  }
  return toFindMap;
}

/**
 * for build @ContentChild in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export function buildContentChild(component: IComponent): void {
  if (!component.contentChildList || !component.parentComponent) return;
  component.contentChildList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.parentComponent.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        const found = foundMap.find(value => ((value.constructorFunction as any).selector === selector) && value.inComponent);
        if (found) (component as any)[propertyName] = found.instanceScope;
      } else {
        const findElementRef = component.$indivInstance.getRenderer.getElementsByTagName(selector);
        if (findElementRef && findElementRef.length > 0) (component as any)[propertyName] = new ElementRef(findElementRef[0]);
      }
    }
    if (utils.isFunction(selector)) {
      const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
      if (foundMap) (component as any)[propertyName] = foundMap.find(value => (value.constructorFunction === selector) && value.inComponent).instanceScope;
    }
  });
}

/**
 * for build @ContentChildren in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export function buildContentChildren(component: IComponent): void {
  if (!component.contentChildrenList || !component.parentComponent) return;
  component.contentChildrenList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.parentComponent.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        (component as any)[propertyName] = (foundMap as any[]).map(value => {
          if (((value.constructorFunction as any).selector === selector) && value.inComponent) return value.instanceScope;
        });
      } else (component as any)[propertyName] = Array.from(component.$indivInstance.getRenderer.getElementsByTagName(selector)).map((findElementRef) => new ElementRef(findElementRef));
    }
    if (utils.isFunction(selector)) {
      const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
      if (foundMap) (component as any)[propertyName] = (foundMap as any[]).map(value => {
        if (value.constructorFunction === selector && value.inComponent) return value.instanceScope;
      });
    }
  });
}

/**
 * use Decorator @ContentChild to select a DOM or Component/Directive instance from <nv-content>
 * 
 * usage:
 * 1. selector: string;
 *  if selector is a DOM tagName, @ContentChildren will select the first matched DOM
 *  if selector is a selector of Component or Directive, @ContentChildren will select the first matched Component/Directive instance
 * 2. selector: Function;
 *  if selector is a  Component or Directive, @ContentChildren will select the first matched Component/Directive instance
 *
 * @export
 * @param {(Function | string)} selector
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function ContentChild(selector: Function | string): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    if (!target.contentChildList) target.contentChildList = [];
    target.contentChildList.push({ propertyName, selector });
    return (target as any)[propertyName];
  };
}

/**
 * use Decorator @ContentChildren to select a DOM or Component/Directive instance from <nv-content>
 * 
 * usage:
 * 1. selector: string;
 *  if selector is a DOM tagName, @ContentChildren will select all matched DOM
 *  if selector is a selector of Component or Directive, @ContentChildren will select all matched Component/Directive instances
 * 2. selector: Function;
 *  if selector is a  Component or Directive, @ContentChildren will select all matched Component/Directive instances
 *
 * @export
 * @param {(Function | string)} selector
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function ContentChildren(selector: Function | string): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    if (!target.contentChildrenList) target.contentChildrenList = [];
    target.contentChildrenList.push({ selector, propertyName });
    return (target as any)[propertyName];
  };
}

