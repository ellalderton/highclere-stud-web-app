import moment from 'moment';

// refresh the horses list on page change if 3mins or more since last refresh
// refresh the entries list on page change if 30mins or more since last refresh
export default function(context) {
	if (!process.server && context.route.name !== 'offline' && context.store.getters['auth/isAuthenticated']) {
		const horsesTimestamp = context.store.getters['horses/getHorsesTimestamp'];
		const entriesTimestamp = context.store.getters['entries/getEntriesTimestamp'];

		if(!horsesTimestamp || moment().isSameOrAfter(horsesTimestamp)) {		
			context.store.dispatch('horses/horses', true)
			.catch(e => {
				console.log(e);
			});
		}

		if(!entriesTimestamp || moment().isSameOrAfter(entriesTimestamp)) {
			context.store.dispatch('entries/entries', true)
			.catch(e => {
				console.log(e);
			});
		}
	}
}