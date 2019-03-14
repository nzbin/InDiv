import { InDiv, Component, AfterMount, ReceiveInputs, OnDestory, ElementRef, HasRender, Input, ContentChild, ContentChildren } from '@indiv/core';
import { HttpClient } from '@indiv/common';

import { TestContentComponent } from '../test-content-component';
import { TestDirective } from '../../directives/test-directive';

@Component({
  selector: 'test-component',
  templateUrl: './template.html',
})
export class TestComponent implements OnDestory, ReceiveInputs, AfterMount, HasRender {
  public state: any;
  @Input() public manName: any;

  public man: {name: string} = {
    name: 'fucker',
  };

  @ContentChild('test-content-component') private testComponent: TestContentComponent;
  @ContentChild('a') private tagA: HTMLElement;
  @ContentChildren('test-directive') private testDirectiveString: TestDirective[];
  @ContentChildren('a') private tagAs: TestDirective[];
  @ContentChildren(TestDirective) private testDirective: TestDirective[];

  constructor(
    private httpClient: HttpClient,
    private indiv: InDiv,
    private element: ElementRef,
  ) {
    console.log(55544333, 'init TestComponent', this.indiv, this.element);
    this.httpClient.get('/success').subscribe({
      next: (value: any) => { console.log(4444, value); },
    });
  }

  public click() {
    console.log('this.manName', this.manName);
    this.manName = 'fuck!';
  }

  public nvHasRender() {
    console.log('TestComponent HasRender', this.tagA, this.tagAs, this.testDirectiveString);
  }

  public nvAfterMount() {
    console.log('TestComponent AfterMount');
  }
  public nvOnDestory() {
    console.log('TestComponent OnDestory');
  }

  public nvReceiveInputs(p: any) {
    console.log('test-component nvReceiveInputs', p);
  }
}
