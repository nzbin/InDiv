import { IComponent } from '../types';
/**
 * for build @ViewChild in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export declare function buildViewChild(component: IComponent): void;
/**
 * for build @ViewChildren in Component
 *
 * @export
 * @param {IComponent} component
 * @returns {void}
 */
export declare function buildViewChildren(component: IComponent): void;
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
export declare function ViewChild(selector: Function | string): (target: IComponent, propertyName: string) => any;
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
export declare function ViewChildren(selector: Function | string): (target: IComponent, propertyName: string) => any;
