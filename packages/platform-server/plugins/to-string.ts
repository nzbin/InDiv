import { InDiv, INvModule } from '@indiv/core';
import { TRouter, nvRouteStatus } from '@indiv/router';
import { _document } from '../renderer';
import { PlatformServer } from './platform-server';
// import { buildPath, generalDistributeRoutes } from '../router';

async function getDOMString(): Promise<string> {
  return _document.getElementById('root').innerHTML;
}

async function renderApp(rootModule: Function, url?: string, nvRootPath?: string) {
  const inDiv = new InDiv();
  inDiv.bootstrapModule(rootModule);
  inDiv.use(PlatformServer);
  await inDiv.init();
  nvRouteStatus.nvRootPath = nvRootPath;
  nvRouteStatus.nvRouteObject = {
    path: url,
    query: null,
    data: null,
  };
}

// todo async await
/**
 * render a Indiv app to string
 *
 * @export
 * @param {InDiv} indiv
 * @param {string} [url]
 * @param {TRouter[]} [routes]
 * @returns {Promise<string>}
 */
export async function renderToString(rootModule: Function, url?: string, nvRootPath?: string): Promise<string> {
  if (_document.getElementById('root')) _document.getElementById('root').innerHTML = '';
  await renderApp(rootModule, url, nvRootPath);
  // setTimeout(() => {
  //   renderApp(rootModule, url, nvRootPath);
  // }, 0);
  // const inDiv = new InDiv();
  // inDiv.bootstrapModule(rootModule);
  // inDiv.use(PlatformServer);
  // await inDiv.init();
  // nvRouteStatus.nvRootPath = nvRootPath;
  // nvRouteStatus.nvRouteObject = {
  //   path: url,
  //   query: null,
  //   data: null,
  // };
  const returnString = _document.getElementById('root').innerHTML;
  // const returnString = await getDOMString();
  return returnString.replace(/^(\<div\>)/g, '').replace(/(\<\/div\>$)/g, '');
}
