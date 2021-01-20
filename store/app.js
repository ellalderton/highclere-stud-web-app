export const state = () => ({
	menuOpen: false,
	searchMenuOpen: false
});

export const mutations = {
	openMenu(state) {
		state.menuOpen = true;
	},
	closeMenu(state) {
		state.menuOpen = false;
	},
	searchOpenMenu(state) {
		state.searchMenuOpen = true;
	},
	searchCloseMenu(state) {
		state.searchMenuOpen = false;
	}
}

export const getters = {
	getMenuStatus(state) {	
		return state.menuOpen;
	},
	getSearchMenuStatus(state) {	
		return state.searchMenuOpen;
	}
}