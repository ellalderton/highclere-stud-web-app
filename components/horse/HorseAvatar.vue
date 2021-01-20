<template>
	<div class="list-item__image-inner" aria-hidden="true" role="presentation">
	    <span class="list-item__image-background" :style="`background-image: url('${$options.filters.horseAvatar(horse.avatar_url, 40, 30)}')`"></span>

		<span
			v-if="isProfile"
	    	class="list-item__image-image [ horse-avatar ]"
	    	:class="{'horse-avatar--hide': toBeLoaded, 'horse-avatar--show': lazyLoaded}" 
	    	:style="`background-image: url('${$options.filters.horseAvatar(horse.avatar_url, 700, 500)}')`"
	    ></span>

	    <span
			v-else
	    	class="list-item__image-image [ horse-avatar ]"
	    	:class="{'horse-avatar--hide': toBeLoaded, 'horse-avatar--show': lazyLoaded}" 
	    	:style="`background-image: url('${$options.filters.horseAvatar(horse.avatar_url, 400, 300)}')`"
	    ></span>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				lazyLoaded: false,
				loadedImg: null,
				toBeLoaded: false,
				imageInterval: null
			}
		},
		props: {
			horse: {
				required: true,
				type: Object
			},
			isProfile: {
				required: false,
				type: Boolean,
				default: false
			}
		},
		mounted() {
			this.loadedImg = new Image();

			if(this.isProfile) {
				this.loadedImg.src = this.$options.filters.horseAvatar(this.horse.avatar_url, 700, 500);
			} else {
				this.loadedImg.src = this.$options.filters.horseAvatar(this.horse.avatar_url, 400, 300);
			}
			
			this.toBeLoaded = true;

			if(this.loadedImg.complete) {
				this.lazyLoaded = true;
			} else {
				this.imageInterval = setInterval(() => {
					if(this.loadedImg.complete) {
						this.lazyLoaded = true;
						clearInterval(this.imageInterval);
					}
				}, 200);
			}		
		},
		destroyed() {
			clearInterval(this.imageInterval);
		}
	}
</script>

<style>
	.horse-avatar {
		transition: opacity 0.5s;
	}

	.horse-avatar--hide {
		opacity: 0;
	}

	.horse-avatar--show {
		opacity: 1;
	}
</style>