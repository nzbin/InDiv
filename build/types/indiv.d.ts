export interface IMiddleware<ES> {
    bootstrap(vm: ES): void;
}
