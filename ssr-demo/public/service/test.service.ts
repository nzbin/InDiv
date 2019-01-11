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
    this.subject.next({
      next: value,
    });
  }

  public unsubscribe() {
    this.subject.subscribe();
  }
}
