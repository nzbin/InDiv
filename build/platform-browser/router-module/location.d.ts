export declare class NvLocation {
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
    get(): {
        path?: string;
        query?: any;
        params?: any;
        data?: any;
        rootPath?: string;
    };
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
    set(path: string, query?: any, data?: any, title?: string): void;
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
    redirectTo(path: string, query?: any, data?: any, title?: string): void;
}
