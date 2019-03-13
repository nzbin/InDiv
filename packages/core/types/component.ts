import { DirectiveList } from './directive';
import { Injector } from '../di';
import { InDiv } from '../indiv';
import { Vnode, ParseOptions } from '../vnode';
import { Compile } from '../compile';

export type TComAndDir = {
  components: {
    nativeElement: any;
    inputs: any;
    name: string;
    nvContent?: Vnode[];
    inComponent?: boolean;
  }[];
  directives: {
    nativeElement: any;
    inputs: any;
    name: string;
    inComponent?: boolean;
  }[];
};

export type ComponentList = {
  nativeElement: any;
  inputs: any;
  instanceScope: IComponent;
  constructorFunction: Function;
  nvContent?: Vnode[];
  inComponent?: boolean;
};

export interface IComponent {
  _save_inputs?: any;
  nativeElement?: Element | any;
  $indivInstance?: InDiv;
  dependencesList?: string[];
  watchStatus?: 'pending' | 'available';
  isWaitingRender?: boolean;
  compileInstance?: Compile;
  parentComponent?: IComponent;

  template?: string;
  declarationMap?: Map<string, Function>;
  inputsList?: { propertyName: string; inputName: string;  }[];
  viewChildList?: { propertyName: string; selector: string | Function; }[];
  viewChildrenList?: { propertyName: string; selector: string | Function; }[];
  contentChildList?: { propertyName: string; selector: string | Function; }[];
  contentChildrenList?: { propertyName: string; selector: string | Function; }[];
  componentList?: ComponentList[];
  directiveList?: DirectiveList[];
  otherInjector?: Injector;
  privateInjector?: Injector;

  // compile template from string to templateVnode
  parseVnodeOptions?: ParseOptions;
  templateVnode?: Vnode[];
  saveVnode?: Vnode[];
  nvContent?: Vnode[];

  nvOnInit?(): void;
  watchData?(): void;
  nvBeforeMount?(): void;
  nvAfterMount?(): void;
  nvOnDestory?(): void;
  nvHasRender?(): void;
  nvDoCheck?(oldState?: any): void;
  nvReceiveInputs?(nextInputs: any): void;
  render?(): Promise<IComponent>;
  compiler?(nativeElement: Element | any, componentInstace: IComponent): Promise<IComponent>;
}
