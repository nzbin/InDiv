import { TRouter } from '@indiv/router';
import { Vnode, InDiv } from '@indiv/core';

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
export async function generalDistributeRoutes(routes: TRouter[], routesList: TRouter[], renderRouteList: string[], indivInstance: InDiv): Promise<void> {
  for (let index = 0; index < renderRouteList.length; index++) {
    const path = renderRouteList[index];
    if (index === 0) {
      const rootRoute = routes.find(route => route.path === `${path}` || /^\/\:.+/.test(route.path));
      if (!rootRoute) throw new Error(`route error: wrong route instantiation in generalDistributeRoutes: ${this.currentUrl}`);

      if (/^\/\:.+/.test(rootRoute.path)) {
        const key = rootRoute.path.split('/:')[1];
        // nvRouteStatus.nvRouteParmasObject[key] = path;
      }

      routesList.push(rootRoute);

      // push root component in InDiv instance
      // this.hasRenderComponentList.push(this.indivInstance.getBootstrapComponent);

      // if (index === renderRouteList.length - 1) this.routerChangeEvent(index);

      // if (rootRoute.redirectTo && /^\/.*/.test(rootRoute.redirectTo) && (index + 1) === renderRouteList.length) {
      //   this.needRedirectPath = rootRoute.redirectTo;
      //   renderRouteList.push(rootRoute.redirectTo);
      //   return;
      // }
    } else {
      const lastRoute = routesList[index - 1].children;
      if (!lastRoute || !(lastRoute instanceof Array)) throw new Error('route error: routes not exit or routes must be an array!');
      const route = lastRoute.find(r => r.path === `/${path}` || /^\/\:.+/.test(r.path));
      if (!route) throw new Error(`route error: wrong route instantiation: ${this.currentUrl}`);

      const nativeElement = indivInstance.getRenderer.getElementsByTagName('router-render')[index - 1];

      let FindComponent = null;
      let currentUrlPath = '';

      // build current url with route.path
      // because rootRoute hasn't been pushed to routesList, we need to += route.path
      routesList.forEach((r, index) => { if (index !== 0) currentUrlPath += r.path; });
      currentUrlPath += route.path;

      if (route.component) {
        const findComponentFromModuleResult = this.findComponentFromModule(route.component, currentUrlPath);
        FindComponent = findComponentFromModuleResult.component;
        await indivInstance.renderComponent(FindComponent, nativeElement, findComponentFromModuleResult.loadModule, null);
      }
      if (route.loadChild) {
        const loadModule = await this.NvModuleFactoryLoader(route.loadChild, currentUrlPath);
        FindComponent = loadModule.bootstrap;
        await indivInstance.renderComponent(FindComponent, nativeElement, loadModule, null);
      }

      if (!route.component && !route.redirectTo && !route.loadChild) throw new Error(`route error: path ${route.path} need a component which has children path or need a  redirectTo which has't children path`);

      if (/^\/\:.+/.test(route.path)) {
        const key = route.path.split('/:')[1];
        // nvRouteStatus.nvRouteParmasObject[key] = path;
      }
      routesList.push(route);

      // if (component) this.hasRenderComponentList.push(component);

      // if (index === renderRouteList.length - 1) this.routerChangeEvent(index);

      // if (route.redirectTo && /^\/.*/.test(route.redirectTo) && (index + 1) === renderRouteList.length) {
      //   this.needRedirectPath = route.redirectTo;
      //   return;
      // }
    }
  }
}
