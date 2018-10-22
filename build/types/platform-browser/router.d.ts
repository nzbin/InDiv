import { IComponent, ComponentList } from '../component';
import { IInDiv } from '../indiv';
import { IKeyWatcher } from '../key-watcher';
export declare type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
};
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
export declare type SetLocation = <Q = any, P = any>(path: string, query?: Q, params?: P, title?: string) => void;
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
