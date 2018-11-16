import { ElementRef } from '../../internal-type';
import { OnInit, ReceiveProps, RouteChange } from '../../lifecycle';
import { NvLocation } from './location';
/**
 * @Directive can be used as `router-to=""`
 *
 * @export
 * @class RouterTo
 * @implements {OnInit}
 * @implements {ReceiveProps}
 * @implements {RouteChange}
 */
export declare class RouterTo implements OnInit, ReceiveProps, RouteChange {
    private element;
    private location;
    private to;
    private props;
    private from;
    private activeClass;
    constructor(element: ElementRef, location: NvLocation);
    nvOnInit(): void;
    nvReceiveProps(nextProps: string): void;
    nvRouteChange(lastRoute?: string, newRoute?: string): void;
    private routeTo;
    private resetState;
}
/**
 * @Directive can be used as `router-from=""`
 *
 * @export
 * @class RouterFrom
 * @implements {OnInit}
 * @implements {ReceiveProps}
 */
export declare class RouterFrom implements OnInit, ReceiveProps {
    private element;
    private props;
    constructor(element: ElementRef);
    nvOnInit(): void;
    nvReceiveProps(nextProps: string): void;
}
/**
 * @Directive can be used as `router-active=""`
 *
 * @export
 * @class RouterActive
 * @implements {OnInit}
 * @implements {ReceiveProps}
 */
export declare class RouterActive implements OnInit, ReceiveProps {
    private element;
    private props;
    constructor(element: ElementRef);
    nvOnInit(): void;
    nvReceiveProps(nextProps: string): void;
}
