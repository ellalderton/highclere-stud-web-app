const goToHorsesMixin = {
	methods: {
		goToHorses() {
			// reset filters if using main menu
			this.$store.commit('horses/resetPagination');
			this.$store.commit('horses/clearFilters', 'training');
			this.$nuxt.$emit('reload_horses_page');
			this.$router.push('/horses');
		}
	}
}

export default goToHorsesMixin;