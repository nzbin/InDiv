export interface InterfaceUtils {
    toString: () => string;
    setCookie(name: string, value: any, options?: any): any;
    getCookie(name: string): any;
    removeCookie(name: string): boolean;
    buildQuery(object: any): string;
    getQuery(name: string): string;
    isFunction(func: any): boolean;
    isEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    deepIsEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    formatInnerHTML(inner: string): string;
}
