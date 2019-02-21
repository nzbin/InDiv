/**
 * ElementRef
 * use for dependency injection or Decorator @ViewChild @ViewChildren
 *
 * @export
 * @class ElementRef
 * @template R
 */
export declare class ElementRef<R = HTMLElement> {
    nativeElement: R;
    constructor(node: R);
}
