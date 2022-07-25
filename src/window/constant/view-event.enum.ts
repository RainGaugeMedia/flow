/**
 * Available element visibility events
 */
export enum ViewEvent {
  /** Element is first partially in the window */
  ENTER_VIEW = 'ENTER_VIEW',
  /** Element is first partially out of the window */
  EXIT_VIEW = 'EXIT_VIEW',
  /** Element is first fully in window */
  IN_VIEW = 'IN_VIEW',
  /** Element is first fully out of window */
  OUT_VIEW = 'OUT_VIEW'
}
