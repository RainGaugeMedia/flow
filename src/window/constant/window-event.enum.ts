/**
 * Available window events
 */
export enum WindowEvent {
  /** When pre-defined window sizes change */
  BREAKPOINT = 'BREAKPOINT',
  /** When width-to-height ratio changes */
  ORIENTATION = 'ORIENTATION',
  /** Built-in window resize event */
  RESIZE = 'RESIZE',
  /** When window resize event is initiated */
  RESIZE_START = 'RESIZE_START',
  /** When window resize event has stopped for configured time */
  RESIZE_STOP = 'RESIZE_STOP',
  /** Built-in window scroll event */
  SCROLL = 'SCROLL',
  /** When window scroll event is initiated */
  SCROLL_START = 'SCROLL_START',
  /** When window scroll event has stopped for configured time */
  SCROLL_STOP = 'SCROLL_STOP'
}
