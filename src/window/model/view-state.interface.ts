import { FlowEventHandlerObject } from '../../model/flow-event-handler-object.interface';
import { ViewEventName } from './view-event-name.type';

/**
 * Defines the object containg view event handlers
 */
export interface ViewState {
  element: Element;
  events: { [k in ViewEventName]?: FlowEventHandlerObject[]; };
  state: 'IN' | 'PARTIAL' | 'OUT' | 'UNKNOWN';
}
