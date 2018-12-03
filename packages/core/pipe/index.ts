import { injected } from '../di';

export type TPipeOptions = {
  name: string;
};

export function Pipe(options: TPipeOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    injected(_constructor);
    (_constructor as any).nvType = 'nvPipe';
    const vm: any = _constructor.prototype;
    vm.name = options.name;
  };
}
