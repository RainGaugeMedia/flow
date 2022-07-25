
export class PointerDetail {
  // ***********************************************************************************
  // Constant(s):
  // ***********************************************************************************

  // ***********************************************************************************
  // Class Member(s):
  // ***********************************************************************************

  public elapsed: number = 0;
  public movement: number = 0;
  public movementX: number = 0;
  public movementY: number = 0;
  public pageX: number;
  public pageY: number;
  public relatedTarget: Element | null;
  public speed: number = 0;
  public target: Element | null;
  public timeStamp: DOMHighResTimeStamp;
  public x: number;
  public y: number;

  // ***********************************************************************************
  // Constructor:
  // ***********************************************************************************

  constructor(evt: MouseEvent | TouchEvent, previous?: PointerDetail) {
    this.timeStamp = evt.timeStamp;
    const e: MouseEvent | Touch = evt.type.includes('mouse') ? (evt as MouseEvent) : (evt as TouchEvent).touches[0];
    

    if (previous) { }
  }

  // ***********************************************************************************
  // Public Method(s):
  // ***********************************************************************************

  // ***********************************************************************************
  // Private Method(s):
  // ***********************************************************************************

}
