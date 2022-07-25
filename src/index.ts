import { UUIDv4 } from '@raingauge/utils';
import { GestureEvent } from './gesture/constant/gesture-event.enum';
import { ViewEvent } from './window/constant/view-event.enum';
import { WindowEvent } from './window/constant/window-event.enum';
import { FlowEventViewHandler } from './window/model/flow-event-view-handler.type';
import { FlowEventHandler } from './window/model/flow-event-handler.type';
import { GestureEventName } from './gesture/model/gesture-event-name.type';
import { ViewEventName } from './window/model/view-event-name.type';
import { ViewState } from './window/model/view-state.interface';
import { WindowDetail } from './window/model/window-detail.class';
import { WindowEventName } from './window/model/window-event-name.interface';
import { FlowEventGestureHandler } from './gesture/model/flow-event-gesture-handler.type';
import { FlowEventHandlerObject } from './model/flow-event-handler-object.interface';

/**
 * The main class of flow 
 */
class Flow {
  // ***********************************************************************************
  // Constant(s):
  // ***********************************************************************************

  // ***********************************************************************************
  // Class Member(s):
  // ***********************************************************************************

  private hasListenerResize: boolean = false;
  private hasListenerScroll: boolean = false;
  private isResizing: boolean = false;
  private isScrolling: boolean = false;
  private stopThreshhold: number = 200;
  private viewEvents: ViewState[] = [];
  private windowEvents: { [key in WindowEventName]?: FlowEventHandlerObject[] } = {};
  private windowDetail: WindowDetail;

  // ***********************************************************************************
  // Constructor:
  // ***********************************************************************************

  constructor() {
    if (document.readyState === 'complete') {
      this.update();
    } else {
      const load: EventListenerOrEventListenerObject = () => {
        this.update();
        window.removeEventListener('load', load);
      };
      window.addEventListener('load', load);
    }
  }

  // ***********************************************************************************
  // Public Method(s):
  // ***********************************************************************************

  /**
   * Determine if a given element is partially in the window
   * @param element The element to evaluate
   * @returns a boolean value
   */
  public elementInView(element: Element): boolean {
    return this.calculateViewState(element, this.windowDetail) === 'PARTIAL';
  }

  /**
   * Determine if a given element is fully in the window
   * @param element The element to evaluate
   * @returns a boolean value
   */
  public elementInViewFull(element: Element): boolean {
    return this.calculateViewState(element, this.windowDetail) === 'IN';
  }

  /**
   * Determine if a given element is fully out of the window
   * @param element The element to evaluate
   * @returns a boolean value
   */
  public elementOutView(element: Element): boolean {
    return this.calculateViewState(element, this.windowDetail) === 'OUT';
  }

  /**
   * Gets the percentage a given element or the document is scrolled down
   * @param element The element to evaluate 
   * @returns a number between 1 and 100
   */
  public getScrolledPercent(element?: Element): number {
    let dividend: number = this.windowDetail.y;
    let divisor: number = this.windowDetail.pageHeight - this.windowDetail.height;
    if (element) {
      divisor = Math.max(element.clientHeight, (element as HTMLElement).offsetHeight, element.scrollHeight);
      dividend = Math.min(divisor, Math.abs(Math.min(0, element.getBoundingClientRect().top)));
    }
    return Number((Math.min(1, dividend / divisor) * 100).toFixed(3));
  }

  /**
   * Removes a listener given the event id
   * @param id the id of the event
   */
  public off(id: string): void {
    // look for id and delete event
  }

