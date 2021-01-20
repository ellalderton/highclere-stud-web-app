import Vue from 'vue';

Vue.mixin({
	methods: {
		showMedia(media) {
			// if video is of type video-url or audio_url just open in new tab
			if(media.type.includes("url")) {
				const win = window.open(media.external_url, '_blank');
  				win.focus();
			} else if (media.type === 'document') {
				const win = window.open(media.url, '_blank');
  				win.focus();
			} else {
				this.$store.commit('media/openModal', media);
			}
		}
	}
})