export const sourceFormat = (v) => {
  if (v) {
    switch (Number(v)) {
      case 0:
        return '案件涉诈网址';
      case 1:
        return '公安部推送';
      case 2:
        return '公安研判';
      case 3:
        return '管局研判(亚鸿)';
      case 4:
        return '管局研判(阿里)';
      default:
        '';
    }
  } else {
    return '';
  }
}