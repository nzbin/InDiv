import { INvModule, IComponent } from '../types';
import { Injector } from '../di';
export { ElementRef } from '../types';
export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export declare class InDiv {
    private modalList;
    private rootDom;
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
