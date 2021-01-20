export const actions = {
	// only runs server side
	async nuxtServerInit(vuexContext, { req, store, redirect, route }) {
		store.dispatch('auth/initAuth', req);

		if(store.getters['auth/isAuthenticated']) {
			try {
				await vuexContext.dispatch('auth/user');
				// await vuexContext.dispatch('horses/horsesInTraining');
			} catch(e) {
				// either token no longer valid or api causing an error
				// so log user out and redirect to /login
				store.dispatch('auth/logout')
				.then(() => {
					redirect('/');
				})
				.catch(e => {
					console.log('logout failed');
				});
			}
			
		} else {
			store.dispatch('auth/logout')
			.then(() => {
				if(route.name !== 'password' && route.name !== 'register') {
					redirect('/');
				}	
			});
			return;
		}
	}
}