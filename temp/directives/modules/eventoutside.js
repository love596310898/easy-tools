
import Vue from 'vue';
import util from '@/utils/utils';

/**
 * 指令名称：v-eventoutside
 * 指令参数：{mode: click | move, inCallback: function, outCallback: function}
 */
const nodeList = [];
const ctx = '@@eventoutsideContext';

let startClick;
let seed = 0;
let time = 100;

util.bind(document, 'mousedown', e => (startClick = e));

util.bind(document, 'mouseup', e => {
  nodeList.forEach(node => node[ctx].documentHandler(e, startClick));
});

// click mode需要执行的逻辑（绑定本身的click事件并且创建本身之外的事件队列）
function createDocumentHandler(el, binding, vnode) {
  if (!el.__hasBindEvent) {
    var eventClick = e => {
      el.$outsidestatus = 'in';
      el[ctx].inCallback && el[ctx].inCallback.call(vnode.context);
    }
    util.bind(el, 'click', eventClick)
    if (!el.__event) {
      el.__event = [];
    }
    el.__event.push({
      type: 'click',
      method: eventClick
    })
    el.__hasBindEvent = true;
  }
  return function (mouseup = {}, mousedown = {}) {
    // cary改：递归搜集各层级关联的弹出元素
    let popperElmArr = [];
    const loop = (vnode) => {
      // el-tooltip、el-popper
      if (vnode.popperElm) {
        popperElmArr.push(vnode.popperElm);
      }
      // el-dialog
      if (vnode.$el.className === "el-dialog__wrapper") {
        popperElmArr.push(vnode.$el);
      }
      if (vnode.$children && vnode.$children.length > 0) {
        vnode.$children.forEach(loop);
      }
    }
    loop(vnode.context);

    // console.log(vnode.context);
    // console.log(popperElmArr);
    // console.log(mousedown.target, mouseup.target);

    if (!vnode || !vnode.context || !mouseup.target || !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      /* (vnode.context.popperElm &&
        (vnode.context.popperElm.contains(mouseup.target) ||
          vnode.context.popperElm.contains(mousedown.target))) */
      // cary改：使用 popperElmArr 替代 vnode.context.popperElm 来匹配
      (popperElmArr.length > 0 &&
        popperElmArr.some(popperElm => popperElm.contains(mouseup.target) || popperElm.contains(mousedown.target)))
      || el.$outsidestatus === 'out') return;
    // outCallback 在外面点击进行回调
    el.$outsidestatus = 'out';
    el[ctx].outCallback && el[ctx].outCallback.call(vnode.context);
  };
}

// 删除相关事件（mouseenter, mouseleave, click）
function removeEvent(el, context = {}) {
  // click模式
  let len = nodeList.length;
  for (let i = 0; i < len; i++) {
    if (el[ctx] && nodeList[i][ctx].id === el[ctx].id) {
      nodeList.splice(i, 1);
      break;
    }
  }
  delete el[ctx];
  // move模式
  [el, context.popperElm].forEach(element => {
    if (!element || !element.__event) return;
    (element.__event || []).forEach(event => {
      util.unbind(element, event.type, event.method);
    })
    element.__event = [];
    element.__hasBindEvent = false;
  })
}

// 更新事件（更新的是mouseenter, mouseleave）
function updateMoveEvent(el, binding, vnode) {
  if (!vnode || !vnode.context) return;
  [el, vnode.context.popperElm].forEach(element => {
    if (!element || element.__hasBindEvent) return;
    element.__hasBindEvent = true;
    var eventIn = e => {
      if (typeof binding.value.inCallback === 'function' && el.$outsidestatus !== 'in') {
        binding.value.inCallback.call(vnode.context);
      }
      el.$outsidestatus = 'in';
      if (el.$timeoutid) {
        clearTimeout(el.$timeoutid);
      }
    }
    var eventOut = e => {
      if (typeof binding.value.outCallback === 'function' && el.$outsidestatus === 'in') {
        el.$timeoutid = setTimeout(() => {
          if (el.$outsidestatus === 'in') return;
          var rect = element.getBoundingClientRect();
          var deviation = 2; // 误差
          if ((rect.left + deviation) <= e.clientX
            && (rect.left + rect.width - deviation) >= e.clientX
            && (rect.top + deviation) <= e.clientY
            && (rect.top + rect.height - deviation) >= e.clientY) {
            // 处理window下的chrome点击会触发mouseleave的bug, 坐标还在element范围内不触发
            return;
          }
          binding.value.outCallback.call(vnode.context);
        }, time)
        el.$outsidestatus = 'out';
      }
    }
    util.bind(element, 'mouseenter', eventIn)
    util.bind(element, 'mouseleave', eventOut)
    if (!element.__event) {
      element.__event = [];
    }
    element.__event.push({
      type: 'mouseenter',
      method: eventIn
    })
    element.__event.push({
      type: 'mouseleave',
      method: eventOut
    })
  })
}

// 更新指令相关事件（Click | Move）
function updateEvent(el, binding, vnode) {
  removeEvent(el, vnode.context);
  if (typeof binding.value === 'object' && binding.value.mode !== 'move') {
    nodeList.push(el);
    el[ctx] = {
      id: el.__id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      inCallback: binding.value.inCallback,
      outCallback: binding.value.outCallback
    };
  } else if (typeof binding.value === 'object' && binding.value.mode === 'move') {
    updateMoveEvent(el, binding, vnode);
  }
}

/**
 * v-eventoutside
 * mode: {click | move} 默认为click
 * inCallback: {function}
 * outCallback: {function}
 */
Vue.directive('eventoutside', {
  bind(el, binding, vnode) {
    const id = seed++;
    el.__id = id;
    updateEvent(el, binding, vnode);
  },
  update(el, binding, vnode) {
    updateEvent(el, binding, vnode);
  },

  unbind(el) {
    // 移除事件
    removeEvent(el);
  }
});
