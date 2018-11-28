import { TUseClassProvider, TUseValueProvider } from '../types';
declare type TNvModuleOptions = {
    imports?: Function[];
    declarations?: Function[];
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
    exports?: Function[];
    bootstrap?: Function;
};
/**
 * Decorator @NvModule
 *
 * to decorate an InDiv NvModule
 *
 * @export
 * @param {TNvModuleOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function NvModule(options: TNvModuleOptions): (_constructor: Function) => void;
export {};
