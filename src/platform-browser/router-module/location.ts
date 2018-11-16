import { Injectable } from '../../di/injectable';
import { Utils } from '../../utils';

import { nvRouteStatus } from './index';

const utils = new Utils();

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
    if (!utils.isBrowser()) return {};
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
    if (!utils.isBrowser()) return;
    const rootPath = nvRouteStatus.nvRootPath === '/' ? '' : nvRouteStatus.nvRootPath;
    history.pushState(
      { path, query, data },
      title,
      `${rootPath}${path}${utils.buildQuery(query)}`,
    );
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
    history.replaceState(
      { path, query, data },
      title,
      `${rootPath}${path}${utils.buildQuery(query)}`,
    );
    nvRouteStatus.nvRouteObject = { path, query, data };
    nvRouteStatus.nvRouteParmasObject = {};
  }
} 
