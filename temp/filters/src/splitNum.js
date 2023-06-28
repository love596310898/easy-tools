/**
 * 作者：Hy
 * 时间：2019-05-24
 * 描述：splitNum
 */
const install = Vue => {
    Vue.filter('splitNum', (val, index = 3, separated = ',') => {
        if (!val) return val;
        const reg = new RegExp(`\\B(?=(?:\\d{${index}})+\\b)`, 'g');
        return String(val).replace(reg, separated);
    });
};

export default install;
