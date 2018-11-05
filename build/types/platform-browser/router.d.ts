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
