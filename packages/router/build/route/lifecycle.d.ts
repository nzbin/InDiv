export interface RouteChange {
    nvRouteChange(lastRoute: string, newRoute: string): void;
}
export interface RouteCanActive {
    nvRouteCanActive(lastRoute: string, newRoute: string): boolean;
}
