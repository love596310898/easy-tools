import Loading from './loading';

export default {
  mixins: [Loading],
  data() {
    return {
      pageSizes: [10, 50, 100, 200, 500],
      totalRecord: 0, // 总条数
      pageSize: 10, // 每页条数
      pageIndex: 1, // 当前页数
    };
  },
  methods: {
    // 查询数据
    async search(currentPage) {
      this.pageIndex = typeof currentPage == 'number' ? currentPage : 1;
      this.takeLoading();
      try {
        const res = await this.get_list({
          maxResult: this.pageSize,
          startPosition: (this.pageIndex - 1) * this.pageSize,
        });
        if (res) {
          this.totalRecord = res.totalRecord;
        }
      } catch (err) {
        console.warn(err);
      }
      this.loaded();
    },
    // 每页条数变化时
    sizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.search();
    },
    // 页码切换时
    currentChange(val) {
      this.search(val);
    },
  },
};
