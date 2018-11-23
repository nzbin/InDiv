import { IMiddleware, INvModule, IComponent } from '../types';
import { Injector } from '../di';
export { ElementRef } from '../types';
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export declare class InDiv {
    private modalList;
    private rootDom;
    private $rootPath;
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
     * @param {IMiddleware<InDiv>} modal
     * @returns {number}
     * @memberof InDiv
     */
    use(modal: IMiddleware<InDiv>): number;
    /**
     * for Middleware set RootPath
     *
     * if not use, rootPath will be <router-render />
     *
     * @param {string} rootPath
     * @memberof InDiv
     */
    setRootPath(rootPath: string): void;
    /**
     * get RootPath for InDiv
     *
     * @returns {string}
     * @memberof InDiv
     */
    getRootPath(): string;
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
    getDirectives(): Function[];
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
     * render NvModule Bootstrap
     *
     * @returns {void}
     * @memberof InDiv
     */
    renderModuleBootstrap(): Promise<IComponent>;
    /**
     * expose function for render Component
     *
     * if otherModule don't has use rootModule
     *
     * if has otherInjector, build component will use otherInjector instead of rootInjector
     *
     * @param {Function} BootstrapComponent
     * @param {Element} renderDOM
     * @param {INvModule} [otherModule]
     * @param {Injector} [otherInjector]
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    renderComponent(BootstrapComponent: Function, renderDOM: Element, otherModule?: INvModule, otherInjector?: Injector): Promise<IComponent>;
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
