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
     * deep clone a object or an array
     *
     * @param {*} obj
     * @returns {*}
     * @memberof Utils
     */
    deepClone(target: any): any;
    /**
     * build url query
     *
     * @param {*} object
     * @returns {string}
     * @memberof Utils
     */
    buildQuery(object: any): string;
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
     * judge evn has window and document
     *
     * @returns {boolean}
     * @memberof Utils
     */
    hasWindowAndDocument(): boolean;
}
export declare const utils: Utils;
