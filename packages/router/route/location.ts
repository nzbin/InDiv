import { Injectable, utils } from '@indiv/core';

import { nvRouteStatus } from './location-status';

@Injectable()
export class NvLocation {
  /**
   * get route in @Component or @Directive
   *
   * get nvRouteObject and nvRouteParmasObject in InDiv
   * 
   * @export
   * @returns {{
   *   path?: string;
   *   query?: any;
   *   params?: any;
   *   data?: any;
   *   rootPath?: string;
   * }}
   */
  public get(): {
    path?: string;
    query?: any;
    params?: any;
    data?: any;
    rootPath?: string;
  } {
    return {
      path: nvRouteStatus.nvRouteObject.path,
      query: nvRouteStatus.nvRouteObject.query,
      params: nvRouteStatus.nvRouteParmasObject,
      data: nvRouteStatus.nvRouteObject.data,
      rootPath: nvRouteStatus.nvRootPath,
    };
  }

  /**
   * set route in @Component or @Directive
   * 
   * set nvRouteObject in InDiv
   * 
   * @export
   * @param {string} path
   * @param {*} [query]
   * @param {*} [data]
   * @param {string} [title]
   * @returns {void}
   */
  public set(path: string, query?: any, data?: any, title?: string): void {
    const rootPath = nvRouteStatus.nvRootPath === '/' ? '' : nvRouteStatus.nvRootPath;
    if (utils.isBrowser()) {
      history.pushState(
        { path, query, data },
        title,
        `${rootPath}${path}${utils.buildQuery(query)}`,
      );
    }
    nvRouteStatus.nvRouteObject = { path, query, data };
  }

  /**
   * redirect route in @Component or @Directive
   *
   * set nvRouteObject in InDiv
   * 
   * @param {string} path
   * @param {*} [query]
   * @param {*} [data]
   * @param {string} [title]
   * @memberof NvLocation
   */
  public redirectTo(path: string, query?: any, data?: any, title?: string): void {
    const rootPath = nvRouteStatus.nvRootPath === '/' ? '' : nvRouteStatus.nvRootPath;
    if (utils.isBrowser()) {
      history.replaceState(
        { path, query, data },
        title,
        `${rootPath}${path}${utils.buildQuery(query)}`,
      );
    }
    nvRouteStatus.nvRouteObject = { path, query, data };
    nvRouteStatus.nvRouteParmasObject = {};
  }
} 
