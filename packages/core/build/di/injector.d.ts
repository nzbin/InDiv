/**
 * IOC container for InDiv
 *
 * methods: push, find, get
 *
 * @export
 * @class Injector
 */
export declare class Injector {
    private readonly providerMap;
    private readonly instanceMap;
    /**
     * set Provider(Map) for save provide
     *
     * @param {*} key
     * @param {*} value
     * @memberof Injector
     */
    setProvider(key: any, value: any): void;
    /**
     * get Provider(Map) by key for save provide
     *
     * @param {*} key
     * @returns {*}
     * @memberof Injector
     */
    getProvider(key: any): any;
    /**
     * set instance of provider by key
     *
     * @param {*} key
     * @param {*} value
     * @memberof Injector
     */
    setInstance(key: any, value: any): void;
    /**
     * get instance of provider by key
     *
     * @param {*} key
     * @returns {*}
     * @memberof Injector
     */
    getInstance(key: any): any;
}
export declare const rootInjector: Injector;
