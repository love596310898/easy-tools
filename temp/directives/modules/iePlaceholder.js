import Vue from 'vue';

/**
 * ie9中显示placeholder
 * 用法示例：
 * <el-input v-model="xxx" v-iePlaceholder placeholder="用户名" clearable></el-input>
 * 需配合全局样式：
 *  .ie-placeholder{
 *    position: absolute;
 *    padding-left: 15px;
 *    font-size: 14px;
 *    color: #888;
 *    pointer-events: none;
 *  }
 */
Vue.directive("iePlaceholder", {
  inserted: function (el) {
    if (("placeholder" in document.createElement("input"))) {
      return;
    }
    if (/^el/.test(el.className)) {
      el = el.querySelector("[placeholder]");
    }
    var placeholder = el.getAttribute("placeholder") || "请输入";
    var span = document.createElement("span");
    span.className = "ie-placeholder";
    span.innerText = placeholder;
    span.style.left = el.offsetLeft + "px";
    el.parentNode.style.position = "relative";
    el.insertAdjacentElement("afterend", span);
    el.onfocus = function (event) {
      if (event.target.value) {
        span.style.display = "none";
      }
    };
    el.onblur = function (event) {
      if (!event.target.value) {
        span.style.display = "inline";
      }
    };
    el.oninput = function (event) {
      if (event.target.value) {
        span.style.display = "none";
      } else {
        span.style.display = "inline";
      }
    }
  },
  unbind: function (el) {
    el.onfocus = el.onblur = el.oninput = null;
  }
});
