import { WindowDetail } from './window-detail.class';

/**
 * Defines the callback function provided to flow
 */
export type FlowEventHandler = (details: WindowDetail, e?: Event) => void;
