export type NvRouteObject = {
  path: string;
  query?: {
      [props: string]: any;
  };
  data?: any;
};

export const nvRouteStatus: {
  nvRouteObject: NvRouteObject,
  nvRouteParmasObject: {
    [props: string]: any;
  },
  nvRootPath: string,
} = {
  nvRouteObject: {
    path: null,
    query: {},
    data: null,
  },
  nvRouteParmasObject: {},
  nvRootPath: '/',
};
