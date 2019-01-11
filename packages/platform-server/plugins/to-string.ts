import { InDiv, INvModule } from '@indiv/core';
import { TRouter, nvRouteStatus } from '@indiv/router';
import { _document } from '../renderer';
import { PlatformServer } from './platform-server';
import { buildPath, generalDistributeRoutes } from '../router';

/**
 * render a Indiv app to string
 * 
 * if has routeConfig, will await route render
 *
 * @export
 * @param {Function} rootModule
 * @param {string} [url]
 * @param {{ routes?: TRouter[], nvRootPath?: string }} [routeConfig]
 * @returns {Promise<string>}
 */
export async function renderToString(rootModule: Function, url?: string, routeConfig?: { routes?: TRouter[], nvRootPath?: string }): Promise<string> {
  if (_document.getElementById('root')) _document.getElementById('root').innerHTML = '';
  const inDiv = new InDiv();
  inDiv.bootstrapModule(rootModule);
  inDiv.use(PlatformServer);
  await inDiv.init();
  if (url && routeConfig) {
    nvRouteStatus.nvRootPath = routeConfig.nvRootPath;
    nvRouteStatus.nvRouteObject = {
      path: url,
      query: null,
      data: null,
    };
    const renderRouteList = buildPath(url);
    const routesList: TRouter[] = [];
    const loadModuleMap: Map<string, INvModule> = new Map();
    await generalDistributeRoutes(routeConfig.routes, routesList, renderRouteList, inDiv, loadModuleMap);
  }
  const content = _document.getElementById('root').innerHTML;
  return content.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
