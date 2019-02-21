import { ElementRef, OnInit, ReceiveInputs, OnDestory, Renderer } from '@indiv/core';
import { NvLocation } from './location';
import { RouteChange } from './lifecycle';
/**
 * @Directive can be used as `router-to=""`
 *
 * @export
 * @class RouterTo
 * @implements {OnInit}
 * @implements {ReceiveInputs}
 * @implements {RouteChange}
 */
export declare class RouterTo implements OnInit, ReceiveInputs, RouteChange, OnDestory {
    private renderer;
    private element;
    private location;
    private to;
    private from;
    constructor(renderer: Renderer, element: ElementRef, location: NvLocation);
    nvOnInit(): void;
    nvReceiveInputs(nextInputs: string): void;
    nvRouteChange(lastRoute: string, newRoute: string): void;
    nvOnDestory(): void;
    private routeTo;
    private resetState;
}
/**
 * @Directive can be used as `router-from=""`
 *
 * @export
 * @class RouterFrom
 * @implements {OnInit}
 * @implements {ReceiveInputs}
 */
export declare class RouterFrom implements OnInit, ReceiveInputs, OnDestory {
    private renderer;
    private element;
    private from;
    constructor(renderer: Renderer, element: ElementRef);
    nvOnInit(): void;
    nvReceiveInputs(nextInputs: string): void;
    nvOnDestory(): void;
}
