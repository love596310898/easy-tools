// 数字每隔三位加一个逗号
const regexp1 = /(\d+?)(?=(?:\d{3})+$)/g;
console.log('11111111111'.replace(regexp1, '$1,'));
// 整数或者保留两位小数
const regexp2 = /^(\d*(\.\d{1,2})?)\d*$/;
console.log('111.111'.replace(regexp2, '$1'))
// 手机号脱敏
const regexp3 = /(?<=\d{3})\w(?=\w{4})/g;
console.log('18372634789'.replace(regexp3, '*'));
// 身份证号脱敏
const regexp4 = /(?<=\d{4})\w(?=\w{4})/g;
console.log('420321198909263818'.replace(regexp4, '*'))