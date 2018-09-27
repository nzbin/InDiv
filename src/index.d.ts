export type TFnWatcher = (oldData?: any) => void;

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

export type ComponentList<C> = {
    dom: Node;
    props: any;
    scope: C;
};

export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}

export type EsRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
}

export type TComponentOptions = {
    selector: string;
    template: string;
};

export type TInjectableOptions = {
    isSingletonMode?: boolean;
};

export type TInjectTokenProvider = {
    [props: string]: any;
    injectToken: string;
    useClass: Function;
};

export type TNvModuleOptions = {
    imports?: Function[];
    components: Function[];
    providers?: (Function | TInjectTokenProvider)[];
    exports?: Function[];
    bootstrap?: Function;
};

export interface IComponent<State = any, Props = any, Vm = any> {
    state?: State | any;
    props?: Props | any;
    utils: Utils;
    compileUtil: CompileUtil;
    renderDom?: Element;
    $vm?: Vm | any;
    stateWatcher?: Watcher;

    $template?: string;
    $components?: Function[];
    $componentList?: ComponentList<IComponent<any, any, any>>[];

    setState?: SetState;
    getLocation?: GetLocation;
    setLocation?: SetLocation;

    nvOnInit?(): void;
    watchData?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvWatchState?(oldState?: any): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: Props): void;
    render(): void;
    reRender(): void;
    mountComponent(dom: Element): void;
    componentsConstructor(dom: Element): void;
    getPropsValue(valueList: any[], value: any): void;
    buildProps(prop: any): any;
    buildComponentScope(ComponentClass: any, props: any, dom: Element): IComponent<any, any, any>;
}

export interface INvModule {
    utils?: Utils;
    $imports?: Function[];
    $components?: Function[];
    $providers?: (Function | TInjectTokenProvider)[];
    $exports?: Function[];
    providerList?: Map<Function | string, Function>;
    bootstrap?: Function;
    buildImports(): void;
    buildProviderList(): void
    buildProviders4Services(): void;
    buildProviders4Components(): void;
    buildComponents4Components(): void;
    buildExports(): void;
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
    toString: () => string;
    setCookie(name: string, value: any, options?: any): void;
    getCookie(name: string): any;
    removeCookie(name: string): boolean;
    buildQuery(object: any): string;
    getQuery(name: string): string;
    isFunction(func: any): boolean;
    isEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    deepIsEqual(a: any, b: any, aStack?: any[], bStack?: any[]): boolean;
    formatInnerHTML(inner: string): string;
    isBrowser(): boolean;
}

export declare class NVHttp {
    get?<P = any, R = any>(url: string, params?: P): Promise<R>;
    delete?<P = any, R = any>(url: string, params?: P): Promise<R>;
    post?<P = any, R = any>(url: string, params?: P): Promise<R>;
    put?<P = any, R = any>(url: string, params?: P): Promise<R>;
    patch?<P = any, R = any>(url: string, params?: P): Promise<R>;
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
    _getValueByValue(vm: any, exp: string, key: string): any;
    _setValueByValue(vm: any, exp: string, key: string, setValue: any): any;
    _getVMVal(vm: any, exp: string): any;
    _getVMRepeatVal(val: any, exp: string, key: string): any;
    bind(node: Element, key?: string, dir?: string, exp?: string, index?: number, vm?: any, watchValue?: any): void;
    templateUpdater(node: Element, val?: any, key?: string, vm?: any): void;
    textUpdater(node: Element, value: any): void;
    htmlUpdater(node: Element, value: any): void;
    ifUpdater(node: Element, value: any): void;
    srcUpdater(node: Element, value: any): void;
    hrefUpdater(node: Element, value: any): void;
    classUpdater(node: Element, value: any): void;
    modelUpdater(node: Element, value: any, exp: string, key: string, index: number, watchData: any, vm: any): void;
    eventHandler(node: Element, vm: any, exp: string, eventName: string, key: string, val: any): void;
}
export declare class CompileUtil {
    [index: string]: any;
    $fragment?: Element | DocumentFragment;
    constructor(fragment?: Element | DocumentFragment);
    _getValueByValue(vm: any, exp: string, key: string): any;
    _getVMVal(vm: any, exp: string): any;
    _getVMRepeatVal(vm: any, exp: string): void;
    bind(node: Element, vm: any, exp: string, dir: string): void;
    templateUpdater(node: any, vm: any, exp: string): void;
    textUpdater(node: Element, value: any): void;
    htmlUpdater(node: Element, value: any): void;
    ifUpdater(node: Element, value: any): void;
    srcUpdater(node: Element, value: any): void;
    hrefUpdater(node: Element, value: any): void;
    classUpdater(node: Element, value: any): void;
    modelUpdater(node: Element, value: any, exp: string, vm: any): void;
    repeatUpdater(node: Element, value: any, expFather: string, vm: any): void;
    repeatChildrenUpdater(node: Element, value: any, expFather: string, index: number, vm: any, watchValue: any): void;
    isDirective(attr: string): boolean;
    isEventDirective(event: string): boolean;
    isElementNode(node: Element): boolean;
    isRepeatNode(node: Element): boolean;
    isRepeatProp(node: Element): boolean;
    isTextNode(node: Element): boolean;
    cloneNode(node: Element, repeatData?: any): Node;
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
    node2Fragment(): DocumentFragment;
    compileText(node: Element, exp: string): void;
    eventHandler(node: Element, vm: any, exp: string, eventName: string): void;
    isDirective(attr: string): boolean;
    isEventDirective(eventName: string): boolean;
    isElementNode(node: Element | string): boolean;
    isRepeatNode(node: Element): boolean;
    isTextNode(node: Element): boolean;
}

