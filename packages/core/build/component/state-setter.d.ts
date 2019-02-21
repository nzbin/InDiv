import { IComponent } from '../types';
/**
 * Decorator @StateSetter in @Component
 *
 * use Decorator @StateSetter to map setState
 *
 * @export
 * @returns {(target: IComponent, propertyName: string) => any}
 */
export declare function StateSetter(): (target: IComponent, propertyName: string) => any;
