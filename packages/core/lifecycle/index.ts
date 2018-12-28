export interface OnInit {
  /**
   * for @Dirctive and @Component, when Dirctive or Component instance will be initialized
   *
   * @memberof OnInit
   */
  nvOnInit(): void;
}

export interface BeforeMount {
  /**
   * for @Dirctive and @Component, when Dirctive or Component will be mounted to DOM
   *
   * @memberof BeforeMount
   */
  nvBeforeMount(): void;
}

export interface AfterMount {
  /**
   * for @Dirctive and @Component, when Dirctive or Component has been mounted to DOM
   *
   * @memberof AfterMount
   */
  nvAfterMount(): void;
}

export interface HasRender {
  /**
   * for @Dirctive and @Component, when Dirctive or Component has been rendered to DOM every time
   *
   * @memberof HasRender
   */
  nvHasRender(): void;
}

export interface OnDestory {
  /**
   * for @Dirctive and @Component, when Dirctive or Component has been destoried
   *
   * @memberof OnDestory
   */
  nvOnDestory(): void;
}

export interface WatchState {
  /**
   * only for @Component, when state from Component instance has been changed
   *
   * @param {*} [oldState]
   * @memberof WatchState
   */
  nvWatchState(oldState?: any): void;
}

export interface ReceiveInputs {
  /**
   * for @Dirctive and @Component, when input from Component instance will been changed
   *
   * @param {*} nextInputs
   * @memberof ReceiveInputs
   */
  nvReceiveInputs(nextInputs: any): void;
}
