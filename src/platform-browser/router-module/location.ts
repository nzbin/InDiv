import { Injectable } from '../../di/injectable';
import { Utils } from '../../utils';

import { esRouteStatus } from './index';

const utils = new Utils();

@Injectable()
export class NvLocation {
  /**
   * getLocation in @Component or @Directive
   *
   * get $esRouteObject and $esRouteParmasObject in InDiv
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
      path: esRouteStatus.esRouteObject.path,
      query: esRouteStatus.esRouteObject.query,
      params: esRouteStatus.esRouteParmasObject,
      data: esRouteStatus.esRouteObject.data,
    };
  }

  /**
   * setLocation in @Component or @Directive
   * 
   * set $esRouteObject in InDiv
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
    const rootPath = (this as any).$vm.$rootPath === '/' ? '' : (this as any).$vm.$rootPath;
    history.pushState(
      { path, query, data },
      title,
      `${rootPath}${path}${utils.buildQuery(query)}`,
    );
    esRouteStatus.esRouteObject = { path, query, data };
  }
} 
