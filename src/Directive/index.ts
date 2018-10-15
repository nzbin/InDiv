type TDirectiveOptions = {
  selector: string;
};

/**
 * Decorator @Directive
 * 
 * to decorate an InDiv Directive
 *
 * @template State
 * @template Props
 * @template Vm
 * @param {TDirectiveOptions} options
 * @returns {(_constructor: Function) => void}
 */
function Directive<State = any, Props = any, Vm = any>(options: TDirectiveOptions): (_constructor: Function) => void {
  return function (_constructor: Function): void {
    (_constructor as any).$isComponentDirective = true;
    (_constructor as any).$selector = options.selector;
    const vm = _constructor.prototype;
  };
}

export default Directive;
