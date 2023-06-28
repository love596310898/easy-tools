/**
 * @param {uiDsingWidth} 设计图宽度 默认 1920
 * @param {splitCount} 分为多少份，默认24份
 *  */
var { uiDsingWidth = 1920, splitCount = 24 } = {};

import { debounce } from '@/utils'

const resizeHandler = function () {
  let doc = document.documentElement;
  let vw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  let scale = vw / uiDsingWidth;
  let baseSize = uiDsingWidth / splitCount;
  let size = (baseSize * scale).toFixed();
  doc.style.fontSize = size + 'px';
};

resizeHandler();

window.addEventListener('resize', debounce(resizeHandler))
