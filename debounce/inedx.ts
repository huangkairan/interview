export function debounce(func: Function, wait = 500) {
  let timeout: number | null = null
  return function(...args: any[]) {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(() => {
      // @ts-ignore
      func.apply(this, args)
    }, wait)
  }
}
