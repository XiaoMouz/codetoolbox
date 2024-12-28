type EventCallback<T = any> = (data: T) => void

const eventTypes = [
  'TOAST:INFO',
  'TOAST:ERROR',
  'API:UPDATECOPYBOARDLIST',
  'API:GETCOPYBOARD',
  'API:POSTCOPYBOARD',
  'API:DELETECOPYBOARD',
  'API:UPDATECOPYBOARD',
  'API:SYNCCOPYBOARD',
] as const

type EventType = (typeof eventTypes)[number]

class EventBus {
  private events: Map<EventType, Set<Function>> = new Map()

  constructor() {
    this.events = new Map()
  }

  subscribe<T>(eventName: EventType, callback: Function): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, new Set())
    }

    this.events.get(eventName)!.add(callback)

    return () => {
      const callbacks = this.events.get(eventName)!
      callbacks.delete(callback)
    }
  }

  publish<T>(eventName: EventType, ...args: any[]): void {
    if (this.events.has(eventName)) {
      this.events.get(eventName)!.forEach((callback) => callback(...args))
    }
  }
}

export const eventBus = new EventBus()
