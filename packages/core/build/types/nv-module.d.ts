import { Injector } from '../di';
export declare type TInjectTokenProvider = {
    [props: string]: any | Function;
    provide: any;
    useClass?: Function;
    useValue?: any;
};
export declare type TUseClassProvider = {
    provide: any;
    useClass: Function;
};
export declare type TUseValueProvider = {
    provide: any;
    useValue: any;
};
export interface INvModule {
    imports?: Function[];
    declarations?: Function[];
    providers?: (Function | TUseClassProvider | TUseValueProvider)[];
    exports?: Function[];
    exportsList?: Function[];
    bootstrap?: Function;
    privateInjector?: Injector;
}
