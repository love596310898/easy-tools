import ModuleMissing from '@/components/module/module-missing.vue';

// 此写法不支持路由守卫
// export default file => () => {
//   const AsyncComponent = () => ({
//     // 需要加载的组件 (应该是一个 `Promise` 对象)
//     component: import(/* webpackChunkName: "[request]" */ "@/views/" + file),
//     // 异步组件加载时使用的组件
//     loading: ModuleLoading,
//     // 加载失败时使用的组件
//     error: ModuleMissing,
//     // 展示加载时组件的延时时间。默认值是 200 (毫秒)
//     delay: 300/* ,
//     // 如果提供了超时时间且组件加载也超时了，
//     // 则使用加载失败时使用的组件。默认值是：`Infinity`
//     timeout: 3000 */
//   });

//   // 包装并返回一个函数式组件
//   return Promise.resolve({
//     functional: true,
//     render(createElement, context) {
//       return createElement(AsyncComponent, context.data, context.children);
//     }
//   });
// };

// module.exports 与 import 同时用会报错
// module.exports = file => () => import("@/views/" + file + ".vue");

export default file => () => {
	let fileNames = window.sessionStorage.getItem('load-faild-names');
	fileNames = fileNames && JSON.parse(fileNames);
	fileNames = Array.isArray(fileNames) ? fileNames : [];
	return import(/* webpackChunkName: "[request]" */ `@/views/${file}`)
		.then(module => {
			//加载模块成功则移除记录的名称重置刷新次数
			if (fileNames.includes(file)) {
				window.sessionStorage.setItem('load-faild-names', JSON.stringify(fileNames.filter(f => f != file)));
			}
			return module.default;
		})
		.catch(e => {
			console.error('加载模块出错：', e);
			// 检查模块名称是否存在保存的队列中，不存在直接刷新一次，存在则直接进入模块加载失败界面提示用户自己进行界面刷新
			if (!fileNames.includes(file)) {
				window.document.location.reload();
				// sessionstorage创建一个队列保存加载失败的模块名称，
				fileNames.push(file);
				window.sessionStorage.setItem('load-faild-names', JSON.stringify(fileNames));
			} else {
				return ModuleMissing;
			}
		});
};
