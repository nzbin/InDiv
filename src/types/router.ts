import { IComponent, ComponentList } from './component';
import { IInDiv } from './indiv';
import { IKeyWatcher } from './keyWatcher';


export type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
};

export interface IRouter {
    routes: TRouter[];
    routesList: TRouter[];
    currentUrl: string;
    lastRoute: string;
    rootDom: Element;
    $rootPath: string;
    hasRenderComponentList: IComponent[];
    needRedirectPath: string;
    $vm: IInDiv;
    watcher: IKeyWatcher;
    renderRouteList: string[];

    bootstrap(vm: IInDiv): void;
    init(arr: TRouter[]): void;
    setRootPath(rootPath: string): void;
    routeChange?(lastRoute?: string, nextRoute?: string): void;
    redirectTo(redirectTo: string): void;
    refresh(): void;
    distributeRoutes(): Promise<any>;
    insertRenderRoutes(): Promise<IComponent>;
    generalDistributeRoutes(): Promise<IComponent>;
    routerChangeEvent(index: number): void;
    emitComponentEvent(componentList: ComponentList<IComponent>[], event: string): void;
    instantiateComponent(FindComponent: Function, renderDom: Element): Promise<IComponent>;
}
