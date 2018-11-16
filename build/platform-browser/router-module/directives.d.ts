import { ElementRef } from '../../internal-type';
import { OnInit, ReceiveProps, RouteChange } from '../../lifecycle';
import { NvLocation } from './location';
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
export declare class RouterFrom implements OnInit, ReceiveProps {
    private element;
    private props;
    constructor(element: ElementRef);
    nvOnInit(): void;
    nvReceiveProps(nextProps: string): void;
}
export declare class RouterActive implements OnInit, ReceiveProps {
    private element;
    private props;
    constructor(element: ElementRef);
    nvOnInit(): void;
    nvReceiveProps(nextProps: string): void;
}
