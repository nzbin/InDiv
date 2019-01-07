import { TRouter, NvLocation, TChildModule, TLoadChild } from '@indiv/router';
import { InDiv, INvModule, factoryModule } from '@indiv/core';

const nvLocation = new NvLocation();

/**
 * build path to route
 *
 * @param {string} url
 * @returns array<string>
 */
export function buildPath(url: string): string[] {
  const renderRouteList = url === '/' ? ['/'] : url.split('/');
  renderRouteList[0] = '/';
  return renderRouteList;
}

/**
 * find route via rootModule
 *
 * @param {array<string>} pathList
 * @param {array<Route>} routes
 * @param {NvModule} rootModule
 * @returns array<string>
 */
export async function generalDistributeRoutes(routes: TRouter[], routesList: TRouter[], renderRouteList: string[], indiv: InDiv, loadModuleMap: Map<string, INvModule>): Promise<void> {
  for (let index = 0; index < renderRouteList.length; index++) {
    const path = renderRouteList[index];
    if (index === 0) {
      const rootRoute = routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
      if (!rootRoute) throw new Error(`route error: wrong route instantiation in generalDistributeRoutes: ${this.currentUrl}`);

      if (/^\/\:.+/.test(rootRoute.path)) {
        const key = rootRoute.path.split('/:')[1];
        nvLocation.get().params[key] = path;
      }

      routesList.push(rootRoute);

      if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === renderRouteList.length) {
        await generalDistributeRoutes(routes, routesList, buildPath(rootRoute.redirectTo), indiv, loadModuleMap);
        return;
      }
    } else {
      const lastRoute = routesList[index - 1].children;
      if (!lastRoute || !(lastRoute instanceof Array)) throw new Error('route error: routes not exit or routes must be an array!');
      const route = lastRoute.find(r => r.path === `/${path}` || /^\/\:.+/.test(r.path));
      if (!route) throw new Error(`route error: wrong route instantiation: ${this.currentUrl}`);

      const nativeElement = indiv.getRenderer.getElementsByTagName('router-render')[index - 1];

      let FindComponent = null;
      let currentUrlPath = '';

      // build current url with route.path
      // because rootRoute hasn't been pushed to routesList, we need to += route.path
      routesList.forEach((r, index) => { if (index !== 0) currentUrlPath += r.path; });
      currentUrlPath += route.path;

      if (route.component) {
        const findComponentFromModuleResult = findComponentFromModule(route.component, currentUrlPath, indiv, loadModuleMap);
        FindComponent = findComponentFromModuleResult.component;
        await indiv.renderComponent(FindComponent, nativeElement, findComponentFromModuleResult.loadModule, null);
      }
      if (route.loadChild) {
        const loadModule = await NvModuleFactoryLoader(route.loadChild, currentUrlPath, loadModuleMap);
        FindComponent = loadModule.bootstrap;
        await indiv.renderComponent(FindComponent, nativeElement, loadModule, null);
      }

      if (!route.component && !route.redirectTo && !route.loadChild) throw new Error(`route error: path ${route.path} need a component which has children path or need a  redirectTo which has't children path`);

      if (/^\/\:.+/.test(route.path)) {
        const key = route.path.split('/:')[1];
        nvLocation.get().params[key] = path;
      }
      routesList.push(route);

      if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === renderRouteList.length) {
        await generalDistributeRoutes(routes, routesList, buildPath(route.redirectTo), indiv, loadModuleMap);
        return;
      }
    }
  }
}

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
export function findComponentFromModule(selector: string, currentUrlPath: string, indiv: InDiv, loadModuleMap: Map<string, INvModule>): { component: Function, loadModule: INvModule } {
  if (loadModuleMap.size === 0) return {
    component: indiv.getDeclarations.find((component: any) => component.selector === selector && component.nvType === 'nvComponent'),
    loadModule: null,
  };

  let component = null;
  let loadModule = null;
  loadModuleMap.forEach((value, key) => {
    if (new RegExp(`^${key}.*`).test(currentUrlPath)) {
      component = value.declarations.find((component: any) => component.selector === selector && component.nvType === 'nvComponent');
      loadModule = value;
    }
  });
  if (!component) {
    component = indiv.getDeclarations.find((component: any) => component.selector === selector && component.nvType === 'nvComponent');
    loadModule = null;
  }

  return { component, loadModule };
}

/**
 * build Module and return Component for route.loadChild
 *
 * @private
 * @param {(TChildModule | TLoadChild)} loadChild
 * @returns {Promise<INvModule>}
 * @memberof Router
 */
export async function NvModuleFactoryLoader(loadChild: TChildModule | TLoadChild, currentUrlPath: string, loadModuleMap: Map<string, INvModule>): Promise<INvModule> {
  if (loadModuleMap.has(currentUrlPath)) return loadModuleMap.get(currentUrlPath);

  let loadModule = null;

  // export default
  if (!(loadChild as TLoadChild).child)
  loadModule = (await (loadChild as TChildModule)()).default;

  // export
  if ((loadChild as TLoadChild).child)
  loadModule = (await (loadChild as TLoadChild).child())[loadChild.name];

  if (!loadModule) throw new Error('load child failed, please check your routes.');

  const loadModuleInstance = factoryModule(loadModule, loadModule.prototype.privateInjector, this.indivInstance);
  loadModuleMap.set(currentUrlPath, loadModuleInstance);

  return loadModuleInstance;
}
