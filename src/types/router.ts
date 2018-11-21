export type TChildModule = () => Promise<any>;

export type TLoadChild = {
    name: string;
    child: TChildModule;
};

export type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
    loadChild?: TLoadChild | TChildModule;
};

export type NvRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};
