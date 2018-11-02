import { TUseClassProvider, TuseValueProvider } from '../types';
export { factoryModule } from './utils';
declare type TNvModuleOptions = {
    imports?: Function[];
    components: Function[];
    providers?: (Function | TUseClassProvider | TuseValueProvider)[];
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
