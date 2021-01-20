import axios from 'axios';
import moment from 'moment';
import { 
	sortBy as _sortBy,
	map as _map,
	find as _find,
	pluck as _pluck,
	uniq as _uniq,
	filter as _filter 
} from 'underscore';
import horseFilters from '@/helpers/horseFilters';

export const state = () => ({
	usersHorses: null,
	horsesTimestamp: null,
	horses: [],
	horsesCount: null,
	trainers: null,
	owners: null,
	filters: {
		age: null,
		primary_color: null,
		sex: null,
		trainer: null,
		owners: null,
		current_location: null,
		pregnancy_status: null,
		group: null,
		open: false,
		usersHorses: null,
		sort: null
	},
	pagination: {
		horses: 1
	},
	gridView: 'list'
});

export const mutations = {
	setUsersHorses(state, data) {
		state.usersHorses = data;
	},
	setGridView(state, type) {
		state.gridView = type;
	},
	setHorsesTimestamp(state) {
		state.horsesTimestamp = moment();
	},
	setHorses(state, data) {
		state.horses = data;
	},
	setHorsesCount(state, count) {
		state.horsesCount = count;
	},
	setTrainers(state, data) {
		state.trainers = data;
	},
	setOwners(state, data) {
		state.owners = data;
	},
	clearHorses(state) {
		state.horses = [];
	},
	clearTrainers(state) {
		state.trainers = null;
	},
	clearOwners(state) {
		state.owners = null;
	},
	setFilters(state, filters) {
		state.filters = filters;
	},
	clearFilters(state) {
		state.filters = {
			age: null,
			primary_color: null,
			sex: null,
			trainer: null,
			owners: null,
			current_location: null,
			pregnancy_status: null,
			group: null,
			open: false,
			usersHorses: null,
			sort: null
		}
	},
	filterByTrainer(state, trainerId) {
		state.filters = {
			age: null,
			primary_color: null,
			sex: null,
			trainer: trainerId,
			owners: null,
			current_location: null,
			pregnancy_status: null,
			group: null,
			open: true,
			usersHorses: null,
			sort: null
		}
	},
	setHorsesPagination(state, page) {
		state.pagination.horses = page;
	},
	resetPagination(state) {
		state.pagination.horses = 1;
	},
	minusReadNotes(state, horse) {
		let horses = state.horses
		

		let foundHorse = _find(horses, (h) => {
			return h.id == horse.id;
		});

		if(foundHorse) {
			foundHorse.unread_notes_count--;

			state.horses = horses;		
		}	
	},
	addReadNotes(state, horse) {
		let horses = state.horses;
	
		let foundHorse = _find(horses, (h) => {
			return h.id === horse.id;
		});

		if(foundHorse) {
			foundHorse.unread_notes_count++;
			
			state.horses = horses;
		}
	},
	addReadComments(state, horse) {
		let horses = state.horses;
		
		let foundHorse = _find(horses, (h) => {
			return h.id === horse.id;
		});

		if(foundHorse) {
			foundHorse.unread_comments_count++;

			state.horses = horses;
		}
	},
	minusReadComments(state, horse) {
		let horses = state.horses;
	
		let foundHorse = _find(horses, (h) => {
			return h.id === horse.id;
		});

		if(foundHorse) {
			foundHorse.unread_comments_count--;
			
			state.horses = horses;
		}
	},
	setUnreadCommentsAndNotes(state, horse) {
		let horses = state.horses;

		let foundHorse = _find(horses, (h) => {
			return h.id === horse.id;
		});

		if(foundHorse) {
			foundHorse.unread_comments_count = horse.unread_comments_count;
			foundHorse.unread_notes_count = horse.unread_notes_count;
			state.horses = horses;
		}
	},
	markAllNotesAsRead(state) {
		state.horses = _map(state.horses, (horse) => {
			horse.unread_notes_count = 0;
			horse.unread_comments_count = 0;
			return horse;
		});
	}
}

