export type TRouter = {
    path: string;
    redirectTo?: string;
    component?: string;
    children?: TRouter[];
    loadChild?: {
        name: string;
        childModule: () => Promise<any>;
    };
};
