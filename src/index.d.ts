export type TFnWatcher = (oldData: any, newData: any) => void;
export type TFnRender = () => void;
export type TLocationState = {
    path: string;
    query?: any,
    params?: any;
}
export type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
};
export declare type ComponentList<C> = {
    dom: Element;
    props: any;
    scope: C;
};

export interface IMiddleware<ES> {
    $bootstrap(vm: ES): void;
}

export type EsRouteObject = {
    path: string;
    query?: any;
    params?: any;
}

export declare class Watcher {
    data: any;
    watcher: TFnWatcher;
    render: TFnRender;
    utils: Utils;
    constructor(data: any, watcher?: TFnWatcher, render?: TFnRender);
    watchData(data: any): void;
}

export declare class Utils {
    constructor();
    setCookie(name: string, value: any, options?: any): void;
    getCookie(name: string): any;
    removeCookie(name: string): boolean;
    buildQuery(object: any): string;
    getQuery(name: string): string;
    isFunction(func: any): boolean;
    isEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    deepIsEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    formatInnerHTML(inner: string): string;
}

export declare class Http {
    $get(url: string, params?: any): Promise<any>;
    $delete(url: string, params?: any): Promise<any>;
    $post(url: string, params?: any): Promise<any>;
    $put(url: string, params?: any): Promise<any>;
    $patch(url: string, params?: any): Promise<any>;
}

export declare class Service {
    static isSingletonMode?: boolean;
    static instance?: Service;
    static _injectedProviders?: Map<string, Service>;

    $http?: Http;
    constructor();
    static getInstance?(args?: any[]): Service;
}

export declare class KeyWatcher {
    data: any;
    watcher?: TFnWatcher;
    key: string;
    utils: Utils;
    constructor(data: any, key: string, watcher?: TFnWatcher);
    watchData(data: any, key: string): void;
}

export declare class CompileUtilForRepeat {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    constructor(fragment?: Element | DocumentFragment);
    _getVMVal(vm: any, exp: string): any;
    _getVMRepeatVal(val: any, exp: string, key: string): any;
    bind(node: Element, val?: any, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchData?: any): void;
    templateUpdater(node: Element, val?: any, key?: string, vm?: any): void;
    textUpdater(node: Element, value: any): void;
    htmlUpdater(node: Element, value: any): void;
    ifUpdater(node: Element, value: any): void;
    classUpdater(node: Element, value: any, oldValue: any): void;
    modelUpdater(node: Element, value: any, exp: string, key: string, index: number, watchValue: any, watchData: any, vm: any): void;
    eventHandler(node: Element, vm: any, exp: string, eventName: string, key: string, val: any): void;
}
export declare class CompileUtil {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    constructor(fragment?: Element | DocumentFragment);
    _getVMVal(vm: any, exp: string): any;
    _getVMRepeatVal(vm: any, exp: string): void;
    _setVMVal(vm: any, exp: string, value: any): void;
    bind(node: Element, vm: any, exp: string, dir: string): void;
    templateUpdater(node: any, vm: any, exp: string): void;
    textUpdater(node: Element, value: any): void;
    htmlUpdater(node: Element, value: any): void;
    ifUpdater(node: Element, value: any): void;
    classUpdater(node: Element, value: any, oldValue: any): void;
    modelUpdater(node: Element, value: any, exp: string, vm: any): void;
    repeatUpdater(node: Element, value: any, expFather: string, vm: any): void;
    repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any): void;
    isDirective(attr: string): boolean;
    isEventDirective(event: string): boolean;
    isElementNode(node: Element): boolean;
    isRepeatNode(node: Element): boolean;
    isIfNode(node: Element): boolean;
    isRepeatProp(node: Element): boolean;
}
export declare class Compile {
    utils: Utils;
    $vm: any;
    $el: Element;
    $fragment: DocumentFragment;
    constructor(el: string | Element, vm: any, routerRenderDom?: Element);
    init(): void;
    compileElement(fragment: DocumentFragment): void;
    recursiveDOM(childNodes: NodeListOf<Node & ChildNode>, fragment: DocumentFragment | Element): void;
    compile(node: Element, fragment: DocumentFragment | Element): void;
    node2Fragment(el: Element): DocumentFragment;
    compileText(node: Element, exp: string): void;
    eventHandler(node: Element, vm: any, exp: string, eventName: string): void;
    isDirective(attr: string): boolean;
    isEventDirective(eventName: string): boolean;
    isElementNode(node: Element | string): boolean;
    isRepeatNode(node: Element): boolean;
    isIfNode(node: Element): boolean;
    isTextNode(node: Element): boolean;
}

