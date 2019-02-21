interface Type<T = any> extends Function {
    new (...args: any[]): T;
}
export declare type TInjectableOptions = {
    isSingletonMode?: boolean;
    providedIn?: Type<any> | 'root' | null;
};
/**
 * Decorator @Injectable
 *
 * to decorate an InDiv Service
 *
 * options Object has two key-values:
 * 1. isSingletonMode?: boolean; To show InDiv this service is a singleton service or not. Defalut value is true.
 * 2. providedIn?: Type<any> | 'root' | null;
 *   If is NvModule, to show InDiv this service can be injected in which providers of NvModule's meta data. PrivateInjector is always used in LazyLoad Module.
 *   if is 'root', it will be injected into rootInjector.
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
export declare function Injectable(options?: TInjectableOptions): (_constructor: Function) => void;
export {};
