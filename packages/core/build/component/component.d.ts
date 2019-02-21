import { TUseClassProvider, TUseValueProvider } from '../types';
export declare type TComponentOptions = {
    selector: string;
    template?: string;
    templateUrl?: string;
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
};
/**
 * Decorator @Component
 *
 * to decorate an InDiv component
 * render function comes from InDiv instance, you can set it by youself
 *
 * watchStatus: 'pending' | 'available', to controll watcher and render will be called or not in dependencesList
 *
 * @template Props
 * @template Vm
 * @param {TComponentOptions} options
 * @returns {(_constructor: Function) => void}
 */
export declare function Component(options: TComponentOptions): (_constructor: Function) => void;
