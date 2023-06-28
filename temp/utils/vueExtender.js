// 时间格式化
import { formatTime } from '@/utils/time';

export default {
  install(Vue) {
    Vue.prototype.$utils = {
      dateFormat: formatTime,
    }
  }
}
