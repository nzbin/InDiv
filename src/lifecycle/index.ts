export interface OnInit {
  nvOnInit(): void;
}

export interface BeforeMount {
  nvBeforeMount(): void;
}

export interface AfterMount {
  nvAfterMount(): void;
}

export interface OnDestory {
  nvOnDestory(): void;
}

export interface HasRender {
  nvHasRender(): void;
}

export interface WatchState {
  nvWatchState(oldState?: any): void;
}

export interface RouteChange {
  nvRouteChange(lastRoute?: string, newRoute?: string): void;
}

export interface ReceiveProps {
  nvReceiveProps(nextProps: any): void;
}

export type SetState = (newState: any) => void;

// export type GetLocation = () => {
//   path?: string;
//   query?: {
//     [props: string]: any;
//   };
//   params?: {
//     [props: string]: any;
//   };
//   data?: any;
// };

// export type SetLocation = <Q = any, P = any>(path: string, query?: Q, data?: P, title?: string) => void;
