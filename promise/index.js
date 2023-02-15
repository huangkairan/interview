var MyPromise = /** @class */ (function () {
    function MyPromise(executor) {
        this.state = MyPromise.PENDING;
        this.result = null;
        executor(this.resolve.bind(this), this.reject.bind(this));
    }
    MyPromise.prototype.resolve = function (value) {
        if (this.state === MyPromise.PENDING) {
            this.state = MyPromise.FULFILLED;
            this.result = value;
        }
    };
    MyPromise.prototype.reject = function (reason) {
        if (this.state === MyPromise.PENDING) {
            this.state = MyPromise.REJECTED;
            this.result = reason;
        }
    };
    MyPromise.prototype.then = function (onFullfilled, onRejected) {
        if (this.state === MyPromise.FULFILLED)
            onFullfilled(this.result);
        if (this.state === MyPromise.REJECTED)
            onRejected(this.result);
    };
    MyPromise.PENDING = 'pending';
    MyPromise.FULFILLED = 'fulfilled';
    MyPromise.REJECTED = 'rejected';
    return MyPromise;
}());
// resolve test
var promise1 = new MyPromise(function (resolve, reject) {
    resolve('这次一定');
});
console.log(promise1);
// reject test MyPromise {PromiseState: 'fulfilled', PromiseResult: '这次一定'}
var promise2 = new MyPromise(function (resolve, reject) {
    reject('下次一定');
});
console.log(promise2);
// then test
var promise3 = new MyPromise(function (resolve, reject) {
    resolve('这次一定');
    reject('下次一定');
});
promise3.then(function () {
    console.log('resolve');
}, function () {
    console.log('reject');
});
// console.log(promise3)
