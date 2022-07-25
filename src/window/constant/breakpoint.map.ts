import { Breakpoint } from './breakpoint.enum';
import { DeviceMap } from './device.map';

/**
 * Defines a map of breakpoint values
 */
export type BreakpointMap = { [Property in keyof typeof Breakpoint]: number };

export const BreakpointMap: BreakpointMap = {
  XS: DeviceMap.iphone5.height - 1,
  S: DeviceMap.iphone5.height,
  M: DeviceMap.ipad.width,
  L: DeviceMap.ipad.height + 1,
  XL: 1200
};
