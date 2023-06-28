export default {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
    beforeRouteEnter(to, from, next) {
        let { meta } = from;
        // 刷新的情况下抹平from的区别
        if (!meta.menu || !meta.menu.breadcrumb || meta.menu.breadcrumb.length < 1) {
            try {
                meta = JSON.parse(window.sessionStorage.getItem('unshowed-router-catch'));
            } catch (err) {
                next();
            }
        }
        // 维持菜单中选中其入口页面
        const name = from.name || meta.name || '/';
        to.meta.name = name;
        // 加工子页的面包屑
        const { breadcrumb } = meta.menu;
        if (Array.isArray(breadcrumb)) {
            let sliceIndex = breadcrumb.length;
            // 获取即将进入路由的面包屑信息
            const toBreadcrumb = to.meta.menu.breadcrumb;
            // 每次进入前复原初始配置
            if (toBreadcrumb.length > 1) { // 刷新时会自动复原
                toBreadcrumb.splice(0, toBreadcrumb.length - 1);
            }
            // 将路由fullPath写入breadcremb，为使用面包屑提供path
            // 同时动态路由匹配传递的参数缓存下来,防止使用面包屑返回时路由传递的参数丢失
            toBreadcrumb[0].url = to.fullPath;
            // 来源路由面包屑中是否包含即将进入路由，如包含则截取前半部分
            breadcrumb.forEach((item, index) => {
                if (item.name == toBreadcrumb[0].name) {
                    sliceIndex = index;
                }
            });
            toBreadcrumb.splice(0, 0, ...breadcrumb.slice(0, sliceIndex));
        }
        window.sessionStorage.setItem('unshowed-router-catch', JSON.stringify(to.meta));
        next();
    },
};
