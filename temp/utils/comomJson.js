export default {
    // 劝阻类型
    dehortChange: {
        1: '未劝阻',
        2: '已受骗',
        3: '未接电话',
        4: '未遇到',
        5: '未受骗',
        6: '已劝阻',
    },
    dehortrevertChange: {
        未劝阻: '1',
        已受骗: '2',
        未接电话: '3',
        未遇到: '4',
        未受骗: '5',
        已劝阻: '6',
    },
    isConOptions: [{
        value: true,
        label: '串并',
    },
    {
        value: false,
        label: '不串并',
    },
    ],
    groupTypeOptions: [{
        value: 'QQ群',
        label: 'QQ群',
    }, {
        value: '微信群',
        label: '微信群',
    }],
    tool_name_options: [{
        value: '选项1',
        label: '微信',
    }, {
        value: '选项2',
        label: 'QQ',
    }],
    caseBankOptions: [{
        value: '银行卡号',
        label: '银行卡号',
    },
    {
        value: '支付宝',
        label: '支付宝',
    },
    {
        value: '微信',
        label: '微信',
    },
    {
        value: '其他',
        label: '其他',
    },
    ],
    chattoolOptions: [{
        value: '交友平台',
        label: '交友平台',
    },
    {
        value: '聊天工具',
        label: '聊天工具',
    }],
    // 回访信息下拉
    feedValueOptions: [{
        value: '打通（不配合）',
        label: '打通（不配合）',
    },
    {
        value: '打通（非本人）',
        label: '打通（非本人）',
    },
    {
        value: '打通（配合）',
        label: '打通（配合）',
    },
    {
        value: '未打通（关机/停机）',
        label: '未打通（关机/停机）',
    },
    {
        value: '未打通（拒接）',
        label: '未打通（拒接）',
    },
    {
        value: '未打通（空号）',
        label: '未打通（空号）',
    },
    {
        value: '未打通（无人接）',
        label: '未打通（无人接）',
    },
    {
        value: '无联系电话',
        label: '无联系电话',
    },
    ],
    // 通用 是否下拉
    isOptions: [{
        value: true,
        label: '是',
    },
    {
        value: false,
        label: '否',
    }],
    // 预警网址库
    isWarningOptions: [{
        value: '0',
        label: '预警',
    },
    {
        value: '1',
        label: '取消预警',
    }],
    isSetUpOptions: [{
        value: true,
        label: '是',
    },
    {
        value: false,
        label: '否',
    }],
    isAppOptions: [{
        value: true,
        label: '已安装',
    },
    {
        value: false,
        label: '未安装',
    }],
    isSendEmailOptions: [{
        value: true,
        label: '是',
    },
    {
        value: false,
        label: '否',
    }],
    listTypeOptions: [{
        value: '黑',
        label: '黑',
    },
    {
        value: '灰',
        label: '灰',
    },
    ],
    isNumOptions: [
        {
            value: 1,
            label: '是',
        },
        {
            value: 0,
            label: '否',
        },
    ],
    urlTypeOp: [
        {
            value: '网址',
            label: '网址',
        },
        {
            value: 'APK',
            label: 'APK',
        },
        {
            value: 'IPA',
            label: 'IPA',
        },
    ],
    isPositionOp: [
        {
            value: 1,
            label: '境内',
        },
        {
            value: 2,
            label: '境外',
        },
        {
            value: 0,
            label: '未知',
        },
    ],
    taskStatusOp: [
        {
            value: 0,
            label: '待执行',
        },
        {
            value: 1,
            label: '正在执行',
        },
        {
            value: 2,
            label: '执行成功',
        },
        {
            value: 3,
            label: '执行失败',
        },

    ],
    baiduStatusOp: [
        {
            value: '请求失败',
            label: '请求失败',
        },
        {
            value: '已收录',
            label: '已收录',
        },
        {
            value: '未收录',
            label: '未收录',
        },
        {
            value: '类似收录',
            label: '类似收录',
        },

    ],
    appSourceOp: [
        {
            value: '本地',
            label: '本地',
        },
        {
            value: '网络',
            label: '网络',
        },
    ],
    appStatusOp: [
        {
            value: '待下载',
            label: '待下载',
        },
        {
            value: '下载中',
            label: '下载中',
        },
        {
            value: '下载失败',
            label: '下载失败',
        },
        {
            value: '读取失败',
            label: '读取失败',
        },
        {
            value: '待分析',
            label: '待分析',
        },
    ],
    harmLevelOp: [
        {
            value: '浅度',
            label: '浅度',
        },
        {
            value: '深度',
            label: '深度',
        },
    ],
    yesandnochinese: [
        {
            value: '是',
            label: '是',
        },
        {
            value: '否',
            label: '否',
        },
    ],
    caseTypeOp: [
        { itemName: 'Q仔诈骗', itemValue: '00' },
        { itemName: '电话冒充领导，熟人诈骗', itemValue: '01' },
        { itemName: '机票退、改签诈骗', itemValue: '02' },
        { itemName: '冒充购物客服退款诈骗', itemValue: '03' },
        { itemName: '重金求子（慈善捐款）诈骗', itemValue: '04' },
        { itemName: '冒充黑社会诈骗', itemValue: '05' },
        { itemName: 'PS图片诈骗', itemValue: '06' },
        { itemName: '冒充公检法', itemValue: '07' },
        { itemName: '刷单类诈骗', itemValue: '08' },
        { itemName: '贷款、代办信用卡类诈骗', itemValue: '09' },
        { itemName: '冒充军警购物诈骗', itemValue: '10' },
        { itemName: '网络交友诱导赌博、投资诈骗', itemValue: '11' },
        { itemName: '游戏币、游戏点卡诈骗', itemValue: '12' },
        { itemName: '游戏装备诈骗', itemValue: '13' },
        { itemName: '虚假购物消费诈骗', itemValue: '14' },
        { itemName: '虚假网站、链接诈骗', itemValue: '15' },
        { itemName: '补助、退税类诈骗', itemValue: '16' },
        { itemName: '理财类诈骗', itemValue: '17' },
        { itemName: '其它类型诈骗', itemValue: '18' },
    ],
    op: [
        {
            value: 1,
            label: '',
        },
    ],
    isOp: [{
        value: 1,
        label: '是',
    },
    {
        value: 0,
        label: '否',
    }],
    // 举报来源：1：微信 2：阳光守护
    denounceSourceOp: [
        {
            value: 1,
            label: '微信',
        },
        {
            value: 2,
            label: '阳光守护',
        },
    ],
    // 举报类型:1：诈骗网址举报，2：诈骗号码举报，3：诈骗社交账号举报，4：诈骗资金账号举报
    denounceTypeOp: [
        {
            value: 1,
            label: '诈骗网址举报',
        },
        {
            value: 2,
            label: '诈骗号码举报',
        },
        {
            value: 3,
            label: '诈骗社交账号举报',
        },
        {
            value: 4,
            label: '诈骗资金账号举报',
        },
    ],
    // 是否有效举报，0：无效， 1：有效
    effectOp: [{
        value: 1,
        label: '是',
    },
    {
        value: 0,
        label: '否',
    }],
    // 处理结论：0：不封堵，1：封堵
    handleResultOp: [{
        value: 1,
        label: '封堵',
    },
    {
        value: 0,
        label: '不封堵',
    }],
    // 状态：0：未处置， 1：处置中， 2:处置完毕， 3:关闭
    statusOp: [
        // {
        //     value: 0,
        //     label: '未处置'
        // },
        {
            value: 1,
            label: '处置中',
        },
        // {
        //     value: 2,
        //     label: '处置完毕'
        // },
        {
            value: 3,
            label: '关闭',
        },
    ],

    dealstatus: [
        {
            value: '同意',
            label: '同意',
        },
        {
            value: '驳回',
            label: '驳回',
        },
    ],
    // 是否预警：0：不预警，1：预警
    warningOp: [
        {
            value: 1,
            label: '预警',
        },
        {
            value: 0,
            label: '不预警',
        },
    ],

};
