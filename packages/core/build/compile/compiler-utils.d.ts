import { IComponent, IDirective } from '../types';
/**
 * build scope for Components in Component
 *
 * @export
 * @param {Function} ComponentClass
 * @param {*} inputs
 * @param {*} nativeElement
 * @param {IComponent} componentInstance
 * @returns {IComponent}
 */
export declare function buildComponentScope(ComponentClass: Function, inputs: any, nativeElement: any, componentInstance: IComponent): IComponent;
/**
 * build scope for Directives in Directive
 *
 * @export
 * @param {Function} DirectiveClass
 * @param {*} inputs
 * @param {*} nativeElement
 * @param {IComponent} componentInstance
 * @returns {IDirective}
 */
export declare function buildDirectiveScope(DirectiveClass: Function, inputs: any, nativeElement: any, componentInstance: IComponent): IDirective;
