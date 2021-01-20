<template>
	<nuxt-link :to="previousPagePath" class="back-button" v-if="previousPagePath">
		<back-button-icon-svg/>
	</nuxt-link>
</template>

<script>
	import BackButtonIconSvg from '@/assets/svg/back-button.svg';

	export default {
		components: {
			BackButtonIconSvg
		},
		computed: {
			previousPagePath() {
				const path = this.$store.getters['auth/getPreviousPage'];
				return path ? path : null;
			}
		}
	}
</script>