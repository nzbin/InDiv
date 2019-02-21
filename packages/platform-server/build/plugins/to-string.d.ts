import { RouteCongfig } from '../router';
/**
 * render a Indiv app to string
 *
 * if has routeConfig, will await route render
 *
 * @export
 * @param {Function} rootModule
 * @param {RouteCongfig} [routeConfig]
 * @returns {Promise<string>}
 */
export declare function renderToString(rootModule: Function, routeConfig?: RouteCongfig): Promise<string>;
