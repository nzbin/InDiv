/**
 * IOC container for InDiv
 *
 * methods: push, find, get
 *
 * @export
 * @class IOCContainer
 */
export declare class Injector {
    private providerMap;
    private instanceMap;
    setProvider(key: any, value: any): void;
    getProvider(key: any): any;
    getInstance(key: any): any;
    setInstance(key: any, value: any): void;
}
export declare const rootInjector: Injector;
