import { ElementRef, utils, Directive, OnInit, ReceiveProps, OnDestory, Input, InDiv } from '@indiv/core';
import { NvLocation } from './location';
import { RouteChange } from './router-module';

/**
 * @Directive can be used as `router-to=""`
 *
 * @export
 * @class RouterTo
 * @implements {OnInit}
 * @implements {ReceiveProps}
 * @implements {RouteChange}
 */
@Directive({
  selector: 'routerTo',
})
export class RouterTo implements OnInit, ReceiveProps, RouteChange, OnDestory {
  @Input('routerTo') private to: string;
  private from: string;

  constructor(
    private indivInstance: InDiv,
    private element: ElementRef,
    private location: NvLocation,
  ) { }

  public nvOnInit() {
    this.resetState(this.to);
    this.indivInstance.getRenderer.addEventListener(this.element.nativeElement, 'click', this.routeTo);
  }

  public nvReceiveProps(nextProps: string) {
    this.resetState(nextProps);
  }

  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    this.resetState(this.to);
  }

  public nvOnDestory() {
    this.indivInstance.getRenderer.removeEventListener(this.element.nativeElement, 'click', this.routeTo);
  }

  private routeTo = () => {
    this.resetState(this.to);
    const nvLocation = this.location.get();
    const currentUrl = `${nvLocation.path}${utils.buildQuery(nvLocation.query)}`;
    if (!this.to) {
      console.error('Directive router-to on element', this.element.nativeElement, 'need a prop');
      return;
    }
    if (this.from && currentUrl === this.from) this.location.set(this.to);
    if (!this.from) this.location.set(this.to);
  }

  private resetState(props: string) {
    this.to = props;
    this.indivInstance.getRenderer.setAttribute(this.element.nativeElement, { type: 'attribute', name: 'router-link-to', value: props });
    this.from = this.indivInstance.getRenderer.getAttribute(this.element.nativeElement, 'router-link-from');
  }
}

/**
 * @Directive can be used as `router-from=""`
 *
 * @export
 * @class RouterFrom
 * @implements {OnInit}
 * @implements {ReceiveProps}
 */
@Directive({
  selector: 'routerFrom',
})
export class RouterFrom implements OnInit, ReceiveProps, OnDestory {
  @Input('routerFrom') private from: string;

  constructor(
    private indivInstance: InDiv,
    private element: ElementRef,
  ) { }

  public nvOnInit() {
    this.indivInstance.getRenderer.setAttribute(this.element.nativeElement, { type: 'attribute', name: 'router-link-from', value: this.from });
  }

  public nvReceiveProps(nextProps: string) {
    this.indivInstance.getRenderer.setAttribute(this.element.nativeElement, { type: 'attribute', name: 'router-link-from', value: nextProps });
  }

  public nvOnDestory() {
    this.element.nativeElement.removeAttribute('router-link-from');
    this.indivInstance.getRenderer.removeAttribute(this.element.nativeElement, { type: 'attribute', name: 'router-link-from', value: this.from });
  }
}
