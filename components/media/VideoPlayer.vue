<template>
		<div class="video">
			<video 
				id="video"
				class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
				controls
				preload="auto"
				data-setup='{"fluid": true, "preload": "auto"}'
				autoplay
			>
				<source type="video/mp4" v-bind:src="`${$options.filters.assetUrl(videoUrl)}`"></source>
			</video>
		</div>
	
</template>

<script>	
	import videojs from 'video.js';

	export default {
		data() {
			return {
				player: null
			}
		},
		props: {
			videoUid: null,
			videoUrl: null,
			thumbnailUrl: null
		},
		mounted() {
			this.player = videojs('video');
		},
		destroyed() {
			this.player.dispose();
		}
	}
</script>

<style scoped>
	.video {
		max-width: none;
		padding: 40px calc((100vw - 800px) /2);
	}
</style>