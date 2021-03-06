import { DispatcherBase, EventListBase } from "ste-core";
import {
  ISimpleEventHandling,
  ISimpleEventHandler,
  ISimpleEvent
} from "./definitions";

/**
 * The dispatcher handles the storage of subsciptions and facilitates
 * subscription, unsubscription and dispatching of a simple event
 */
export class SimpleEventDispatcher<TArgs>
  extends DispatcherBase<ISimpleEventHandler<TArgs>>
  implements ISimpleEvent<TArgs> {
  /**
   * Creates a new SimpleEventDispatcher instance.
   */
  constructor() {
    super();
  }

  /**
   * Dispatches the event.
   * @param args The arguments object.
   */
  dispatch(args: TArgs): void {
    this._dispatch(false, this, arguments);
  }

  /**
   * Dispatches the events thread.
   * @param args The arguments object.
   */
  dispatchAsync(args: TArgs): void {
    this._dispatch(true, this, arguments);
  }

  /**
   * Creates an event from the dispatcher. Will return the dispatcher
   * in a wrapper. This will prevent exposure of any dispatcher methods.
   */
  public asEvent(): ISimpleEvent<TArgs> {
    return super.asEvent();
  }
}

/**
 * Similar to EventList, but instead of TArgs, a map of event names ang argument types is provided with TArgsMap.
 */
export class NonUniformSimpleEventList<
  TArgsMap extends { [event: string]: any }
> {
  private _events: {
    [K in keyof TArgsMap]?: SimpleEventDispatcher<TArgsMap[K]>
  } = {};

  /**
   * Gets the dispatcher associated with the name.
   * @param name The name of the event.
   */
  get<K extends keyof TArgsMap>(
    name: K
  ): SimpleEventDispatcher<TArgsMap[K]> {
    if (this._events[name]) {
      // @TODO avoid typecasting. Not sure why TS thinks this._events[name] could still be undefined.
      return this._events[name] as SimpleEventDispatcher<TArgsMap[K]>;
    }

    const event = this.createDispatcher<TArgsMap[K]>();
    this._events[name] = event;
    return event;
  }

  /**
   * Removes the dispatcher associated with the name.
   * @param name The name of the event.
   */
  remove(name: string): void {
    delete this._events[name];
  }

  /**
   * Creates a new dispatcher instance.
   */
  protected createDispatcher<T>(): SimpleEventDispatcher<T> {
    return new SimpleEventDispatcher<T>();
  }
}

/**
 * Storage class for multiple simple events that are accessible by name.
 * Events dispatchers are automatically created.
 */
export class SimpleEventList<TArgs> extends EventListBase<
  SimpleEventDispatcher<TArgs>
> {
  /**
   * Creates a new SimpleEventList instance.
   */
  constructor() {
    super();
  }

  /**
   * Creates a new dispatcher instance.
   */
  protected createDispatcher(): SimpleEventDispatcher<TArgs> {
    return new SimpleEventDispatcher<TArgs>();
  }
}

/**
 * Extends objects with simple event handling capabilities.
 */
export abstract class SimpleEventHandlingBase<TArgs>
  implements ISimpleEventHandling<TArgs> {
  private _events = new SimpleEventList<TArgs>();

  protected get events(): SimpleEventList<TArgs> {
    return this._events;
  }

  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  subscribe(name: string, fn: ISimpleEventHandler<TArgs>): void {
    this._events.get(name).subscribe(fn);
  }

  /**
   * Subscribes to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  sub(name: string, fn: ISimpleEventHandler<TArgs>): void {
    this.subscribe(name, fn);
  }

  /**
   * Subscribes once to the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  one(name: string, fn: ISimpleEventHandler<TArgs>): void {
    this._events.get(name).one(fn);
  }

  /**
   * Checks it the event has a subscription for the specified handler.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  has(name: string, fn: ISimpleEventHandler<TArgs>) {
    return this._events.get(name).has(fn);
  }

  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  unsubscribe(name: string, fn: ISimpleEventHandler<TArgs>): void {
    this._events.get(name).unsubscribe(fn);
  }

  /**
   * Unsubscribes from the event with the specified name.
   * @param name The name of the event.
   * @param fn The event handler.
   */
  unsub(name: string, fn: ISimpleEventHandler<TArgs>): void {
    this.unsubscribe(name, fn);
  }
}
