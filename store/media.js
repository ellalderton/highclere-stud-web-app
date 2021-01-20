export const state = () => ({
	modalOpen: false,
	media: null
});

export const mutations = {
	openModal(state, media) {
		state.media = media;
		state.modalOpen = true;
	},
	closeModal(state) {
		state.modalOpen = false;
		state.media = null;
	}
}

export const getters = {
	isModalOpen(state) {
		return state.modalOpen;
	},
	getMedia(state) {
		return state.media;
	}
}