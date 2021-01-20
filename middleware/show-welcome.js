import moment from 'moment';

// Show welcome message on first login and if 24hrs since last seen.
export default function(context) {
	if (context.route.name !== 'offline' && context.store.getters['auth/isAuthenticated']) {

		const showWelcome = context.store.getters['auth/getShowWelcome'];

		if(showWelcome === null) {
			context.store.commit('auth/setWelcome', true);
		} else {
			const userTimestamp = context.store.getters['auth/getUserTimestamp'];

			if(!userTimestamp) {
				context.store.commit('auth/setUserTimestamp');
			}

			if(moment().isSameOrAfter(userTimestamp)) {
				context.store.commit('auth/setWelcome', true);
				context.store.commit('auth/setUserTimestamp');
			} else {
				context.store.commit('auth/setWelcome', false);
			}
		}	
	}
}