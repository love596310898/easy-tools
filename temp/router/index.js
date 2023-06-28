/**
 * 全站路由配置
 *
 * 对于自动生成页（可配到菜单中）/page/:id, 虽然菜单信息中有 id 和 name, 但路由信息中没有, 所以采用 path 来匹配
 * 菜单中不能配通配符id，否则所有页都会匹配这个菜单
 * 菜单中每次只能配单个页地址，虽可以通过解析找到page模块，但如果事先路由中不存在/page/:id，会造成只有菜单配了才可以查看该页效果
 */
import Vue from 'vue';
import Router from 'vue-router';
// import api_menu from "@/api/sys/menu";
import api_auth from '@/api/auth';
import store from '@/store';
import {
  clearLoginInfo, getParsedUrl, getfixedUrl, sortTreeData,
} from '@/utils/base';
import cloneDeep from 'lodash/cloneDeep';
import { Message } from 'element-ui';
import qs from 'qs';
import NProgress from 'nprogress';
import { ng_url_mapping, ng_permission_mapping } from './url-mapping';
import { inner_route_mapping } from './url-route-mapping';
import 'nprogress/nprogress.css';

// 不显示在菜单中的次要路由
import unshowRoutersInMenu from './unshow-routers-in-menu.js';

/**
 * 需要被缓存的组件路由
 * @param { name } 组件名称
 * @param { children } 需要使用缓存的子路由
 */
const cacheNameMap = {
  // url研判任务列表
  '/data-judgment/judgment-task': {
    name: 'judgment-task',
    children: ['/data-judgment/judgment-task/details', '/fz-knowledge-base/url-detail']
  },
  // url研判任务详情
  '/data-judgment/judgment-task/details': {
    name: 'judgment-task-detail',
    children: ['/fz-knowledge-base/url-detail'],
  },
  // app研判任务列表
  "/cloud/fraudapp": {
    name: 'fraud-app',
    children: ['/cloud/fraudapp/details', '/fz-knowledge-base/apk-detail']
  },
  // app研判任务详情
  "/cloud/fraudapp/details": {
    name: 'fraud-app-detail',
    children: ['/fz-knowledge-base/apk-detail']
  },
  // 网址存活验证
  "/data-judgment/web-life": {
    name: 'web-life-validate',
    children: ['/data-judgment/web-life/detail']
  },
  // 白名单过滤
  "/cloud-white-list": {
    name: 'white-list-filter',
    children: ['/cloud/white-list/detail']
  },
  // 域名提取
  "/data-judge/doamin-extract": {
    name: 'DomainExtract',
    children: ['/data-judge/domain-extract/detail']
  }
};

/**
 * 需要使用缓存的组件路由与其对应的父路由
 */
const useingCacheMap = {};
Object.keys(cacheNameMap).forEach(key => {
  cacheNameMap[key].children.forEach(child => {
    if (!Array.isArray(useingCacheMap[child])) {
      useingCacheMap[child] = [];
    }
    useingCacheMap[child].push(key);
  })
})


NProgress.configure({ showSpinner: false });

Vue.use(Router);

// 取消现有 cancel token 下所有未完成的请求
export function cancelRequest() {
  if (window.globalCache.requestCancels) {
    window.globalCache.requestCancels.forEach((cancel) => {
      cancel();
    });
    window.globalCache.requestCancels = [];
  }
}

export function getRouteNameByMenu(menu) {
  return `${menu.name}_${menu.id}`; // 如果用id，需加上前缀，防止与静态 name（如 "404"）冲突
  // return menu.url.substr(1); // 解决子菜单回退缓存和keepAlive name 不一致，面包屑无定位问题--有问题
}

// 开发环境不使用懒加载, 懒加载页面太多会造成webpack热更新慢, 而生产环境使用懒加载
const _import = require(`./import-${process.env.NODE_ENV}`).default;

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
  // 反诈云数据统计
  {
    path: '/data-statistics-screen',
    component: _import('data-statistics-screen/index.vue'),
    name: 'data-statistics-screen'
  },
  {
    path: '/404',
    component: _import('404'),
    name: '404',
  },
  {
    path: '/login',
    component: _import('login.v2.vue'),
    // component: _import('login.vue'),
    name: 'login',
  },
  // 反诈云工作台
  {
    path: '/anti-fraud-cloud',
    component: _import('anti-fraud-cloud/index.vue'),
    name: 'anti-fraud-cloud',
  }
];

// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
  path: '/',
  component: _import('main'),
  children: [],
};

let firstRoute;

function createRouter() {
  return new Router({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    hasDynamicRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRoutes),
  });
}
// 创建路由
const router = createRouter();
// 获取路由类型
function getRouteType(route, globalRoutes = []) {

  let tmp = [];
  for (let i = 0; i < globalRoutes.length; i += 1) {
    // console.log(route, globalRoutes[i]);
    // 带参数的动态路由匹配时，当前路由path与路由表中的path不相等，所以加入额外匹配判断
    if (

      (route.name != undefined && route.name === globalRoutes[i].name)
      || route.path === globalRoutes[i].path
      || (route.matched[0] && route.matched[0].path === globalRoutes[i].path)
    ) {
      return 'global';
    }
    if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
      tmp = tmp.concat(globalRoutes[i].children);
    }
  }

  return tmp.length >= 1 ? getRouteType(route, tmp) : 'main';
}
/**
 * 获取路由类型, global: 全局路由, main: 主入口路由
 */
// 获取第一个可用的菜单 name
function getFirstMenu(menuList) {
  for (const item of menuList) {
    if (!item.children) {
      if (!item.url || item.url === '/') continue;
      switch (item.openMode) {
        // 打开新窗口模式不作为默认首页
        // 兼容ng版配置
        case '_blank':
        case 'blank':
        case 'dialog':
          break;
        default:
          return getRouteNameByMenu(item);
      }
    } else {
      const result = getFirstMenu(item.children);
      if (result) return result;
    }
  }
  return null;
}
/**
 * 解析嵌套路由
 * @param {*} route 路由
 * @param {*} name 路由名，对应菜单名
 * @param {*} findDefaultChildRoute 查找默认子路由
 */
function parseNestedRoute(route, name, findDefaultChildRoute = true) {
  // 当前层级路由存在默认子路由
  let hasDefaultChildRoute = false;

  route.children.forEach((item) => {
    item.meta = { ...item.meta, name };

    // 找到默认子路由
    if (findDefaultChildRoute && (item.path === '' || item.path === '/')) {
      hasDefaultChildRoute = true;

      if (item.children) {
        parseNestedRoute(item, name);
      } else {
        // 给最终的默认子路由加上 name
        item.name = name;
      }
    } else if (item.children) {
      // 为每一层子路由加上 meta.name
      parseNestedRoute(item, name, false);
    }
  });

  // 找不到下级默认子路由，给当前层级路由（可能是父路由或某层默认子路由）加上 name
  if (findDefaultChildRoute && !hasDefaultChildRoute) route.name = name;
}
/**
 * 动态路由生成器
 * @param {*} menuList 菜单列表
 * @param {*} routes 动态路由
 */
