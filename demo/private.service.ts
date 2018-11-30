import { Injectable } from '@indiv/core';
// import { Injectable } from '../packages/core';
import { SharedModule } from './share.module';

@Injectable({
  isSingletonMode: true,
  providedIn: SharedModule,
})
export class PrivateService {
  public isPrivate: boolean = true;

  public change() {
    this.isPrivate = false;
  }
}
