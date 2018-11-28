import { Injectable } from '../src';
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
