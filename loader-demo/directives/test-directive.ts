import { OnInit, ReceiveInputs, Directive, ElementRef, Input, Renderer } from '@indiv/core';
import { RouteChange } from '@indiv/router'; 
import { HeroSearchService } from '../services/service';

@Directive({
  selector: 'test-directive',
})
export class TestDirective implements OnInit, RouteChange, ReceiveInputs {
  @Input('test-directive') public testDirective: string;
  constructor(
    private hss: HeroSearchService,
    private element: ElementRef,
    private renderer: Renderer,
  ) {}

  public nvOnInit() {
    console.log(5555, 'init TestDirective', this.testDirective);
    console.log(666666, 'init TestDirective element', this.element);
    this.hss.test();
    this.renderer.addEventListener(this.element.nativeElement, 'mouseover', this.changeColor);
    this.renderer.addEventListener(this.element.nativeElement, 'mouseout', this.removeColor);
  }
  public nvRouteChange(lastRoute: string, newRoute: string) {
    console.log(5555, 'nvRouteChange TestDirective', newRoute);
  }
  public nvReceiveInputs(nextInputs: any): void {
    console.log(33333, 'nvReceiveInputs test-directive', nextInputs);
  }

  public changeColor = () => {
    this.renderer.setStyle(this.element.nativeElement, 'color', 'red');
  }
  public removeColor = () => {
    this.renderer.removeStyle(this.element.nativeElement, 'color');
  }
}
