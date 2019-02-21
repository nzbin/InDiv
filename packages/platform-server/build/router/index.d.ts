import { TRouter } from '@indiv/router';
import { InDiv, INvModule } from '@indiv/core';
export declare type RouteCongfig = {
    path?: string;
    query?: any;
    routes?: TRouter[];
    nvRootPath?: string;
};
/**
 * build path to route
 *
 * @export
 * @param {string} url
 * @returns {string[]}
 */
export declare function buildPath(url: string): string[];
/**
 * find route via rootModule
 *
 * @export
 * @param {RouteCongfig} routeConfig
 * @param {TRouter[]} routesList
 * @param {string[]} renderRouteList
 * @param {InDiv} indiv
 * @param {Map<string, INvModule>} loadModuleMap
 * @returns {Promise<void>}
 */
export declare function generalDistributeRoutes(routeConfig: RouteCongfig, routesList: TRouter[], renderRouteList: string[], indiv: InDiv, loadModuleMap: Map<string, INvModule>): Promise<void>;
/**
 * find component from loadModule or rootModule
 *
 * if loadModuleMap.size === 0, only in rootModule
 * if has loadModule, return component in loadModule firstly
 *
 * @export
 * @param {string} selector
 * @param {string} currentUrlPath
 * @param {InDiv} indiv
 * @param {Map<string, INvModule>} loadModuleMap
 * @returns {{ component: Function, loadModule: INvModule }}
 */
export declare function findComponentFromModule(selector: string, currentUrlPath: string, indiv: InDiv, loadModuleMap: Map<string, INvModule>): {
    component: Function;
    loadModule: INvModule;
};
/**
 * build Module and return Component for route.loadChild
 *
 * @export
 * @param {Function} loadChild
 * @param {string} currentUrlPath
 * @param {Map<string, INvModule>} loadModuleMap
 * @returns {INvModule}
 */
export declare function NvModuleFactoryLoader(loadChild: Function, currentUrlPath: string, loadModuleMap: Map<string, INvModule>): INvModule;
