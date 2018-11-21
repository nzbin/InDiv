import { TUseClassProvider, TUseValueProvider } from '../types';
declare type TDirectiveOptions = {
    selector: string;
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};
/**
 * Decorator @Directive
 *
 * to decorate an InDiv Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function Directive<Props = any, Vm = any>(options: TDirectiveOptions): (_constructor: Function) => void;
export {};
