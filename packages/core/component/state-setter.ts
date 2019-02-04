import { IComponent } from '../types';
import { setState } from './utils';

/**
 * Decorator @StateSetter in @Component
 * 
 * use Decorator @StateSetter to map setState
 *
 * @export
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export function StateSetter(): (target: IComponent, propertyName: string) => any {
  return function (target: IComponent, propertyName: string): any {
    (target as any)[propertyName] = setState;
    return (target as any)[propertyName];
  };
}
