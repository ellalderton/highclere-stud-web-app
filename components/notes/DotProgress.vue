<template>
	<span style="width: 10px; text-align: left; margin-left: 3px; letter-spacing: 2px;">{{ dots }}</span>
</template>

<script>
	export default {
		data() {
			return {
				dots: '',
				dotsInterval: null
			}
		},
		mounted() {
			this.dotProgress();
		},
		destroyed() {
			clearInterval(this.dotsInterval);
		},
		methods: {
			dotProgress() {
				this.dotsInterval = setInterval(() => {
					if(this.dots === '...') return this.dots = '';

					this.dots = `${this.dots}.`;
				}, 800);			
			}
		}
	}
</script>