export declare class InDiv {
    modalList: IMiddleware<InDiv>[];
    utils: Utils;
    rootDom: Element;
    $rootPath: string;
    $canRenderModule: boolean;
    $routeDOMKey: string;
    $rootModule: INvModule;
    $components: Function[];
    $esRouteObject?: EsRouteObject;
    $esRouteParmasObject?: {
        [props: string]: any;
    };
    constructor();
    use(modal: IMiddleware<InDiv>): number;
    setRootPath(rootPath: string): void;
    bootstrapModule(Esmodule: Function): void;
    init(): void;
    renderModuleBootstrap(): void;
    renderComponent(BootstrapComponent: Function, renderDOM: Element): any;
    replaceDom(component: IComponent, renderDOM: Element): void;
}

export declare class Router {
    routes: TRouter[];
    routesList: TRouter[];
    currentUrl: string;
    lastRoute: string;
    rootDom: Element;
    utils: Utils;
    $rootPath: string;
    hasRenderComponentList: IComponent[];
    needRedirectPath: string;
    $vm: InDiv;
    watcher: KeyWatcher;
    renderRouteList: string[];
    constructor();
    bootstrap(vm: InDiv): void;
    init(arr: TRouter[]): void;
    setRootPath(rootPath: string): void;
    routeChange?(lastRoute?: string, nextRoute?: string): void;
    redirectTo(redirectTo: string): void;
    refresh(): void;
    distributeRoutes(): void;
    insertRenderRoutes(): void;
    generalDistributeRoutes(): void;
    routerChangeEvent(index: number): void;
    emitComponentEvent(componentList: ComponentList<IComponent>[], event: string): void;
    instantiateComponent(FindComponent: Function, renderDom: Element): any;
}

// Dependency Injection
export declare function Injectable(options?: TInjectableOptions): (_constructor: Function) => void;

export declare function Injected(_constructor: Function): void;

export declare function injector(_constructor: Function, _module: any): any[];

export declare function factoryCreator(_constructor: Function, _module: any): any;

export declare function Component<State = any, Props = any, Vm = any>(options: TComponentOptions): (_constructor: Function) => void;

export declare function NvModule(options: TNvModuleOptions): (_constructor: Function) => void;

export declare function factoryModule(EM: Function): INvModule;

// life cycle hooks
export declare interface OnInit {
    nvOnInit(): void;
}

export declare interface BeforeMount {
    nvBeforeMount(): void;
}

export declare interface AfterMount {
    nvAfterMount(): void;
}

export declare interface OnDestory {
    nvOnDestory(): void;
}

export declare interface HasRender {
    nvHasRender(): void;
}

export declare interface WatchState {
    nvWatchState(oldState?: any): void;
}

export declare interface RouteChange {
    nvRouteChange(lastRoute?: string, newRoute?: string): void;
}

export declare interface ReceiveProps {
    nvReceiveProps(nextProps: any): void;
}

// component functions
export declare type SetState = <S>(newState: { [key: string]: S }) => void;

export declare type GetLocation = () => {
    path?: string;
    query?: {
        [props: string]: any;
    };
    params?: {
        [props: string]: any;
    };
    data?: any;
};

export declare type SetLocation = <Q, P>(path: string, query?: Q, params?: P, title?: string) => void;
