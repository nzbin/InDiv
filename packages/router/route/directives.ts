import { ElementRef, utils, Directive, OnInit, ReceiveInputs, OnDestory, Input, Renderer } from '@indiv/core';
import { NvLocation } from './location';
import { RouteChange } from './lifecycle';

/**
 * @Directive can be used as `router-to=""`
 *
 * @export
 * @class RouterTo
 * @implements {OnInit}
 * @implements {ReceiveInputs}
 * @implements {RouteChange}
 */
@Directive({
  selector: 'routerTo',
})
export class RouterTo implements OnInit, ReceiveInputs, RouteChange, OnDestory {
  @Input('routerTo') private to: string;
  private from: string;

  constructor(
    private renderer: Renderer,
    private element: ElementRef,
    private location: NvLocation,
  ) { }

  public nvOnInit() {
    this.resetState(this.to);
    this.renderer.addEventListener(this.element.nativeElement, 'click', this.routeTo);
  }

  public nvReceiveInputs(nextInputs: string) {
    this.resetState(nextInputs);
  }

  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    this.resetState(this.to);
  }

  public nvOnDestory() {
    this.renderer.removeEventListener(this.element.nativeElement, 'click', this.routeTo);
    this.renderer.removeAttribute(this.element.nativeElement, 'router-link-to');
  }

  private routeTo = () => {
    this.resetState(this.to);
    const nvLocation = this.location.get();
    const currentUrl = `${nvLocation.path}${utils.buildQuery(nvLocation.query)}`;
    if (!this.to) {
      console.error('Directive router-to on element', this.element.nativeElement, 'need a input');
      return;
    }
    if (this.from && currentUrl === this.from) this.location.set(this.to);
    if (!this.from) this.location.set(this.to);
  }

  private resetState(to: string) {
    this.to = to;
    this.renderer.setAttribute(this.element.nativeElement, 'router-link-to', to);
    this.from = this.renderer.getAttribute(this.element.nativeElement, 'router-link-from');
  }
}

/**
 * @Directive can be used as `router-from=""`
 *
 * @export
 * @class RouterFrom
 * @implements {OnInit}
 * @implements {ReceiveInputs}
 */
@Directive({
  selector: 'routerFrom',
})
export class RouterFrom implements OnInit, ReceiveInputs, OnDestory {
  @Input('routerFrom') private from: string;

  constructor(
    private renderer: Renderer,
    private element: ElementRef,
  ) { }

  public nvOnInit() {
    this.renderer.setAttribute(this.element.nativeElement, 'router-link-from', this.from);
  }

  public nvReceiveInputs(nextInputs: string) {
    this.renderer.setAttribute(this.element.nativeElement, 'router-link-from', nextInputs);
  }

  public nvOnDestory() {
    this.renderer.removeAttribute(this.element.nativeElement, 'router-link-from');
  }
}
