# 5 设计事件总线

请设计一个事件总线工具，要求满足以下条件，请尽量完成能完成的最高难度。

难度一：可以是 class 或者 非 class 的形式。有基本的监听、卸载监听、多重监听、触发等基本功能，可以传递参数。以下只是示例代码，可以自行设计 api。

```javascript
const bus = new Bus()
bus.listen('testEvent', (...argv) => { 
  console.log('event callback')
})
bus.trigger('testEvent', 1, 2)
```

难度二：在 listener 中可以继续触发事件，要求在总线对象内部要保持正确的事件调用栈(树形)，并能提供接口打印出来，例如:

```javascript
bus.listen('testEvent', function callback1(){
  // do something
  this.trigger('testEvent2')
})

bus.listen('testEvent2', function callback2(){
  // do something
})

bus.trigger('testEvent')
/** 
 * 设计 api 和数据结构并打印出这次 trigger 内部所有发生的事件和监听信息
 * 期望得到的结果例如：
 * event: testEvent
 * --callback: callback1
 * ----event: testEvent2
 * ------callback: callback2
 * 
 * 注意，bus.trigger 应该可以执行多次，每一次trigger 都应该得到一个独立的事件栈。
 */
```

难度三：增加对 async callback 的支持，并要求仍然能够正确打印出调用栈。增加对无线循环调用事件的判断。
