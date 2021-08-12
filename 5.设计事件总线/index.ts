/**
 * Time: 2021.08.12 12:00
 */

interface Listener extends Function {
  once?: boolean
}

class EventBus {
  private eventsMap: Map<string, Listener[]>
  constructor() {
    this.eventsMap = new Map()
  }

  on(eventName: string, listener: Listener, once = false): EventBus {
    listener.once = once
    this.eventsMap.set(eventName, this.eventsMap.has(eventName)
      ? this.eventsMap.get(eventName)!.concat(listener)
      : [listener])
    return this
  }

  once(eventName: string, listener: Listener): EventBus {
    this.on(eventName, listener, true)
    return this
  }

  off(eventName: string, listener: Listener): EventBus {
    if (!this.eventsMap.has(eventName)) {
      console.warn(`[EventBus]: Related events that are not registered for '${eventName}'`)
    }
    else {
      const next = this.eventsMap.get(eventName)!.filter(fn => fn !== listener)
      if (!next.length)
        this.eventsMap.delete(eventName)
      else
        this.eventsMap.set(eventName, next)
    }
    return this
  }

  emit(eventName: string, ...args: unknown[]): EventBus {
    if (!this.eventsMap.has(eventName)) {
      console.warn(`[EventBus]: Related events that are not registered for '${eventName}'`)
    }
    else {
      const listeners = this.eventsMap.get(eventName)!
      for (let i = 0; i < listeners.length; i += 1) {
        const listener = listeners[i]
        listener.apply(this, args)
        if (listener.once) {
          listeners.splice(i, 1)
          i -= 1
        }
      }

      if (!listeners.length)
        this.eventsMap.delete(eventName)
      else
        this.eventsMap.set(eventName, listeners)
    }
    return this
  }
}

export default EventBus
