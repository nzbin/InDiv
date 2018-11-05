/**
 * utils for InDiv
 *
 * @class Utils
 */
export declare class Utils {
    /**
     * Creates an instance of Utils.
     * @memberof Utils
     */
    constructor();
    /**
     * set Cookie with easier-cookie
     *
     * @param {string} name
     * @param {*} value
     * @param {*} [options]
     * @memberof Utils
     */
    setCookie(name: string, value: any, options?: any): void;
    /**
     * get Cookie with easier-cookie
     *
     * @param {string} name
     * @returns {*}
     * @memberof Utils
     */
    getCookie(name: string): any;
    /**
     * remove Cookie with easier-cookie
     *
     * @param {string} name
     * @returns {boolean}
     * @memberof Utils
     */
    removeCookie(name: string): boolean;
    /**
     * build url query
     *
     * @param {*} object
     * @returns {string}
     * @memberof Utils
     */
    buildQuery(object: any): string;
    /**
     * get one url query
     *
     * @param {string} name
     * @returns {string}
     * @memberof Utils
     */
    getQuery(name: string): string;
    /**
     * judge something is Function or not
     *
     * @param {*} func
     * @returns {boolean}
     * @memberof Utils
     */
    isFunction(func: any): boolean;
    /**
     * judge two things are equal or not
     *
     * @param {*} a
     * @param {*} b
     * @param {any[]} [aStack]
     * @param {any[]} [bStack]
     * @returns {boolean}
     * @memberof Utils
     */
    isEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    /**
     * deep judge two things are equal or not
     *
     * @param {*} a
     * @param {*} b
     * @param {any[]} [aStack]
     * @param {any[]} [bStack]
     * @returns {boolean}
     * @memberof Utils
     */
    deepIsEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    /**
     * format string for InnerHTML
     *
     * @param {string} inner
     * @returns {string}
     * @memberof Utils
     */
    formatInnerHTML(inner: string): string;
    /**
     * judge evn is browser or node
     *
     * @returns {boolean}
     * @memberof Utils
     */
    isBrowser(): boolean;
}
