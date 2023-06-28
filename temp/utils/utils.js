/**
 * 作者：Hyhello
 * 时间：2019-04-09
 * 描述：工具类
 */

/**
 * 存储localStorage/sessionStorage
 */
import { formatTime } from './time';

export const setStore = (name, content, deep) => {
    if (!name) return;
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    if (deep) {
        window.localStorage.setItem(name, content);
    } else {
        window.sessionStorage.setItem(name, content);
    }
};

/**
 * 获取localStorage/sessionStorage
 */
export const getStore = (name, deep) => {
    if (!name) return;
    if (deep) {
        return window.localStorage.getItem(name);
    }
    return window.sessionStorage.getItem(name);
};

/**
 * 删除localStorage/sessionStorage
 */
export const removeStore = (name, deep) => {
    if (!name) return;
    if (deep) {
        window.localStorage.removeItem(name);
    } else {
        window.sessionStorage.removeItem(name);
    }
};

// oneOf
export const oneOf = (target, list) => list.some(item => target === item);

// 供echarts 使用
export const findLabel = (list = [], key = 'name', substr) => {
    const legend = [];
    list.forEach(item => {
        const name = substr ? item[key].substr(0, substr) : item[key];
        legend.push(name);
    });
    return legend;
};

export const _eval = (str) =>
    // eslint-disable-next-line no-new-func
    (new Function('', `return ${str}`)());

// 导入
export const formatDuring = (t, format = 'dd天hh时mm分ss秒') => {
    // 对应的毫秒
    const map = {
        d: 24 * 60 * 60 * 1000,
        h: 60 * 60 * 1000,
        m: 60 * 1000,
        s: 1000,
    };
    const o = {
        'd+': Math.floor(t / map.d), // 天
        'h+': Math.floor(t % map.d / map.h), // 时
        'm+': Math.floor(t % map.h / map.m), // 分
        's+': Math.floor(t % map.m / map.s), // 秒
    };

    for (const i in o) {
        if (new RegExp(`(${i})`).test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[i] : (`00${o[i]}`).substr(-2));
        }
    }
    return format;
};

// 格式化
export const formateDate = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => { // author: meizz
    if (!date) return null;
    if (typeof date === 'string') {
        date = date.replace(/-/g, '/');
    }
    date = new Date(date);
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds(), // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
    for (const k in o) { if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length))); }
    return fmt;
};

// 时间区间 距离现在几天 return Array
/**
 *
 * @param { int } space 	// 时间区间之间间隔
 * @param { int } offset 	// 起始日期距离今天往后推迟多少天
 * @param { string } fmt	// yyyy-MM-dd
 * @return { Array };
 */
 export const getFormerlyDate = (space = 1, offset = 1, fmt = 'yyyyMMdd') => {
	const timestamp = +new Date();
	const oneDay = 24 * 60 * 60 * 1000;
	const endstamp = timestamp - oneDay * offset + oneDay;
	const starstamp = endstamp - oneDay * space + oneDay;
	const now = formatTime(endstamp, fmt);
	const prev = formatTime(starstamp, fmt);
	return [prev, now];
};

// 排序
export const compare = (prop) => (a, b) => {
    a = prop ? a[prop] : a;
    b = prop ? b[prop] : b;
    return a - b;
};

// requireAll 加载文件
export const requireAll = requireContext => {
    const resource = {};
    requireContext.keys().forEach(item => {
        const src = item.replace(/(?:.*?)(\w+)\.js$/, '$1');
        const result = requireContext(item);
        resource[src] = ('default' in result)
            ? result.default
            : result;
    });
    return resource;
};

// 类型
export const _typeof = (str) => ({}).toString.call(str).slice(8, -1);

// toUnicode
export const toUnicode = (s) => {
    if (typeof s !== 'string') return s;
    return s.replace(/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g, (_) => `\\u${_.charCodeAt(0).toString(16).toUpperCase()}`);
};

// 构造枚举
export const mkEnum = (obj = {}) => {
    const res = {};
    Object.keys(obj).forEach(item => {
        const key = toUnicode(item);
        const value = toUnicode(obj[item]);
        res[res[key] = value] = key;
    });
    return res;
};

// 拼接
export const joint = (list = [], key = 'name', separator = '、') => list.map(item => item[key]).join(separator);

// toNumber
export const toNumber = n => {
	const val = parseFloat(n);
	return isNaN(val) ? n : val;
};

// toFixed
export const toFixed = (num, fixed = 1) => {
	if (!num) return num;
	return /\d\.\d*$/.test(String(num)) ? num.toFixed(fixed) : num;
};

