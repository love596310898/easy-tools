/* eslint-disable no-prototype-builtins */
/* eslint-disable no-param-reassign */

// 判断是否为undifined
const isUndefined = v => v === undefined;

// 获取当前时间
const createDate = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();
	return {
		year,
		month,
		day,
		hour,
		minute,
		second
	};
};

// 格式化为两位数
const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : `0${n}`;
};

// 格式化时间
const formatTime = date => {
	if (isUndefined(date)) {
		date = new Date();
	} else if (date && !Date.isPrototypeOf(date)) {
		date = new Date(date);
	}
	const { year, month, day, hour, minute, second } = createDate(date);
	return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`;
};

// 格式化结束时间
const endTimeToText = data => {
	data = data.replace(/-/g, '/');
	const endtime = new Date(data).getTime();
	const nowTime = new Date().getTime();
	const keepTime = endtime - nowTime;
	if (keepTime <= 0) return '投票已截止';
	const day = (keepTime / 1000 / 3600 / 24).toFixed(0);
	const hours = (keepTime / 1000 / 3600).toFixed(0) % 24;
	const min = (((keepTime / 1000) % 3600) / 60).toFixed(0);
	if (day > 0) {
		return `${day}天后截止`;
	}
	return `${hours}小时${min}分后截止`;
};

// 格式化数值为货币金额显示
const formatNumberToMoney = num => {
	if (/\d*(\.\d+)?/.test(num)) {
		const formatMoneyReg = /(\d+?)(?=(?:\d{3})+$)/g;
		const strArr = String(Number(num).toFixed(2)).split('.');
		strArr[0] = String(strArr[0]).replace(formatMoneyReg, '$1,');
		return strArr.join('.');
	} else {
		return num;
	}
};
