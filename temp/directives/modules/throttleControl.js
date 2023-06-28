import Vue from 'vue'
import { Message } from 'element-ui';
/***
 * 防抖 单位时间只触发最后一次
 *  @param {?Number|300} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|"click"} event - 事件类型 例："click"
 *  @param {Array} binding.value - [fn,event,time]
 *  例：<el-button v-debounce="[reset,`click`,300]">刷新</el-button>
 *  也可简写成：<el-button v-debounce="[reset]">刷新</el-button>
 */
Vue.directive('debounce', {
  inserted: function (el, binding) {
    let [fn, event = "click", time = 3000] = binding.value
    let timer
    el.addEventListener(event, () => {
      timer && clearTimeout(timer)
      timer = setTimeout(() => fn(), time)
    })
  }
})

/***
 *  节流 每单位时间可触发一次
 * 【考虑到input的change事件】
 *  @param {?Number|300} time - 间隔时间
 *  @param {Function} fn - 执行事件
 *  @param {?String|"click"} event - 事件类型 例："click"
 *  @param {Array} binding.value - [fn,event,time]
 *  例：<el-button v-throttle="[reset,`click`,300]">刷新</el-button>
 *  传递参数则：<el-button v-throttle="[()=>reset(param),`click`,300]">刷新</el-button>
 */
Vue.directive('throttle', {
  inserted: function (el, binding) {
    let [fn, event = "click", time = 3000] = binding.value
    let timer, timer_end;
    el.addEventListener(event, () => {
      if (timer) {
        // clearTimeout(timer_end);
        // return timer_end = setTimeout(() => fn(), time);
        Message({
          message: '请勿重复操作！',
          type: 'warning'
        })
        return false
      }
      fn();
      timer = setTimeout(() => timer = null, time)
    })
  }
})
