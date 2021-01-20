// set the previous page, except if it was the login page.
export default function(context) {
	if (!process.server && context.from.path !== '/' && context.route.path !== '/' && context.route.path !== '/password' && context.route.path !== '/register' && context.route.path !== 'offline') {
		context.store.commit('auth/setPreviousPage', {
			from: context.from.path,
			current: context.route.path
		});
	}
}