import { IComponent, IDirective } from '../types';

const stopRenderLifecycles: string[] = ['nvOnInit', 'watchData', 'nvBeforeMount', 'nvHasRender', 'nvOnDestory'];

/**
 * call lifecycle hooks
 * 
 * if lifecycle is nvOnInit or watchData or nvBeforeMount or nvOnDestory, component won't render
 *
 * @export
 * @param {(IComponent | IDirective)} vm
 * @param {string} lifecycle
 * @returns {void}
 */
export function lifecycleCaller(vm: IComponent | IDirective, lifecycle: string): void {
  if (!(vm as any)[lifecycle]) return;
  // Component
  if ((vm.constructor as any).nvType === 'nvComponent') {
    const canRenderLifecycle = stopRenderLifecycles.indexOf(lifecycle) === -1;
    const saveWatchStatus = (vm as IComponent).watchStatus;

    if (!canRenderLifecycle) (vm as IComponent).watchStatus = 'pending';
    if (canRenderLifecycle && saveWatchStatus === 'available') (vm as IComponent).watchStatus = 'pending';

    (vm as any)[lifecycle]();

    if (!canRenderLifecycle) {
      (vm as IComponent).watchStatus = 'available';
      (vm as IComponent).isWaitingRender = false;
    }
    if (canRenderLifecycle && saveWatchStatus === 'available') {
      (vm as IComponent).watchStatus = 'available';
      if ((vm as IComponent).isWaitingRender && (vm as IComponent).nvDoCheck) (vm as IComponent).nvDoCheck();
      if ((vm as IComponent).isWaitingRender) {
        (vm as IComponent).render();
        (vm as IComponent).isWaitingRender = false;
      }
    }
  }
  // Directive
  if ((vm.constructor as any).nvType === 'nvDirective') (vm as any)[lifecycle]();
}
