interface Type<T> extends Function {
    new (...args: any[]): T;
}
declare type TInjectableOptions = {
    isSingletonMode?: boolean;
    providedIn?: Type<any> | 'root' | null;
};
/**
 * Decorator @Injectable
 *
 * to decorate an InDiv Service
 *
 * @param {TInjectableOptions} [options]
 * @returns {(_constructor: Function) => void}
 */
export declare function Injectable(options?: TInjectableOptions): (_constructor: Function) => void;
export {};
