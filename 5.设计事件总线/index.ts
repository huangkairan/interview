/**
 * Time:
 *  - Level one: 2021.08.12 12:00 - 2021.08.12 12:51
 *  - Level two: 2021.08.12 12:51 - 2021.08.12 13:59
 */

interface Listener extends Function {
  once?: boolean
}

interface CallFrame {
  eventName: string
  fn: Listener
  args: unknown[]
  isOnce?: boolean
  derivedFrames: CallFrame[]
}

class EventBus {
  private eventsMap: Map<string, Listener[]>

  private callStack: CallFrame[]
  private callHistory: CallFrame[]

  private get currentContext() {
    return this.callStack[this.callStack.length - 1]
  }

  constructor() {
    this.eventsMap = new Map()
    this.callStack = []
    this.callHistory = []
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
      if (this.callStack.length)
        this.callHistory = []

      const listeners = this.eventsMap.get(eventName)!
      for (let i = 0; i < listeners.length; i += 1) {
        const listener = listeners[i]

        const frame: CallFrame = {
          eventName,
          fn: listener,
          args,
          isOnce: listener.once,
          derivedFrames: [],
        }

        // ======================== context push ========================
        if (this.currentContext)
          this.currentContext.derivedFrames.push(frame)
        this.callStack.push(frame)

        // ======================== call ========================
        listener.apply(this, args)

        // ======================== context pop ========================
        if (this.callStack.length === 1)
          this.callHistory.push(this.currentContext)
        this.callStack.pop()

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

  log() {
    if (!this.callHistory)
      console.warn('[EventBus]: No recent call stack')
    return this.callHistory
  }
}

export default EventBus
