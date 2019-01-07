import { InDiv, INvModule } from '@indiv/core';
import { TRouter } from '@indiv/router';
import { _document } from '../renderer';
import { PlatformServer } from './platform-server';
import { buildPath, generalDistributeRoutes } from '../router';

/**
 * render a Indiv app to string
 *
 * @export
 * @param {InDiv} indiv
 * @param {string} [url]
 * @param {TRouter[]} [routes]
 * @returns {Promise<string>}
 */
export async function renderToString(indiv: InDiv, url?: string, routes?: TRouter[]): Promise<string> {
  if (!_document.getElementById('root')) return '';

  _document.getElementById('root').innerHTML = '';

  indiv.use(PlatformServer);
  await indiv.init();

  if (url && routes) {
    const renderRouteList = buildPath(url);
    const routesList: TRouter[] = [];
    const loadModuleMap: Map<string, INvModule> = new Map();
    await generalDistributeRoutes(routes, routesList, renderRouteList, indiv, loadModuleMap);
  }

  const returnString = _document.getElementById('root').innerHTML;
  return returnString.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
