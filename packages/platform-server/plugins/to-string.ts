import { InDiv } from '@indiv/core';
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
 * @param {TRouter[]} [routers]
 * @returns {Promise<string>}
 */
export async function renderToString(indiv: InDiv, url?: string, routers?: TRouter[]): Promise<string> {
  indiv.use(PlatformServer);
  await indiv.init();

  if (url && routers) {
    const renderRouteList = buildPath(url);
    const routesList: TRouter[] = [];
    await generalDistributeRoutes(routers, routesList, renderRouteList, indiv);
  }
  // todo render
  const returnString = _document.getElementById('root').innerHTML;
  return returnString.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
