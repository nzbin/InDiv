import { IComponent, ComponentList, DirectiveList } from '../types';
import { utils } from '../utils';
import { ElementRef } from './element-ref';
import { buildFoundMap } from './utils';

/**
 * for build @ViewChild in Component
 *
 * @param {IComponent} component
 * @returns {void}
 */
function buildViewChild(component: IComponent): void {
  if (!component.viewChildList) return;
  component.viewChildList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        const found = foundMap.find(value => (value.constructorFunction as any).selector === selector);
        if (found) (component as any)[propertyName] = found.instanceScope;
      } else {
        const findElementRef = component.$indivInstance.getRenderer.getElementsByTagName(selector, component.nativeElement);
        if (findElementRef && findElementRef.length > 0) (component as any)[propertyName] = new ElementRef(findElementRef[0]);
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
 * @param {IComponent} component
 * @returns {void}
 */
function buildViewChildren(component: IComponent): void {
  if (!component.viewChildrenList) return;
  component.viewChildrenList.forEach(({ propertyName, selector }) => {
    if (typeof selector === 'string') {
      if (component.declarationMap.has(selector)) {
        const foundMap: ComponentList[] | DirectiveList[] = buildFoundMap(component, selector);
        if (!foundMap) return;
        (component as any)[propertyName] = (foundMap as any[]).map(value => {
          if ((value.constructorFunction as any).selector === selector) return value.instanceScope;
        });
      } else (component as any)[propertyName] = Array.from(component.$indivInstance.getRenderer.getElementsByTagName(selector, component.nativeElement)).map((findElementRef) => new ElementRef(findElementRef));
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
 * for build @ViewChild and @ViewChildren in Component
 *
 * @export
 * @param {IComponent} component
 */
export function buildViewChildandChildren(component: IComponent): void {
  buildViewChild(component);
  buildViewChildren(component);
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
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function ViewChild(selector: Function | string): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    if (!target.viewChildList) target.viewChildList = [];
    target.viewChildList.push({ propertyName, selector });
    return (target as any)[propertyName];
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
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function ViewChildren(selector: Function | string): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    if (!target.viewChildrenList) target.viewChildrenList = [];
    target.viewChildrenList.push({ selector, propertyName });
    return (target as any)[propertyName];
  };
}
