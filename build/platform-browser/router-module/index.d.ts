import { NvRouteObject, TLoadChild, TChildModule } from '../../types';
import { InDiv } from '../../indiv';
export { NvLocation } from './location';
export { RouterTo, RouterFrom, RouterActive } from './directives';
export declare const nvRouteStatus: {
    nvRouteObject: NvRouteObject;
    nvRouteParmasObject: {
        [props: string]: any;
    };
    nvRootPath: string;
};
export declare type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
    loadChild?: TLoadChild | TChildModule;
};
export declare class RouteModule {
    private indivInstance;
    routeChange?: (lastRoute?: string, nextRoute?: string) => void;
    private routes;
    private routesList;
    private currentUrl;
    private lastRoute;
    private hasRenderComponentList;
    private needRedirectPath;
    private watcher;
    private renderRouteList;
    private loadModuleMap;
    private canWatch;
    constructor(indivInstance: InDiv);
    /**
     * init root data
     *
     * @static
     * @param {{
     *     routes: TRouter[],
     *     rootPath?: string,
     *     routeChange?: (lastRoute?: string, nextRoute?: string) => void,
     *   }} routeData
     * @returns {Function}
     * @memberof RouteModule
     */
    static forRoot(routeData: {
        routes: TRouter[];
        rootPath?: string;
        routeChange?: (lastRoute?: string, nextRoute?: string) => void;
    }): Function;
    /**
     * redirectTo a path
     *
     * @private
     * @param {string} redirectTo
     * @memberof Router
     */
    private redirectTo;
    /**
     * refresh if not watch $nvRouteObject
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
