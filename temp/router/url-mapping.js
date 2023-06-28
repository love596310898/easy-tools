/* eslint-disable camelcase */
// ng版系统管理菜单url映射为新版url
export const ng_url_mapping = {
    // 应用
    'system.menuConfig.list': '/sys/app',
    // 菜单
    'system.menu.list': '/sys/menu',
    // 角色
    'system.role.list': '/sys/role',
    // 用户
    'system.user.list': '/sys/user',
    // 组织机构
    'system.org.list': '/sys/org',
    // 登录日志
    'system.log.loginList': '/sys/log/login',
    // 操作日志
    'system.log.optList': '/sys/log/opt',
    // 系统配置（旧字典）
    'config.dic.list': '/sys/cfg/dic',
};

// ng版系统管理权限关键字映射为新版关键字
export const ng_permission_mapping = {
    // 应用
    'apps:edit': ['sys.app.add', 'sys.app.edit'],
    'apps:del': 'sys.app.del',
    // 菜单
    'menu:add': ['sys.menu.addMenu', 'sys.menu.addPermission'],
    'menu:update': 'sys.menu.edit',
    'menu:del': 'sys.menu.del',
    // 角色
    'role:add': 'sys.role.add',
    'role:edit': 'sys.role.edit',
    'role:del': 'sys.role.del',
    // 用户
    'user:add': 'sys.user.add',
    'user:edit': 'sys.user.edit',
    'user:del': 'sys.user.del',
    'user:reset': 'sys.user.resetPassword',
    'user:unlock': 'sys.user.unlock',
    // 组织机构
    'org:mod': ['sys.org.add', 'sys.org.edit'],
    'org:del': 'sys.org.del',
    // 系统配置（旧字典）
    'dic:save': ['sys.cfg.dic.add', 'sys.cfg.dic.edit'],
    'dic:del': 'sys.cfg.dic.del',
};
