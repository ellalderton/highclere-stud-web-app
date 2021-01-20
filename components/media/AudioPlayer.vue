<template>
		<div class="audio">
			<audio 
  				id="audio" 
  				class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9" 
  				controls 
			  	preload="auto" 
			  	width="800" 
			  	height="100" 
			  	:poster="`${$options.filters.assetUrl(horseAvatar)}`" 
			  	data-setup='{}'
			  	autoplay 
			  >
			  	<source :src="audioUrl" type='audio/mp3'/>;
			</audio>
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
			audioUrl: null,
			horseId: null,
		},
		mounted() {
			this.player = videojs('audio');
		},
		destroyed() {
			this.player.dispose();
		},
		computed: {
			horseAvatar() {
				if(!this.$nuxt._route.params.horse_id && !this.horseId) return '';
				const horseId = this.$nuxt._route.params.horse_id ? this.$nuxt._route.params.horse_id : this.horseId;

				const horse = this.$store.getters['horses/getSingleHorse'](horseId);

				if(!horse) return '';

				return `${horse.avatar_url}?w=600&h=400`;
			}			
		}
	}
</script>

<style scoped>
	.audio {
		max-width: none;
		padding: 40px calc((100vw - 800px) /2);
	}
</style>