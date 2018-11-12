export declare class NvLocation {
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
     *   rootPath?: string;
     * }}
     */
    getLocation(): {
        path?: string;
        query?: any;
        params?: any;
        data?: any;
        rootPath?: string;
    };
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
    setLocation(path: string, query?: any, data?: any, title?: string): void;
}
