// import { ILifecycle, IUtil, ILocationState } from '../types';

// import Utils from '../Utils';
// import { CompileUtil } from '../CompileUtils';

// abstract class Lifecycle<Vm = any> {
//   public compileUtil?: CompileUtil;
//   public utils?: IUtil;
//   public $location?: {
//     state?: () => ILocationState;
//     go?: (path: string, query?: any, params?: any) => void;
//   };
//   public $vm?: Vm | any;

//   constructor() {
//     this.compileUtil = new CompileUtil();
//     this.utils = new Utils();
//     this.$location = {
//       state: this.$getLocationState.bind(this),
//       go: this.$locationGo.bind(this),
//     };
//   }

//   public $getLocationState(): ILocationState {
//     return {
//       path: this.$vm.$esRouteObject.path,
//       query: this.$vm.$esRouteObject.query,
//       params: this.$vm.$esRouteObject.params,
//     };
//   }

//   public $locationGo(path: string, query?: any, params?: any): void {
//     const rootPath = this.$vm.$rootPath === '/' ? '' : this.$vm.$rootPath;
//     history.pushState(
//       {
//         path,
//         query,
//         params,
//       },
//       null,
//       `${rootPath}${path}${this.utils.buildQuery(query)}`);
//     this.$vm.$esRouteObject = {
//       path,
//       query,
//       params,
//     };
//   }

//   public esOnInit(): void { }

//   public esBeforeMount(): void { }

//   public esAfterMount(): void { }

//   public esOnDestory(): void { }

//   public esHasRender(): void { }

//   public esWatchState(oldData?: any, newData?: any): void { }
// }

// export default Lifecycle;

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
