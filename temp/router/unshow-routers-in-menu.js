// 开发环境不使用懒加载, 懒加载页面太多会造成webpack热更新慢, 而生产环境使用懒加载
const _import = require(`./import-${process.env.NODE_ENV}`).default;
export default [
  // 反诈主题库
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: 'APP详情'
          }
        ]
      }
    },
    path: '/fz-knowledge-base/apk-detail',
    component: _import('fz-knowledge-base/apk-detail/index.vue'),
    props: route => route.query,
  },
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: 'URL详情'
          }
        ]
      }
    },
    path: '/fz-knowledge-base/url-detail',
    component: _import('fz-knowledge-base/url-detail-v2/index.vue'),
    props: (route) => route.query
  },
  // 涉诈家族情报网 APP任务列表
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: 'APP任务列表'
          }
        ]
      }
    },
    path: '/quick-search/app-task',
    component: _import('quick-search/app-task/index.vue'),
    props: (route) => route.query
  },
  // 涉诈家族情报网 APP任务列表 - 详情
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: 'APP任务详情'
          }
        ]
      }
    },
    path: '/quick-search/app-task/details',
    component: _import('quick-search/app-task/details/index.vue'),
    props: (route) => route.query
  },
  // 涉诈url研判任务详情
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: '任务详情'
          }
        ]
      }
    },
    path: '/data-judgment/judgment-task/details',
    component: _import('data-judgment/judgment-task/details/index.vue'),
    props: (route) => route.query
  },
  // 涉诈app研判任务详情
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: '任务详情'
          }
        ]
      }
    },
    path: '/cloud/fraudapp/details',
    component: _import('cloud/fraudapp/details/index.vue'),
    props: (route) => route.query
  },
  // 网址存活研判任务详情
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: '任务详情'
          }
        ]
      }
    },
    path: '/data-judgment/web-life/detail',
    component: _import('data-judgment/web-life/detail.vue'),
    props: (route) => route.query
  },
  // 技术反制任务详情
  {
    meta: {
      menu: {
        breadcrumb: [
          {
            name: '任务详情'
          }
        ]
      }
    },
    path: '/technical-counter/detail',
    component: _import('technical-counter/task-detail.vue'),
    props: (route) => route.query
  },
  // 调正查询详情页
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '调证查询详情' }]
      }
    },
    path: '/cloud/prospect/detail',
    component: _import('cloud/prospect/detail'),
    props: (route) => route.query
  },
  // 白名单过滤任务详情
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '白名单过滤详情' }]
      }
    },
    path: '/cloud/white-list/detail',
    component: _import('cloud-white-list/detail.vue'),
    props: (route) => route.query
  },
  // 个人中心
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '个人中心' }]
      }
    },
    path: '/self-center',
    component: _import('self-center/index.vue')
  },
  // 域名提取详情
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '域名提取详情' }]
      }
    },
    path: '/data-judge/domain-extract/detail',
    component: _import('data-judgment/domain-extract/detail.vue'),
    props: (route) => route.query
  },
  // 侦查建议 apk任务列表
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '任务列表' }]
      }
    },
    path: '/investigation-suggestion/service',
    component: _import('investigation-suggestion/service'),
    props: route => route.query,
  },
  // 侦查建议 apk任务详情
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '任务详情' }]
      }
    },
    path: '/investigation-suggestion/service/detail',
    component: _import('investigation-suggestion/service/detail.vue'),
    props: route => route.query,
  },
  // 技术侦查详情
  {
    meta: {
      menu: {
        breadcrumb: [{ name: '任务详情' }]
      }
    },
    path: '/technical-investigation/my-service/detail',
    component: _import('technical-investigation/my-service/detail.vue'),
    props: route => route.query,
  },
];
