import { TRouter, IInDiv, IComponent, ComponentList } from '../../types';
import KeyWatcher from '../../key-watcher';
export { TRouter } from '../../types';
/**
 * route for InDiv
 *
 * @export
 * @class Router
 */
export declare class Router {
    routes: TRouter[];
    routesList: TRouter[];
    currentUrl: string;
    lastRoute: string;
    rootDom: Element;
    $rootPath: string;
    hasRenderComponentList: IComponent[];
    needRedirectPath: string;
    $vm: IInDiv;
    watcher: KeyWatcher;
    renderRouteList: string[];
    routeChange?: (lastRoute?: string, nextRoute?: string) => void;
    constructor();
    /**
     * bootstrap and init watch $esRouteParmasObject in InDiv
     *
     * @param {IInDiv} vm
     * @returns {void}
     * @memberof Router
     */
    bootstrap(vm: IInDiv): void;
    /**
     * set rootDom
     *
     * @param {TRouter[]} arr
     * @returns {void}
     * @memberof Router
     */
    init(arr: TRouter[]): void;
    setRootPath(rootPath: string): void;
    /**
     * redirectTo a path
     *
     * @param {string} redirectTo
     * @memberof Router
     */
    redirectTo(redirectTo: string): void;
    /**
     * refresh if not watch $esRouteObject
     *
     * @memberof Router
     */
    refresh(): void;
    /**
     * distribute routes and decide insert or general Routes
     *
     * @returns {Promise<any>}
     * @memberof Router
     */
    distributeRoutes(): Promise<any>;
    /**
     * insert Routes and render
     *
     * if has rendered Routes, it will find which is different and render it
     *
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    insertRenderRoutes(): Promise<IComponent>;
    /**
     * render Routes
     *
     * first render
     *
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    generalDistributeRoutes(): Promise<IComponent>;
    /**
     * emit nvRouteChange and nvOnDestory for Components
     *
     * @param {number} index
     * @memberof Router
     */
    routerChangeEvent(index: number): void;
    /**
     * emit nvRouteChange and nvOnDestory for Components with recursion
     *
     * @param {ComponentList<IComponent>[]} componentList
     * @param {string} event
     * @memberof Router
     */
    emitComponentEvent(componentList: ComponentList<IComponent>[], event: string): void;
    /**
     * instantiate Component
     *
     * use InDiv renderComponent
     *
     * @param {Function} FindComponent
     * @param {Element} renderDom
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    instantiateComponent(FindComponent: Function, renderDom: Element): Promise<IComponent>;
}
/**
 * getLocation in @Component or @Directive
 *
 * get $esRouteObject and $esRouteParmasObject in InDiv
 *
 * @export
 * @returns {{
 *   path?: string;
 *   query?: any;
 *   params?: any;
 *   data?: any;
 * }}
 */
export declare function getLocation(): {
    path?: string;
    query?: any;
    params?: any;
    data?: any;
};
/**
 * setLocation in @Component or @Directive
 *
 * set $esRouteObject in InDiv
 *
 * @export
 * @param {string} path
 * @param {*} [query]
 * @param {*} [data]
 * @param {string} [title]
 * @returns {void}
 */
export declare function setLocation(path: string, query?: any, data?: any, title?: string): void;
