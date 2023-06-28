/**
 * @description 用于数字格式化
 */

/**
 * 格式化数字, 保留精度
 * @param {number} originNumber     数字
 * @param {number} precision        数字精度
 */
function toInteger(number, precision) {
  const num = Number(number);
  if (Number.isNaN(num) || Number.isInteger(num)) {
    return number;
  }
  const numStr = num.toFixed(precision);
  const [int, float] = numStr.split('.');
  return int * Math.pow(10, precision) + Number(float);
}

/**
 * 货币风格的数字
 * @param {number} val     数字
 * @param {number} index   分隔位数
 * @param {string} separated   分隔符
 */

function moneyStyleNumber(val, index = 3, separated = ',') {
  if (!val) return val;
  const reg = new RegExp(`\\B(?=(?:\\d{${index}})+\\b)`, 'g');
  return String(val).replace(reg, separated);
}


