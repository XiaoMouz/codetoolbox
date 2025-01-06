type EventCallback<T = any> = (data: T) => void

/**
 * Event class
 * @template Events - The type of events that can be published
 * @class
 * @example
 * const eventBus = new Event<{ 'TOAST:INFO': string, 'TOAST:ERROR': string }>()
 * eventBus.subscribe('TOAST:INFO', (message) => console.log(message))
 * eventBus.publish('TOAST:INFO', 'Hello, world!')
 * // => 'Hello, world!'
 *
 */
export class Event<Events extends Record<string, any>> {
  private events: Map<string, Set<EventCallback>> = new Map()

  /**
   * Subscribe to an event
   * @param eventName  - The name of the event to subscribe to
   * @param callback - The callback function to call when the event is published
   */
  subscribe<EventName extends keyof Events>(
    eventName: EventName,
    callback: EventCallback<Events[EventName]>
  ) {
    let set: Set<EventCallback<Events[EventName]>> | undefined =
      this.events.get(eventName as string)
    if (!set) {
      set = new Set()
      this.events.set(eventName as string, set)
    }

    set.add(callback)
  }

  /**
   *  Unsubscribe from an event
   * @param eventName - The name of the event to unsubscribe from
   * @param callback - The callback function to unsubscribe
   * @returns void
   */
  desubscribe<EventName extends keyof Events>(
    eventName?: EventName,
    callback?: EventCallback<Events[EventName]>
  ) {
    if (!eventName) {
      this.events.clear()
      return
    }
    if (!callback) {
      this.events.delete(eventName as string)
      return
    }
    const set: Set<EventCallback<Events[EventName]>> | undefined =
      this.events.get(eventName as string)
    if (!set) return
    set.delete(callback)
  }

  /**
   * Publish an event
   * @param name - The name of the event to publish
   * @param value - The value to pass to the callback functions
   * @returns void
   */
  publish<EventName extends keyof Events>(
    name: EventName,
    value: Events[EventName]
  ) {
    const set: Set<EventCallback<Events[EventName]>> | undefined =
      this.events.get(name as string)
    if (!set) return
    const copied = [...set]
    copied.forEach((fn) => fn(value))
  }
}
