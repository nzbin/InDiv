import { INvModule, IComponent } from '../types';

import { Utils } from '../utils';
import { factoryCreator } from '../di';
import { factoryModule } from '../nv-module';

export class ElementRef<R = HTMLElement> {
  public nativeElement: R;
  constructor(node: R) {
    this.nativeElement = node;
  }
}

interface Type<T = any> extends Function {
  new (...args: any[]): T;
}

export interface IPlugin {
  bootstrap(vm: InDiv): void;
}

const utils = new Utils();

/**
 * main: for new InDiv
 *
 * @class InDiv
 */
export class InDiv {
  private readonly pluginList: IPlugin[] = [];
  private rootNode: Element | any;
  private routeDOMKey: string = 'router-render';
  private rootModule: INvModule = null;
  private declarations: Function[];
  private bootstrapComponent: IComponent;
  private render: () => Promise<IComponent>;
  private reRender: () => Promise<IComponent>;

  constructor() {
    if (utils.isBrowser()) {
      this.rootNode = document.querySelector('#root');
    }
  }

  /**
   * for using plugin class, use bootstrap method of plugin instance and return plugin's id in this.pluginList
   *
   * @param {Type<IPlugin>} Modal
   * @returns {number}
   * @memberof InDiv
   */
  public use(Plugin: Type<IPlugin>): number {
    const newPlugin = new Plugin();
    newPlugin.bootstrap(this);
    this.pluginList.push(newPlugin);
    return this.pluginList.length - 1;
  }
  
  /**
   * set component Render function
   * 
   * render and rerender will be a method in Component instance,
   * so you can use this in render and rerender
   *
   * @template S
   * @template P
   * @template V
   * @param {() => Promise<IComponent<S, P, V>>} render
   * @param {() => Promise<IComponent<S, P, V>>} [reRender]
   * @memberof InDiv
   */
  public setComponentRender<S = any, P = any, V = any>(render: () => Promise<IComponent<S, P, V>>, reRender?: () => Promise<IComponent<S, P, V>>): void {
    this.render = render;
    this.reRender = reRender ? reRender : render;
  }

  /**
   * get component Render function 
   *
   * @returns {{ render: () => Promise<IComponent>, reRender: () => Promise<IComponent> }}
   * @memberof InDiv
   */
  public getComponentRender(): { render: () => Promise<IComponent>, reRender: () => Promise<IComponent> } {
    return {
      render: this.render,
      reRender: this.reRender,
    };
  }

  /**
   * return component instance of root module's bootstrap
   *
   * @returns {IComponent}
   * @memberof InDiv
   */
  public getBootstrapComponent(): IComponent {
    return this.bootstrapComponent;
  }

  /**
   * set route's DOM tag name
   *
   * @param {string} routeDOMKey
   * @memberof InDiv
   */
  public setRouteDOMKey(routeDOMKey: string): void {
    this.routeDOMKey = routeDOMKey;
  }
  
  /**
   * get route's DOM tag name
   *
   * @returns {string}
   * @memberof InDiv
   */
  public getRouteDOMKey(): string {
    return this.routeDOMKey;
  }

  /**
   * get root module in InDiv
   *
   * @returns {INvModule}
   * @memberof InDiv
   */
  public getRootModule(): INvModule {
    return this.rootModule;
  }

  /**
   * get root module in root module
   *
   * @returns {Function[]}
   * @memberof InDiv
   */
  public getDeclarations(): Function[] {
    return this.declarations;
  }

  /**
   * set rootNode which InDiv application can be mounted
   * 
   * this method can be used in cross platform architecture
   *
   * @param {*} node
   * @memberof InDiv
   */
  public setRootNode(node: any): void {
    this.rootNode = node;
  }

  /**
   * get rootNode which InDiv application can be mounted
   * 
   * this method can be used in cross platform architecture
   *
   * @returns {*}
   * @memberof InDiv
   */
  public getRootNode(): any {
    return this.rootNode;
  }

