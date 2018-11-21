export declare type TChildModule = () => Promise<any>;
export declare type TLoadChild = {
    name: string;
    child: TChildModule;
};
export declare type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
    loadChild?: TLoadChild | TChildModule;
};
export declare type NvRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};
