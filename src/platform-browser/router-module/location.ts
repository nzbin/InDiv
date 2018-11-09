import { Injectable } from '../../di/injectable';
import { Utils } from '../../utils';

import { nvRouteStatus } from './index';

const utils = new Utils();

@Injectable()
export class NvLocation {
  /**
   * getLocation in @Component or @Directive
   *
   * get nvRouteObject and nvRouteParmasObject in InDiv
   * 
   * @export
   * @returns {{
   *   path?: string;
   *   query?: any;
   *   params?: any;
   *   data?: any;
   * }}
   */
  public getLocation(): {
    path?: string;
    query?: any;
    params?: any;
    data?: any;
  } {
    if (!utils.isBrowser()) return {};
    return {
      path: nvRouteStatus.nvRouteObject.path,
      query: nvRouteStatus.nvRouteObject.query,
      params: nvRouteStatus.nvRouteParmasObject,
      data: nvRouteStatus.nvRouteObject.data,
    };
  }

  /**
   * setLocation in @Component or @Directive
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
  public setLocation(path: string, query?: any, data?: any, title?: string): void {
    if (!utils.isBrowser()) return;
    const rootPath = nvRouteStatus.nvRootPath === '/' ? '' : nvRouteStatus.nvRootPath;
    history.pushState(
      { path, query, data },
      title,
      `${rootPath}${path}${utils.buildQuery(query)}`,
    );
    nvRouteStatus.nvRouteObject = { path, query, data };
  }
} 