  /**
   * Add a listener to execute a given function on an element's visibility event
   * @param event the window event to listen on
   * @param element the element to add the listener to
   * @param handler the action to be executed on the event
   */
  public on(
    event: ViewEvent | ViewEventName,
    element: Element,
    handler: FlowEventViewHandler
  ): void;
  /**
   * Add a listener to execute a given function on a window event
   * @param event the window event to listen on
   * @param handler the action to be executed on the event
   */
  public on(
    event: WindowEvent | WindowEventName,
    handler: FlowEventHandler
  ): void;
  public on(
    event: GestureEvent | GestureEventName | ViewEvent | ViewEventName | WindowEvent | WindowEventName,
    elementOrHandler: Element | ((...args: any[]) => void),
    handler?: (...args: any[]) => void
  ): string {
    const id: string = (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: number | string) => {
      c = Number(c);
      return (c ^ (window.crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    }); // UUIDv4();
    if (ViewEvent[event as ViewEventName] && arguments.length === 3) {
      this.registerViewEvent(id, event as ViewEvent, (elementOrHandler as Element), handler!);
      return id;
    } else if (WindowEvent[event as WindowEventName] && typeof elementOrHandler === 'function') {
      this.registerWindowEvent(id, event as WindowEvent, (elementOrHandler as FlowEventHandler));
      return id;
    }
    throw new Error('Unknown event');
  }

  /**
   * Manually update the windows state
   * @returns an updated {@link WindowDetail} object
   */
  public update(): WindowDetail {
    return this.execute(performance.now());
  }

  // ***********************************************************************************
  // Private Method(s):
  // ***********************************************************************************

  private calculateViewState(element: Element, windowDetail: WindowDetail): 'IN' | 'PARTIAL' | 'OUT' {
    const rect: DOMRect = element.getBoundingClientRect();

    return 0 < rect.top && 0 < rect.left && windowDetail.height > rect.bottom && windowDetail.width > rect.right ? 'IN' : 0 < rect.bottom && 0 < rect.right && windowDetail.height > rect.top && windowDetail.width > rect.left ? 'PARTIAL' : 'OUT';
  }

  private EVENT_HANDLER_RESIZE: (e: UIEvent) => void =
    (e: UIEvent) => this.execute(e.timeStamp, e.type.toUpperCase(), e);

  private EVENT_HANDLER_SCROLL: (e: Event) => void =
    (e: Event) => this.execute(e.timeStamp, e.type.toUpperCase(), e);

  private evalViewEvent(viewState: ViewState, windowDetail: WindowDetail, evt?: Event): void {
    const state: 'IN' | 'PARTIAL' | 'OUT' = this.calculateViewState(viewState.element, windowDetail);

    if (viewState.events['ENTER_VIEW'] && viewState.state === 'OUT' && state !== 'OUT') {
      viewState.events['ENTER_VIEW']
        .forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, viewState.element, evt));
    }
    if (viewState.events['EXIT_VIEW'] && viewState.state === 'IN' && state !== 'IN') {
      viewState.events['EXIT_VIEW']
        .forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, viewState.element, evt));
    }
    if (viewState.events['IN_VIEW'] && viewState.state !== 'IN' && state === 'IN') {
      viewState.events['IN_VIEW']
        .forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, viewState.element, evt));
    }
    if (viewState.events['OUT_VIEW'] && viewState.state !== 'OUT' && state === 'OUT') {
      viewState.events['OUT_VIEW']
        .forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, viewState.element, evt));
    }

    viewState.state = state;
  }

  private execute(timestamp: DOMHighResTimeStamp): WindowDetail;
  private execute(timestamp: DOMHighResTimeStamp, initType: string, evt: Event): WindowDetail;
  private execute(timestamp: DOMHighResTimeStamp, initType?: string, evt?: Event): WindowDetail {
    const windowDetail: WindowDetail = new WindowDetail(timestamp, this.windowDetail);
    if (!this.windowDetail) return this.windowDetail = windowDetail;

    if (initType === WindowEvent.RESIZE) {
      if (!this.isResizing) {
        this.isResizing = true;
        this.windowEvents.RESIZE_START?.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));
      }

      // All resize functions
      this.windowEvents.RESIZE?.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));

      if (this.windowEvents.BREAKPOINT && windowDetail.breakpoint !== this.windowDetail.breakpoint) {
        this.windowEvents.BREAKPOINT!.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));
      }

      if (this.windowEvents.ORIENTATION && windowDetail.orientation !== this.windowDetail.orientation) {
        this.windowEvents.ORIENTATION!.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));
      }
    } else if (initType === WindowEvent.SCROLL) {
      if (!this.isScrolling) {
        this.isScrolling = true;
        this.windowEvents.SCROLL_START?.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));
      }

      // All scroll functions
      this.windowEvents.SCROLL?.forEach((e: FlowEventHandlerObject) => e.handler(windowDetail, evt));
    }

    this.viewEvents.forEach((state: ViewState) => {
      this.evalViewEvent(state, windowDetail, evt);
    });

    return this.windowDetail = windowDetail;
  }

  private listenResize(): void {
    if (!this.hasListenerResize) {
      window.addEventListener('resize', this.EVENT_HANDLER_RESIZE);
      this.hasListenerResize = true;
    }
  }

  private listenScroll(): void {
    if (!this.hasListenerScroll) {
      window.addEventListener('scroll', this.EVENT_HANDLER_SCROLL);
      this.hasListenerScroll = true;
    }
  }

  private registerViewEvent(
    id: string,
    event: ViewEvent,
    element: Element,
    handler: FlowEventViewHandler
  ): void {
    this.listenResize();
    this.listenScroll();
    let viewState: ViewState | undefined = this.viewEvents.find((viewState: ViewState) => {
      viewState.element = element;
    });
    if (!viewState) viewState = {
      element,
      events: {},
      state: 'UNKNOWN'
    };
    if (!viewState.events[event]) viewState.events[event] = [];
    viewState.events[event]!.push({ id, handler });
    this.viewEvents.push(viewState);
    if (this.windowDetail) this.evalViewEvent(viewState, this.windowDetail);
  }

  private registerWindowEvent(id: string, event: WindowEvent, handler: FlowEventHandler): void {
    if (event.includes(WindowEvent.SCROLL)) this.listenScroll();
    else this.listenResize();
    if (!this.windowEvents[event]) this.windowEvents[event] = [];
    this.windowEvents[event]!.push({ id, handler });
  }

  private silenceResize(): void {
    if (this.hasListenerResize) {
      window.removeEventListener('resize', this.EVENT_HANDLER_RESIZE);
      this.hasListenerResize = false;
    }
  }

  private silenceScroll(): void {
    if (this.hasListenerScroll) {
      window.removeEventListener('scroll', this.EVENT_HANDLER_SCROLL);
      this.hasListenerScroll = false;
    }
  }
}

