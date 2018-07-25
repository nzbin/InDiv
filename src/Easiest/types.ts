export { default as Component } from '../Component';
export { default as EsModule } from '../EsModule';
export { default as Service } from '../Service';

export interface IESModal<ES> {
    $bootstrap(vm: ES): any;
}

export interface EsRouteObject {
    path: string;
    query?: any;
    params?: any;
}
