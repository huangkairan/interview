import { throttle } from '../index'

describe('throttle', () => {
  jest.useFakeTimers()
  it('should call the function only once in the interval', () => {
    const fn = jest.fn()
    const throttledFn = throttle(fn, 1000)

    throttledFn()
    throttledFn()
    throttledFn()

    jest.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(0)

    jest.advanceTimersByTime(500)
    expect(fn).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(1)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
