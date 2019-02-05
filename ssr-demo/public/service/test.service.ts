import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@indiv/core';

@Injectable()
export default class TestService {
  public data: number;
  public subject: Subject<any>;

  constructor() {
    this.data = 1;
    this.subject = new Subject();
  }
  
  public subscribe(fun: (value: any) => void): Subscription {
    return this.subject.subscribe({
      next: fun,
    });
  }

  public update(value: any) {
    console.log(1000000, 'this.data', this.data);
    this.data = value;
    console.log(111111, 'this.data', this.data);
    this.subject.next({
      next: value,
    });
  }

  public unsubscribe() {
    this.subject.subscribe();
  }
}
