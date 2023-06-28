import moment from 'moment';
import httpRequest from '@/utils/httpRequest';
import { resolveSass } from '@/utils/apiFormat';
/**
 * 时间格式化
 * @param {*} date Date对象 或 时间戳
 * @param {*} fmt "yyyy-MM-dd hh:mm:ss"
 */
export function formatTime(date, fmt = 'yyyy-MM-dd hh:mm:ss') {
  if (!date) return date;
  if (!(date instanceof Date)) {
    if (isNaN(Number(date))) {
      return date;
    } else {
      date = new Date(Number(date));
    }
  }
  var o = {
    'M+': date.getMonth() + 1, //月份
    'd+': date.getDate(), //日
    'h+': date.getHours(), //小时
    'm+': date.getMinutes(), //分
    's+': date.getSeconds(), //秒
    'q+': Math.floor((date.getMonth() + 3) / 3) //季度
  };
  // 格式化年
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  // 格式化毫秒
  if (/(S+)/.test(fmt)) {
    const tmp = date.getMilliseconds();
    fmt = fmt.replace(RegExp.$1, ('000' + tmp).substr(('' + tmp).length));
  }
  // 格式化其它
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }
  return fmt;
}

/**
 * 通过最近时间和单位（最近一周，最近一月等），获取时间段（时间戳数组）
 * @param {*} timeValue 最近时间
 * @param {*} timeUnit  时间单位
 * @param {*} natureTime  自然时间
 */
export function getTimeRangeByUnit(timeValue, timeUnit, natureTime) {
  if (timeValue == undefined || !timeUnit || timeValue < 0) return [];
  if (timeUnit == 'hours') timeUnit = 'hour'; // 旧数据兼容

  let start;
  let end;

  if (natureTime) {
    if (timeValue == 0) {
      start = moment().startOf(timeUnit);
      end = moment().endOf(timeUnit);
    } else {
      start = moment()
        .startOf(timeUnit)
        .subtract(timeValue, timeUnit + 's');
      end = moment()
        .endOf(timeUnit)
        .subtract(1, timeUnit + 's');
    }
  } else {
    start = moment().subtract(timeValue, timeUnit + 's');
    end = moment();
  }

  return [start.valueOf(), end.valueOf()];
}

/**
 * 换算得到毫秒值
 * @param {*} timeValue
 * @param {*} timeUnit
 */
export function getMilliSecond(timeValue, timeUnit) {
  switch (timeUnit) {
    case 'second':
      return timeValue * 1000;
    case 'minute':
      return timeValue * 1000 * 60;
    case 'hour':
      return timeValue * 1000 * 3600;
    case 'day':
      return timeValue * 1000 * 3600 * 24;
    case 'week':
      return timeValue * 1000 * 3600 * 24 * 7;
    case 'month':
      return timeValue * 1000 * 3600 * 24 * 30;
    case 'year':
      return timeValue * 1000 * 3600 * 24 * 365;
  }
}

/**
 * 根据时间周期单位获取时间范围（Unit: String => Array: [Date, Date]）
 * @param {*} Unit 周期单位
 */
export function getTimeRange(Unit) {
  const now = new Date();
  const y = now.getFullYear();
  const M = now.getMonth() + 1;
  const d = now.getDate();
  const w = now.getDay() > 0 ? now.getDay() : 7;
  let startDate;
  // 补零函数
  const fz = str => (str.toString().length === 1 ? `0${str}` : `${str}`);
  switch (Unit) {
    case 'day': {
      startDate = new Date(`${y}-${fz(M)}-${fz(d)} 00:00:00`);
      return [startDate, now];
    }
    case 'week': {
      startDate = new Date(`${formatTime(now.getTime() - (w - 1) * 24 * 3600 * 1000, 'yyyy-MM-dd')} 00:00:00`);
      return [startDate, now];
    }
    case 'month': {
      startDate = new Date(`${y}-${fz(M)}-01 00:00:00`);
      return [startDate, now];
    }
    case 'year': {
      startDate = new Date(`${y}-01-01 00:00:00`);
      return [startDate, now];
    }
    default: {
      startDate = new Date(`${formatTime(now.getTime() - (Unit - 1) * 24 * 3600 * 1000, 'yyyy-MM-dd')} 00:00:00`);
      return [startDate, now];
    }
  }
}

/** 秒转成时分秒 */
export function formatSeconds(value) {
  if (value == null) return '';
  var theTime = parseInt(value); // 秒
  var theTime1 = 0; // 分
  var theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }

  var result = '' + parseInt(theTime); //秒

  result = (theTime < 10 ? '0' : '') + parseInt(theTime) + ' 秒'; //秒

  if (theTime1 > 0) {
    result = (theTime1 < 10 ? '0' : '') + parseInt(theTime1) + ' 分 ' + result; //分，不足两位数，首位补充0，
  }

  if (theTime2 > 0) {
    result = parseInt(theTime2) + ' 小时 ' + result; //时
  }
  return result;
}

// 获取当天0点的时间戳
export function getStartTime(unit = 'day') {
  return moment()
    .startOf(unit)
    .valueOf();
}

// 获取服务器时间 并返回时间范围
/**
 *
 * @param {*} range  // 时间范围
 * @param {*} type // 日期格式 1 为年月日 2为年月日时分秒
 */
export async function timeRange(range, type) {
  // const defaultTime = () => httpRequest.get(resolve('/counterPhoneGreylist/getSystemDate'));
  const defaultTime = () => httpRequest.get(resolveSass('/sys/security/user/getSystemDate'));
  const serviceTime = await defaultTime();
  const nowTime = new Date(serviceTime);
  const y = nowTime.getFullYear();
  const M = nowTime.getMonth() + 1;
  const d = nowTime.getDate();

  let startTime = new Date(nowTime).getTime() - (range - 1) * 24 * 60 * 60 * 1000; // 获取当前时间的毫秒数
  const startY = new Date(startTime).getFullYear();
  const startM = new Date(startTime).getMonth() + 1;
  const startD = new Date(startTime).getDate();
  // 补0
  const dateStr = str => (str.toString().length == 1 ? `0${str}` : str);
  if (type == 1) {
    return [`${startY}-${dateStr(startM)}-${dateStr(startD)}`, `${y}-${dateStr(M)}-${dateStr(d)}`];
  } else {
    return [`${startY}-${dateStr(startM)}-${dateStr(startD)} 00:00:00`, serviceTime];
  }
}

export const timeSuffixer = (v) => {
  const hourUnit = 1000 * 60 * 60;
  const minuteUnit = 1000 * 60;
  const secondUnit = 1000;
  const hour = Math.floor((v / hourUnit)) + '小时';
  const minute = Math.floor(((v % hourUnit) / minuteUnit)) + '分钟';
  const second = Math.floor((((v % hourUnit) % minuteUnit) / secondUnit)) + '秒';
  if (v > hourUnit) {
    return hour + minute + second;
  } else if (v > minuteUnit) {
    return minute + second;
  } else if (v > secondUnit) {
    return second;
  } else {
    return v.toFixed() + '毫秒';
  }
}