import { IMiddleware, INvModule, EsRouteObject, IComponent } from '../types';
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export declare class InDiv {
    modalList: IMiddleware<InDiv>[];
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
    render: () => Promise<IComponent>;
    reRender: () => Promise<IComponent>;
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
     * for Middleware set component Render function
     *
     * @template R
     * @template Re
     * @param {R} [render]
     * @param {Re} [reRender]
     * @memberof InDiv
     */
    setComponentRender<S = any, P = any, V = any>(render?: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void;
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
    renderModuleBootstrap(): void;
    /**
     * expose function for render Component
     *
     * @param {Function} BootstrapComponent
     * @param {Element} renderDOM
     * @param {INvModule} [nvModule=this.$rootModule]
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    renderComponent(BootstrapComponent: Function, renderDOM: Element, nvModule?: INvModule): Promise<IComponent>;
    /**
     * render adn replace DOM
     *
     * @param {IComponent} component
     * @param {Element} renderDOM
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    replaceDom(component: IComponent, renderDOM: Element): Promise<IComponent>;
}
