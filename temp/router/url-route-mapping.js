/* eslint-disable camelcase */
/**
 * 菜单url映射为相应的内置路由
 * 将改变原有路由生成规则，可解决后台目前不支持路由高级用法的问题
 * 对于需要子页面的情况，推荐在菜单管理中配置 /xxx/:id? 之类的匹配规则，然后在 xxx 组件中根据 id 来选择要渲染的子页面组件
 * 注意最好不要出现name属性，避免与动态路由中的name冲突
 */
export const inner_route_mapping = {
    // 示例说明： /xxx 为菜单管理中配置的url，且在 src/views 下存在 xxx 组件和子组件 aaa、bbb
    /* "/xxx": {
    path: "/xxx",
    component: _import("xxx"),
    children: [
      {
        path: "aaa",
        component: _import("aaa")
      },
      {
        path: "bbb",
        component: _import("bbb")
      }
    ]
  } */
};
