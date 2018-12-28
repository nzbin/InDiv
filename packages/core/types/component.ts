import { DirectiveList, IDirective } from './directive';
import { Injector } from '../di';
import { RenderTaskQueue } from '../render';
import { InDiv } from '../indiv';
import { Vnode } from '../vnode';

export type TComAndDir = {
  components: {
    nativeElement: any,
    inputs: any,
    name: string,
  }[];
  directives: {
    nativeElement: any,
    inputs: any,
    name: string,
  }[];
};

export type ComponentList<C> = {
  nativeElement: any;
  inputs: any;
  instanceScope: C;
  constructorFunction: Function;
};

export interface IComponent {
  _save_inputs?: any;
  nativeElement?: Element | any;
  $indivInstance?: InDiv;
  renderTaskQueue?: RenderTaskQueue;
  dependencesList?: string[];
  renderStatus?: 'pending' | 'available';

  template?: string;
  declarationMap?: Map<string, Function>;
  inputsMap?: Map<string, string>;
  componentList?: ComponentList<IComponent>[];
  directiveList?: DirectiveList<IDirective>[];
  otherInjector?: Injector;
  privateInjector?: Injector;
  saveVnode?: Vnode[];

  nvOnInit?(): void;
  watchData?(): void;
  nvBeforeMount?(): void;
  nvAfterMount?(): void;
  nvOnDestory?(): void;
  nvHasRender?(): void;
  nvWatchState?(oldState?: any): void;
  nvRouteChange?(lastRoute: string, newRoute: string): void;
  nvReceiveInputs?(nextInputs: any): void;
  render?(): Promise<IComponent>;
  compiler?(nativeElement: Element | any, componentInstace: IComponent): Promise<IComponent>;
}