function scrollByDirection(
    el,
    from = 0,
    to,
    duration = 500,
    finish,
    scrollDirect = "scrollTop"
  ) {
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 1000 / 60);
        };
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);

    function scroll(start, end, step) {
      if (start === end) {
        // 滚动完进行回调
        if (typeof finish === "function") {
          finish();
        }
        return;
      }

      let d = start + step > end ? end : start + step;
      if (start > end) {
        d = start - step < end ? end : start - step;
      }

      if (el === window) {
        window.scrollTo(d, d);
      } else {
        el[scrollDirect] = d;
      }
      window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
  }

  function scrollTop(el, from = 0, to, duration = 500, finish) {
    scrollByDirection(el, from, to, duration, finish, "scrollTop");
  }

  function scrollLeft(el, from = 0, to, duration = 500, finish) {
    scrollByDirection(el, from, to, duration, finish, "scrollLeft");
  }

  let CanScroller = true;

  const noop = () => { };

  export default {
    /**
     * 判断是否是字符串
     */
    isString: function (target) {
      return Object.prototype.toString.call(target) === "[object String]";
    },
    /**
     * 判断是否是时间
     */
    isDate: function (target) {
      return Object.prototype.toString.call(target) === "[object Date]";
    },
    /**
     * 判断是否是数字
     */
    isNumber: function (target) {
      return Object.prototype.toString.call(target) === "[object Number]";
    },
    /**
     * 判断是否是Object
     */
    isObject: function (target) {
      return Object.prototype.toString.call(target) === "[object Object]";
    },
    /**
     * 判断是否是Array
     */
    isArray: function (target) {
      return Object.prototype.toString.call(target) === "[object Array]";
    },
    /**
     * 判断是否是Function
     */
    isFunction: function (target) {
      return Object.prototype.toString.call(target) === "[object Function]";
    },
    /**
     * 判断是否是Boolean
     */
    isBoolean: function (target) {
      return Object.prototype.toString.call(target) === "[object Boolean]";
    },
    /**
     * 驼峰化
     * console.log(camelize('-moz-transform'));
     *  => MozTransform
     * city => City
     */
    camelize: str => {
      str = str || "";
      let matcher = function (match, c) {
        return c ? c.toUpperCase() : "";
      }
      return str.replace(/[^a-zA-Z](.)/g, matcher).replace(/^(.)/, matcher);
    },
    /**
     * 中划线化
     * console.log(dasherize('MozTransform'));
     * => "-moz-transofrm"
     * agent id => agent-id
     */
    dasherize: str => {
      str = str || "";
      return str
        .replace(/([A-Z])/g, "-$1")
        .replace(/[-_\s]+/g, "-")
        .toLowerCase();
    },

    /**
     * 节流函数
     * fn 待执行函数
     * duration 传入的执行间隔时间 默认250ms
     */

    throttle(fn, duration) {
      // 记录上次执行的时间
      let lastTime;
      // 定时器
      // let timer;
      // 默认执行间隔250ms
      const dura = duration || 250;
      return function () {
        let args = arguments;
        let now = new Date();
        let ctx = this;
        if (lastTime && now - lastTime < dura) {
          // 上次执行时间 --- 现在  小于间隔时间 那么重启定时器
          clearTimeout(fn.timer);
          fn.timer = setTimeout(function () {
            lastTime = now;
            fn.apply(ctx, args);
          }, dura);
        } else {
          // 超过间隔时间 可立即执行
          lastTime = now;
          fn.apply(ctx, args);
        }
      };
    },
    /**
     * 去抖函数
     * fn 待执行函数
     * wait 接收函数触发的时间区间 会在
     * immediate true wait时间段的开始阶段执行，false 末尾阶段执行
     */
    debounce(fn, wait = 250, immediate = false) {
      let args, context, timestamp;

      let later = function () {
        // wait指定的时间间隔期间不断调用debounce返回的函数 会不断更新timestamp，启动新的计时器，计算需要重新延时的时间
        let last = new Date() - timestamp;
        if (last < wait && last >= 0)
          fn.timeout = setTimeout(later, wait - last);
        else {
          // wait >= last 执行 最近一次的调用
          fn.timeout = null;
          if (!immediate) {
            fn.apply(context, args);
            context = args = null;
          }
        }
      };
      // 重复调用，重置timestamp 改变later内的last
      return function () {
        context = this;
        args = arguments;
        timestamp = new Date();
        let callNow = immediate && !fn.timeout;
        if (!fn.timeout) fn.timeout = setTimeout(later, wait);
        // 在时间区间开头阶段立即执行
        if (callNow) {
          fn.apply(context, args);
          context = args = null;
        }
      };
    },
    /**
     * 动态加载脚本文件, 返回一个promise
     * @param attr 生成script标签时的属性
     */
    loadScript: function (url, attr) {
      return new Promise(function (resolve) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        if (script.readyState) {
          //IE
          script.onreadystatechange = function () {
            if (
              script.readyState == "loaded" ||
              script.readyState == "complete"
            ) {
              script.onreadystatechange = null;
              resolve();
            }
          };
        } else {
          //Others
          script.onload = function () {
            resolve();
          };
        }

        script.src = url;
        if (Object.prototype.toString.apply(attr) === "[object Object]") {
          for (let i in attr) {
            script.setAttribute(i, attr[i]);
          }
        }
        document.getElementsByTagName("head")[0].appendChild(script);
      });
    },
    /**
     * 动态加载css文件，返回一个Promise
     * @param {*} href
     * @param {*} callback 可选
     */
    loadCss(href, callback) {
      return new Promise(resolve => {
        let link = document.createElement("link");
        link.href = href;
        link.rel = "stylesheet";
        link.onload = () => {
          if (typeof callback === "function") {
            callback();
          }
          resolve();
        };
        document.getElementsByTagName("head")[0].appendChild(link);
      });
    },
    /**
     *  根据name获取当前url对应的参数
     *  url = '&key=value' => value
     *  默认值为defaultValue
     */
    getUrlParam: (name) => {
      if (!name) return null;
      var search = document.location.href;
      var pattern = new RegExp("[?&]" + name + "=([^&]*)", "g");
      var matcher = pattern.exec(search);
      var param = null;
      if (null !== matcher) {
        try {
          param = decodeURIComponent(decodeURIComponent(matcher[1]));
        } catch (e) {
          try {
            param = decodeURIComponent(matcher[1]);
          } catch (e) {
            param = matcher[1];
          }
        }
      }
      return param;
    },
    /**
     * 格式对象为url query 模式
     */
    parseUrlParam: (obj) => {
      let url = [];
      for (let key in obj) {
        url.push(`${key}=${encodeURIComponent(obj[key])}`);
      }
      return url.join('&');
    },
    /**
     * 获取滚动条宽度
     */
    getScrollbarWidth() {
      if (this.getScrollbarWidth.value === undefined) {
        var odiv = document.createElement("div"), //创建一个div
          styles = {
            width: "100px",
            height: "100px",
            overflowY: "scroll" //让他有滚动条
          },
          i,
          scrollbarWidth;
        for (i in styles) odiv.style[i] = styles[i];
        document.body.appendChild(odiv); //把div添加到body中
        scrollbarWidth = odiv.offsetWidth - odiv.clientWidth; //相减
        odiv.remove(); //移除创建的div
        this.getScrollbarWidth.value = scrollbarWidth; //返回滚动条宽度
      }
      return this.getScrollbarWidth.value;
    },
    hasClass(el, cls) {
      if (!el || !cls) return false;
      if (cls.indexOf(" ") !== -1)
        throw new Error("className should not contain space.");
      if (el.classList) {
        return el.classList.contains(cls);
      } else {
        return (" " + el.className + " ").indexOf(" " + cls + " ") > -1;
      }
    },
    addClass(el, cls) {
      if (!el) return;
      let curClass = el.className;
      const classes = (cls || "").split(" ");

      for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
          el.classList.add(clsName);
        } else {
          if (!this.hasClass(el, clsName)) {
            curClass += " " + clsName;
          }
        }
      }
      if (!el.classList) {
        el.className = curClass;
      }
    },
    removeClass(el, cls) {
      if (!el || !cls) return;
      const classes = cls.split(" ");
      let curClass = " " + el.className + " ";

      for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
          el.classList.remove(clsName);
        } else {
          if (this.hasClass(el, clsName)) {
            curClass = curClass.replace(" " + clsName + " ", " ");
          }
        }
      }
      if (!el.classList) {
        const trim = function (string) {
          return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
        };
        el.className = trim(curClass);
      }
    },
    // 获取全局唯一Key
    getUniqueKey() {
      if (!this.___uniqueKey) this.___uniqueKey = 0;
      return this.___uniqueKey++;
    },
    // 获取输入框里光标的位置
    getCursorPosition(node) {
      // 判断node是否为dom对象
      if (
        !(
          (typeof HTMLElement === "object" &&
            node instanceof HTMLElement) ||
          (node &&
            typeof node === "object" &&
            node.nodeType === 1 &&
            typeof node.nodeName === "string")
        )
      ) {
        return;
      }
      var cursurPosition = -1;
      //非IE浏览器
      if (typeof node.selectionStart === "number") {
        cursurPosition = node.selectionStart;
      }
      //IE
      else {
        var range = document.selection.createRange();
        range.moveStart("character", -node.value.length);
        cursurPosition = range.text.length;
      }
      return cursurPosition;
    },
    // 设置光标的位置
    setCaret(node, caret) {
      if (node.setSelectionRange) {
        node.focus();
        node.setSelectionRange(caret, caret);
        setTimeout(function () {
          node.setSelectionRange(caret, caret);
        });
      } else if (node.createTextRange) {
        var range = node.createTextRange();
        range.collapse(true);
        range.moveEnd("character", caret);
        range.moveStart("character", caret);
        range.select();
      }
    },
    /*
     * 事件绑定
     *
     * @method bind
     * @param  {dom||window}   elem        需要绑定的dom节点或window对象
     * @param  {String}        event       绑定的事件名称
     * @param  {Function}      handler     事件处理方法
     */
    bind: (elem = window, event, handler, useCapture = false) => {
      if (elem && elem !== "undefined" && event && handler) {
        event =
          event === "mousewheel" ?
            document.onmousewheel !== undefined ?
              "mousewheel" :
              "DOMMouseScroll" :
            event;
        if (document.attachEvent) {
          elem.attachEvent("on" + event, handler);
        } else {
          elem.addEventListener(event, handler, useCapture);
        }
      }
    },
    /*
     * 移除事件绑定
     *
     * @method unbind
     * @param  {dom||window}   elem         需要移除绑定的dom节点或window对象
     * @param  {String}        event        绑定的事件名称
     * @param  {Function||Array<Function>}  handler    事件处理方法，可以为数组
     */
    unbind: (elem = window, event, handler) => {
      if (elem && elem !== "undefined" && event && handler) {
        event =
          event === "mousewheel" ?
            document.onmousewheel !== undefined ?
              "mousewheel" :
              "DOMMouseScroll" :
            event;
        var handlers = [];
        if (Array.isArray(handler) && handler.length > 0) {
          handlers = handler;
        } else {
          handlers.push(handler);
        }
        if (document.removeEventListener) {
          handlers.forEach(e => {
            elem.removeEventListener(event, e, false);
          });
        } else {
          handlers.forEach(e => {
            elem.detachEvent("on" + event, e);
          });
        }
      }
    },
    // direction: left right up down
    scrollNext: (el, direction, flag = "resume", complete = noop) => {
      if (!CanScroller || !el) return;
      let children = el.children;
      let len = children.length;
      if (direction == "left") {
        for (let i = 1; i < len; i++) {
          let c = children[i];
          // 滚动到哪里
          if (el.scrollLeft < c.offsetLeft + c.clientWidth) {
            let from = el.scrollLeft,
              to = children[i - 1].offsetLeft;
            scrollLeft(el, from, to, 500, function () {
              if (el.scrollLeft != to) {
                CanScroller = false;
                if (flag === "comeback") {
                  from = 0;
                }
                scrollLeft(el, el.scrollLeft, from, 500, () => {
                  CanScroller = true;
                  complete();
                });
              } else {
                complete();
              }
            });
            return {
              index: i - 1,
              from,
              to,
              children
            };
          }
        }
      } else if (direction == "right") {
        for (let i = 0; i < len - 1; i++) {
          let c = children[i];
          // 滚动到哪里
          if (el.scrollLeft < c.offsetLeft + c.clientWidth) {
            let from = el.scrollLeft,
              to = children[i + 1].offsetLeft;
            scrollLeft(el, from, to, 500, function () {
              if (el.scrollLeft != to) {
                CanScroller = false;
                if (flag === "comeback") {
                  from = 0;
                }
                scrollLeft(el, el.scrollLeft, from, 500, () => {
                  CanScroller = true;
                  complete();
                });
              } else {
                complete();
              }
            });
            return {
              index: i + 1,
              from,
              to,
              children
            };
          }
        }
      } else if (direction == "up") {
        for (let i = 1; i < len; i++) {
          let c = children[i];
          // 滚动到哪里
          if (el.scrollTop < c.offsetTop + c.clientHeight) {
            let from = el.scrollTop,
              to = children[i - 1].offsetTop;
            scrollTop(el, from, to, 500, function () {
              if (el.scrollTop != to) {
                CanScroller = false;
                if (flag === "comeback") {
                  from = 0;
                }
                scrollTop(el, el.scrollTop, from, 500, () => {
                  CanScroller = true;
                  complete();
                });
              } else {
                complete();
              }
            });
            return {
              index: i - 1,
              from,
              to,
              children
            };
          }
        }
      } else if (direction == "down") {
        for (let i = 0; i < len - 1; i++) {
          let c = children[i];
          // 滚动到哪里
          if (el.scrollTop < c.offsetTop + c.clientHeight) {
            let from = el.scrollTop,
              to = children[i + 1].offsetTop;
            scrollTop(el, from, to, 500, function () {
              if (el.scrollTop != to) {
                CanScroller = false;
                if (flag === "comeback") {
                  from = 0;
                }
                scrollTop(el, el.scrollTop, from, 500, () => {
                  CanScroller = true;
                  complete();
                });
              } else {
                complete();
              }
            });
            return {
              index: i + 1,
              from,
              to,
              children
            };
          }
        }
      }
    },
    // scrollTop animation
    scrollTop,
    scrollLeft
  };

  export function s4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  export function s8() {
    return s4() + s4();
  }

  export function s12() {
    return s4() + s4() + s4();
  }

  export function s16() {
    return s4() + s4() + s4() + s4();
  }

  /**
   * 设置透明度
   * @param {*} hexStr
   * @param {*} opacity
   */
  export function parseColor(hexStr, opacity = 1) {
    if (hexStr === 'inherit') {
      hexStr = '#fff';
    }
    let colors = [];
    if (/^rgb/.test(hexStr)) {
      colors = hexStr.split(/\D+/).splice(1, 3);
    } else {
      colors =
        hexStr.length === 4 ?
          hexStr
            .substr(1)
            .split("")
            .map(function (s) {
              return 0x11 * parseInt(s, 16);
            }) : [
              hexStr.substr(1, 2),
              hexStr.substr(3, 2),
              hexStr.substr(5, 2)
            ].map(function (s) {
              return parseInt(s, 16);
            });
    }
    colors.push(opacity);
    return `rgba(${colors.join(",")})`;
  }

  export function formatNumber(str, n = 2, isObject = false) {
    n = !isNaN(n * 1) ? n * 1 : 1;
    let _ext, unit = '';
    try {
      str = str * 1 || 0;
      _ext = str >= 0 ? '' : '-';
      str = Math.abs(str);
      if (str >= 10000000000) {
        str = Math.round(str / 10000000000 * Math.pow(10, n)) / Math.pow(10, n);
        unit = '百亿';
      } else if (str >= 100000000) {
        str = Math.round(str / 100000000 * Math.pow(10, n)) / Math.pow(10, n);
        unit = '亿';
      } else if (str >= 10000) {
        str = Math.round(str / 10000 * Math.pow(10, n)) / Math.pow(10, n);
        unit = '万';
      } else {
        str = Math.round(str / 1 * Math.pow(10, n)) / Math.pow(10, n);
      }
    } catch (e) { }
    if (isObject) {
      return {
        number: _ext + str,
        unit: unit
      }
    } else {
      return _ext + str + unit;
    }
  }


  /**
   * JSONData json字符串List<Map>
   * fileName 自定义导出文件名 '服务器配置'var fileName="服务器配置";
   * header 自定义表格标题 var header=new Array("IP","服务器名","角色","监控模版","监控状态","邮件","创建业务","机柜","地区","备注");
   * headerKey 设置表格标题对应的导出数据中的key值 var headerKey=new Array("ip","machinename","rolename","template_name","mstatus","isemail","isbusiness","cabinet","region","remark");
   * ifHandleValue 是否需要处理表格内数据 0 不需要，1 需要(需要自定义handleValue(headerKey,value)函数设置自定义表格内容)
   * handleValue Function
   */
  export function JSONToExcelConvertor(FileName, arrData, headerList, handleValue) {
    let header = headerList.map(v => v.name);
    let headerKey = headerList.map(v => v.key);
    var excel = '<table>';
    // 设置表头
    var row = "<tr>";
    for (var i = 0, l = header.length; i < l; i++) {
      row += "<td>" + header[i] + '</td>';
    }
    // 换行
    excel += row + "</tr>";
    // 设置数据
    for (var i = 0; i < arrData.length; i++) {
      var row = "<tr>";
      for (var j = 0; j < headerKey.length; j++) {
        var key = headerKey[j];
        var value = (arrData[i][key] === "" || null === arrData[i][key] || undefined === arrData[i][key]) ? "" : arrData[i][key];
        if (handleValue) {
          //key 为自定义表格标题对应的key值，value值为当前要处理的数据
          value = handleValue(key, value);
        }
        row += '<td>' + value + '</td>';
      }
      excel += row + "</tr>";
    }
    excel += "</table>";

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">';
    excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += FileName;
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";
    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = FileName + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
