import { sortBy as _sortBy, filter as _filter, contains as _contains } from 'underscore';
import moment from 'moment';

export const state = () => ({
	entries: [],
	entriesTimestamp: null,
	pagination: 1
});

export const mutations = {
	setEntries(state, entries) {
		state.entries = entries;
	},
	setEntriesTimestamp(state) {
		state.entriesTimestamp = moment();
	},
	setPagination(state, page) {
		state.pagination = page;
	},
	resetPagination(state) {
		state.pagination = 1;
	},
}

export const actions = {
	entries(vuexContext, force = false) {
		if(vuexContext.getters.getEntries.length && !force) return;

		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/entries/`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			vuexContext.commit('setEntriesTimestamp');

			let entries = result.data;

			if(vuexContext.rootGetters['auth/getIsSyndicate']) {
				let horseWapiIds = vuexContext.rootGetters['auth/getUserHorseWapiIds'];

				entries = _filter(entries, entry => {
					return _contains(horseWapiIds, entry.horseWapiId);
				});
			}

			vuexContext.commit('setEntries', entries);
			return;
		})
		.catch(e => Promise.reject(e));
	}
}

export const getters = {
	getEntriesTimestamp(state) {
		if(!state.entriesTimestamp) return null;

		let timestamp = state.entriesTimestamp

		return timestamp.add(30, 'm'); // add 30 mins
	},
	getEntries(state) {
		const orderedbyTime = _sortBy(state.entries, (entry) => {
			return entry.time;
		});
		state.entries
		return _sortBy(orderedbyTime, (entry) => {
			return entry.date;
		});
	},
	getEntriesCount(state) {
		if(!state.entries) return 0;
		return state.entries.length;
	},
	getEntriesForHorse(state) {
		return id => {
			if(!id) return;

			return _sortBy(_filter(state.entries, entry => {
				return entry.horseID == id;
			}), entry => {
				return entry.date;
			});
		}	
	},
	getTodaysEntries(state) {
		if(!state.entries.length) return [];

		const orderedbyTime = _sortBy(state.entries, (entry) => {
			return entry.time;
		});
		state.entries
		const orderedbyDate = _sortBy(orderedbyTime, (entry) => {
			return entry.date;
		});
		
		return _filter(orderedbyDate, entry => {
			return moment(entry.date).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY');
		});
	},
	getUpcomingEntries(state) {
		if(!state.entries.length) return [];

		const orderedbyTime = _sortBy(state.entries, (entry) => {
			return entry.time;
		});
		state.entries
		const orderedbyDate = _sortBy(orderedbyTime, (entry) => {
			return entry.date;
		});
		
		return _filter(orderedbyDate, entry => {
			return moment(entry.date) > moment();
		});
	},
	getPagination(state) {
		return state.pagination;
	}
}