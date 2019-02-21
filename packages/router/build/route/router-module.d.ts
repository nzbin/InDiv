import { IComponent, InDiv, IDirective } from '@indiv/core';
import { NvLocation } from './location';
export declare type TChildModule = () => Promise<any>;
export interface IComponentWithRoute extends IComponent {
    nvRouteCanActive?: (lastRoute: string, newRoute: string) => boolean;
    nvRouteChange?: (lastRoute?: string, newRoute?: string) => void;
}
export interface IDirectiveWithRoute extends IDirective {
    nvRouteChange?: (lastRoute?: string, newRoute?: string) => void;
}
export declare type TLoadChild = {
    name: string;
    child: TChildModule;
};
export declare type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
    loadChild?: TLoadChild | TChildModule | Function;
    routeCanActive?: (lastRoute: string, newRoute: string) => boolean;
    routeChange?: (lastRoute?: string, newRoute?: string) => void;
};
export declare class RouteModule {
    private indivInstance;
    private nvLocation;
    routeChange?: (lastRoute?: string, nextRoute?: string) => void;
    private routes;
    private routesList;
    private currentUrl;
    private lastRoute;
    private hasRenderComponentList;
    private needRedirectPath;
    private isWatching;
    private renderRouteList;
    private loadModuleMap;
    private canWatch;
    /**
     * Creates an instance of RouteModule.
     *
     * if don't use static function forRoot, RouteModule.prototype.canWatch is false
     * if RouteModule.prototype.canWatch is false, don't watch router
     * if RouteModule.prototype.canWatch is true, watch router and reset RouteModule.prototype.canWatch
     *
     * @param {InDiv} indivInstance
     * @param {NvLocation} nvLocation
     * @memberof RouteModule
     */
    constructor(indivInstance: InDiv, nvLocation: NvLocation);
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
     * build object by location.search
     *
     * @returns
     * @memberof Utils
     */
    private buildObjectFromLocationSearch;
    /**
     * refresh if not watch $nvRouteObject
     *
     * @private
     * @memberof Router
     */
    private refresh;
    /**
     * open watcher on nvRouteStatus.nvRouteObject
     *
     * @private
     * @returns
     * @memberof RouteModule
     */
    private routeWatcher;
    /**
     * distribute routes and decide insert or general Routes
     *
     * @private
     * @returns {Promise<void>}
     * @memberof Router
     */
    private distributeRoutes;
    /**
     * insert Routes and render
     *
     * if has rendered Routes, it will find which is different and render it
     *
     * @private
     * @returns {Promise<void>}
     * @memberof Router
     */
    private insertRenderRoutes;
    /**
     * render Routes
     *
     * first render
     *
     * @private
     * @returns {Promise<void>}
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
     * @param {ComponentList[]} componentList
     * @param {string} event
     * @memberof Router
     */
    private emitComponentEvent;
    /**
     * emit nvRouteChange and nvOnDestory for Directives with recursion
     *
     * @private
     * @param {DirectiveList[]} directiveList
     * @param {string} event
     * @memberof RouteModule
     */
    private emitDirectiveEvent;
    /**
     * instantiate Component
     *
     * use InDiv renderComponent
     *
     * if argument has loadModule, use loadModule
     * if argument has'nt loadModule, use rootModule in InDiv
     *
     * @private
     * @param {Function} FindComponent
     * @param {Element} nativeElement
     * @param {INvModule} loadModule
     * @returns {IComponentWithRoute}
     * @memberof RouteModule
     */
    private initComponent;
    /**
     * run renderer of Component
     *
     * if argument has initVnode, will use initVnode fro new Component instance
     *
     * @private
     * @template R
     * @param {IComponentWithRoute} FindComponent
     * @param {R} nativeElement
     * @param {Vnode[]} [initVnode]
     * @returns {Promise<IComponentWithRoute>}
     * @memberof RouteModule
     */
    private runRender;
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
     * if this.loadModuleMap.size === 0, only in rootModule
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
