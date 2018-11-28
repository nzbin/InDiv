import { INvModule, IComponent } from '../types';
export declare class ElementRef extends HTMLElement {
}
interface Type<T = any> extends Function {
    new (...args: any[]): T;
}
export interface IMiddleware {
    bootstrap(vm: InDiv): void;
}
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export declare class InDiv {
    private readonly middlewareList;
    private readonly rootDom;
    private $routeDOMKey;
    private $rootModule;
    private $declarations;
    private bootstrapComponent;
    private render;
    private reRender;
    constructor();
    /**
     * for using middleware and use bootstrap method of middleware
     *
     * @param {Type<IMiddleware>} Modal
     * @returns {number}
     * @memberof InDiv
     */
    use(Middleware: Type<IMiddleware>): number;
    /**
     * set component Render function
     *
     * @template R
     * @template Re
     * @param {R} [render]
     * @param {Re} [reRender]
     * @memberof InDiv
     */
    setComponentRender<S = any, P = any, V = any>(render: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void;
    /**
     * get component Render function
     *
     * @returns {{ render: () => Promise<IComponent>, reRender: () => Promise<IComponent> }}
     * @memberof InDiv
     */
    getComponentRender(): {
        render: () => Promise<IComponent>;
        reRender: () => Promise<IComponent>;
    };
    /**
     * return component instance of root module's bootstrap
     *
     * @returns {IComponent}
     * @memberof InDiv
     */
    getBootstrapComponent(): IComponent;
    /**
     * set route's DOM tag name
     *
     * @param {string} routeDOMKey
     * @memberof InDiv
     */
    setRouteDOMKey(routeDOMKey: string): void;
    /**
     * get route's DOM tag name
     *
     * @returns {string}
     * @memberof InDiv
     */
    getRouteDOMKey(): string;
    /**
     * get root module in InDiv
     *
     * @returns {INvModule}
     * @memberof InDiv
     */
    getRootModule(): INvModule;
    /**
     * get root module in root module
     *
     * @returns {Function[]}
     * @memberof InDiv
     */
    getDeclarations(): Function[];
    /**
     * bootstrap NvModule
     *
     * if not use Route it will be used
     *
     * @param {Function} Esmodule
     * @returns {void}
     * @memberof InDiv
     */
    bootstrapModule(Esmodule: Function): void;
    /**
     * init InDiv and renderModuleBootstrap()
     *
     * @returns {void}
     * @memberof InDiv
     */
    init(): void;
    /**
     * expose function for render Component
     *
     * if otherModule don't has use rootModule
     *
     * if has otherModule, build component will use privateInjector from loadModule instead of rootInjector
     *
     * @param {Function} BootstrapComponent
     * @param {Element} renderDOM
     * @param {INvModule} [otherModule]
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    renderComponent(BootstrapComponent: Function, renderDOM: Element, otherModule?: INvModule): Promise<IComponent>;
    /**
     * render NvModule Bootstrap
     *
     * @returns {void}
     * @memberof InDiv
     */
    private renderModuleBootstrap;
    /**
     * render adn replace DOM
     *
     * @param {IComponent} component
     * @param {Element} renderDOM
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    private replaceDom;
}
export {};
