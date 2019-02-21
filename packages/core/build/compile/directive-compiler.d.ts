import { IComponent, TComAndDir } from '../types';
/**
 * mountDirective for Directives in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export declare function mountDirective(componentInstance: IComponent, componentAndDirectives: TComAndDir): void;
/**
 * construct Directives in Directive
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export declare function directivesConstructor(componentInstance: IComponent, componentAndDirectives: TComAndDir): void;
