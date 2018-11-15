import { TRouter, IInDiv } from '../../types';
export { TRouter } from '../../types';
/**
 * route for InDiv
 *
 * @export
 * @class Router
 */
export declare class Router {
    routeChange?: (lastRoute?: string, nextRoute?: string) => void;
    private routes;
    private routesList;
    private currentUrl;
    private lastRoute;
    private $rootPath;
    private hasRenderComponentList;
    private needRedirectPath;
    private $vm;
    private watcher;
    private renderRouteList;
    private loadModuleMap;
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
    /**
     * set rootPath
     *
     * @param {string} rootPath
     * @memberof Router
     */
    setRootPath(rootPath: string): void;
    /**
     * redirectTo a path
     *
     * @private
     * @param {string} redirectTo
     * @memberof Router
     */
    private redirectTo;
    /**
     * refresh if not watch $esRouteObject
     *
     * @private
     * @memberof Router
     */
    private refresh;
    /**
     * distribute routes and decide insert or general Routes
     *
     * @private
     * @returns {Promise<any>}
     * @memberof Router
     */
    private distributeRoutes;
    /**
     * insert Routes and render
     *
     * if has rendered Routes, it will find which is different and render it
     *
     * @private
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    private insertRenderRoutes;
    /**
     * render Routes
     *
     * first render
     *
     * @private
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    private generalDistributeRoutes;
    /**
     * emit nvRouteChange and nvOnDestory for Components
     *
     * @private
     * @param {number} index
     * @memberof Router
     */
    private routerChangeEvent;
    /**
     * emit nvRouteChange and nvOnDestory for Components with recursion
     *
     * @private
     * @param {ComponentList<IComponent>[]} componentList
     * @param {string} event
     * @memberof Router
     */
    private emitComponentEvent;
    /**
     * emit nvRouteChange and nvOnDestory for Directives with recursion
     *
     * @private
     * @param {DirectiveList<IDirective>[]} directiveList
     * @param {string} event
     * @memberof RouteModule
     */
    private emitDirectiveEvent;
    /**
     * instantiate Component
     *
     * use InDiv renderComponent
     *
     * if parmas has loadModule, use loadModule
     * if parmas has'nt loadModule, use rootModule in InDiv
     *
     * @private
     * @param {Function} FindComponent
     * @param {Element} renderDom
     * @param {INvModule} [loadModule]
     * @returns {Promise<IComponent>}
     * @memberof Router
     */
    private instantiateComponent;
    /**
     * build Module and return Component for route.loadChild
     *
     * @private
     * @param {(TChildModule | TLoadChild)} loadChild
     * @returns {Promise<INvModule>}
     * @memberof Router
     */
    private NvModuleFactoryLoader;
    /**
     * find component from loadModule or rootModule
     *
     * if this.loadModuleMap.size === 0, only in $rootModule
     * if has loadModule, return component in loadModule firstly
     *
     *
     * @private
     * @param {string} selector
     * @param {string} currentUrlPath
     * @returns {{ component: Function, loadModule: INvModule }}
     * @memberof Router
     */
    private findComponentFromModule;
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
