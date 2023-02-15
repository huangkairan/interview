class MyPromise {
  static PENDING = 'pending'
  static FULFILLED = 'fulfilled'
  static REJECTED = 'rejected'
  private state
  private result: any
  private onFulfilledCallbacks: Function[] = [] // 存储成功回调
  private onRejectedCallbacks: Function[] = [] // 存储失败回调
  constructor(executor: Function) {
    this.state = MyPromise.PENDING
    this.result = null
    try {
      executor(this.resolve.bind(this), this.reject.bind(this))
    }
    catch (e) {
      this.reject(e)
    }
  }

  resolve(value: unknown) {
    if (this.state === MyPromise.PENDING) {
      this.state = MyPromise.FULFILLED
      this.result = value
      this.onFulfilledCallbacks.forEach(cb => cb(value))
    }
  }

  reject(reason: unknown) {
    if (this.state === MyPromise.PENDING) {
      this.state = MyPromise.REJECTED
      this.result = reason
      this.onRejectedCallbacks.forEach(cb => cb(reason))
    }
  }

  then(onFullfilled: Function, onRejected: Function) {
    onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason }

    if (this.state === MyPromise.PENDING) {
      this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          onFullfilled(this.result)
        })
      })
      this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          onRejected(this.result)
        })
      })
    }

    if (this.state === MyPromise.FULFILLED) {
      setTimeout(() => {
        onFullfilled(this.result)
      })
    }

    if (this.state === MyPromise.REJECTED) {
      setTimeout(() => {
        onRejected(this.result)
      })
    }
  }
}

// resolve test
const promise1 = new MyPromise((resolve, reject) => {
  resolve('这次一定')
})
console.log(promise1)
// reject test MyPromise {state: 'fulfilled', PromiseResult: '这次一定'}
const promise2 = new MyPromise((resolve, reject) => {
  reject('下次一定')
})
console.log(promise2)

// then test
const promise3 = new MyPromise((resolve, reject) => {
  resolve('这次一定')
  reject('下次一定')
})
promise3.then(() => {
  console.log('resolve')
}, () => {
  console.log('reject')
})

// reject error
promise1.then(
  undefined,
  (reason) => {
    console.log('rejected:', reason)
  },
)
// 测试代码
console.log(1)
let promise1 = new MyPromise((resolve, reject) => {
  console.log(2)
  setTimeout(() => {
    console.log('A', promise1)
    resolve('这次一定')
    console.log('B', promise1)
    console.log(4)
  })
})
promise1.then(
  (result) => {
    console.log('C', promise1)
    console.log('fulfilled:', result)
  },
  (reason) => {
    console.log('rejected:', reason)
  },
)
console.log(3)
