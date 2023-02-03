export function throttle(fn: Function, wait = 500) {
  let lastCall = 0
  return function(...args: any[]) {
    const now = Date.now()
    if (now - lastCall < wait) return
    lastCall = now
    // @ts-ignore
    return fn.apply(this, args)
  }
}
