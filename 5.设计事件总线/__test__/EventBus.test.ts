import EventBus from '../index'

describe('[3. 设计事件总线]', () => {
  const log = console.log
  const warn = console.warn
  beforeEach(() => {
    console.log = jest.fn()
    console.warn = jest.fn()
  })
  afterAll(() => {
    console.log = log
    console.warn = warn
  })

  /**
   * 难度一
   * 可以是 class 或者 非 class 的形式。有基本的监听、卸载监听、多重监听、触发等基本功能，可以传递参数
   */
  test('should complete implementation of basic features', () => {
    const bus = new EventBus()
    const listener = (text: string) => console.log(text)

    bus
      .on('foo', listener)
      .emit('foo', 'text1')
      .emit('foo', 'text2')
      .off('foo', listener)
      .emit('foo', 'text3') // ignore
      .once('bar', listener)
      .emit('bar', 'text4')
      .emit('bar', 'text5') // ignore

    // @ts-ignore
    const logs = console.log.mock.calls
    // @ts-ignore
    const warns = console.warn.mock.calls

    expect(logs).toEqual([
      ['text1'],
      ['text2'],
      ['text4'],
    ])

    expect(warns).toEqual([
      ['[EventBus]: Related events that are not registered for \'foo\''],
      ['[EventBus]: Related events that are not registered for \'bar\''],
    ])
  })
})
