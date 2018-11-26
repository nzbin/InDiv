import { Injectable } from '../src';

@Injectable()
export class HeroSearchService1 {
  constructor() {}

  public test() {
    console.log('HeroSearchService !!!1111');
  }
}

@Injectable()
export class HeroSearchService2 {
  constructor() {}

  public test(): void {
    console.log('HeroSearchService !!!2222');
  }
}

@Injectable()
export class HeroSearchService {
  public hsr: HeroSearchService1;
  public testValue: number = 3;
  constructor(
    private heroSearchService1: HeroSearchService1,
  ) {
    console.log('检查 是否相等', heroSearchService1 === this.heroSearchService1);
    console.log('测试 ts 依赖注入', this.heroSearchService1);
    this.heroSearchService1.test();
  }

  public test() {
    console.log('HeroSearchService !!!1111111111', this.testValue);
    this.testValue = 4;
    console.log('HeroSearchService !!!000000000', this.testValue);
  }

  public showValue() {
    console.log(444422, 'this.testValue', this.testValue);
  }
}