export const actions = {
	horses(vuexContext, force = false) {
		if(vuexContext.getters.getHorses && !force) return;

		let postUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/app/advanced-search-syndicate`;

		return this.$axios
		.$post(postUrl, {
			headers: {}
		})
		.then(result => {
			// set first page so we have something to show whilst the rest loads
			// vuexContext.commit('setHorsesInTraining', result.data);
			vuexContext.commit('setHorsesCount', result.meta.total);
			vuexContext.commit('setHorsesTimestamp');

			// work out number of pages
			const totalPages = result.meta.last_page;
			let postArray = [];

			for (let i = 2; i <= totalPages; i++) {
				postArray.push(this.$axios.$post(`${postUrl}?page=${i}`, {}, {headers: {}}));
			}

			return axios.all(postArray)
			.then(axios.spread((...res) => {

				for (let i = 0; i < res.length; i++) {
					result.data = result.data.concat(res[i].data);
				}

				vuexContext.commit('setHorses', result.data);
				return;
			}));
		})
		.catch(e => Promise.reject(e));
	},
	clearAll(vuexContext) {
		vuexContext.commit('clearHorses');
		vuexContext.commit('clearTrainers');
		vuexContext.commit('clearOwners');
	}
}

export const getters = {
	getHorsesTimestamp(state) {
		if(!state.horsesTimestamp) return null;

		let timestamp = state.horsesTimestamp

		return timestamp.add(3, 'm');
	},
	getSingleHorse(state) {	
		return id => {
			if(!id) return;

			const horses = state.horses;

			return _find(horses, horse => {
				return horse.id == id;
			});
		}	
	},
	getHorses(state) {
		if(!state.horses.length) return;

		return state.horses;
	},
	getHorsesCount(state) {
		if(!state.horsesCount) return;

		return state.horsesCount;
	},
	getHorseSearchList(state) {
		let horses = state.horses;

		return _sortBy(horses, horse => {
			let name = horse.name;
			if(!isNaN(horse.name.charAt(0))) {
				name = `xxx${horse.name}`;
			}
			
			return name;
		});
	},
	getSiresList(state) {
		if(!state.horses) return [];

		let horses = state.horses;

		return horses.map(horse => {
			return horse.sire;
		});
	},
	getTrainers(state) {
		const horses = state.horses;

		const trainers = _uniq(_filter(_map(horses, horse => {
			return horse.trainers[0];
		}), (trainer) => {
			return trainer && trainer.name !== '';
		}), trainer => {
			return trainer.id;
		});

		return trainers.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	},
	getOwners(state) {
		const horses = state.horses;

		const owners = _uniq(_filter(_pluck(horses, 'ownership'), (owner) => {
			return owner && owner.name !== '';
		}), owner => {
			return owner.id;
		});

		return owners.sort((a, b) => {
			return a.name.localeCompare(b.name);
		});
	},
	getHorseLocations(state) {
		const horses = state.horses;

		const locations = _uniq(_pluck(horses, 'current_location'));

		return locations.sort();
	},
	getHorseGroups(state) {
		const horses = state.horses;

		const groups = _uniq(_pluck(horses, 'group'));

		return groups.sort();
	},
	getFilteredHorses(state) {
		if(!state.horses.length) return;

		const filters = new horseFilters(state.horses, state.filters, state.usersHorses);

		return filters.filterHorses();
	},
	getFilters: (state) => () => {
		return state.filters;
	},
	getHorsesPagination(state) {
		return state.pagination.horses;
	},
	getGridView(state) {
		return state.gridView;
	},
	getHorsebyWapi(state) {
		return wapiId => {
			if(!wapiId) return;

			const horses = state.horses;

			return _find(horses, horse => {
				return horse.wapi_id == wapiId;
			});
		}
	},
	getUsersHorses(state) {
		return state.usersHorses;
	}
}