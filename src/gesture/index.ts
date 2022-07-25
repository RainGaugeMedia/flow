/*
window.addEventListener('mousedown', (e: MouseEvent) => { });
    window.addEventListener('mouseup', (e: MouseEvent) => { });
    window.addEventListener('mousemove', (e: MouseEvent) => { });
    window.addEventListener('touchstart', (e: TouchEvent) => { });
    window.addEventListener('touchend', (e: TouchEvent) => { });
    window.addEventListener('touchmove', (e: TouchEvent) => { });
    */

import { PointerDetail } from './model/pointer-detail.class';

export class FlowGesture {
    // ***********************************************************************************
    // Constant(s):
    // ***********************************************************************************

    // ***********************************************************************************
    // Class Member(s):
    // ***********************************************************************************

    private down: PointerDetail;
    private move: PointerDetail;
    private isDown: boolean = false;
    private isMoving: boolean = false;
    private isRotating: boolean = false;
    private isScaling: boolean = false;
    private isTouching: boolean = false;

    // ***********************************************************************************
    // Constructor:
    // ***********************************************************************************

    constructor() {

    }

    // ***********************************************************************************
    // Public Method(s):
    // ***********************************************************************************

    // ***********************************************************************************
    // Private Method(s):
    // ***********************************************************************************

}
