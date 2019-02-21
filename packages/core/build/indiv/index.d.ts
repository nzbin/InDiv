import { INvModule, IComponent } from '../types';
import { Renderer, Vnode } from '../vnode';
interface Type<T = any> extends Function {
    new (...args: any[]): T;
}
export interface IPlugin {
    bootstrap(vm: InDiv): void;
}
/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export declare class InDiv {
    private readonly pluginList;
    private rootElement;
    private routeDOMKey;
    private rootModule;
    private declarations;
    private bootstrapComponent;
    private renderer;
    private isServerRendering;
    private indivEnv;
    /**
     * create an instance of InDiv
     *
     * set provider and instance in rootInjector
     *
     * @memberof InDiv
     */
    constructor();
    /**
     * for using plugin class, use bootstrap method of plugin instance and return plugin's id in this.pluginList
     *
     * @param {Type<IPlugin>} Modal
     * @returns {number}
     * @memberof InDiv
     */
    use(Plugin: Type<IPlugin>): number;
    /**
     * set component Renderer
     *
     * @param {*} NewRenderer
     * @memberof InDiv
     */
    setRenderer(NewRenderer: any): void;
    /**
     * get component Renderer
     *
     * @readonly
     * @type {Renderer}
     * @memberof InDiv
     */
    readonly getRenderer: Renderer;
    /**
     * return component instance of root module's bootstrap
     *
     * @readonly
     * @type {IComponent}
     * @memberof InDiv
     */
    readonly getBootstrapComponent: IComponent;
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
     * @readonly
     * @type {string}
     * @memberof InDiv
     */
    readonly getRouteDOMKey: string;
    /**
     * get root module in InDiv
     *
     * @readonly
     * @type {INvModule}
     * @memberof InDiv
     */
    readonly getRootModule: INvModule;
    /**
     * get root module in root module
     *
     * @readonly
     * @type {Function[]}
     * @memberof InDiv
     */
    readonly getDeclarations: Function[];
    /**
     * set rootElement which InDiv application can be mounted
     *
     * this method can be used in cross platform architecture
     *
     * @param {*} node
     * @memberof InDiv
     */
    setRootElement(node: any): void;
    /**
     * get rootElement which InDiv application can be mounted
     *
     * this method can be used in cross platform architecture
     *
     * @readonly
     * @type {*}
     * @memberof InDiv
     */
    readonly getRootElement: any;
    /**
     * set env and isServerRendering for indiv env
     *
     * @param {string} env
     * @param {boolean} [isServerRendering]
     * @memberof InDiv
     */
    setIndivEnv(env: string, isServerRendering?: boolean): void;
    /**
     * get env and isServerRendering for indiv env
     *
     * @readonly
     * @type {{ isServerRendering: boolean; indivEnv: string; }}
     * @memberof InDiv
     */
    readonly getIndivEnv: {
        isServerRendering: boolean;
        indivEnv: string;
    };
    /**
     * bootstrap NvModule
     *
     * if not use Route it will be used
     *
     * @param {Function} Nvmodule
     * @returns {void}
     * @memberof InDiv
     */
    bootstrapModule(Nvmodule: Function): void;
    /**
     * init InDiv and renderModuleBootstrap()
     *
     * @template R
     * @returns {Promise<void>}
     * @memberof InDiv
     */
    init<R = Element>(): Promise<IComponent>;
    /**
     * method of Component's initialization
     *
     * init component and watch data
     *
     * @template R
     * @param {Function} BootstrapComponent
     * @param {R} nativeElement
     * @param {INvModule} [otherModule]
     * @returns {IComponent}
     * @memberof InDiv
     */
    initComponent<R = Element>(BootstrapComponent: Function, nativeElement: R, otherModule?: INvModule): IComponent;
    /**
     * run renderer of Component by async
     *
     * will call lifecycle nvBeforeMount, nvHasRender, nvAfterMount
     *
     * @template R
     * @param {IComponent} component
     * @param {R} nativeElement
     * @param {Vnode[]} [initVnode]
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    runComponentRenderer<R = Element>(component: IComponent, nativeElement: R, initVnode?: Vnode[]): Promise<IComponent>;
    /**
     * expose function for render Component
     *
     * if otherModule don't has use rootModule
     * if has otherModule, build component will use privateInjector from loadModule instead of rootInjector
     * if has initVnode, it will use initVnode for new Component
     *
     * @template R
     * @param {Function} BootstrapComponent
     * @param {R} nativeElement
     * @param {INvModule} [otherModule]
     * @param {Vnode[]} [initVnode]
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    renderComponent<R = Element>(BootstrapComponent: Function, nativeElement: R, otherModule?: INvModule, initVnode?: Vnode[]): Promise<IComponent>;
    /**
     * render NvModule Bootstrap
     *
     * @private
     * @template R
     * @returns {Promise<IComponent>}
     * @memberof InDiv
     */
    private renderModuleBootstrap;
    /**
     * render adn replace DOM
     *
     * @private
     * @template R
     * @param {IComponent} component
     * @param {R} nativeElement
     * @param {Vnode[]} [initVnode]
     * @returns {Promise<void>}
     * @memberof InDiv
     */
    private render;
}
export {};
