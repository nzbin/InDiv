import { IService } from '../types';
import "reflect-metadata";

export function Injectable(_constructor: Function): void {
    // 通过反射机制，获取参数类型列表    
    const paramsTypes: Array<Function> = Reflect.getMetadata('design:paramtypes', _constructor);
    console.log('paramsTypesparamsTypes', paramsTypes);
    console.log('_constructor_constructor', (_constructor as any)._injectedProviders);
    if (paramsTypes.length) {
        paramsTypes.forEach((v, i) => {
            if (v === _constructor) {
                throw new Error('不可以依赖自身');
            } else {
                const service = v.name;
                if ((_constructor as any)._needInjectedClass) {
                    (_constructor as any)._needInjectedClass.push(service);
                } else {
                    (_constructor as any)._needInjectedClass = [service];
                }
            }
        })
    }
    console.log('_needInjectedClass', (_constructor as any)._needInjectedClass);
}

export function Injector(_constructor: Function, module: any): any {
    const args: IService[] = [];
    if ((_constructor as any)._needInjectedClass) {
        (_constructor as any)._needInjectedClass.forEach((arg: string) => {
            const service = (_constructor as any)._injectedProviders.has(arg) ? (_constructor as any)._injectedProviders.get(arg) : module.$providers.find((service: IService) => service.constructor.name === arg);
            if (service) args.push(service);
        });
    } else {
        const CLASS_ARGUS = /^function\s+[^\(]*\(\s*([^\)]*)\)/m;
        const argList = _constructor.toString().match(CLASS_ARGUS)[1].replace(/ /g, '').split(',');
        // const args: IService[] = [];
        argList.forEach((arg: string) => {
            const argu = `${arg.charAt(0).toUpperCase()}${arg.slice(1)}`;
            const service = (_constructor as any)._injectedProviders.has(argu) ? (_constructor as any)._injectedProviders.get(argu) : module.$providers.find((service: IService) => service.constructor.name === argu);
            if (service) args.push(service);
        });
        // return args;
    }
    return args;
}

export function FactoryCreator(_constructor: Function, injector: any[]) {
    
}
