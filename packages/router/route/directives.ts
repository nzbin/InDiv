import { ElementRef, Utils, Directive, OnInit, ReceiveProps, OnDestory } from '@indiv/core';
import { NvLocation } from './location';
import { RouteChange } from './router-module';

const utils = new Utils();

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
  selector: 'router-to',
})
export class RouterTo implements OnInit, ReceiveProps, RouteChange, OnDestory {
  private to: string;
  private props: string;
  private from: string;
  private activeClass: string;

  constructor(
    private element: ElementRef,
    private location: NvLocation,
  ) {}

  public nvOnInit() {
    this.resetState(this.props);
    this.element.nativeElement.addEventListener('click', this.routeTo, false);
  }

  public nvReceiveProps(nextProps: string) {
    this.resetState(nextProps);
  }

  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    this.resetState(this.props);
    if (!this.activeClass) return;
    if (newRoute === this.to && !this.element.nativeElement.classList.contains(this.activeClass)) this.element.nativeElement.classList.add(this.activeClass);
    if (newRoute !== this.to && this.element.nativeElement.classList.contains(this.activeClass)) this.element.nativeElement.classList.remove(this.activeClass);
  }

  public nvOnDestory() {
    this.element.nativeElement.removeEventListener('click', this.routeTo, false);
  }

  private routeTo = () => {
    this.resetState(this.props);
    const location = this.location.get();
    const currentUrl = `${location.path}${utils.buildQuery(location.query)}`;
    if (!this.to) {
      console.error('Directive router-to on element', this.element.nativeElement, 'need a prop');
      return;
    }
    if (this.from && currentUrl === this.from) this.location.set(this.to);
    if (!this.from) this.location.set(this.to);
  }

  private resetState(props: string) {
    this.to = props;
    this.element.nativeElement.setAttribute('router-link-to', props);
    this.from = this.element.nativeElement.getAttribute('router-link-from');
    this.activeClass = this.element.nativeElement.getAttribute('router-link-active');
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
  selector: 'router-from',
})
export class RouterFrom implements OnInit, ReceiveProps, OnDestory {
  private props: string;

  constructor(private element: ElementRef) {}

  public nvOnInit() {
    this.element.nativeElement.setAttribute('router-link-from', this.props);
  }

  public nvReceiveProps(nextProps: string) {
    this.element.nativeElement.setAttribute('router-link-from', nextProps);
  }

  public nvOnDestory() {
    this.element.nativeElement.removeAttribute('router-link-from');
  }
}

/**
 * @Directive can be used as `router-active=""`
 *
 * @export
 * @class RouterActive
 * @implements {OnInit}
 * @implements {ReceiveProps}
 */
@Directive({
  selector: 'router-active',
})
export class RouterActive implements OnInit, ReceiveProps, OnDestory {
  private props: string;
  // todo 不知道怎么用
  constructor(private element: ElementRef) {}

  public nvOnInit() {
    this.element.nativeElement.setAttribute('router-link-active', this.props);
    this.setActive(this.props);
  }

  public nvReceiveProps(nextProps: string) {
    this.element.nativeElement.setAttribute('router-link-active', nextProps);
    this.setActive(nextProps);
  }

  public nvRouteChange(lastRoute?: string, newRoute?: string) {
    this.setActive(this.props);
  }

  public nvOnDestory() {
    this.element.nativeElement.removeAttribute('router-link-active');
  }

  public setActive(props: string) {

  }
}
