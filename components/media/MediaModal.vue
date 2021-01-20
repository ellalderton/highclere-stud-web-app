<template>
	<div>
	<client-only>
	<sweet-modal modal-theme="dark" overlay-theme="dark" ref="modal" v-on:close="close">
		<template v-if="showModal">
			<template v-if="media.type === 'image'">
				<client-only>
					<img :src="`${$options.filters.assetUrl(media.url)}?w=${imgWidth}&h=${imgWidth}`">
	  			</client-only>
	  		</template>

			<template v-if="media.type === 'video'">
	  			<video-player :video-url="`${$options.filters.assetUrl(media.url)}`"/>
	  		</template>

	  		<template v-if="media.type === 'audio'">
	  			<audio-player 
	  				:audio-url="`${$options.filters.assetUrl(media.url)}`"
	  				:horse-id="media.horse_id"
	  			/>
	  		</template>

	  		<template v-if="showModal && media.title">
	  			<p class="media__title" style="color: white;">{{ media.title }}</p>
	  		</template>
	  	</template>
	</sweet-modal>
	</client-only>
	</div>
</template>

<script>
	import { SweetModal }  from 'sweet-modal-vue';
	import VideoPlayer from '@/components/media/VideoPlayer';
	import AudioPlayer from '@/components/media/AudioPlayer';

	export default {
		components: {
			SweetModal,
			VideoPlayer,
			AudioPlayer,
		},
		methods: {
			close() {
				this.$store.commit('media/closeModal');
			}
		},
		computed: {
			showModal() {
			 let show = this.$store.getters['media/isModalOpen'];

			 if(show) this.$refs.modal.open();

			 return show;
			},
			media() {
				return this.$store.getters['media/getMedia'];
			},
			imgWidth() {
				if(window.innerWidth > 700) return 800;

				return 500;
			},

		}
	}
</script>

<style>
	.sweet-modal {
		width: 100% !important;
	    max-width: 100% !important;
	    height: 100%;
		@media screen and (max-width: 767px) {
			max-height: 90vh !important;
		}		
	}
	.sweet-modal-overlay.theme-dark {
		background: #333333 !important;
	}
	.video {
		max-width: 800px;
	}
	
	.sweet-modal.is-mobile-fullscreen {
		position: fixed !important;
	}

	.sweet-modal .sweet-box-actions {
	    position: absolute;
	    top: 12px;
	    left: 12px;
	}

	.sweet-modal .sweet-box-actions .sweet-action-close svg {
	    width: 40px;
	    height: 40px;
	}

	.sweet-action-close {
		opacity: 0;
		transition: opacity 0.5s 0.5s;
	}

	.sweet-content {
		height: 100%;
	}

	.is-visible .sweet-action-close {
		opacity: 1;
	}

	.sweet-modal img {
		max-width: 800px;
		max-height: 90vh;
	}

	@media screen and (max-height: 450px) {
		.sweet-modal img {
			max-height: inherit;
		}

		.sweet-modal img:last-of-type {
			display: none !important;
		}
	}

	@media screen and (max-width: 900px) {
		.sweet-modal img {
			max-width: 100%;
		}
	}

	.media__title {
		opacity: 0;
		transition: opacity 0.2s 1s;
		@media screen and (max-width: 767px) {
			margin-top: -25px;
		}
	}
	
	.is-visible .media__title {
		opacity: 1;
	}

	img + .media__title {
		margin-top: 15px;
	}

	.sweet-modal .sweet-box-actions .sweet-action-close:hover {
	    background: #484848;
	    color: #fff;
	}
</style>