function dynamicRoutesBuilder(menuList = [], routes = []) {
  let tmp = [];

  for (let i = 0; i < menuList.length; i += 1) {
    const ml = menuList[i];

    // 存入面包屑中的信息尽量简化，以免转存到 localStorage 时，体积超出上限
    const ml_simple = {
      id: ml.id,
      name: ml.name,
      icon: ml.icon,
      url: ml.url,
    };

    // 计算菜单的面包屑
    if (ml.parentBreadcrumb) {
      ml.breadcrumb = [...ml.parentBreadcrumb, ml_simple];
    } else {
      ml.breadcrumb = [ml_simple]; // 第一层级
    }

    // 删掉菜单信息中的冗余信息
    delete ml.parentBreadcrumb; // 临时的传递
    delete ml.parent; // 后台返回的，仅能看到上级，被面包屑取代

    if (ml.children && ml.children.length >= 1) {
      ml.children.forEach((child) => { child.parentBreadcrumb = ml.breadcrumb; }); // 将父级的面包屑传递下去

      tmp = tmp.concat(ml.children); // 广度遍历，拼接下一层
    } else if (ml.url && /\S/.test(ml.url)) {
      // 匹配内置路由
      const mappedRoute = inner_route_mapping[ml.url];
      if (mappedRoute) {
        ml.url = mappedRoute.path; // 替换原有url
        // 如果是嵌套路由
        if (mappedRoute.children) {
          parseNestedRoute(mappedRoute, getRouteNameByMenu(ml));
        }
        routes.push(mappedRoute); // 加入内置路由
        continue;
      }
      const mappedUrl = ng_url_mapping[ml.url];
      if (mappedUrl) ml.url = mappedUrl;
      if (['_blank', 'blank', 'dialog'].includes(ml.openMode)) {
        ml.url = getfixedUrl(ml.url);
        continue;
      }

      const route = {
        path: ml.url,
        component: null,
        name: getRouteNameByMenu(ml),
        meta: {
          menu: ml,
        },
      };
      const parsedUrl = getParsedUrl(ml.url);
      const fixedUrl = getfixedUrl(parsedUrl);
      if (!/^\/#\/.*/.test(fixedUrl)) {
        ml.url = fixedUrl;
        route.path = `iframe/${encodeURIComponent(ml.url)}`;
        route.component = _import('iframe') || null;
        route.meta = {
          ...route.meta,
          iframeUrl: ml.url,
        };
      } else if (/^\/page\//.test(ml.url)) {
        // 动态页不能都配同一个path（/page 或者 /page/:type/:id），所以用 /page/1/xx 作为path，同时将参数解析后存入meta中
        const url_tmp = ml.url.replace(/^\//, '');
        const arr_tmp = url_tmp.split('/');
        arr_tmp.shift();
        route.meta = {
          ...route.meta,
          paramsInfo: arr_tmp,
        };
        try {
          route.component = _import('page') || null;
        } catch (e) {
          console.log(e);
        }
      } else {
        const arr_tmp = ml.url.split('?');
        const url_tmp = arr_tmp[0].split('/:')[0];
        if (arr_tmp[1]) {
          // 路由 path 中存在问号时，刷新页面会 404，所以将问号转码
          // route.path = arr_tmp[0] + encodeURIComponent("?") + arr_tmp[1];
          // eslint-disable-next-line prefer-destructuring
          route.path = arr_tmp[0];
          route.meta = {
            ...route.meta,
            queryInfo: qs.parse(arr_tmp[1]),
          };
        }
        const componentUrl = url_tmp.replace(/^\//, '');
        try {
          route.component = _import(componentUrl) || null;
        } catch (e) {
          console.warn(e);
        }
      }
      routes.push(route);
    }
  }
  if (tmp.length >= 1) {
    dynamicRoutesBuilder(tmp, routes);
  } else {
    const dynamicRoutes = cloneDeep(mainRoutes);
    dynamicRoutes.children = routes.concat(unshowRoutersInMenu);
    // 现有路由信息不能修改和删除，只能 addRoutes 来改变
    router.addRoutes([dynamicRoutes, { path: '*', redirect: { name: '404' } }]);
    router.options.hasDynamicRoutes = true;
    // 此处在动态路由注册完毕，意味用户已登录，所以在此处获取平台公共数据
    Promise.resolve('getPublicData').then(store.dispatch);
  }
}

// 重置路由
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
  firstRoute = null;
}

router.beforeEach((to, from, next) => {
  // 需要缓存的路由
  const needCacheCom = cacheNameMap[to.path];
  // 已被缓存的路由
  const cachedCom = cacheNameMap[from.path];
  // 使用缓存的子路由
  const useingCacheCom = useingCacheMap[from.path];

  // 进入的路由to需要被缓存，加入缓存队列
  if (needCacheCom) {
    store.commit('keepAlive/setKeep', needCacheCom.name);
  }

  // from已被缓存 && 进入的页面不是其子路由，清除from路由缓存
  if (cachedCom && !cachedCom.children.includes(to.path)) {
    store.commit('keepAlive/removeKeep', cachedCom.name);
  }

  // form路由是详情页面 && 进入的路由是其父路由，清除其父路由的所有子路由缓存
  if (useingCacheCom && useingCacheCom.includes(to.path)) {
    const parent = cacheNameMap[to.path]
    parent.children.forEach(child => {
      const childRoute = cacheNameMap[child];
      if (childRoute) {
        store.commit('keepAlive/removeKeep', childRoute.name);
      }
    })
    // form路由是详情页面 && 进入的路由不是其父类路由 && 进入的路由不是其子路由， 清除其所有父路由缓存
  } else if (useingCacheCom && (!cachedCom || !cachedCom.children.includes(to.path))) {
    useingCacheCom.forEach(parentRoutePath => {
      const parentRoute = cacheNameMap[parentRoutePath];
      if (parentRoute) {
        store.commit('keepAlive/removeKeep', parentRoute.name);
      }
    })
  }

  NProgress.start();
  // 取消旧页面的请求（Tabs形式除外）
  if (!window.globalConfig.useTabs) cancelRequest();
  // 添加动态(菜单)路由
  // 1. 已经添加 or 全局路由, 直接访问
  // 2. 获取菜单列表, 添加并保存本地存储
  if (router.options.hasDynamicRoutes || getRouteType(to, globalRoutes) === 'global') {
    if (to.path === '/' && firstRoute && firstRoute.name !== null) {
      next(firstRoute);
      // 应对场景：在默认页，点平台标题，进度条不消失
      if (from.name === firstRoute.name) {
        NProgress.done();
      }
    } else {
      next();

    }
  } else {

    api_auth
      .getMyInfo()
      .then((res) => {
        const data = res.body;
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('userName', data.user.userName);
        localStorage.setItem('idNo', data.user.idNo || '');
        localStorage.setItem('realName', data.user.realName);
        window.globalCache.userInfo = data.user;
        // 重置路由
        resetRouter();
        let list = [];
        let permissions = [];
        data.apps.forEach((item) => {
          if (
            item.key === window.globalConfig.appKey
            || (!window.globalConfig.showAppSelect && window.globalConfig.showFullMenu)
            || (!window.globalConfig.showAppSelect
              && window.globalConfig.showSystemMenu
              && item.key === 'system')
          ) {
            list = list.concat(item.menus);
          }
          // 兼容ng版配置
          let keys = [];
          Object.keys(item.functions).forEach((key) => {
            const mappedPermission = ng_permission_mapping[key];
            if (mappedPermission) {
              keys = keys.concat(mappedPermission);
            } else {
              keys = keys.concat(key);
            }
          });
          permissions = permissions.concat(keys);
        });

        if (list.length == 0) {
          Message.error('没有权限登录当前应用');
          api_auth.logout().then(() => {
            clearLoginInfo();
            next({ name: 'login', params: { target: to } });
          });
          return;
        }

        // 后台好像已经改成排序的了，这里的排序暂时没去掉，兼容旧后台，以防万一
        const menuList = sortTreeData(list);
        dynamicRoutesBuilder(menuList);
        sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'));
        sessionStorage.setItem('permissions', JSON.stringify(permissions || '[]'));
        // 处理子应用同域部署的情况下，本地存储key冲突的问题
        sessionStorage.setItem(window.globalConfig.appKey + '-menuList', JSON.stringify(menuList || '[]'));
        firstRoute = { name: getFirstMenu(menuList) };
        next({ ...to, replace: true });
      })
      .catch((err) => {
        clearLoginInfo();
        console.log(err, '请求菜单列表和权限失败，跳转至登录页');

        next({ name: 'login', params: { target: to } });
        // 应对场景：退出到登录页后，点浏览器后退，进度条不消失
        NProgress.done();
      });
  }
});


router.afterEach(() => {
  NProgress.done();
});

// 切换到应用对应的路由，然而浏览器后退的表现不好
export function switchAppRouter(menuList) {
  resetRouter();
  // 防止重新生成路由后，由于无法匹配，造成每次切换应用时，顶部栏都闪动（重新渲染）的问题，这样写后只有第一次切换会闪
  router.replace('/');
  // 重新生成路由，后台好像已经改成排序的了，这里先不排序了
  dynamicRoutesBuilder(menuList);

  firstRoute = { name: getFirstMenu(menuList) };
  // 临时改变路由，来触发 router.beforeEach，应对切换应用前后，url不变的情况下，内容页不刷新的问题
  router.replace('/404');
  router.replace('/');
}
export default router;
