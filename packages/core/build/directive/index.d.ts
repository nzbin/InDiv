import { TUseClassProvider, TUseValueProvider } from '../types';
export declare type TDirectiveOptions = {
    selector: string;
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};
/**
 * Decorator @Directive
 *
 * to decorate an InDiv Directive
 *
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function Directive(options: TDirectiveOptions): (_constructor: Function) => void;
