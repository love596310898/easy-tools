import Vue from 'vue';

/**
 * v-dialogDrag: 弹窗指令，支持 “拖拽”、“双击头部全屏”、“调整尺寸” 操作
 * 用法示例：
 * <el-dialog v-dialogDrag="{drag: true}"></el-dialog> 开启拖拽
 * <el-dialog v-dialogDrag="{drag: true, fullscreen: true, resize: true}"></el-dialog> 开启拖拽、双击头部全屏、调整尺寸
 * <el-dialog v-dialogDrag="{resize: true, minW: 500, minH: 400}"></el-dialog> 开启调整尺寸（可选：限制最小尺寸）
 */
Vue.directive('dialogDrag', {
  // 从 bind 改为 update，以便动态改变配置
  update(el, binding, vnode, oldVnode) {
    let _drag = false, _fullscreen = false, _resize = false, _minW = 200, _minH = 200;

    if (binding.value) {
      const o = binding.value;
      if (o.drag != undefined) _drag = o.drag;
      if (o.fullscreen != undefined) _fullscreen = o.fullscreen;
      if (o.resize != undefined) _resize = o.resize;
      if (_resize) {
        if (o.minW != undefined) _minW = o.minW;
        if (o.minH != undefined) _minH = o.minH;
      }
    }

    const dialogHeaderEl = el.querySelector('.el-dialog__header');
    const dialogFooterEl = el.querySelector('.el-dialog__footer');
    const dragDom = el.querySelector('.el-dialog');

    let onStartDrag;

    /**
     * 拖拽
     */
    if (_drag) {
      // 清除选择头部文字效果
      dialogHeaderEl.onselectstart = new Function("return false");

      // dialogHeaderEl.style.cursor = 'move';
      dialogHeaderEl.style.cssText += ';cursor:move;'
      dragDom.style.cssText += ';top:0px;'

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = (function () {
        if (window.document.currentStyle) {
          return (dom, attr) => dom.currentStyle[attr];
        } else {
          return (dom, attr) => getComputedStyle(dom, false)[attr];
        }
      })()

      onStartDrag = (e) => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft;
        const disY = e.clientY - dialogHeaderEl.offsetTop;

        // const screenWidth = document.body.clientWidth; // body当前宽度
        // const screenHeight = document.documentElement.clientHeight; // 可见区域高度(应为body高度，可某些环境下无法获取)
        const maxWidth = el.clientWidth;
        const maxHeight = el.clientHeight;

        const dragDomWidth = dragDom.offsetWidth; // 对话框宽度
        const dragDomheight = dragDom.offsetHeight; // 对话框高度

        const minDragDomLeft = dragDom.offsetLeft;
        const maxDragDomLeft = maxWidth - dragDom.offsetLeft - dragDomWidth;

        const minDragDomTop = dragDom.offsetTop;
        const headerH = dialogHeaderEl.offsetHeight;
        let maxDragDomTop;
        if (dragDomheight < maxHeight) {
          maxDragDomTop = maxHeight - dragDom.offsetTop - dragDomheight;
        } else {
          maxDragDomTop = maxHeight - dragDom.offsetTop - headerH;
        }

        // 获取到的值带px 正则匹配替换
        let styL = sty(dragDom, 'left');
        let styT = sty(dragDom, 'top');

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (styL.includes('%')) {
          styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100);
          styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100);
        } else {
          styL = +styL.replace(/\px/g, '');
          styT = +styT.replace(/\px/g, '');
        };

        const dialogBodyEl = el.querySelector('.el-dialog__body');
        // 阻止内部交互，以免光标移入iframe内嵌页面后，document.onmouseup 无法触发
        dialogBodyEl.style.pointerEvents = "none";

        document.onmousemove = function (e) {
          // 通过事件委托，计算移动的距离
          let left = e.clientX - disX;
          let top = e.clientY - disY;

          // 边界处理
          if (-left > minDragDomLeft) {
            left = -minDragDomLeft;
          } else if (left > maxDragDomLeft) {
            left = maxDragDomLeft;
          }

          if (-top > minDragDomTop) {
            top = -minDragDomTop;
          } else if (top > maxDragDomTop) {
            top = maxDragDomTop;
          }

          // 移动当前元素
          dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`;
        };

        document.onmouseup = function (e) {
          document.onmousemove = null;
          document.onmouseup = null;
          // 允许内部交互
          dialogBodyEl.style.pointerEvents = "auto";
        };
      }

      dialogHeaderEl.onmousedown = onStartDrag;
    } else {
      dialogHeaderEl.style.cursor = 'initial';
      dialogHeaderEl.onmousedown = null;
    }

    /**
     * 双击头部全屏
     */
    let maxMin = dialogHeaderEl.querySelector('.el-dialog__minmax');

    if (_fullscreen) {
      // 初始非全屏
      let isFullScreen = false;
      let nowWidth;
      let nowBodyHeight;
      let nowMarginTop;
      let nowMarginBottom;

      //头部插入最大化最小化元素
      if (!maxMin) {
        maxMin = document.createElement("button");
        maxMin.className = 'el-dialog__headerbtn el-dialog__minmax';
        maxMin.style.right = '40px';
        maxMin.style.color = '#909399';
        maxMin.title = '最大化';
        maxMin.innerHTML = '<i class="el-icon-full-screen" onMouseOver="this.style.color=\'#409EFF\'" onMouseOut="this.style.color=\'inherit\'"></i>';
        dialogHeaderEl.insertBefore(maxMin, dialogHeaderEl.childNodes[dialogHeaderEl.childNodes.length - 1]);
        //点击放大缩小效果
        maxMin.onclick = setMaxMin;
        //双击头部效果
        dialogHeaderEl.ondblclick = setMaxMin;
      }

      // 双击头部效果
      function setMaxMin() {
        const headerH = dialogHeaderEl.offsetHeight;
        const footerH = dialogFooterEl ? dialogFooterEl.offsetHeight : 0;
        const otherH = headerH + footerH;
        const dialogBodyEl = el.querySelector('.el-dialog__body');

        if (isFullScreen == false) {
          let i = maxMin.querySelector('.el-icon-full-screen');
          i.classList.remove('el-icon-full-screen');
          i.classList.add('el-icon-crop');
          nowWidth = dragDom.clientWidth;
          nowBodyHeight = dialogBodyEl.offsetHeight;
          nowMarginTop = dragDom.style.marginTop;
          nowMarginBottom = dragDom.style.marginBottom;

          maxMin.title = '还原';

          dragDom.style.left = 0;
          dragDom.style.top = 0;
          dragDom.style.width = "100VW";
          dragDom.style.height = "100VH";
          dragDom.style.marginTop = 0;
          dragDom.style.marginBottom = 0;
          isFullScreen = true;

          if (_drag) {
            dialogHeaderEl.style.cursor = 'initial';
            dialogHeaderEl.onmousedown = null;
          }

          if (dialogBodyEl) {
            dialogBodyEl.style.boxSizing = "border-box";
            dialogBodyEl.style.overflow = "auto";
            dialogBodyEl.style.height = `calc(100% - ${otherH}px)`
          }
        } else {
          let i = maxMin.querySelector('.el-icon-crop');
          i.classList.remove('el-icon-crop');
          i.classList.add('el-icon-full-screen');
          maxMin.title = '最大化';

          dragDom.style.width = nowWidth + 'px';
          dragDom.style.height = "auto";
          dragDom.style.marginTop = nowMarginTop;
          dragDom.style.marginBottom = nowMarginBottom;
          isFullScreen = false;

          if (_drag) {
            dialogHeaderEl.style.cursor = 'move';
            dialogHeaderEl.onmousedown = onStartDrag;
          }

          if (dialogBodyEl) {
            dialogBodyEl.style.height = nowBodyHeight + "px";
          }
        }
      }
    } else {
      if (maxMin) {
        maxMin.onclick = null;
        dialogHeaderEl.ondblclick = null;
        dialogHeaderEl.removeChild(dialogHeaderEl.childNodes[dialogHeaderEl.childNodes.length - 2]);
      }
    }

    /**
     * 调整尺寸
     */
    let resizeEl = dragDom.querySelector('.el-dialog__resize');

    if (_resize) {
      // 弹框可拉伸最小宽高
      let minWidth = _minW;
      let minHeight = _minH;

      // 拉伸
      if (!resizeEl) {
        resizeEl = document.createElement("div");
        resizeEl.className = 'el-dialog__resize el-icon-bottom-right';
        dragDom.appendChild(resizeEl);
        // 在弹窗右下角加上一个控制块
        resizeEl.style.cursor = 'se-resize';
        resizeEl.style.position = 'absolute';
        resizeEl.style.width = '15px';
        resizeEl.style.height = '15px';
        resizeEl.style.right = 0;
        resizeEl.style.bottom = 0;
        resizeEl.style.fontSize = "14px";
        // 鼠标拉伸弹窗
        resizeEl.onmousedown = (e) => {
          // 记录初始x位置
          const clientX = e.clientX;
          // 鼠标按下，计算当前元素距离可视区的距离
          const disX = e.clientX - resizeEl.offsetLeft - resizeEl.offsetWidth;
          const disY = e.clientY - resizeEl.offsetTop - resizeEl.offsetHeight;

          const headerH = dialogHeaderEl.offsetHeight;
          const footerH = dialogFooterEl ? dialogFooterEl.offsetHeight : 0;
          const otherH = headerH + footerH;

          const dialogBodyEl = el.querySelector('.el-dialog__body');
          // 阻止内部交互，以免光标移入iframe内嵌页面后，document.onmouseup 无法触发
          dialogBodyEl.style.pointerEvents = "none";

          document.onmousemove = function (e) {
            e.preventDefault(); // 移动时禁用默认事件

            // 通过事件委托，计算移动的距离
            const x = e.clientX - disX + (e.clientX - clientX);// 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
            const y = e.clientY - disY;

            let tmp = `${x}px`;
            // 比较是否小于最小宽高
            tmp = x > minWidth ? tmp : minWidth + 'px';
            // 比较是否大于最大宽度
            const maxWidth = el.clientWidth;
            tmp = x < maxWidth ? tmp : maxWidth + 'px';
            dragDom.style.width = tmp;

            if (dialogBodyEl) {
              dialogBodyEl.style.boxSizing = "border-box";
              dialogBodyEl.style.overflow = "auto";
              dialogBodyEl.style.height = y > minHeight ? `${y - otherH}px` : (minHeight - otherH) + 'px';
            }
          };
          // 拉伸结束
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
            // 允许内部交互
            dialogBodyEl.style.pointerEvents = "auto";
          };
        }
      }
    } else {
      if (resizeEl) {
        resizeEl.onmousedown = null;
        dragDom.removeChild(dragDom.childNodes[dragDom.childNodes.length - 1]);
      }
    }
  }
});