  /**
   * bootstrap NvModule
   * 
   * if not use Route it will be used
   *
   * @param {Function} Nvmodule
   * @returns {void}
   * @memberof InDiv
   */
  public bootstrapModule(Nvmodule: Function): void {
    if (!Nvmodule) throw new Error('must send a root module');

    this.rootModule = factoryModule(Nvmodule, null, this);
    this.declarations = [...this.rootModule.declarations];
  }

  /**
   * init InDiv and renderModuleBootstrap()
   *
   * @template R
   * @returns {void}
   * @memberof InDiv
   */
  public init<R = Element>(): void {
    if (!utils.isBrowser()) return;

    if (!this.rootModule) throw new Error('must use bootstrapModule to declare a root NvModule before init');
    if (!this.render) throw new Error('must use plugin of platform to set a render in InDiv!');
    this.renderModuleBootstrap<R>();
  }

  /**
   * expose function for render Component
   * 
   * if otherModule don't has use rootModule
   * 
   * if has otherModule, build component will use privateInjector from loadModule instead of rootInjector
   *
   * @template R
   * @param {Function} BootstrapComponent
   * @param {R} renderNode
   * @param {INvModule} [otherModule]
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  public async renderComponent<R = Element>(BootstrapComponent: Function, renderNode: R, otherModule?: INvModule): Promise<IComponent> {
    const provideAndInstanceMap = new Map();
    provideAndInstanceMap.set(InDiv, this);
    provideAndInstanceMap.set(ElementRef, new ElementRef(renderNode));

    const otherInjector = otherModule ? otherModule.privateInjector : null;
    const component: IComponent = factoryCreator(BootstrapComponent, otherInjector, provideAndInstanceMap);

    component.$indivInstance = this;

    if (otherModule) {
      otherModule.declarations.forEach((findDeclaration: Function) => {
        if (!component.declarationMap.has((findDeclaration as any).selector)) component.declarationMap.set((findDeclaration as any).selector, findDeclaration);
      });
    } else {
      this.rootModule.declarations.forEach((findDeclaration: Function) => {
        if (!component.declarationMap.has((findDeclaration as any).selector)) component.declarationMap.set((findDeclaration as any).selector, findDeclaration);
      });
    }

    component.render = this.render.bind(component);
    component.reRender = this.reRender.bind(component);
    // set otherInjector for components from loadModule to be used
    component.otherInjector = otherInjector;

    if (component.nvOnInit) component.nvOnInit();
    if (component.watchData) component.watchData();
    if (!component.template) throw new Error('must decaler this.template in bootstrap()');
    const template = component.template;
    if (template && typeof template === 'string' && renderNode) {
      if (component.nvBeforeMount) component.nvBeforeMount();

      const _component = await this.componentRender<R>(component, renderNode);
      if (_component.nvAfterMount) _component.nvAfterMount();
      return _component;

    } else {
      throw new Error('renderBootstrap failed: template or rootDom is not exit');
    }
  }

  /**
   * render NvModule Bootstrap
   *
   * @private
   * @template R
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  private async renderModuleBootstrap<R = Element>(): Promise<IComponent> {
    if (!this.rootModule.bootstrap) throw new Error('need bootstrap for render Module Bootstrap');
    const BootstrapComponent = this.rootModule.bootstrap;
    this.bootstrapComponent = await this.renderComponent<R>(BootstrapComponent, this.rootNode);
    return this.bootstrapComponent;
  }

  /**
   * render adn replace DOM
   *
   * @private
   * @template R
   * @param {IComponent} component
   * @param {R} renderNode
   * @returns {Promise<IComponent>}
   * @memberof InDiv
   */
  private componentRender<R = Element>(component: IComponent, renderNode: R): Promise<IComponent> {
    component.renderNode = renderNode;
    return component.render();
  }
}