export const flow: Flow = new Flow();

/*
<style>* {box-sizing:border-box;}
body, html {min-height: 10vh;height: 50vh;width: 75vw;background: rgba(0,0,255,.1)}
  body {width:105vw;}
.page {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
}

.header {
  flex: 1;
  background: rgba(0, 255, 255, 0.25);
}

.content {
  display: flex;
  flex: 1;
  height: 100%;
  }img{opacity:0;}

.main {
  flex: 1;
  background: rgba(128, 0, 128, 0.25);
}

.side {
  flex: 0 1 35%;
  background: rgba(255, 0, 255, 0.25);
  }#a{width: 50px;height:250px;background:red;position:absolute;top:3em;left:5em;margin:2px;padding:2px;border: 2px solid transparent;}</style>
<div id="a"></div>
<div class="page">
  <div class="header">Header</div>
  <div class="content">
    <div class="side">Side</div>
    <div class="main">
      <div>Main</div>
      <img width="400" src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.goodfreephotos.com%2Falbums%2Fother-landscapes%2Fwaterfall-in-nature.jpg&f=1&nofb=1" alt=""/>
    </div>
  </div>
</div>
<script>
console.clear();
</script>

let down;
let move;
let up;
let time;
let touching = false;

window.addEventListener('touchstart', e => {
  touching = true;
  Object.values(e.touches).forEach(t => {
    console.log(t.identifier);
  });
  d(e);
});

window.addEventListener('mousedown', e => {
  e.preventDefault();
  if (!touching) d(e);
});

window.addEventListener('touchend', e => {
  setTimeout(() => touching = false, 0);
  u(e);
});

window.addEventListener('mouseup', e => {
  if (!touching) u(e);
});

function d(e) {
  // console.log(e);
  console.log(e.timeStamp, e.type, touching);
}

function u(e) {
  console.log(e.timeStamp, e.type, touching);
}

*/
