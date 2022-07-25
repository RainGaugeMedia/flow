import { FlowEventHandler } from '../window/model/flow-event-handler.type';

/**
 * Defines the object containing an window event handler
 */
export interface FlowEventHandlerObject {
  id: string;
  handler: (...args: any[]) => void;
}
