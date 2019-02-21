import { IComponent, TComAndDir } from '../types';
import { Vnode } from '../vnode';
/**
 * mountComponent for Components in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export declare function mountComponent(componentInstance: IComponent, componentAndDirectives: TComAndDir): Promise<void>;
/**
 * construct Components in Component
 *
 * @export
 * @param {IComponent} componentInstance
 * @param {TComAndDir} componentAndDirectives
 */
export declare function componentsConstructor(componentInstance: IComponent, componentAndDirectives: TComAndDir): void;
/**
 * build list for build @Component and @Directive
 *
 * @export
 * @param {Vnode} vnode
 * @param {TComAndDir} componentAndDirectives
 */
export declare function buildComponentsAndDirectives(vnode: Vnode, componentAndDirectives: TComAndDir): void;
/**
 * render Component with using nativeElement and RenderTask instance
 *
 * @export
 * @param {*} nativeElement
 * @param {IComponent} componentInstance
 * @returns {Promise<IComponent>}
 */
export declare function componentCompiler(nativeElement: any, componentInstance: IComponent): Promise<IComponent>;
