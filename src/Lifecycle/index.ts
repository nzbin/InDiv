export interface OnInit {
  esOnInit(): void;
}

export interface BeforeMount {
  esBeforeMount(): void;
}

export interface AfterMount {
  esAfterMount(): void;
}

export interface OnDestory {
  esOnDestory(): void;
}

export interface HasRender {
  esHasRender(): void;
}

export interface WatchState {
  esWatchState(oldData?: any, newData?: any): void;
}

export interface RouteChange {
  esRouteChange(lastRoute?: string, newRoute?: string): void;
}
