import axios from 'axios';
import { sortBy as _sortBy, filter as _filter, contains as _contains } from 'underscore';
import moment from 'moment';
import Cookie from 'js-cookie';

export const state = () => ({
	results: [],
	pagination: 1,
	dayFilter: null,
	resultsTimestamp: null
});

export const mutations = {
	setResults(state, results) {
		state.results = results;
	},
	setResultsTimestamp(state) {
		state.resultsTimestamp = moment();
	},
	setPagination(state, page) {
		state.pagination = page;
	},
	resetPagination(state) {
		state.pagination = 1;
	},
	setDayFilter(state, day) {
		state.dayFilter = day;
	},
	resetDayFilter(state) {
		state.dayFilter = null;
	}
}

export const actions = {
	resultsAll(vuexContext) {
		const resultsTimestamp = vuexContext.getters.getResultsTimestamp;

		if(!resultsTimestamp || moment().isSameOrAfter(resultsTimestamp)) {

			const postUrl = `${process.client ? window.location.origin : ''}/w-erapi/4DCGI/EANDRAPI/RacesForList`;

			const resultsMax = 30;
			const dateFrom = moment().subtract(9,'d').format('YYYY-MM-DD');

			// SESSION, USER, ID
			Cookie.remove('SESSION');
			Cookie.remove('USER');
			Cookie.remove('ID');


			// Cookie.set('app_jwt', result.data.token, { expires: 700 });	

			return this.$axios
			.$post(postUrl, {
				dateFrom: dateFrom,
				resultsMax: resultsMax,
				resultsOffset: 0
			}, {
				headers: {}
			})
			.then(response => {
				console.log('RES!!!', response);
				let results = response.performances;
				
				if(response.resultsFound > resultsMax) {
					let numPages = Math.floor(response.resultsFound / resultsMax);

					let postArray = [];

					for (let i = 1; i <= numPages; i++) {
						postArray.push(this.$axios.$post(`${postUrl}`, { 
							dateFrom: dateFrom,
							resultsMax: resultsMax,
							resultsOffset: i * resultsMax
						}, {headers: {}}));
					}

					return axios.all(postArray)
					.then(axios.spread((...res) => {

						for (let i = 0; i < res.length; i++) {
							results = results.concat(res[i].performances);
						}
						vuexContext.commit('setResultsTimestamp');
						vuexContext.commit('setResults', results);
						return results;
					}));
				}

				if(vuexContext.rootGetters['auth/getIsSyndicate']) {
					let horseWapiIds = vuexContext.rootGetters['auth/getUserHorseWapiIds'];

					results = _filter(results, result => {
						return _contains(horseWapiIds, result.animalID.toString());
					});
				}

				vuexContext.commit('setResultsTimestamp');
				vuexContext.commit('setResults', results);
				return results;
			
			})
			.catch(e => Promise.reject(e));
		} else {
			return vuexContext.getters.getResults;
		}
	},

	individualResults(vuexContext, { wapiId, pagination }) {
		const postUrl = `${process.client ? window.location.origin : ''}/w-erapi/4DCGI/EANDRAPI/RacesForHorse`;

		const resultsMax = 10;
		const resultsOffset = (pagination - 1) * resultsMax;

		return this.$axios
		.$post(postUrl, {
			animalID: wapiId,
			resultsMax: resultsMax,
			resultsOffset: resultsOffset
		}, {headers: {}})
		.then(response => {
			return response;
		})
		.catch(e => Promise.reject(e));
	}
}

export const getters = {
	getPagination(state) {
		return state.pagination;
	},
	getDayFilter(state) {
		return state.dayFilter;
	},
	getResultsTimestamp(state) {
		if(!state.resultsTimestamp || !moment.isMoment(state.resultsTimestamp)) return null;

		let timestamp = state.resultsTimestamp

		return timestamp.add(3, 'm');
	},
	getResults(state) {
		return state.results;
	}
}