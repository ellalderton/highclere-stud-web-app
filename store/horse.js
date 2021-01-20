import axios from 'axios';

export const actions = {
	getHorse(vuexContext, id) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}?include=lineage,sales`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result.data;
		})
		.catch(e => Promise.reject(e));
	},
	getImages(vuexContext, id) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}/photos`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result.data;
		})
		.catch(e => Promise.reject(e));
	},
	getVideos(vuexContext, id) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}/videos`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result.data;
		})
		.catch(e => Promise.reject(e));
	},
	getAudio(vuexContext, id) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}/audio`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result.data;
		})
		.catch(e => Promise.reject(e));
	},
	getDocuments(vuexContext, id) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}/documents`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result.data;
		})
		.catch(e => Promise.reject(e));
	},
	getNotes(vuexContext, { id, pagination }) {
		const getUrl = `${process.client ? window.location.origin : ''}/w-api/api/horses/${id}/notes-app?page=${pagination}`;

		return this.$axios
		.$get(getUrl)
		.then(result => {
			return result;
		})
		.catch(e => Promise.reject(e));
	}
}