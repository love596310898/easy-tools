function debounce(fn, wait) {
  var timerId = null
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args)
    }, wait);
  }
}

var sayName = debounce(function (name) {
  console.log(`my name is: ${name} + ${this.lastName}`);
}, 1000);

var that = { lastName: 'lili' }

that.sayName = sayName;

new Array(5).fill('caijinbo').forEach(i => that.sayName(i));