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
  nvWatchState(oldData?: any, newData?: any): void;
}

export interface RouteChange {
  nvRouteChange(lastRoute?: string, newRoute?: string): void;
}

export interface ReceiveProps {
  nvReceiveProps(nextProps: any): void;
}

export type SetState = <S>(newState: { [key: string]: S }) => void;

export type GetLocation = () => {
  path?: string;
  query?: any;
  params?: any;
  data?: any;
};

export type SetLocation = <Q = any, P = any>(path: string, query?: Q, data?: P, title?: string) => void;
