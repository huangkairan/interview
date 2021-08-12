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
    function listener(text: string) {
      console.log(text)
    }

    bus
      .on('foo', listener)
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
      ['text1'],
      ['text2'],
      ['text2'],
      ['text4'],
    ])

    expect(warns).toEqual([
      ['[EventBus]: Related events that are not registered for \'foo\''],
      ['[EventBus]: Related events that are not registered for \'bar\''],
    ])
  })

  /**
   * 难度二
   * 在 listener 中可以继续触发事件，要求在总线对象内部要保持正确的事件调用栈(树形)，并能提供接口打印出来。
   */
  test('should support output call stack', () => {
    const bus = new EventBus()
    function listener(this: EventBus, eventName: string, ...args: unknown[]) {
      this.emit(eventName, ...args)
    }

    bus
      .on('foo', listener)
      .on('bar', listener)
      .on('baz', listener)
      .emit('foo', 'bar', 'baz')

    expect(bus.log()).toEqual([
      {
        eventName: 'foo',
        fn: listener,
        args: ['bar', 'baz'],
        isOnce: false,
        derivedFrames: [
          {
            eventName: 'bar',
            fn: listener,
            args: ['baz'],
            isOnce: false,
            derivedFrames: [
              {
                eventName: 'baz',
                fn: listener,
                args: [],
                isOnce: false,
                derivedFrames: [],
              },
            ],
          },
        ],
      },
    ])
  })
})
