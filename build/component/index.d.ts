import { TUseClassProvider, TuseValueProvider } from '../types';
declare type TComponentOptions = {
    selector: string;
    template: string;
    providers?: (Function | TUseClassProvider | TuseValueProvider)[];
};
/**
 * Decorator @Component
 *
 * to decorate an InDiv component
 * render function comes from InDiv instance, you can set it by youself
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function Component<State = any, Props = any, Vm = any>(options: TComponentOptions): (_constructor: Function) => void;
export declare function setState(newState: any): void;
export {};
