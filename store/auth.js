import Cookie from 'js-cookie';
import moment from 'moment';

export const state = () => ({
	token: null,
	user: null,
	canSeeNotes: true, // to be set
	canAddNotes: true,
	isSyndicate: false,
	horseWapiIds: null,
	previousPage: [],
	userTimestamp: null,
	showWelcome: null
});

export const mutations = {
	setToken(state, token) {
		state.token = token;
	},
	setUser(state, data) {
		state.user = {
			first_name: data.first_name,
			last_name: data.last_name,
			id: data.id,
			role: data.company_role,
			email: data.email,
			total_notes: data.total_notes,
			unread_notes: data.unread_notes,
			unread_comments: data.unread_comments,
			avatar_url: data.avatar_url,
		};

		if(data.company_role !== 'staff') {
			state.canAddNotes = true;
		} else {
			state.isSyndicate = true;
			state.horseWapiIds = data.horse_wapi_ids;
		}
	},
	setWelcome(state, bol) {
		state.showWelcome = bol;
	},
	setUserTimestamp(state) {
		state.userTimestamp = moment();
	},
	setAvatar(state, data) {
		state.user.avatar_url = data;
	},
	clearToken(state) {
		state.token = null;
	},
	clearUser(state) {
		state.user = null;
		state.showWelcome = null;
		state.userTimestamp = null;
		state.canAddNotes = false;
	},
	minusUnreadNotes(state) {
		state.user.unread_notes = state.user.unread_notes - 1;
	},
	addUnreadNotes(state) {
		state.user.unread_notes = state.user.unread_notes + 1;
	},
	minusUnreadComments(state) {
		state.user.unread_comments = state.user.unread_comments - 1;
	},
	addUnreadComments(state) {
		state.user.unread_comments = state.user.unread_comments + 1;
	},
	setUnreadNotes(state, num) {
		state.user.unread_notes = num;
	},
	setUnreadComments(state, num) {
		state.user.unread_comments = num;
	},
	setPreviousPage(state, route) {
		if(state.previousPage.length >= 15) {
			state.previousPage.shift();
		}

		const length = state.previousPage.length;

		// if route is the same as last
		// back button was used so, just remove last one
		if(state.previousPage[length - 1] === route.current) {
			state.previousPage.pop();
		} else {
			state.previousPage.push(route.from);
		}
	},
	clearPreviousPage(state) {
		state.previousPage = [];
	}
}

export const actions = {
	authenticateUser(vuexContext, authData) {
		let authUrl = `${process.client ? window.location.origin : ''}/w-api/api/users/login-app`;

		return this.$axios
		.$post(authUrl, authData, {
			headers: {}
		})
		.then(result => {
			vuexContext.commit('setToken', result.data.token);
			vuexContext.commit('setUser', result.data);
			
			Cookie.set('app_jwt', result.data.token, { expires: 700 });	
		    return;
		})
		.catch(e => Promise.reject(e));
	},
	initAuth(vuexContext, req) {
		let token;

		// if server side set the Token from cookie in header
		if(req) {
			if(!req.headers.cookie) return;

			const jwtCookie = req.headers.cookie.split(';')
				.find(c => c.trim().startsWith('app_jwt='));

			if(!jwtCookie) return;

			token = jwtCookie.split('=')[1];

			vuexContext.commit('setToken', token);
		}
	},
	user(vuexContext) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/me`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			vuexContext.commit('setUser', result.data);

			if(result.data.company_role !== 'staff') {
				vuexContext.commit('horses/setUsersHorses', result.data.users_horses, { root: true });
			}
		})
		.catch(e => {
			vuexContext.dispatch('logout');
			$nuxt._router.push('/');
			return Promise.reject(e)
		});
	},
	logout(vuexContext) {
		vuexContext.commit('clearToken');
		vuexContext.commit('clearUser');
		vuexContext.commit('clearPreviousPage');
		
		vuexContext.dispatch('horses/clearAll', null, {root:true});
		
		Cookie.remove('app_jwt');
	}
}

export const getters = {
	isAuthenticated(state) {
		return state.token != null;
	},
	getUser(state) {
		return state.user;
	},
	isManagement(state) {
		if(!state.user) return false;
		return state.user.role === 'management';
	},
	getPreviousPage(state) {
		const length = state.previousPage.length;
		if(!length) return null;
		return state.previousPage[length - 1];
	},
	getCanSeeNotes(state) {
		return state.canSeeNotes;
	},
	getCanAddNotes(state) {
		return state.canAddNotes;
	},
	getShowWelcome(state) {
		return state.showWelcome;
	},
	getUserTimestamp(state) {
		if(!state.userTimestamp) return null;

		let timestamp = state.userTimestamp;

		return timestamp.add(1, 'd');
	},
	getUserHorseWapiIds(state) {
		return state.horseWapiIds;
	},
	getIsSyndicate(state) {
		return state.isSyndicate;
	},
	getUsersHorses(state) {
		return state.usersHorses;
	}
}