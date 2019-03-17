import { IComponent } from '../types';

/**
 * change detection trategy
 * 
 * OnPush: 0, will jump watchData
 * Default: 1, collect dependences and watchData
 *
 * @export
 * @enum {number}
 */
export enum ChangeDetectionStrategy {
  OnPush,
  Default,
}

export type TMarkForCheck = () => Promise<void>;

/**
 * call DoCheck and render
 *
 * @returns {Promise<void>}
 */
async function markForCheck(): Promise<void> {
  if ((this as IComponent).nvDoCheck) (this as IComponent).nvDoCheck();
  await (this as IComponent).render();
}

/**
 * Decorator @MarkForCheck
 * 
 * tell @Component that need to check for render views
 *
 * @export
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function MarkForCheck(): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    target[propertyName] = markForCheck;
    return target[propertyName];
  };
}
