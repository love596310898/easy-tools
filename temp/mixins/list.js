/**
 *  作者：Air.叶
 *  时间：2019-07-10
 *  描述：混合类
 */

export default {
    data() {
        return {
            autoload_: true, // 是否自动加载列表
            loading: false, // 列表加载
            list: [], // 列表展示
            searchData: {
                // 搜索条件
                startPosition: this.$store.state.pageNo, // 当前页码
                maxResult: this.$store.state.pageSize, // 分页大小
            },
            total: this.$store.state.total, // 总数量
        };
    },
    computed: {
        // 分页是否展示
        pageShow() {
            return !!this.list.length;
        },
    },
    created() {
        // eslint-disable-next-line no-underscore-dangle
        if (this.autoload_) {
            this.currentChange(1);
        }
    },
    methods: {
        formatParams(params) {
            const res = Object.create(null);
            // eslint-disable-next-line no-restricted-syntax
            for (const i in params) {
                // eslint-disable-next-line no-prototype-builtins
                if (params.hasOwnProperty(i)) {
                    const key = i.replace(/_/g, '.');
                    res[key] = params[i];
                }
            }
            return res;
        },
        async currentChange(val) {
            try {
                this.loading = true;
                this.searchData.startPosition = val;
                const params = {
                    ...this.searchData,
                    startPosition: (val - 1) * this.searchData.maxResult,
                };
                // 获取列表
                // eslint-disable-next-line no-underscore-dangle
                const result = await this._getList(params);
                if (result) {
                    this.list = result.resultData;
                    this.total = result.totalRecord;
                    this.loading = false;
                } else {
                    this.loading = false;
                }
            } catch (e) {
                this.loading = false;
                this.list = [];
            }
        },
        // eslint-disable-next-line no-underscore-dangle
        _getIndex(index) {
            return (this.searchData.startPosition - 1) * this.searchData.maxResult + index + 1;
        },
        sizeChange(size) {
            this.searchData.maxResult = size;
            this.currentChange(1);
        },
        search() {
            this.currentChange(1);
        },
        // 有默认时间 对应监听时间选择及删除
        startDateChange(val) {
            if (val === null) {
                this.searchData.startDate = '';
            } else {
                this.searchData.startDate = val;
            }
            this.$forceUpdate();
        },
        sChange(val) {
            if (val === null) {
                this.searchData.startDate = '';
            } else {
                this.searchData.startDate = val;
            }
            this.$forceUpdate();
        },
        endDateChange(val) {
            if (val === null) {
                this.searchData.endDate = '';
            } else {
                this.searchData.endDate = val;
            }
            this.$forceUpdate();
        },
        eChange(val) {
            if (val === null) {
                this.searchData.endDate = '';
            } else {
                this.searchData.endDate = val;
            }
            this.$forceUpdate();
        },
    },
};
