export { default as Easiest } from '../Easiest';
export { IESModal, EsRouteObject } from '../Easiest/types';

export interface IRouter {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: IRouter[];
}
