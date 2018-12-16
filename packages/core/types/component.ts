import { DirectiveList, IDirective } from './directive';
import { Injector } from '../di';
import { RenderTaskQueue } from '../render';
import { InDiv } from '../indiv';
import { Vnode, TAttributes } from '../vnode';

export type ComponentList<C> = {
    dom: Node;
    props: any;
    scope: C;
    constructorFunction: Function;
    hasRender: boolean;
};

export interface IComponent {
    props?: any;
    nativeElement?: Element | any;
    $indivInstance?: InDiv;
    renderTaskQueue?: RenderTaskQueue;
    dependencesList?: string[];
    renderStatus?: 'pending' | 'available';

    template?: string;
    declarationMap?: Map<string, Function>;
    componentList?: ComponentList<IComponent>[];
    directiveList?: DirectiveList<IDirective>[];
    otherInjector?: Injector;
    privateInjector?: Injector;

    componentAndDirectiveList?: {
        components: Map<Vnode, Vnode>;
        directives: Map<TAttributes, TAttributes>;
    };

    nvOnInit?(): void;
    watchData?(): void;
    nvBeforeMount?(): void;
    nvAfterMount?(): void;
    nvOnDestory?(): void;
    nvHasRender?(): void;
    nvWatchState?(oldState?: any): void;
    nvRouteChange?(lastRoute: string, newRoute: string): void;
    nvReceiveProps?(nextProps: any): void;
    render?(): Promise<IComponent>;
    compiler?(nativeElement: Element | any, componentInstace: IComponent): Promise<IComponent>;
}
