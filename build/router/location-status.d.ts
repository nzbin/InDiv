export declare type NvRouteObject = {
    path: string;
    query?: {
        [props: string]: any;
    };
    data?: any;
};
export declare const nvRouteStatus: {
    nvRouteObject: NvRouteObject;
    nvRouteParmasObject: {
        [props: string]: any;
    };
    nvRootPath: string;
};
