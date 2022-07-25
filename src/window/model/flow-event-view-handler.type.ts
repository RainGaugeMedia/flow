import { WindowDetail } from './window-detail.class';

/**
 * Defines the callback function provided to flow for element view events
 */
export type FlowEventViewHandler = (detail: WindowDetail, element: Element, e?: Event) => void;
