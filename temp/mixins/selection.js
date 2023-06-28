export default {
    computed: {
        // 是否全部选中
        isSelectedAll() {
            if (this.list.length) {
                return !this.list.filter(app => app.isSelected === false)[0];
            }
            return false;
        },
        // 当前选中的条数
        selectedAppCount() {
            return this.list.filter((app) => app.isSelected).length;
        },
    },
    methods: {
        // 全选或者反选
        selecteAll(val) {
            this.list.forEach(app => {
                app.isSelected = val;
            });
        },
    },
};