export declare abstract class Lifecycle<Vm = any> {
    compileUtil?: CompileUtil;
    utils?: Utils;
    $location?: {
        state?: () => TLocationState;
        go?: (path: string, query?: any, params?: any) => void;
    };
    $vm?: Vm | any;
    constructor();
    $getLocationState(): TLocationState;
    $locationGo(path: string, query?: any, params?: any): void;
    $onInit(): void;
    $beforeMount(): void;
    $afterMount(): void;
    $onDestory(): void;
    $hasRender(): void;
    $watchState(oldData?: any, newData?: any): void;
}

export declare class Component<State = any, Props = any, Vm = any> extends Lifecycle<Vm> {
    static scope?: Component<any, any, any>;
    static _injectedProviders?: Map<string, Function>;
    static _injectedComponents?: {
        [name: string]: Function;
    };
    state?: State | any;
    props?: Props | any;
    $renderDom?: Element;
    $globalContext?: any;
    $vm?: Vm | any;
    $template?: string;
    $components?: {
        [name: string]: Function;
    };
    $componentList?: ComponentList<Component<any, any, any>>[];
    stateWatcher?: Watcher;
    propsWatcher?: Watcher;
    constructor();
    $bootstrap(): void;
    $beforeInit(): void;
    $routeChange(lastRoute: string, newRoute: string): void;
    $render(): void;
    $reRender(): void;
    $mountComponent(dom: Element, isFirstRender?: boolean): void;
    $componentsConstructor(dom: Element): void;
    $setState(newState: any): void;
    $setProps(newProps: any): void;
    $setGlobalContext(newGlobalContext: any): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: Function, props: any, dom: Element): Component<any, any, any>;
}

export declare class EsModule {
    utils?: Utils;
    $imports?: Function[];
    $components?: {
        [name: string]: Function;
    };
    $providers?: Function[];
    $exports?: string[];
    $exportList?: {
        [name: string]: Function;
    };
    providerList?: Map<string, Service>;
    $bootstrap?: Function;
    constructor();
    $declarations(): void;
    $buildImports(): void;
    $buildProviderList(): void
    $buildProviders4Services(): void;
    $buildProviders4Components(): void;
    $buildComponents4Components(): void;
    $buildExports(): void;
}
export declare class Easiest {
    modalList: IMiddleware<Easiest>[];
    utils: Utils;
    $globalContext: any;
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $routeDOMKey: string;
    $rootModule: EsModule;
    $components: {
        [name: string]: Function;
    };
    $esRouteObject?: EsRouteObject;
    constructor();
    $use(modal: IMiddleware<Easiest>): number;
    $setRootPath(rootPath: string): void;
    $bootstrapModule(Esmodule: Function): void;
    $init(): void;
    $renderModuleBootstrap(): void;
    $renderComponent(BootstrapComponent: Function, renderDOM: Element): Promise<any>;
    replaceDom(component: Component, renderDOM: Element): Promise<any>;
}
export declare class Router {
    routes: TRouter[];
    routesList: TRouter[];
    currentUrl: string;
    lastRoute: string;
    rootDom: Element;
    utils: Utils;
    $rootPath: string;
    hasRenderComponentList: Component[];
    needRedirectPath: string;
    $vm: Easiest;
    watcher: KeyWatcher;
    renderRouteList: string[];
    constructor();
    $bootstrap(vm: Easiest): void;
    $init(arr: TRouter[]): void;
    $setRootPath(rootPath: string): void;
    $routeChange(lastRoute?: string, nextRoute?: string): void;
    redirectTo(redirectTo: string): void;
    refresh(): void;
    distributeRoutes(): void;
    insertRenderRoutes(): void;
    generalDistributeRoutes(): void;
    instantiateComponent(FindComponent: Function, renderDom: Element): Promise<any>;
}

export declare function Injectable(_constructor: Function): void;
export declare function injectorinjector(_constructor: Function, _module: any): any[];
export declare function factoryCreator(_constructor: Function, _module: any): any;
