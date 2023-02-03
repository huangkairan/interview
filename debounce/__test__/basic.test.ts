import { debounce } from '../inedx'

describe('debounce', () => {
  it('should call debounced function once', () => {
    jest.useFakeTimers()

    const func = jest.fn()
    const debounced = debounce(func, 500)

    debounced()
    debounced()
    debounced()

    jest.runOnlyPendingTimers()

    expect(func).toHaveBeenCalledTimes(1)
  })

  it('should call the function after the wait time passed', () => {
    jest.useFakeTimers()

    const func = jest.fn()
    const debouncedFunc = debounce(func, 1000)

    debouncedFunc()

    jest.advanceTimersByTime(999)
    expect(func).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1)
    expect(func).toHaveBeenCalled()
  })
})
