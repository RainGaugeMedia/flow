import { GestureEventName } from '../gesture/model/gesture-event-name.type';
import { ViewEventName } from '../window/model/view-event-name.type';
import { WindowEventName } from '../window/model/window-event-name.interface';

/**
 * The available flow event names
 */
export type EventName = GestureEventName | ViewEventName | WindowEventName;
