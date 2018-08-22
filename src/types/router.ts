import { IComponent } from './component';
import { IEasiest } from './easiest';
import { IUtil } from './utils';
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
    utils: IUtil;
    $rootPath: string;
    hasRenderComponentList: IComponent[];
    needRedirectPath: string;
    $vm: IEasiest;
    watcher: IKeyWatcher;
    renderRouteList: string[];

    bootstrap(vm: IEasiest): void;
    init(arr: TRouter[]): void;
    esRouteChange(lastRoute?: string, nextRoute?: string): void;
    redirectTo(redirectTo: string): void;
    refresh(): void;
    distributeRoutes(): void;
    insertRenderRoutes(): void;
    generalDistributeRoutes(): void;
    // instantiateComponent(FindComponent: Function, renderDom: Element): Promise<any>;
    instantiateComponent(FindComponent: Function, renderDom: Element): any;
}
