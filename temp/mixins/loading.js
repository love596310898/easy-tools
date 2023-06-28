export default {
    data() {
        return {
            isLoading: false, // 是否处于加载中
        };
    },
    methods: {
        // 进入加载
        takeLoading() {
            if (this.isLoading == false) {
                this.isLoading = true;
            }
        },
        // 取消加载
        loaded() {
            if (this.isLoading == true) {
                this.isLoading = false;
            }
        },
    },
};
