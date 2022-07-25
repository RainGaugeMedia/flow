import { Breakpoint } from '../constant/breakpoint.enum';
import { BreakpointMap } from '../constant/breakpoint.map';
import { Direction } from '../../constant/direction.enum';
import { Orientation } from '../constant/orientation.enum';
import { Size } from '../constant/size.enum';


/**
 * Defines the state of the window size and position
 */
export class WindowDetail {
  // ***********************************************************************************
  // Class Member(s):
  // ***********************************************************************************

  public breakpoint: Breakpoint;
  public directionHorizontal: Direction | Size | null = null;
  public directionVertical: Direction | Size | null = null;
  public height: number = window.innerHeight;
  public movementHeight: number = 0;
  public movementPageHeight: number = 0;
  public movementPageWidth: number = 0;
  public movementWidth: number = 0;
  public movementX: number = 0;
  public movementY: number = 0;
  public orientation: Orientation;
  public pageHeight: number;
  public pageWidth: number;
  public timestamp: DOMHighResTimeStamp;
  public width: number = window.innerWidth;
  public x: number = window.pageXOffset;
  public y: number = window.pageYOffset;

  // ***********************************************************************************
  // Constructor:
  // ***********************************************************************************

  constructor(timestamp: DOMHighResTimeStamp, previous?: WindowDetail) {
    this.timestamp = timestamp;
    this.orientation = this.calculateOrientation();
    this.pageHeight = this.calculatePageSize();
    this.pageWidth = this.calculatePageSize(true);
    this.breakpoint = this.calculateBreakpoint();

    if (previous) {
      this.movementHeight = this.height - previous.height;
      this.movementPageHeight = this.pageHeight - previous.pageHeight;
      this.movementPageWidth = this.pageWidth - previous.pageWidth;
      this.movementWidth = this.width - previous.width;
      this.movementX = this.x - previous.x;
      this.movementY = this.y - previous.y;
      this.calculateDirection();
    }
  }

  // ***********************************************************************************
  // Private Method(s):
  // ***********************************************************************************

  private calculateBreakpoint(): Breakpoint {
    if (this.width >= BreakpointMap.XL) return Breakpoint.XL;
    if (this.width >= BreakpointMap.L) return Breakpoint.L;
    if (this.width >= BreakpointMap.M) return Breakpoint.M;
    if (this.width >= BreakpointMap.S) return Breakpoint.S;
    return Breakpoint.XS;
  }

  private calculateDirection(): void {
    if (this.movementHeight || this.movementWidth) {
      this.directionVertical = this.movementWidth < 0 ? Size.DECREASE : this.movementWidth > 0 ? Size.INCREASE : null;
      this.directionHorizontal =
        this.movementHeight < 0 ? Size.DECREASE : this.movementHeight > 0 ? Size.INCREASE : null;
    } else if (this.movementX || this.movementY) {
      this.directionVertical = this.movementX < 0 ? Direction.LEFT : this.movementX > 0 ? Direction.RIGHT : null;
      this.directionHorizontal = this.movementY < 0 ? Direction.UP : this.movementY > 0 ? Direction.DOWN : null;
    };
  }

  private calculateOrientation(): Orientation {
    return this.width >= this.height ? Orientation.LANDSCAPE : Orientation.PORTRAIT;
  }

  private calculatePageSize(width: boolean = false): number {
    const side: 'Height' | 'Width' = width ? 'Width' : 'Height';
    return Math.max(
      document.documentElement[`client${side}`],
      document.documentElement[`offset${side}`],
      document.documentElement[`scroll${side}`],
      document.body[`client${side}`],
      document.body[`offset${side}`],
      document.body[`scroll${side}`]
    );
  }
}