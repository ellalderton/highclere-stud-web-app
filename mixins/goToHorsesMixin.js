const goToHorsesMixin = {
	methods: {
		goToHorses() {
			// reset filters if using main menu
			this.$store.commit('horses/resetPagination');
			this.$store.commit('horses/clearFilters');
			this.$router.push('/horses');
		}
	}
}

export default goToHorsesMixin;